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
