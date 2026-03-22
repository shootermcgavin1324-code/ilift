// ============================================
// LOCAL STORAGE - Always works, never fails
// ============================================

import type { User, Workout } from '../types';

// Check if we're in browser
const isBrowser = typeof window !== 'undefined';

// Keys
const KEYS = {
  EMAIL: 'ilift_email',
  USER_DATA: 'ilift_onboarding_data',
  WORKOUTS: 'ilift_workouts',
  USER_ID: 'ilift_user_id',
  PRS: 'ilift_prs',
  BEST_STREAK: 'ilift_best_streak',
  HIGHEST_RANK: 'ilift_highest_rank',
  FAVORITES: 'ilift_favorites',
  PENDING_EMAIL: 'ilift_pending_email',
  PENDING_CODE: 'ilift_pending_code',
  ONBOARDING: 'ilift_onboarding',
};

// Get user from localStorage
export function getLocalUser(): User | null {
  const email = localStorage.getItem(KEYS.EMAIL);
  const data = localStorage.getItem(KEYS.USER_DATA);
  if (!email || !data) return null;
  
  const onboarding = JSON.parse(data);
  return {
    email,
    name: onboarding.name || email.split('@')[0],
    total_xp: onboarding.totalXP || 0,
    streak: onboarding.streak || 0,
    badges: onboarding.badges || [],
    group_id: onboarding.groupCode || 'TEST',
    lastWorkoutDate: onboarding.lastWorkoutDate,
    onboarding
  };
}

// Save user to localStorage
export function saveLocalUser(user: User): void {
  localStorage.setItem(KEYS.EMAIL, user.email);
  localStorage.setItem(KEYS.USER_DATA, JSON.stringify({
    name: user.name,
    groupCode: user.group_id,
    totalXP: user.total_xp,
    streak: user.streak,
    badges: user.badges,
    lastWorkoutDate: user.lastWorkoutDate,
    ...user.onboarding
  }));
}

// Get workouts from localStorage
export function getLocalWorkouts(): Workout[] {
  const data = localStorage.getItem(KEYS.WORKOUTS);
  return data ? JSON.parse(data) : [];
}

// Save workout to localStorage
export function saveLocalWorkout(workout: Workout): void {
  const workouts = getLocalWorkouts();
  workouts.unshift(workout);
  // Keep only last 50 workouts
  localStorage.setItem(KEYS.WORKOUTS, JSON.stringify(workouts.slice(0, 50)));
}

// Get stored user ID
export function getLocalUserId(): string | null {
  return localStorage.getItem(KEYS.USER_ID);
}

// Set stored user ID
export function setLocalUserId(id: string): void {
  localStorage.setItem(KEYS.USER_ID, id);
}

// Clear all local data
export function clearLocalData(): void {
  localStorage.removeItem(KEYS.EMAIL);
  localStorage.removeItem(KEYS.USER_DATA);
  localStorage.removeItem(KEYS.WORKOUTS);
  localStorage.removeItem(KEYS.USER_ID);
  localStorage.removeItem(KEYS.PRS);
  localStorage.removeItem(KEYS.BEST_STREAK);
  localStorage.removeItem(KEYS.HIGHEST_RANK);
  localStorage.removeItem(KEYS.FAVORITES);
  localStorage.removeItem(KEYS.PENDING_EMAIL);
  localStorage.removeItem(KEYS.PENDING_CODE);
  localStorage.removeItem(KEYS.ONBOARDING);
}

// PR type
interface PR {
  maxWeight: number;
  date: string;
}

// Get PRs from localStorage
export function getLocalPRs(): Record<string, PR> {
  const data = localStorage.getItem(KEYS.PRS);
  return data ? JSON.parse(data) : {};
}

// Save PR to localStorage
export function saveLocalPR(exercise: string, weight: number): void {
  const prs = getLocalPRs();
  const key = exercise.toLowerCase();
  if (!prs[key] || weight > prs[key].maxWeight) {
    prs[key] = {
      maxWeight: weight,
      date: new Date().toISOString()
    };
    localStorage.setItem(KEYS.PRS, JSON.stringify(prs));
  }
}

// Get best streak
export function getLocalBestStreak(): number {
  return parseInt(localStorage.getItem(KEYS.BEST_STREAK) || '0');
}

// Save best streak
export function setLocalBestStreak(streak: number): void {
  localStorage.setItem(KEYS.BEST_STREAK, streak.toString());
}

// Get highest rank
export function getLocalHighestRank(): number {
  return parseInt(localStorage.getItem(KEYS.HIGHEST_RANK) || '0');
}

// Save highest rank
export function setLocalHighestRank(rank: number): void {
  localStorage.setItem(KEYS.HIGHEST_RANK, rank.toString());
}

// Get favorites
export function getLocalFavorites(): string[] {
  const data = localStorage.getItem(KEYS.FAVORITES);
  return data ? JSON.parse(data) : [];
}

// Save favorites
export function setLocalFavorites(favorites: string[]): void {
  localStorage.setItem(KEYS.FAVORITES, JSON.stringify(favorites));
}

// Pending email (from landing before onboarding)
export function getPendingEmail(): string | null {
  return localStorage.getItem(KEYS.PENDING_EMAIL);
}

export function setPendingEmail(email: string): void {
  localStorage.setItem(KEYS.PENDING_EMAIL, email);
}

export function clearPendingEmail(): void {
  localStorage.removeItem(KEYS.PENDING_EMAIL);
}

// Pending code (from landing before onboarding)
export function getPendingCode(): string | null {
  return localStorage.getItem(KEYS.PENDING_CODE);
}

export function setPendingCode(code: string): void {
  localStorage.setItem(KEYS.PENDING_CODE, code.toUpperCase());
}

export function clearPendingCode(): void {
  localStorage.removeItem(KEYS.PENDING_CODE);
}

// Onboarding status
export function hasCompletedOnboarding(): boolean {
  return localStorage.getItem(KEYS.ONBOARDING) === 'true';
}

export function setOnboardingComplete(): void {
  localStorage.setItem(KEYS.ONBOARDING, 'true');
}

export function clearOnboarding(): void {
  localStorage.removeItem(KEYS.ONBOARDING);
}
