import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// User functions
export async function getUser(email: string) {
  const { data } = await supabase.from('users').select('*').eq('email', email).single();
  return data;
}

export async function createUser(user: any) {
  const { data, error } = await supabase.from('users').insert(user).select().single();
  return { data, error };
}

export async function updateUser(id: string, updates: any) {
  const { data, error } = await supabase.from('users').update(updates).eq('id', id).select().single();
  return { data, error };
}

// Workout functions
export async function saveWorkout(workout: any) {
  const { data, error } = await supabase.from('workouts').insert(workout).select().single();
  return { data, error };
}

export async function getUserWorkouts(userId: string) {
  const { data } = await supabase.from('workouts').select('*').eq('user_id', userId).order('date', { ascending: false });
  return data || [];
}

export async function getLeaderboard(groupCode: string) {
  const { data } = await supabase.from('users').select('*').order('total_xp', { ascending: false });
  return data || [];
}

// Group functions
export async function getGroupByCode(code: string) {
  const { data } = await supabase.from('groups').select('*').eq('code', code).single();
  return data;
}

export async function createGroup(group: any) {
  const { data, error } = await supabase.from('groups').insert(group).select().single();
  return { data, error };
}
