// ============================================
// LOCAL STORAGE - Always works, never fails
// ============================================

import type { User, Workout } from '../types';

// Keys
const KEYS = {
  EMAIL: 'ilift_email',
  USER_DATA: 'ilift_onboarding_data',
  WORKOUTS: 'ilift_workouts',
  USER_ID: 'ilift_user_id'
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
}
