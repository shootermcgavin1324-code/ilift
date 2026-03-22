// ============================================
// PLAYER TITLES & PRESTIGE - Pure logic
// ============================================

import type { PlayerTitle, PlayerStats } from './types';

// Determine player title based on stats
export function getPlayerTitle(stats: PlayerStats): PlayerTitle {
  const { totalXP, streak, badges, workouts } = stats;
  
  if (totalXP >= 50000) return 'LEGEND';
  if (streak >= 30) return 'UNSTOPPABLE';
  if (badges.length >= 10) return 'COLLECTOR';
  if (workouts >= 50) return 'GRINDER';
  if (totalXP >= 10000) return 'XP MASTER';
  if (streak >= 7) return 'ON FIRE';
  if (workouts >= 10) return 'ACTIVE';
  return 'ROOKIE';
}

// Calculate prestige level (every 10,000 XP)
export function getPrestige(totalXP: number): number {
  return Math.floor(totalXP / 10000);
}
