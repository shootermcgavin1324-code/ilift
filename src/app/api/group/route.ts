import { NextResponse } from 'next/server';
import { getGroupMembers } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const groupId = searchParams.get('groupId');
    
    if (!groupId) {
      return NextResponse.json({ success: false, error: 'Missing group ID' }, { status: 400 });
    }
    
    const members = getGroupMembers(groupId);
    
    return NextResponse.json({ 
      success: true, 
      members: members.map((m: any) => ({
        id: m.id,
        name: m.name,
        totalXP: m.totalXP || 0,
        streak: m.streak || 0,
        badges: m.badges || []
      }))
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
