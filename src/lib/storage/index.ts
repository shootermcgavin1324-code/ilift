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
        // Cache in localStorage for offline (including bestStreak & highestRank)
        local.saveLocalUser({
          email: convexUser.email,
          name: convexUser.name,
          total_xp: convexUser.total_xp,
          streak: convexUser.streak,
          badges: convexUser.badges || [],
          group_id: convexUser.group_id || 'TEST',
          lastWorkoutDate: convexUser.lastWorkoutDate,
          experience: convexUser.experience,
          fitnessGoal: convexUser.fitnessGoal,
          totalWorkouts: convexUser.totalWorkouts,
        });
        // Sync best streak and highest rank to localStorage
        if (convexUser.bestStreak) {
          local.setLocalBestStreak(convexUser.bestStreak);
        }
        if (convexUser.highestRank) {
          local.setLocalHighestRank(convexUser.highestRank);
        }
        return {
          email: convexUser.email,
          name: convexUser.name,
          total_xp: convexUser.total_xp,
          streak: convexUser.streak,
          badges: convexUser.badges || [],
          group_id: convexUser.group_id || 'TEST',
          lastWorkoutDate: convexUser.lastWorkoutDate,
          bestStreak: convexUser.bestStreak,
          highestRank: convexUser.highestRank,
          experience: convexUser.experience,
          fitnessGoal: convexUser.fitnessGoal,
          totalWorkouts: convexUser.totalWorkouts,
        };
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

// Sync XP to Convex (called after workout completion)
export async function syncXP(email: string, totalXP: number, streak: number, badges: string[]): Promise<void> {
  if (!email) return;
  
  try {
    const user: User = {
      email,
      name: local.getLocalUser()?.name || 'Player',
      total_xp: totalXP,
      streak,
      badges,
      group_id: local.getLocalUser()?.group_id || 'TEST'
    };
    
    // First ensure user exists in Convex
    try {
      const existing = await convex.getUser(email);
      if (!existing) {
        // User doesn't exist yet, create them first
        await convex.upsertUser(email, user.name || 'Player', user.group_id || 'TEST', undefined, undefined, 0);
      }
    } catch {
      // Skip user creation if it fails
    }
    
    // Now update profile
    await convex.updateProfile(email, { 
      name: user.name, 
      group_id: user.group_id, 
      badges: user.badges 
    });
    
    // Get current XP and calculate difference
    const current = await convex.getUser(email);
    if (current) {
      const xpDiff = totalXP - current.total_xp;
      if (xpDiff > 0) {
        await convex.addXP(email, xpDiff);
      }
    }
  } catch (err) {
    console.warn('Convex syncXP failed:', err);
    // Silently fail - local data is already saved
  }
}

// Create user - saves to Convex, then local
export async function createUser(user: User): Promise<string | null> {
  // Save to Convex first
  try {
    await convex.upsertUser(user.email, user.name, user.group_id || 'TEST', user.experience, user.fitnessGoal, user.totalWorkouts);
  } catch (err) {
    console.warn('Convex createUser failed, local only:', err);
  }
  
  // Always save locally too
  local.saveLocalUser(user);
  return user.email;
}

// Update user - saves to Convex, then local
export async function updateUser(user: User): Promise<void> {
  if (!user.email) {
    // No email, can't sync to Convex
    local.saveLocalUser(user);
    return;
  }
  
  // Ensure user exists in Convex first
  try {
    const existing = await convex.getUser(user.email);
    if (!existing) {
      await convex.upsertUser(
        user.email, 
        user.name || 'Player', 
        user.group_id || 'TEST',
        user.experience,
        user.fitnessGoal,
        user.totalWorkouts || 0
      );
    }
  } catch {
    // Convex might be down, continue with local
  }
  
  // Now update profile
  try {
    await convex.updateProfile(user.email, { 
      name: user.name, 
      group_id: user.group_id, 
      badges: user.badges,
      experience: user.experience,
      fitnessGoal: user.fitnessGoal,
      totalWorkouts: user.totalWorkouts,
      bestStreak: user.bestStreak,
      highestRank: user.highestRank,
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
    const user = local.getLocalUser();
    await convex.saveWorkout(
      user?.email || '',
      workout.exercise,
      workout.score,
      workout.date,
      user?.name
    );
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
      // Get from Convex
      const convexWorkouts = await convex.getWorkouts(email);
      if (convexWorkouts && convexWorkouts.length > 0) {
        // Cache in localStorage
        for (const w of convexWorkouts) {
          local.saveLocalWorkout({
            exercise: w.exercise,
            score: w.score,
            date: w.date,
            user_id: w.userEmail,
            user_name: w.userName,
          });
        }
        return convexWorkouts.map(w => ({
          exercise: w.exercise,
          score: w.score,
          date: w.date,
          user_id: w.userEmail,
          user_name: w.userName,
        }));
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
      return leaderboard.map(u => ({
        email: u.email,
        name: u.name,
        total_xp: u.total_xp,
        streak: u.streak,
        badges: u.badges || [],
        group_id: u.group_id || groupCode,
        lastWorkoutDate: u.lastWorkoutDate,
      }));
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

export async function getPRs(userEmail?: string): Promise<Record<string, { maxWeight: number; date: string }>> {
  const email = userEmail || local.getLocalUser()?.email;
  
  if (!email) {
    return local.getLocalPRs();
  }
  
  // Try Convex first
  try {
    const convexPRs = await convex.getPRs(email);
    if (convexPRs && Object.keys(convexPRs).length > 0) {
      // Cache locally
      for (const [exercise, pr] of Object.entries(convexPRs)) {
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

export async function savePR(userEmail: string, exercise: string, weight: number): Promise<boolean> {
  const email = userEmail || local.getLocalUser()?.email;
  if (!email) {
    local.saveLocalPR(exercise, weight);
    return weight > 0;
  }
  
  // Save to Convex first
  let isNewPR = false;
  try {
    const result = await convex.savePR(email, exercise, weight);
    isNewPR = result.isNewPR;
  } catch (err) {
    console.warn('Convex savePR failed, local only:', err);
  }
  
  // Always save locally too
  local.saveLocalPR(exercise, weight);
  return isNewPR;
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

export async function syncHighestRank(rank: number, email: string): Promise<void> {
  local.setLocalHighestRank(rank);
  // Sync to Convex - track in profile
  try {
    await convex.updateProfile(email, {});
  } catch (err) {
    console.warn('Convex syncHighestRank failed:', err);
  }
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
// VIDEO UPLOAD (Not implemented - requires external service)
// ============================================

export async function uploadVideo(userId: string, file: File): Promise<string | null> {
  console.warn('Video upload not implemented');
  return null;
}

export async function uploadAvatar(userId: string, file: File): Promise<string | null> {
  console.warn('Avatar upload not implemented');
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
