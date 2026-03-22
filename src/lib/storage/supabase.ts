// ============================================
// SUPABASE STORAGE - May fail, that's OK
// ============================================

import { supabase } from '../supabase';
import type { User, Workout } from '../types';

// Get user from Supabase
export async function getSupabaseUser(email: string): Promise<User | null> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    
    if (error || !data) return null;
    return data as User;
  } catch (err) {
    console.log('Supabase getUser failed:', err);
    return null;
  }
}

// Create user in Supabase
export async function createSupabaseUser(user: User): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from('users')
      .insert({
        email: user.email,
        name: user.name,
        total_xp: user.total_xp,
        streak: user.streak,
        group_id: user.group_id,
        badges: user.badges,
        onboarding: user.onboarding
      })
      .select()
      .single();
    
    if (error) {
      console.log('Supabase createUser error:', error.message);
      return null;
    }
    return data?.id || null;
  } catch (err) {
    console.log('Supabase createUser failed:', err);
    return null;
  }
}

// Update user in Supabase
export async function updateSupabaseUser(user: User): Promise<void> {
  try {
    const email = localStorage.getItem('ilift_email');
    if (!email) return;
    
    const { error } = await supabase.from('users').update({
      total_xp: user.total_xp,
      streak: user.streak,
      badges: user.badges
    }).eq('email', email);
    
    if (error) {
      console.log('Supabase update error:', error.message);
    }
  } catch (err) {
    console.log('Supabase updateUser failed:', err);
  }
}

// Save workout to Supabase
export async function saveSupabaseWorkout(workout: Workout): Promise<void> {
  try {
    const email = localStorage.getItem('ilift_email');
    await supabase.from('workouts').insert({
      user_name: workout.user_name || email,
      exercise: workout.exercise,
      score: workout.score,
      date: workout.date
    });
  } catch (err) {
    console.log('Supabase saveWorkout failed:', err);
  }
}

// Get workouts from Supabase
export async function getSupabaseWorkouts(userId: string): Promise<Workout[]> {
  try {
    const { data } = await supabase
      .from('workouts')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });
    return data || [];
  } catch (err) {
    console.log('Supabase getWorkouts failed:', err);
    return [];
  }
}

// Get leaderboard from Supabase
export async function getSupabaseLeaderboard(groupCode: string): Promise<User[]> {
  try {
    const { data } = await supabase
      .from('users')
      .select('*')
      .eq('group_id', groupCode)
      .order('total_xp', { ascending: false });
    return data || [];
  } catch (err) {
    console.log('Supabase getLeaderboard failed:', err);
    return [];
  }
}

// Get PRs from Supabase
export async function getSupabasePRs(userId: string): Promise<Record<string, number>> {
  try {
    const { data } = await supabase
      .from('personal_records')
      .select('*')
      .eq('user_id', userId);
    
    if (!data || data.length === 0) return {};
    
    const prs: Record<string, number> = {};
    data.forEach(row => {
      prs[row.exercise] = row.weight;
    });
    return prs;
  } catch (err) {
    console.log('Supabase getPRs failed:', err);
    return {};
  }
}

// Save PR to Supabase
export async function saveSupabasePR(userId: string, exercise: string, weight: number): Promise<void> {
  try {
    // Check if PR exists
    const { data: existing } = await supabase
      .from('personal_records')
      .select('*')
      .eq('user_id', userId)
      .eq('exercise', exercise)
      .single();
    
    if (existing) {
      // Update if new weight is higher
      if (weight > existing.weight) {
        await supabase
          .from('personal_records')
          .update({ weight, date: new Date().toISOString() })
          .eq('id', existing.id);
      }
    } else {
      // Insert new PR
      await supabase
        .from('personal_records')
        .insert({
          user_id: userId,
          exercise,
          weight,
          date: new Date().toISOString()
        });
    }
  } catch (err) {
    console.log('Supabase savePR failed:', err);
  }
}

// Upload video to Supabase Storage
export async function uploadVideoToSupabase(
  userId: string, 
  file: File
): Promise<string | null> {
  try {
    const fileName = `${userId}/${Date.now()}_${file.name}`;
    
    const { data, error } = await supabase.storage
      .from('videos')
      .upload(fileName, file, {
        contentType: file.type,
        upsert: false
      });
    
    if (error) {
      console.log('Supabase video upload error:', error.message);
      return null;
    }
    
    // Get public URL
    const { data: urlData } = supabase.storage
      .from('videos')
      .getPublicUrl(fileName);
    
    return urlData.publicUrl;
  } catch (err) {
    console.log('Supabase video upload failed:', err);
    return null;
  }
}

// Upload avatar to Supabase Storage
export async function uploadAvatarToSupabase(
  userId: string, 
  file: File
): Promise<string | null> {
  try {
    const fileName = `${userId}/avatar`;
    
    const { data, error } = await supabase.storage
      .from('avatars')
      .upload(fileName, file, {
        contentType: file.type,
        upsert: true
      });
    
    if (error) {
      console.log('Supabase avatar upload error:', error.message);
      return null;
    }
    
    // Get public URL
    const { data: urlData } = supabase.storage
      .from('avatars')
      .getPublicUrl(fileName);
    
    return urlData.publicUrl;
  } catch (err) {
    console.log('Supabase avatar upload failed:', err);
    return null;
  }
}
