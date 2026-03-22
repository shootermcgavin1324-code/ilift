// XP calculation logic - extracted for reusability

export interface SetData {
  weight: number;
  reps: number;
  rpe: number;
  done: boolean;
}

export interface ScoreResult {
  xpEarned: number;
  breakdown: {
    baseXP: number;
    rpeBonus: number;
    volumeBonus: number;
  };
}

// Calculate XP earned from a workout
export function calculateScore(sets: SetData[]): ScoreResult {
  const doneSets = sets.filter(s => s.done);
  
  if (doneSets.length === 0) {
    return { xpEarned: 0, breakdown: { baseXP: 0, rpeBonus: 0, volumeBonus: 0 } };
  }
  
  const baseXP = 10; // Base XP per workout
  const avgRpe = doneSets.reduce((sum, s) => sum + s.rpe, 0) / doneSets.length;
  const totalSets = doneSets.length;
  
  // RPE multiplier: higher effort = more XP
  // RPE 10 = 2x, RPE 5 = 1x
  const rpeMultiplier = avgRpe / 5;
  
  // Volume bonus: more sets = more XP
  const volumeBonus = totalSets * 2;
  
  // Calculate total
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

// Calculate level from XP
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
