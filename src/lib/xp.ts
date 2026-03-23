// ============================================
// XP CALCULATION - Call of Duty style leveling & prestige
// ============================================

import type { SetData, ScoreResult } from './types';

export type ExerciseType = 'strength' | 'cardio' | 'calisthenics';

// ============================================
// LEVEL SYSTEM CONFIG
// ============================================

export const MAX_LEVEL = 55;
export const PRESTIGE_BONUS_MULTIPLIER = 1.10; // +10% XP boost after prestige

// XP required for each level (1-55)
// Simplified: 100 XP per level = 5,500 total to prestige (~4 months)
export function getXPForLevel(level: number): number {
  return 100;
}

// Calculate total XP needed to reach a specific level
export function getTotalXPForLevel(targetLevel: number): number {
  let total = 0;
  for (let i = 1; i < targetLevel; i++) {
    total += getXPForLevel(i);
  }
  return total;
}

// ============================================
// EXERCISE TYPE XP CONFIG
// ============================================

const XP_CONFIG = {
  strength: {
    base: 10,
    perSet: 2,
  },
  cardio: {
    perMile: 10,
  },
  calisthenics: {
    perRep: 1,
  },
};

const RPE_MULTIPLIER = 0.2;

// ============================================
// XP CALCULATION FUNCTIONS
// ============================================

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

function calculateCardioXP(sets: SetData[]): ScoreResult {
  const doneSets = sets.filter(s => s.done);
  if (doneSets.length === 0) {
    return { xpEarned: 0, breakdown: { baseXP: 0, rpeBonus: 0, volumeBonus: 0 } };
  }

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

function calculateCalisthenicsXP(sets: SetData[]): ScoreResult {
  const doneSets = sets.filter(s => s.done);
  if (doneSets.length === 0) {
    return { xpEarned: 0, breakdown: { baseXP: 0, rpeBonus: 0, volumeBonus: 0 } };
  }

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

export function getExerciseType(exerciseName: string): ExerciseType {
  const name = exerciseName.toLowerCase();
  
  const cardioExercises = ['run', 'running'];
  if (cardioExercises.some(e => name.includes(e))) {
    return 'cardio';
  }
  
  const calisthenicsExercises = ['push-up', 'pushup', 'pull-up', 'pullup', 'dip', 'dips', 'chin-up', 'chinup', 'sit-up', 'situp', 'crunch', 'crunches', 'burpee', 'burpees', 'muscle-up', 'plank'];
  if (calisthenicsExercises.some(e => name.includes(e))) {
    return 'calisthenics';
  }
  
  return 'strength';
}

// ============================================
// LEVEL & PRESTIGE CALCULATIONS
// ============================================

export interface LevelResult {
  level: number;
  xpInCurrentLevel: number;
  xpToNextLevel: number;
  progressPercent: number;
  canPrestige: boolean;
}

/**
 * Calculate user's level from total XP (ignoring prestige)
 * Level 1-55, resets after prestige
 */
export function calculateLevel(totalXP: number): number {
  let remainingXP = totalXP;
  let level = 1;
  
  while (level < MAX_LEVEL && remainingXP >= getXPForLevel(level)) {
    remainingXP -= getXPForLevel(level);
    level++;
  }
  
  return level;
}

/**
 * Calculate prestige count from total XP
 * Each prestige = 55 levels worth of XP
 */
export function calculatePrestige(totalXP: number): number {
  const xpForMaxLevel = getTotalXPForLevel(MAX_LEVEL + 1);
  if (totalXP < xpForMaxLevel) return 0;
  
  return Math.floor((totalXP - xpForMaxLevel) / xpForMaxLevel) + 1;
}

/**
 * Get XP within current level (for progress bar)
 */
export function getXPInCurrentLevel(totalXP: number, prestigeCount: number): number {
  // Remove XP from previous prestiges
  const xpForMaxLevel = getTotalXPForLevel(MAX_LEVEL + 1);
  const prestigeXP = prestigeCount * xpForMaxLevel;
  const xpInCurrentPrestige = totalXP - prestigeXP;
  
  let remainingXP = xpInCurrentPrestige;
  let level = 1;
  
  while (level < MAX_LEVEL && remainingXP >= getXPForLevel(level)) {
    remainingXP -= getXPForLevel(level);
    level++;
  }
  
  return remainingXP;
}

/**
 * Calculate detailed level info
 */
export function calculateLevelInfo(totalXP: number): LevelResult {
  const prestigeCount = calculatePrestige(totalXP);
  const xpInCurrentPrestige = totalXP - (prestigeCount * getTotalXPForLevel(MAX_LEVEL + 1));
  
  let remainingXP = xpInCurrentPrestige;
  let level = 1;
  
  while (level < MAX_LEVEL && remainingXP >= getXPForLevel(level)) {
    remainingXP -= getXPForLevel(level);
    level++;
  }
  
  const xpToNextLevel = getXPForLevel(level);
  const progressPercent = Math.min((remainingXP / xpToNextLevel) * 100, 100);
  
  return {
    level,
    xpInCurrentLevel: remainingXP,
    xpToNextLevel,
    progressPercent,
    canPrestige: level >= MAX_LEVEL
  };
}

/**
 * Apply XP bonus for prestige
 */
export function applyPrestigeBonus(xp: number, prestigeCount: number): number {
  if (prestigeCount > 0) {
    return Math.round(xp * PRESTIGE_BONUS_MULTIPLIER);
  }
  return xp;
}

/**
 * Handle prestige reset
 * Returns new XP total after prestige
 */
export function performPrestige(currentTotalXP: number): number {
  const currentPrestige = calculatePrestige(currentTotalXP);
  const xpForMaxLevel = getTotalXPForLevel(MAX_LEVEL + 1);
  
  // New prestige level + reset XP to 0 within new prestige
  return (currentPrestige + 1) * xpForMaxLevel;
}

/**
 * Get display string for prestige (e.g., "⭐⭐")
 */
export function getPrestigeStars(prestigeCount: number): string {
  if (prestigeCount === 0) return '';
  return '⭐'.repeat(Math.min(prestigeCount, 10));
}

/**
 * Format level display (e.g., "Prestige 2 — Level 12")
 */
export function formatLevelDisplay(level: number, prestigeCount: number): string {
  const stars = getPrestigeStars(prestigeCount);
  if (prestigeCount > 0) {
    return `Prestige ${prestigeCount}${stars} — Level ${level}`;
  }
  return `Level ${level}`;
}

// Legacy exports for backward compatibility
export function calculateLegacyScore(sets: SetData[]): ScoreResult {
  return calculateScore(sets, 'strength');
}

export function calculateXPProgress(totalXP: number): {
  xpInCurrentLevel: number;
  xpToNextLevel: number;
  progressPercent: number;
} {
  const info = calculateLevelInfo(totalXP);
  return {
    xpInCurrentLevel: info.xpInCurrentLevel,
    xpToNextLevel: info.xpToNextLevel,
    progressPercent: info.progressPercent
  };
}

export function calculateLevelLegacy(totalXP: number): number {
  return calculateLevel(totalXP);
}

export function calculatePrestigeLegacy(totalXP: number): number {
  return calculatePrestige(totalXP);
}
