// ============================================
// STREAK LOGIC - Pure logic for streak calculations
// ============================================

import type { User } from './types';

// Helper functions
function getTodayDate(): string {
  return new Date().toISOString().split('T')[0];
}

function getYesterdayDate(): string {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return yesterday.toISOString().split('T')[0];
}

function calculateStreak(user: User): { streak: number; reason: string } {
  const today = getTodayDate();
  const yesterday = getYesterdayDate();
  const lastWorkout = user.lastWorkoutDate;
  
  if (!lastWorkout) {
    return { streak: 1, reason: 'first' };
  }
  
  if (lastWorkout === today) {
    return { streak: user.streak, reason: 'already' };
  }
  
  if (lastWorkout === yesterday) {
    return { streak: user.streak + 1, reason: 'increment' };
  }
  
  return { streak: 1, reason: 'reset' };
}

// Process workout and update streak properly
export function processWorkout(user: User): { 
  updatedUser: User; 
  streakChanged: boolean; 
  message: string 
} {
  const today = getTodayDate();
  const { streak, reason } = calculateStreak(user);
  
  const streakChanged = reason === 'increment' || reason === 'reset' || reason === 'first';
  
  let message = '';
  if (reason === 'already') {
    message = 'Streak maintained - workout logged today';
  } else if (reason === 'increment') {
    message = `🔥 Streak increased to ${streak}!`;
  } else if (reason === 'reset') {
    message = 'Streak reset - start fresh!';
  } else if (reason === 'first') {
    message = '🔥 Streak started!';
  }
  
  const updatedUser: User = {
    ...user,
    streak,
    lastWorkoutDate: today
  };
  
  return { updatedUser, streakChanged, message };
}

// Export helpers
export { getTodayDate, getYesterdayDate, calculateStreak };
