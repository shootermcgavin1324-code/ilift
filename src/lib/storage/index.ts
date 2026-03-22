// ============================================
// HYBRID STORAGE - Primary + Fallback
// Uses localStorage as primary, Supabase as sync
// NEVER breaks - always has fallback
// ============================================

import type { User, Workout } from '../types';
import * as local from './local';
import * as supabase from './supabase';

// Get user - tries Supabase first, then localStorage
export async function getUser(email?: string): Promise<User> {
  const userEmail = email || local.getLocalUser()?.email;
  
  if (userEmail) {
    const supabaseUser = await supabase.getSupabaseUser(userEmail);
    if (supabaseUser) {
      return supabaseUser;
    }
  }
  
  const localUser = local.getLocalUser();
  if (localUser) {
    return localUser;
  }
  
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
  local.saveLocalUser(user);
  const supabaseId = await supabase.createSupabaseUser(user);
  
  if (supabaseId) {
    local.setLocalUserId(supabaseId);
  }
  
  return supabaseId;
}

// Update user - saves to both
export async function updateUser(user: User): Promise<void> {
  local.saveLocalUser(user);
  await supabase.updateSupabaseUser(user);
}

// Save workout - saves to both
export async function saveWorkout(workout: Workout): Promise<void> {
  local.saveLocalWorkout(workout);
  await supabase.saveSupabaseWorkout(workout);
}

// Get workouts - local only for now
export function getWorkouts(): Workout[] {
  return local.getLocalWorkouts();
}

// Get leaderboard - tries Supabase, falls back to local
export async function getLeaderboard(groupCode: string): Promise<User[]> {
  const supabaseLeaderboard = await supabase.getSupabaseLeaderboard(groupCode);
  if (supabaseLeaderboard.length > 0) {
    return supabaseLeaderboard;
  }
  
  // Fallback: get user from local and return single-user leaderboard
  const localUser = local.getLocalUser();
  if (localUser && localUser.group_id === groupCode) {
    return [localUser];
  }
  
  return [];
}

// Clear all data
export function clearData(): void {
  local.clearLocalData();
}

// Re-export helpers
export { local, supabase };
