// ============================================
// HYBRID STORAGE - Convex Primary + Local Fallback
// Convex is primary, localStorage is fallback for offline
// ============================================

import type { User, Workout } from '../types';
import * as local from './local';
import * as convex from '../convex/client-wrapper';

// ============================================
// USER FUNCTIONS
// ============================================

// Get user - tries Convex first, then localStorage
export async function getUser(email?: string): Promise<User> {
  const userEmail = email || local.getLocalUser()?.email;
  
  if (userEmail) {
    try {
      // Try Convex first
      const convexUser = await convex.getUser(userEmail);
      if (convexUser) {
        // Cache in localStorage for offline
        local.saveLocalUser(convexUser);
        return convexUser;
      }
    } catch (err) {
      console.warn('Convex unavailable, using localStorage:', err);
    }
  }
  
  // Fallback to localStorage
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

// Create user - saves to Convex, then local
export async function createUser(user: User): Promise<string | null> {
  // Save to Convex first
  try {
    await convex.upsertUser(user.email, user.name, user.group_id);
  } catch (err) {
    console.warn('Convex createUser failed, local only:', err);
  }
  
  // Always save locally too
  local.saveLocalUser(user);
  return user.email;
}

// Update user - saves to Convex, then local
export async function updateUser(user: User): Promise<void> {
  // Save to Convex
  try {
    await convex.updateProfile(user.email, {
      name: user.name,
      group_id: user.group_id,
      badges: user.badges,
    });
  } catch (err) {
    console.warn('Convex updateUser failed, local only:', err);
  }
  
  // Always save locally too
  local.saveLocalUser(user);
}

// ============================================
// WORKOUT FUNCTIONS
// ============================================

// Save workout - saves to Convex, then local
export async function saveWorkout(workout: Workout): Promise<void> {
  // Save to Convex first
  try {
    // Get user info from workout or localStorage
    const userEmail = workout.user_id || local.getLocalUser()?.email;
    const userName = workout.user_name || local.getLocalUser()?.name;
    
    if (userEmail) {
      await convex.saveWorkout(
        userEmail,
        workout.exercise,
        workout.score,
        workout.date,
        userName
      );
    }
  } catch (err) {
    console.warn('Convex saveWorkout failed, local only:', err);
  }
  
  // Always save locally too
  local.saveLocalWorkout(workout);
}

// Get workouts - tries Convex first, then local
export async function getWorkouts(userEmail?: string): Promise<Workout[]> {
  const email = userEmail || local.getLocalUser()?.email;
  
  if (email) {
    try {
      const convexWorkouts = await convex.getWorkouts(email);
      if (convexWorkouts && convexWorkouts.length > 0) {
        // Cache in localStorage (use saveLocalWorkout for each)
        for (const w of convexWorkouts) {
          local.saveLocalWorkout(w);
        }
        return convexWorkouts;
      }
    } catch (err) {
      console.warn('Convex getWorkouts failed, using local:', err);
    }
  }
  
  // Fallback to local
  return local.getLocalWorkouts();
}

// ============================================
// LEADERBOARD
// ============================================

// Get leaderboard - uses Convex
export async function getLeaderboard(groupCode: string): Promise<User[]> {
  try {
    const leaderboard = await convex.getLeaderboard(groupCode);
    if (leaderboard) {
      return leaderboard;
    }
  } catch (err) {
    console.warn('Convex getLeaderboard failed, using local:', err);
  }
  
  // Fallback to local
  const localUser = local.getLocalUser();
  if (localUser && localUser.group_id === groupCode) {
    return [localUser];
  }
  
  return [];
}

// ============================================
// DATA CLEARING
// ============================================

// Clear all data
export function clearData(): void {
  local.clearLocalData();
}

// ============================================
// PR FUNCTIONS
// ============================================

export async function getPRs(userId: string): Promise<Record<string, { maxWeight: number; date: string }>> {
  // Try Convex first
  try {
    const convexPRs = await convex.getPRs(userId);
    if (convexPRs) {
      // Cache locally by saving each PR
      for (const [exercise, prData] of Object.entries(convexPRs)) {
        const pr = prData as { maxWeight: number; date: string };
        local.saveLocalPR(exercise, pr.maxWeight);
      }
      return convexPRs;
    }
  } catch (err) {
    console.warn('Convex getPRs failed, using local:', err);
  }
  
  // Fallback to local
  return local.getLocalPRs();
}

export async function savePR(userId: string, exercise: string, weight: number): Promise<void> {
  // Save to Convex first
  try {
    await convex.savePR(userId, exercise, weight);
  } catch (err) {
    console.warn('Convex savePR failed, local only:', err);
  }
  
  // Always save locally too
  local.saveLocalPR(exercise, weight);
}

// ============================================
// STREAK/RANK FUNCTIONS
// ============================================

export function getBestStreak(): number {
  return local.getLocalBestStreak();
}

export function setBestStreak(streak: number): void {
  local.setLocalBestStreak(streak);
}

export async function syncBestStreak(streak: number, email: string): Promise<void> {
  // Save locally first
  local.setLocalBestStreak(streak);
  
  // Sync to Convex
  try {
    await convex.updateStreak(email, streak);
  } catch (err) {
    console.warn('Convex syncBestStreak failed:', err);
  }
}

export function getHighestRank(): number {
  return local.getLocalHighestRank();
}

export function setHighestRank(rank: number): void {
  local.setLocalHighestRank(rank);
}

export async function syncHighestRank(rank: number): Promise<void> {
  local.setLocalHighestRank(rank);
  // Sync to Convex via updateUser if needed
}

// ============================================
// FAVORITES
// ============================================

export function getFavorites(): string[] {
  return local.getLocalFavorites();
}

export function setFavorites(favorites: string[]): void {
  local.setLocalFavorites(favorites);
}

// ============================================
// VIDEO UPLOAD (Disabled - no backend)
// ============================================

export async function uploadVideo(userId: string, file: File): Promise<string | null> {
  console.warn('Video upload not implemented - no Supabase backend');
  return null;
}

export async function uploadAvatar(userId: string, file: File): Promise<string | null> {
  console.warn('Avatar upload not implemented - no backend');
  return null;
}

// ============================================
// RE-EXPORT LOCAL HELPERS
// ============================================

export {
  getLocalUser,
  saveLocalUser,
  getLocalWorkouts,
  saveLocalWorkout,
  getLocalUserId,
  setLocalUserId,
  getLocalPRs,
  saveLocalPR,
  getLocalBestStreak,
  setLocalBestStreak,
  getLocalHighestRank,
  setLocalHighestRank,
  getLocalFavorites,
  setLocalFavorites,
  getPendingEmail,
  setPendingEmail,
  clearPendingEmail,
  getPendingCode,
  setPendingCode,
  clearPendingCode,
  hasCompletedOnboarding,
  setOnboardingComplete,
  clearOnboarding,
  clearLocalData,
  getFitnessGoal,
  setFitnessGoal,
  getExperience,
  setExperience,
  getTotalWorkouts,
  setTotalWorkouts,
  incrementTotalWorkouts,
} from './local';