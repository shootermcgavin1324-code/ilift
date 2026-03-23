// Exercise data - extracted for reusability
// Used by LogTab, workout tracking, and analytics

export interface Exercise {
  name: string;
  category?: string;
}

// Categories for filtering
export const CATEGORIES = ['All', 'Push', 'Pull', 'Legs', 'Cardio', 'Calisthenics'] as const;
export type Category = typeof CATEGORIES[number];

export const QUICK_EXERCISES: Exercise[] = [
  // Push
  { name: 'Bench Press', category: 'Push' },
  { name: 'Overhead Press', category: 'Push' },
  { name: 'Push Up', category: 'Push' },
  { name: 'Incline Dumbbell', category: 'Push' },
  { name: 'Tricep Extension', category: 'Push' },
  { name: 'Dips', category: 'Push' },
  // Pull
  { name: 'Deadlift', category: 'Pull' },
  { name: 'Barbell Row', category: 'Pull' },
  { name: 'Pull Up', category: 'Pull' },
  { name: 'Lat Pulldown', category: 'Pull' },
  { name: 'Dumbbell Curl', category: 'Pull' },
  { name: 'Face Pull', category: 'Pull' },
  // Legs
  { name: 'Squat', category: 'Legs' },
  { name: 'Leg Press', category: 'Legs' },
  { name: 'Lunges', category: 'Legs' },
  { name: 'Leg Curl', category: 'Legs' },
  { name: 'Calf Raise', category: 'Legs' },
  { name: 'Romanian Deadlift', category: 'Legs' },
  // Cardio
  { name: 'Running', category: 'Cardio' },
  // Calisthenics (renamed to avoid duplicates)
  { name: 'Muscle Up', category: 'Calisthenics' },
  { name: 'Chin Up', category: 'Calisthenics' },
  { name: 'Diamond Push Up', category: 'Calisthenics' },
  { name: 'Pistol Squat', category: 'Calisthenics' },
  { name: 'Squat Jump', category: 'Calisthenics' },
  { name: 'Lunge Jump', category: 'Calisthenics' },
  { name: 'Plank', category: 'Calisthenics' },
  { name: 'Side Plank', category: 'Calisthenics' },
  { name: 'Hollow Body', category: 'Calisthenics' },
  { name: 'L-Sit', category: 'Calisthenics' },
  { name: 'Burpee', category: 'Calisthenics' },
  { name: 'Mountain Climber', category: 'Calisthenics' },
  { name: 'Box Jump', category: 'Calisthenics' },
];

// Legacy exercises (backwards compatibility)
export const LEGACY_EXERCISES: Exercise[] = [
  { name: 'Bench Press', category: 'Chest' },
  { name: 'Squat', category: 'Legs' },
  { name: 'Deadlift', category: 'Back' },
  { name: 'Pull-ups', category: 'Back' },
  { name: 'Dips', category: 'Chest' },
  { name: 'Overhead Press', category: 'Shoulders' },
  { name: 'Barbell Row', category: 'Back' },
  { name: 'Leg Press', category: 'Legs' },
  { name: 'Romanian Deadlift', category: 'Legs' },
  { name: 'Lat Pulldown', category: 'Back' },
  { name: 'Cable Fly', category: 'Chest' },
  { name: 'Leg Curl', category: 'Legs' },
  { name: 'Calf Raise', category: 'Legs' },
  { name: 'Face Pull', category: 'Shoulders' },
  { name: 'Bicep Curl', category: 'Arms' },
  { name: 'Tricep Pushdown', category: 'Arms' },
  { name: 'Lateral Raise', category: 'Shoulders' },
  { name: 'Cable Row', category: 'Back' },
  { name: 'Leg Extension', category: 'Legs' },
  { name: 'Hip Thrust', category: 'Legs' },
];

export function getExerciseNames(): string[] {
  return QUICK_EXERCISES.map(e => e.name);
}

export function searchExercises(query: string): Exercise[] {
  const lower = query.toLowerCase();
  return QUICK_EXERCISES.filter(e => e.name.toLowerCase().includes(lower));
}

export function getExercisesByCategory(category: string): Exercise[] {
  if (category === 'All') return QUICK_EXERCISES;
  return QUICK_EXERCISES.filter(e => e.category === category);
}
