// ============================================
// SUPABASE CLIENT - Just the connection
// ============================================

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Storage functions (for media uploads)
export async function uploadVideo(userId: string, file: File) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/${Date.now()}.${fileExt}`;
  
  const { data, error } = await supabase.storage
    .from('videos')
    .upload(fileName, file);
    
  if (error) return { error };
  
  const { data: urlData } = supabase.storage
    .from('videos')
    .getPublicUrl(fileName);
    
  return { url: urlData.publicUrl, error: null };
}

export async function uploadAvatar(userId: string, file: File) {
  const fileExt = file.name.split('.').pop();
  const fileName = `avatars/${userId}.${fileExt}`;
  
  const { data, error } = await supabase.storage
    .from('videos')
    .upload(fileName, file, { upsert: true });
    
  if (error) return { error };
  
  const { data: urlData } = supabase.storage
    .from('videos')
    .getPublicUrl(fileName);
    
  return { url: urlData.publicUrl, error: null };
}
