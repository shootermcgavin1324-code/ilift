// Achievements data - extracted for reusability

export interface Achievement {
  id: string;
  name: string;
  desc: string;
  points: number;
  icon?: string;
}

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first_workout', name: 'First Steps', desc: 'Complete first workout', points: 50 },
  { id: 'verified', name: 'Verified', desc: 'Upload video proof', points: 150 },
  { id: 'streak_7', name: 'On Fire', desc: '7 day streak', points: 100 },
  { id: 'streak_30', name: 'Unstoppable', desc: '30 day streak', points: 250 },
  { id: 'streak_100', name: 'Legend', desc: '100 day streak', points: 500 },
  { id: 'workout_100', name: 'Workout Club', desc: 'Complete 100 workouts', points: 300 },
  { id: 'xp_1000', name: 'Rising Star', desc: 'Earn 1000 XP', points: 200 },
  { id: 'xp_5000', name: 'XP Master', desc: 'Earn 5000 XP', points: 500 },
  { id: 'xp_10000', name: 'XP Legend', desc: 'Earn 10000 XP', points: 1000 },
];

export function getAchievementById(id: string): Achievement | undefined {
  return ACHIEVEMENTS.find(a => a.id === id);
}
