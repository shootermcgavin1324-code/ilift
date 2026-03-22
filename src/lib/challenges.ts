// ============================================
// CHALLENGES DATA
// ============================================

import type { Challenge } from './types';

export const CHALLENGES: Record<string, Challenge[]> = {
  daily: [
    { id: 'daily_50pushups', name: '50 Push-ups', desc: 'Complete 50 push-ups today', target: 50, unit: 'pushups', xp: 100 },
    { id: 'daily_logworkout', name: 'Daily Workout', desc: 'Log at least one workout today', target: 1, unit: 'workout', xp: 50 },
    { id: 'daily_3sets', name: 'Volume King', desc: 'Complete 3 sets today', target: 3, unit: 'sets', xp: 75 },
  ],
  weekly: [
    { id: 'weekly_5workouts', name: '5x This Week', desc: 'Complete 5 workouts this week', target: 5, unit: 'workouts', xp: 300 },
    { id: 'weekly_streak3', name: '3 Day Streak', desc: 'Maintain a 3-day streak', target: 3, unit: 'days', xp: 200 },
  ],
  monthly: [
    { id: 'monthly_20workouts', name: '20 Club', desc: 'Complete 20 workouts this month', target: 20, unit: 'workouts', xp: 1000 },
    { id: 'monthly_5000xp', name: '5K XP Month', desc: 'Earn 5000 XP this month', target: 5000, unit: 'XP', xp: 1500 },
  ],
  lifetime: [
    { id: 'lifetime_100workouts', name: 'Century Club', desc: 'Complete 100 workouts', target: 100, unit: 'workouts', xp: 2500 },
    { id: 'lifetime_10kxp', name: '10K Total', desc: 'Earn 10000 XP total', target: 10000, unit: 'XP', xp: 5000 },
    { id: 'lifetime_30daystreak', name: 'Monthly Streak', desc: 'Achieve a 30-day streak', target: 30, unit: 'days', xp: 3000 },
  ]
};
