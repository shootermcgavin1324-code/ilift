// ============================================
// XP CALCULATION - Unified scoring for all exercise types
// ============================================

import type { SetData, ScoreResult } from './types';

export type ExerciseType = 'strength' | 'cardio' | 'calisthenics';

// Base XP values per exercise type
const XP_CONFIG = {
  strength: {
    base: 10,        // Base XP per workout
    perSet: 2,       // Bonus XP per completed set
  },
  cardio: {
    perMile: 10,     // 10 XP per mile
  },
  calisthenics: {
    perRep: 1,       // 1 XP per rep
  },
};

// RPE bonus multiplier (effort-based)
const RPE_MULTIPLIER = 0.2; // Each RPE point adds 20% bonus

/**
 * Calculate XP for strength exercises
 * Formula: baseXP + (sets × perSet) + (avgRPE × baseXP × RPE_MULTIPLIER)
 */
function calculateStrengthXP(sets: SetData[]): ScoreResult {
  const doneSets = sets.filter(s => s.done);
  if (doneSets.length === 0) {
    return { xpEarned: 0, breakdown: { baseXP: 0, rpeBonus: 0, volumeBonus: 0 } };
  }

  const baseXP = XP_CONFIG.strength.base;
  const totalSets = doneSets.length;
  const avgRpe = doneSets.reduce((sum, s) => sum + s.rpe, 0) / doneSets.length;
  
  const volumeBonus = totalSets * XP_CONFIG.strength.perSet;
  const rpeBonus = Math.round(baseXP * avgRpe * RPE_MULTIPLIER);
  const xpEarned = baseXP + volumeBonus + rpeBonus;
  
  return {
    xpEarned,
    breakdown: {
      baseXP,
      rpeBonus,
      volumeBonus
    }
  };
}

/**
 * Calculate XP for cardio exercises
 * Formula: miles × perMile + (avgRPE × miles × 0.1 bonus)
 */
function calculateCardioXP(sets: SetData[]): ScoreResult {
  const doneSets = sets.filter(s => s.done);
  if (doneSets.length === 0) {
    return { xpEarned: 0, breakdown: { baseXP: 0, rpeBonus: 0, volumeBonus: 0 } };
  }

  // For cardio, we track distance in "weight" field (as miles) and time in "reps" field
  const totalMiles = doneSets.reduce((sum, s) => sum + (s.weight || 0), 0);
  const avgRpe = doneSets.reduce((sum, s) => sum + s.rpe, 0) / doneSets.length;
  
  const baseXP = Math.round(totalMiles * XP_CONFIG.cardio.perMile);
  const rpeBonus = Math.round(baseXP * avgRpe * 0.1);
  const xpEarned = baseXP + rpeBonus;
  
  return {
    xpEarned,
    breakdown: {
      baseXP,
      rpeBonus,
      volumeBonus: 0
    }
  };
}

/**
 * Calculate XP for calisthenics exercises
 * Formula: totalReps × perRep + (avgRPE × totalReps × 0.1 bonus)
 */
function calculateCalisthenicsXP(sets: SetData[]): ScoreResult {
  const doneSets = sets.filter(s => s.done);
  if (doneSets.length === 0) {
    return { xpEarned: 0, breakdown: { baseXP: 0, rpeBonus: 0, volumeBonus: 0 } };
  }

  // For calisthenics, we track reps in "reps" field
  const totalReps = doneSets.reduce((sum, s) => sum + (s.reps || 0), 0);
  const avgRpe = doneSets.reduce((sum, s) => sum + s.rpe, 0) / doneSets.length;
  
  const baseXP = totalReps * XP_CONFIG.calisthenics.perRep;
  const rpeBonus = Math.round(baseXP * avgRpe * 0.1);
  const xpEarned = baseXP + rpeBonus;
  
  return {
    xpEarned,
    breakdown: {
      baseXP,
      rpeBonus,
      volumeBonus: 0
    }
  };
}

/**
 * Calculate XP based on exercise type
 * @param sets - Array of set data
 * @param exerciseType - Type of exercise (strength, cardio, calisthenics)
 */
export function calculateScore(sets: SetData[], exerciseType: ExerciseType = 'strength'): ScoreResult {
  switch (exerciseType) {
    case 'cardio':
      return calculateCardioXP(sets);
    case 'calisthenics':
      return calculateCalisthenicsXP(sets);
    case 'strength':
    default:
      return calculateStrengthXP(sets);
  }
}

/**
 * Get exercise type from exercise name
 * This is a simple mapping - can be expanded
 */
export function getExerciseType(exerciseName: string): ExerciseType {
  const name = exerciseName.toLowerCase();
  
  // Cardio exercises
  const cardioExercises = ['run', 'running'];
  if (cardioExercises.some(e => name.includes(e))) {
    return 'cardio';
  }
  
  // Calisthenics
  const calisthenicsExercises = ['push-up', 'pushup', 'pull-up', 'pullup', 'dip', 'dips', 'chin-up', 'chinup', 'sit-up', 'situp', 'crunch', 'crunches', 'burpee', 'burpees', 'muscle-up', 'plank'];
  if (calisthenicsExercises.some(e => name.includes(e))) {
    return 'calisthenics';
  }
  
  // Default to strength
  return 'strength';
}

// Legacy export for backward compatibility (defaults to strength)
export function calculateLegacyScore(sets: SetData[]): ScoreResult {
  return calculateScore(sets, 'strength');
}

// Calculate level from XP (every 500 XP = 1 level)
export function calculateLevel(totalXP: number): number {
  return Math.floor(totalXP / 500) + 1;
}

// Calculate XP progress within current level
export function calculateXPProgress(totalXP: number): {
  xpInCurrentLevel: number;
  xpToNextLevel: number;
  progressPercent: number;
} {
  const xpInCurrentLevel = totalXP % 500;
  const xpToNextLevel = 500 - xpInCurrentLevel;
  const progressPercent = (xpInCurrentLevel / 500) * 100;
  
  return { xpInCurrentLevel, xpToNextLevel, progressPercent };
}

// Calculate prestige level (every 10,000 XP)
export function calculatePrestige(totalXP: number): number {
  return Math.floor(totalXP / 10000);
}
