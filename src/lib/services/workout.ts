// ============================================
// WORKOUT SERVICE - Workout processing & XP logic
// Consolidated from components & stores
// ============================================

import type { Workout, SetData, ScoreResult } from '../types';
import { calculateScore, getExerciseType } from '../xp';

// Process a completed workout and return XP earned
export function processWorkout(
  exercise: string,
  sets: SetData[],
  currentXP: number,
  currentStreak: number
): {
  xpEarned: number;
  newXP: number;
  newStreak: number;
  newLevel: number;
  leveledUp: boolean;
  scoreBreakdown: ScoreResult;
} {
  // Get exercise type and calculate score for all sets
  const exerciseType = getExerciseType(exercise);
  const result = calculateScore(sets, exerciseType);
  
  const totalXP = result.xpEarned;
  
  // Update streak (simplified - in real app would check dates)
  const newStreak = currentStreak + (totalXP > 0 ? 1 : 0);
  
  // Calculate new totals
  const newXP = currentXP + totalXP;
  const newLevel = Math.floor(newXP / 500) + 1;
  const previousLevel = Math.floor(currentXP / 500) + 1;
  const leveledUp = newLevel > previousLevel;

  return {
    xpEarned: totalXP,
    newXP,
    newStreak,
    newLevel,
    leveledUp,
    scoreBreakdown: result,
  };
}

// Get today's workout summary
export function getTodayStats(workouts: Workout[], today: string): {
  workoutCount: number;
  totalXP: number;
  exercises: string[];
} {
  const todayWorkouts = workouts.filter((w) => w.date === today);
  
  return {
    workoutCount: todayWorkouts.length,
    totalXP: todayWorkouts.reduce((sum, w) => sum + (w.score || 0), 0),
    exercises: [...new Set(todayWorkouts.map((w) => w.exercise))],
  };
}

// Check if user already worked out today
export function hasWorkedOutToday(workouts: Workout[], today: string): boolean {
  return workouts.some((w) => w.date === today);
}

// Get workout history by date range
export function getWorkoutsByDateRange(
  workouts: Workout[],
  startDate: string,
  endDate: string
): Workout[] {
  return workouts.filter(
    (w) => w.date >= startDate && w.date <= endDate
  );
}

// Get exercises user has done
export function getUserExercises(workouts: Workout[]): string[] {
  return [...new Set(workouts.map((w) => w.exercise))];
}

// Get exercise frequency (for analytics)
export function getExerciseFrequency(workouts: Workout[]): Record<string, number> {
  const frequency: Record<string, number> = {};
  
  workouts.forEach((w) => {
    frequency[w.exercise] = (frequency[w.exercise] || 0) + 1;
  });
  
  return frequency;
}

// Generate workout streak info
export interface StreakInfo {
  currentStreak: number;
  longestStreak: number;
  lastWorkoutDate: string | null;
  daysSinceLastWorkout: number;
}

export function calculateStreakInfo(workouts: Workout[], currentStreak: number): StreakInfo {
  if (workouts.length === 0) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      lastWorkoutDate: null,
      daysSinceLastWorkout: 0,
    };
  }

  // Sort by date descending
  const sorted = [...workouts].sort((a, b) => b.date.localeCompare(a.date));
  const lastWorkoutDate = sorted[0]?.date || null;

  // Calculate days since last workout
  const today = new Date().toISOString().split('T')[0];
  const daysSinceLastWorkout = lastWorkoutDate
    ? Math.floor((new Date(today).getTime() - new Date(lastWorkoutDate).getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  return {
    currentStreak,
    longestStreak: currentStreak, // Would need to calculate from history
    lastWorkoutDate,
    daysSinceLastWorkout,
  };
}