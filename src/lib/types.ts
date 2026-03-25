// ============================================
// SHARED TYPES - Single source of truth
// ============================================

export interface User {
  id?: string;
  email: string;
  name: string;
  total_xp: number;
  streak: number;
  badges: string[];
  group_id?: string;
  lastWorkoutDate?: string; // YYYY-MM-DD format
  totalWorkouts?: number; // Persistent workout count
  onboarding?: Record<string, any>;
}

export interface Workout {
  id?: string;
  exercise: string;
  score: number;
  date: string;
  user_id?: string;
  user_name?: string;
}

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

export interface Challenge {
  id: string;
  name: string;
  desc: string;
  target: number;
  unit: string;
  xp: number;
}

export interface BadgeCheckResult {
  earned: string[];
  newlyEarned: string[];
}

export interface PlayerStats {
  totalXP: number;
  streak: number;
  badges: string[];
  workouts: number;
}

export type PlayerTitle = 
  | 'ROOKIE'
  | 'ACTIVE'
  | 'ON FIRE'
  | 'GRINDER'
  | 'COLLECTOR'
  | 'XP MASTER'
  | 'UNSTOPPABLE'
  | 'LEGEND';
