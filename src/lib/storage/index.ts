// ============================================
// HYBRID STORAGE - Primary + Fallback
// Uses localStorage as primary, Convex as sync
// NEVER breaks - always has fallback
// ============================================

import type { User, Workout } from '../types';
import * as local from './local';

// ============================================
// CONVEX STORAGE - Sync layer
// Uses Convex hooks for cloud sync
// ============================================

// Lazy load convex hooks to avoid SSR issues
let convexHooks: typeof import('@/lib/convex/hooks') | null = null;

async function getConvexHooks() {
  if (!convexHooks) {
    convexHooks = await import('@/lib/convex/hooks');
  }
  return convexHooks;
}

// ============================================
// USER FUNCTIONS
// ============================================

// Get user - tries Convex first, then localStorage
export async function getUser(email?: string): Promise<User> {
  const userEmail = email || local.getLocalUser()?.email;
  
  if (userEmail) {
    try {
      const hooks = await getConvexHooks();
      // For now, we'll use localStorage directly since hooks need React context
      // The Convex integration will be done via components using hooks
    } catch {
      // Convex not available
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

// Create user - saves to local (Convex sync via hooks in components)
export async function createUser(user: User): Promise<string | null> {
  local.saveLocalUser(user);
  // Convex sync will happen via useUpsertUser hook in signup flow
  return user.email;
}

// Update user - saves to local
export async function updateUser(user: User): Promise<void> {
  local.saveLocalUser(user);
  // Convex sync will happen via useUpdateProfile hook
}

// ============================================
// WORKOUT FUNCTIONS
// ============================================

// Save workout - saves to local
export async function saveWorkout(workout: Workout): Promise<void> {
  local.saveLocalWorkout(workout);
  // Convex sync will happen via useAddWorkout hook
}

// Get workouts - local only for now
export function getWorkouts(): Workout[] {
  return local.getLocalWorkouts();
}

// ============================================
// LEADERBOARD
// ============================================

// Get leaderboard - local only for now
export async function getLeaderboard(groupCode: string): Promise<User[]> {
  // For now, get user from local and return single-user leaderboard
  // Convex integration via useLeaderboard hook in components
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
  // For now, use local storage
  // Convex integration via useUserPRs hook
  return local.getLocalPRs();
}

export async function savePR(userId: string, exercise: string, weight: number): Promise<void> {
  // Save to local first (for immediate UI)
  local.saveLocalPR(exercise, weight);
  // Convex sync will happen via useSavePR hook
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
  local.setLocalBestStreak(streak);
  // Convex sync via useUpdateStreak hook
}

export function getHighestRank(): number {
  return local.getLocalHighestRank();
}

export function setHighestRank(rank: number): void {
  local.setLocalHighestRank(rank);
}

export async function syncHighestRank(rank: number): Promise<void> {
  local.setLocalHighestRank(rank);
  // Convex sync via useUpdateProfile hook
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