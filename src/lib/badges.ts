// ============================================
// BADGE CHECKING - Pure logic
// ============================================

import type { User, BadgeCheckResult } from './types';
import { ACHIEVEMENTS } from './achievements';

// Check which badges a user has earned based on their stats
export function checkBadges(
  user: Partial<User>,
  totalWorkouts: number,
  hasVideoProof: boolean = false
): BadgeCheckResult {
  const earned: string[] = [];
  const total_xp = user.total_xp ?? 0;
  const streak = user.streak ?? 0;
  const badges = user.badges ?? [];
  
  // First workout
  if (totalWorkouts >= 1) {
    earned.push('first_workout');
  }
  
  // XP-based badges
  if (total_xp >= 1000) earned.push('xp_1000');
  if (total_xp >= 5000) earned.push('xp_5000');
  if (total_xp >= 10000) earned.push('xp_10000');
  
  // Streak badges
  if (streak >= 7) earned.push('streak_7');
  if (streak >= 30) earned.push('streak_30');
  if (streak >= 100) earned.push('streak_100');
  
  // Workout count badges
  if (totalWorkouts >= 100) earned.push('workout_100');
  
  // Video verification
  if (hasVideoProof) earned.push('verified');
  
  // Find newly earned badges
  const existingBadges = new Set(badges);
  const newlyEarned = earned.filter(b => !existingBadges.has(b));
  
  return { earned, newlyEarned };
}

// Get badge info by ID
export function getBadgeInfo(badgeId: string) {
  return ACHIEVEMENTS.find(a => a.id === badgeId);
}
