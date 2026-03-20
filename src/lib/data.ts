// Hybrid Data Layer
// Uses localStorage as primary, Supabase as secondary
// NEVER breaks - always has fallback

import { supabase } from './supabase';

// Types
export interface User {
  id?: string;
  email: string;
  name: string;
  total_xp: number;
  streak: number;
  badges: string[];
  group_id: string;
  onboarding?: any;
}

export interface Workout {
  id: string;
  exercise: string;
  score: number;
  date: string;
  user_id?: string;
  user_name?: string;
}

// ============================================
// LOCAL STORAGE FUNCTIONS (Always Work)
// ============================================

function getLocalUser(): User | null {
  const email = localStorage.getItem('ilift_email');
  const data = localStorage.getItem('ilift_onboarding_data');
  if (!email || !data) return null;
  
  const onboarding = JSON.parse(data);
  return {
    email,
    name: onboarding.name || email.split('@')[0],
    total_xp: onboarding.totalXP || 0,
    streak: onboarding.streak || 0,
    badges: onboarding.badges || [],
    group_id: onboarding.groupCode || 'TEST',
    onboarding
  };
}

function saveLocalUser(user: User): void {
  localStorage.setItem('ilift_email', user.email);
  localStorage.setItem('ilift_onboarding_data', JSON.stringify({
    name: user.name,
    groupCode: user.group_id,
    totalXP: user.total_xp,
    streak: user.streak,
    badges: user.badges,
    ...user.onboarding
  }));
}

function getLocalWorkouts(): Workout[] {
  const data = localStorage.getItem('ilift_workouts');
  return data ? JSON.parse(data) : [];
}

function saveLocalWorkout(workout: Workout): void {
  const workouts = getLocalWorkouts();
  workouts.unshift(workout);
  localStorage.setItem('ilift_workouts', JSON.stringify(workouts.slice(0, 50)));
}

// ============================================
// SUPABASE FUNCTIONS (May Fail - That's OK)
// ============================================

async function getSupabaseUser(email: string): Promise<User | null> {
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

async function createSupabaseUser(user: User): Promise<string | null> {
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

async function saveSupabaseWorkout(workout: Workout): Promise<void> {
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

async function updateSupabaseUser(user: User): Promise<void> {
  try {
    // Try to update by email (more reliable)
    const email = localStorage.getItem('ilift_email');
    if (!email) return;
    
    await supabase.from('users').update({
      total_xp: user.total_xp,
      streak: user.streak,
      badges: user.badges
    }).eq('email', email);
  } catch (err) {
    console.log('Supabase updateUser failed:', err);
  }
}

// ============================================
// HYBRID FUNCTIONS (Primary + Fallback)
// ============================================

// Get user - tries Supabase first, then localStorage
export async function getUser(email?: string): Promise<User> {
  const userEmail = email || localStorage.getItem('ilift_email');
  
  if (userEmail) {
    // Try Supabase first
    const supabaseUser = await getSupabaseUser(userEmail);
    if (supabaseUser) {
      return supabaseUser;
    }
  }
  
  // Fallback to localStorage
  const localUser = getLocalUser();
  if (localUser) {
    return localUser;
  }
  
  // Return empty user if nothing found
  return {
    email: '',
    name: 'Guest',
    total_xp: 0,
    streak: 0,
    badges: [],
    group_id: 'TEST'
  };
}

// Create user - saves to both
export async function createUser(user: User): Promise<string | null> {
  // Always save to localStorage first (never fails)
  saveLocalUser(user);
  
  // Try to save to Supabase (may fail - that's ok)
  const supabaseId = await createSupabaseUser(user);
  
  if (supabaseId) {
    localStorage.setItem('ilift_user_id', supabaseId);
  }
  
  return supabaseId;
}

// Save workout - saves to both
export async function saveWorkout(workout: Workout): Promise<void> {
  // Always save locally first
  saveLocalWorkout(workout);
  
  // Try to save to Supabase
  await saveSupabaseWorkout(workout);
}

// Update user XP/streak
export async function updateUser(user: User): Promise<void> {
  // Always update locally
  saveLocalUser(user);
  
  // Try to update Supabase
  await updateSupabaseUser(user);
}

// Get workouts - local only for now
export function getWorkouts(): Workout[] {
  return getLocalWorkouts();
}
