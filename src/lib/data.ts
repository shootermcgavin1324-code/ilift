// ============================================
// DATA LAYER - Re-exports from storage + streak logic
// ============================================

import type { User, Workout, SetData, ScoreResult } from './types';

// Re-export everything from storage
export * from './storage';

// Re-export streak logic
export * from './streak';

// Re-export XP logic (for convenience)
export { calculateScore, calculateLevel, calculateXPProgress, calculatePrestige } from './xp';
export type { SetData, ScoreResult } from './types';

// Legacy re-exports for components that import from data.ts
export type { User, Workout } from './types';
