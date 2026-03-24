// ============================================
// BADGE CHECKING - Tracks progress for all achievements
// ============================================

import type { User, BadgeCheckResult, Workout } from './types';
import { ACHIEVEMENTS } from './achievements';

// Extended context for badge checking
export interface BadgeCheckContext {
  totalWorkouts: number;
  totalSets: number;
  totalXP: number;
  currentStreak: number;
  hasVideoProof: boolean;
  xpEarnedToday: number;
  workoutsToday: number;
  workoutsThisWeek: number;
  xpThisWeek: number;
  workoutTypesToday: string[]; // unique exercise categories done today
  lastWorkoutDate?: string;
  squadRank?: number;
  squadSize?: number;
}

// Check which badges a user has earned based on their stats
export function checkBadges(
  user: Partial<User>,
  totalWorkouts: number = 0,
  hasVideoProof: boolean = false,
  context?: Partial<BadgeCheckContext>
): BadgeCheckResult {
  const earned: string[] = [];
  const total_xp = user.total_xp ?? 0;
  const streak = user.streak ?? 0;
  const badges = user.badges ?? [];
  
  const ctx = {
    totalWorkouts,
    totalSets: context?.totalSets ?? 0,
    totalXP: total_xp,
    currentStreak: streak,
    hasVideoProof,
    xpEarnedToday: context?.xpEarnedToday ?? 0,
    workoutsToday: context?.workoutsToday ?? 0,
    workoutsThisWeek: context?.workoutsThisWeek ?? 0,
    xpThisWeek: context?.xpThisWeek ?? 0,
    workoutTypesToday: context?.workoutTypesToday ?? [],
    lastWorkoutDate: context?.lastWorkoutDate,
    squadRank: context?.squadRank,
    squadSize: context?.squadSize,
  };

  // ========== DAILY ACHIEVEMENTS ==========
  
  // Punch the Clock - Complete 1 workout
  if (ctx.totalWorkouts >= 1) {
    earned.push('punch_the_clock');
  }
  
  // Turn the Key - Start or keep a streak alive
  if (ctx.currentStreak >= 1) {
    earned.push('turn_the_key');
  }
  
  // Find Your Range - Hit RPE 8+ (would need RPE tracking in workout)
  // For now, we'll check if they have any workouts with high scores
  if (ctx.totalWorkouts >= 1) {
    earned.push('find_your_range'); // Simplified - any workout counts
  }
  
  // First Steps (legacy)
  if (ctx.totalWorkouts >= 1) {
    earned.push('first_workout');
  }
  
  // ========== WEEKLY ACHIEVEMENTS ==========
  
  // The Long Haul - Earn 400 XP this week
  if (ctx.xpThisWeek >= 400) {
    earned.push('the_long_haul');
  }
  
  // Still Standing - Complete 4 workouts this week
  if (ctx.workoutsThisWeek >= 4) {
    earned.push('still_standing');
  }
  
  // Check the Scoreboard - Pass someone on leaderboard
  if (ctx.squadRank !== undefined && ctx.squadSize !== undefined && ctx.squadRank < ctx.squadSize) {
    earned.push('check_the_scoreboard');
  }
  
  // Not Done Yet - Earn XP late in the week (Friday-Sunday)
  if (ctx.xpEarnedToday > 0) {
    const day = new Date().getDay();
    if (day === 5 || day === 6 || day === 0) { // Fri, Sat, Sun
      earned.push('not_done_yet');
    }
  }
  
  // Streak badges
  if (ctx.currentStreak >= 7) earned.push('streak_7');
  if (ctx.currentStreak >= 30) earned.push('streak_30');
  if (ctx.currentStreak >= 100) earned.push('streak_100');
  
  // ========== ALL-TIME ACHIEVEMENTS ==========
  
  // XP Farmer - 300+ XP in one day
  if (ctx.xpEarnedToday >= 300) {
    earned.push('xp_farmer');
  }
  
  // The Long Game - 25 total workouts
  if (ctx.totalWorkouts >= 25) {
    earned.push('the_long_game');
  }
  
  // Trail of Destruction - 100 total sets
  if (ctx.totalSets >= 100) {
    earned.push('trail_of_destruction');
  }
  
  // Not Over Till It's Over - Clutch streak before reset
  // (Simplified: if they have any streak)
  if (ctx.currentStreak >= 1) {
    earned.push('not_over_till_its_over');
  }
  
  // For Science - 3 different workout types in one day
  if (ctx.workoutTypesToday.length >= 3) {
    earned.push('for_science');
  }
  
  // Running Laps - Be far ahead of squad
  if (ctx.squadRank !== undefined && ctx.squadSize !== undefined && ctx.squadRank <= Math.floor(ctx.squadSize * 0.25)) {
    earned.push('running_laps');
  }
  
  // Back from the Brink - Save streak at last moment
  // (Simplified: if streak > 0)
  if (ctx.currentStreak >= 1) {
    earned.push('back_from_the_brink');
  }
  
  // Three for Three - 3 high-effort workouts in a row
  // (Simplified: if they have 3+ workouts)
  if (ctx.totalWorkouts >= 3) {
    earned.push('three_for_three');
  }
  
  // XP milestones
  if (ctx.totalXP >= 1000) earned.push('xp_1000');
  if (ctx.totalXP >= 5000) earned.push('xp_5000');
  if (ctx.totalXP >= 10000) earned.push('xp_10000');
  
  // Workout count milestones
  if (ctx.totalWorkouts >= 50) earned.push('workout_50');
  if (ctx.totalWorkouts >= 100) earned.push('workout_100');
  
  // ========== SPECIAL WEEKLY ==========
  
  // These require specific exercise tracking
  // No Breaks - 25 push-ups (would need rep tracking)
  // Hold the Line - 1-min plank
  // Empty the Tank - 50 squats
  // Three Digits - 100 reps
  // One Take - complete without stopping
  
  // Video verification
  if (ctx.hasVideoProof) earned.push('verified');
  
  // Find newly earned badges
  const existingBadges = new Set(badges);
  const newlyEarned = earned.filter(b => !existingBadges.has(b));
  
  return { earned, newlyEarned };
}

// Get badge info by ID
export function getBadgeInfo(badgeId: string) {
  return ACHIEVEMENTS.find(a => a.id === badgeId);
}
