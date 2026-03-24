// ============================================
// ACHIEVEMENTS - Organized by difficulty tier
// ============================================

export interface Achievement {
  id: string;
  name: string;
  desc: string;
  points: number;
  category: 'daily' | 'weekly' | 'alltime' | 'special';
}

export const ACHIEVEMENTS: Achievement[] = [
  // ⚡ DAILY - Small but meaningful
  {
    id: 'punch_the_clock',
    name: 'Punch the Clock',
    desc: 'Complete 1 workout',
    points: 10,
    category: 'daily'
  },
  {
    id: 'turn_the_key',
    name: 'Turn the Key',
    desc: 'Start your streak (or keep it alive)',
    points: 15,
    category: 'daily'
  },
  {
    id: 'find_your_range',
    name: 'Find Your Range',
    desc: 'Hit RPE 8+',
    points: 20,
    category: 'daily'
  },

  // 🏆 WEEKLY - This is where we get better
  {
    id: 'the_long_haul',
    name: 'The Long Haul',
    desc: 'Earn 400 XP this week',
    points: 50,
    category: 'weekly'
  },
  {
    id: 'still_standing',
    name: 'Still Standing',
    desc: 'Complete 4 workouts this week',
    points: 60,
    category: 'weekly'
  },
  {
    id: 'check_the_scoreboard',
    name: 'Check the Scoreboard',
    desc: 'Pass someone on the leaderboard',
    points: 75,
    category: 'weekly'
  },
  {
    id: 'not_done_yet',
    name: 'Not Done Yet',
    desc: 'Earn XP late in the week',
    points: 40,
    category: 'weekly'
  },

  // 🧠 ALL-TIME - This is where you win or lose
  {
    id: 'xp_farmer',
    name: 'XP Farmer',
    desc: 'Earn 300+ XP in one day',
    points: 100,
    category: 'alltime'
  },
  {
    id: 'the_long_game',
    name: 'The Long Game',
    desc: 'Log 25 total workouts',
    points: 150,
    category: 'alltime'
  },
  {
    id: 'trail_of_destruction',
    name: 'Trail of Destruction',
    desc: 'Complete 100 total sets',
    points: 200,
    category: 'alltime'
  },
  {
    id: 'not_over_till_its_over',
    name: "Not Over Till It's Over",
    desc: 'Clutch a streak before it resets',
    points: 125,
    category: 'alltime'
  },
  {
    id: 'for_science',
    name: 'For Science',
    desc: 'Complete 3 different workout types in one day',
    points: 80,
    category: 'alltime'
  },
  {
    id: 'running_laps',
    name: 'Running Laps',
    desc: 'Be far ahead of your squad',
    points: 90,
    category: 'alltime'
  },
  {
    id: 'back_from_the_brink',
    name: 'Back from the Brink',
    desc: 'Save a streak at the last possible moment',
    points: 110,
    category: 'alltime'
  },
  {
    id: 'three_for_three',
    name: 'Three for Three',
    desc: 'Hit 3 high-effort sessions in a row',
    points: 95,
    category: 'alltime'
  },

  // 🎥 SPECIAL WEEKLY - Go viral territory
  {
    id: 'no_breaks',
    name: 'No Breaks',
    desc: '25 push-ups straight',
    points: 85,
    category: 'special'
  },
  {
    id: 'hold_the_line',
    name: 'Hold the Line',
    desc: '1-minute plank',
    points: 70,
    category: 'special'
  },
  {
    id: 'empty_the_tank',
    name: 'Empty the Tank',
    desc: '50 squats',
    points: 80,
    category: 'special'
  },
  {
    id: 'three_digits',
    name: 'Three Digits',
    desc: '100 reps total (any movement)',
    points: 100,
    category: 'special'
  },
  {
    id: 'one_take',
    name: 'One Take',
    desc: 'Complete challenge without stopping',
    points: 60,
    category: 'special'
  },

  // Legacy achievements (kept for backward compat)
  {
    id: 'first_workout',
    name: 'First Steps',
    desc: 'Complete your first workout',
    points: 50,
    category: 'daily'
  },
  {
    id: 'streak_7',
    name: 'On Fire',
    desc: '7 day streak',
    points: 100,
    category: 'weekly'
  },
  {
    id: 'streak_30',
    name: 'Unstoppable',
    desc: '30 day streak',
    points: 250,
    category: 'alltime'
  },
  {
    id: 'streak_100',
    name: 'Legend',
    desc: '100 day streak',
    points: 500,
    category: 'alltime'
  },
  {
    id: 'xp_1000',
    name: 'Rising Star',
    desc: 'Earn 1000 XP',
    points: 100,
    category: 'alltime'
  },
  {
    id: 'xp_5000',
    name: 'XP Master',
    desc: 'Earn 5000 XP',
    points: 300,
    category: 'alltime'
  },
  {
    id: 'xp_10000',
    name: 'XP Legend',
    desc: 'Earn 10000 XP',
    points: 500,
    category: 'alltime'
  },
  {
    id: 'workout_50',
    name: 'Dedicated',
    desc: 'Complete 50 workouts',
    points: 200,
    category: 'alltime'
  },
  {
    id: 'workout_100',
    name: 'Workout Club',
    desc: 'Complete 100 workouts',
    points: 400,
    category: 'alltime'
  },
];

export function getAchievementById(id: string): Achievement | undefined {
  return ACHIEVEMENTS.find(a => a.id === id);
}

export function getAchievementsByCategory(category: Achievement['category']): Achievement[] {
  return ACHIEVEMENTS.filter(a => a.category === category);
}
