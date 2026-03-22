// ============================================
// XP CALCULATION - Pure logic, no storage
// ============================================

import type { SetData, ScoreResult } from './types';

// Calculate XP earned from a workout
export function calculateScore(sets: SetData[]): ScoreResult {
  const doneSets = sets.filter(s => s.done);
  
  if (doneSets.length === 0) {
    return { xpEarned: 0, breakdown: { baseXP: 0, rpeBonus: 0, volumeBonus: 0 } };
  }
  
  const baseXP = 10;
  const avgRpe = doneSets.reduce((sum, s) => sum + s.rpe, 0) / doneSets.length;
  const totalSets = doneSets.length;
  
  // RPE multiplier: higher effort = more XP
  const rpeMultiplier = avgRpe / 5;
  
  // Volume bonus: more sets = more XP
  const volumeBonus = totalSets * 2;
  
  const rpeBonus = Math.round(baseXP * rpeMultiplier * totalSets);
  const xpEarned = baseXP + rpeBonus + volumeBonus;
  
  return {
    xpEarned,
    breakdown: {
      baseXP,
      rpeBonus,
      volumeBonus
    }
  };
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
