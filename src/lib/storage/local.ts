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
  FITNESS_GOAL: 'ilift_fitness_goal',
  EXPERIENCE: 'ilift_experience',
  TOTAL_WORKOUTS: 'ilift_total_workouts',
  CHAT_MESSAGES: 'ilift_chat_messages',
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
    totalWorkouts: onboarding.totalWorkouts || 0,
    onboarding
  };
}

// Save user to localStorage
export function saveLocalUser(user: User): void {
  // Preserve existing totalWorkouts if not in user object
  const existingData = localStorage.getItem(KEYS.USER_DATA);
  const existing = existingData ? JSON.parse(existingData) : {};
  
  localStorage.setItem(KEYS.EMAIL, user.email);
  localStorage.setItem(KEYS.USER_DATA, JSON.stringify({
    name: user.name,
    groupCode: user.group_id,
    totalXP: user.total_xp,
    streak: user.streak,
    badges: user.badges,
    lastWorkoutDate: user.lastWorkoutDate,
    totalWorkouts: user.totalWorkouts ?? existing.totalWorkouts ?? 0,
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
  localStorage.removeItem(KEYS.FAVORITES);
  localStorage.removeItem(KEYS.PENDING_EMAIL);
  localStorage.removeItem(KEYS.PENDING_CODE);
  localStorage.removeItem(KEYS.ONBOARDING);
  // Keep streak, rank, and totalWorkouts - they persist across sessions for the same user
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
  const result = data ? JSON.parse(data) : [];
  console.log('[LOCAL] getLocalFavorites:', result);
  return result;
}

// Save favorites
export function setLocalFavorites(favorites: string[]): void {
  console.log('[LOCAL] setLocalFavorites called with:', favorites);
  localStorage.setItem(KEYS.FAVORITES, JSON.stringify(favorites));
  console.log('[LOCAL] localStorage now has:', localStorage.getItem(KEYS.FAVORITES));
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

// Fitness goal from onboarding
export function getFitnessGoal(): string | null {
  return localStorage.getItem(KEYS.FITNESS_GOAL);
}

export function setFitnessGoal(goal: string): void {
  localStorage.setItem(KEYS.FITNESS_GOAL, goal);
}

// Experience level from onboarding
export function getExperience(): string | null {
  return localStorage.getItem(KEYS.EXPERIENCE);
}

export function setExperience(level: string): void {
  localStorage.setItem(KEYS.EXPERIENCE, level);
}

// Total workouts count (persists across sessions in user data)
export function getTotalWorkouts(): number {
  // First check user data (persistent)
  const data = localStorage.getItem(KEYS.USER_DATA);
  if (data) {
    const parsed = JSON.parse(data);
    if (parsed.totalWorkouts && parsed.totalWorkouts > 0) {
      return parsed.totalWorkouts;
    }
  }
  // Fallback to separate key (for backwards compatibility)
  return parseInt(localStorage.getItem(KEYS.TOTAL_WORKOUTS) || '0');
}

export function setTotalWorkouts(count: number): void {
  localStorage.setItem(KEYS.TOTAL_WORKOUTS, count.toString());
  // Also save to user data for persistence
  const data = localStorage.getItem(KEYS.USER_DATA);
  if (data) {
    const parsed = JSON.parse(data);
    parsed.totalWorkouts = count;
    localStorage.setItem(KEYS.USER_DATA, JSON.stringify(parsed));
  }
}

export function incrementTotalWorkouts(): number {
  const current = getTotalWorkouts();
  const newCount = current + 1;
  setTotalWorkouts(newCount);
  return newCount;
}

// ============================================
// CHAT MESSAGE FUNCTIONS (Local fallback)
// ============================================

interface LocalMessage {
  id: string;
  userEmail: string;
  userName: string;
  text: string;
  time: string;
}

export function getLocalChatMessages(): LocalMessage[] {
  const saved = localStorage.getItem(KEYS.CHAT_MESSAGES);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return [];
    }
  }
  return [];
}

export function saveLocalChatMessage(msg: { userEmail: string; userName: string; text: string }): void {
  const messages = getLocalChatMessages();
  const newMsg: LocalMessage = {
    id: Date.now().toString(),
    userEmail: msg.userEmail,
    userName: msg.userName,
    text: msg.text,
    time: 'now'
  };
  messages.push(newMsg);
  // Keep last 100 messages
  localStorage.setItem(KEYS.CHAT_MESSAGES, JSON.stringify(messages.slice(-100)));
}
