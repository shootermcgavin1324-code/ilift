import { NextRequest, NextResponse } from 'next/server';

// This API route handles file uploads
// Currently uses localStorage on client (demo mode)
// Later: Connect to Supabase Storage for cloud persistence

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const userId = formData.get('userId') as string;
    const type = formData.get('type') as string; // 'video' | 'avatar'

    if (!file || !userId) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing file or userId' 
      }, { status: 400 });
    }

    // Validate file type
    if (type === 'video' && !file.type.startsWith('video/')) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid file type. Must be video.' 
      }, { status: 400 });
    }

    if (type === 'avatar' && !file.type.startsWith('image/')) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid file type. Must be image.' 
      }, { status: 400 });
    }

    // Validate file size (10MB limit for demo)
    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ 
        success: false, 
        error: 'File too large. Max 10MB for demo.' 
      }, { status: 400 });
    }

    // For demo: return file data as base64 (client will handle storage)
    // Later: Upload to Supabase Storage and return public URL
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = `data:${file.type};base64,${buffer.toString('base64')}`;

    return NextResponse.json({
      success: true,
      data: {
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        // For Supabase: return the uploaded file URL
        // url: `https://xxx.supabase.co/storage/v1/object/public/${bucket}/${path}`
        url: base64, // Demo mode: return base64
      }
    });

  } catch (error) {
    console.error('Storage API error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Upload failed' 
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const fileId = searchParams.get('fileId');
  const userId = searchParams.get('userId');

  if (!fileId || !userId) {
    return NextResponse.json({ 
      success: false, 
      error: 'Missing fileId or userId' 
    }, { status: 400 });
  }

  // Demo: Return placeholder
  // Later: Fetch from Supabase Storage
  return NextResponse.json({
    success: true,
    data: null
  });
}
