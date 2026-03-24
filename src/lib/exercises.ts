// Exercise data - extracted for reusability
// Used by LogTab, workout tracking, and analytics

export interface Exercise {
  name: string;
  category?: string;
}

// Categories for filtering
export const CATEGORIES = ['All', 'Push', 'Pull', 'Legs', 'Core', 'Calisthenics'] as const;
export type Category = typeof CATEGORIES[number];

// Standardized exercise library
export const EXERCISES: Exercise[] = [
  // ============ PUSH ============
  { name: 'DB Flat Bench Press', category: 'Push' },
  { name: 'Incline DB Chest Press', category: 'Push' },
  { name: 'DB Military Press', category: 'Push' },
  { name: 'Standing DB Shoulder Press', category: 'Push' },
  { name: 'DB Lateral Raise', category: 'Push' },
  { name: 'Seated DB Lateral Raise', category: 'Push' },
  { name: 'Cable Lateral Raise', category: 'Push' },
  { name: 'Cross-Body Triceps Extension', category: 'Push' },

  // ============ PULL ============
  { name: 'TRX Row', category: 'Pull' },
  { name: 'Single Arm DB Row', category: 'Pull' },
  { name: 'Chin-Up', category: 'Pull' },
  { name: 'Pull-Up', category: 'Pull' },
  { name: 'Inverted Row', category: 'Pull' },
  { name: 'Face Pull', category: 'Pull' },
  { name: 'Rear Delt Pulldown', category: 'Pull' },
  { name: 'Incline Bench Curl', category: 'Pull' },
  { name: 'DB Hammer Curl', category: 'Pull' },
  { name: 'Bicep Curl', category: 'Pull' },

  // ============ LEGS ============
  { name: 'Single-Leg Romanian Deadlift', category: 'Legs' },
  { name: 'Goblet Squat', category: 'Legs' },
  { name: 'Split Squat', category: 'Legs' },
  { name: 'Walking Lunge', category: 'Legs' },

  // ============ CORE ============
  { name: 'Standing Ab Crunch', category: 'Core' },
  { name: 'Hanging Leg Raise', category: 'Core' },
  { name: 'Copenhagen Plank', category: 'Core' },

  // ============ CALISTHENICS ============
  { name: 'Push-Up', category: 'Calisthenics' },
  { name: 'Deficit Push-Up', category: 'Calisthenics' },
  { name: 'Chin-Up', category: 'Calisthenics' },
  { name: 'Pull-Up', category: 'Calisthenics' },
  { name: 'Inverted Row', category: 'Calisthenics' },
  { name: 'Hanging Leg Raise', category: 'Calisthenics' },
];

// Quick select exercises (most common for fast logging)
export const QUICK_EXERCISES: Exercise[] = [
  // Push
  { name: 'DB Flat Bench Press', category: 'Push' },
  { name: 'Incline DB Chest Press', category: 'Push' },
  { name: 'DB Military Press', category: 'Push' },
  { name: 'DB Lateral Raise', category: 'Push' },
  { name: 'Cross-Body Triceps Extension', category: 'Push' },
  // Pull
  { name: 'TRX Row', category: 'Pull' },
  { name: 'Single Arm DB Row', category: 'Pull' },
  { name: 'Chin-Up', category: 'Pull' },
  { name: 'Pull-Up', category: 'Pull' },
  { name: 'Face Pull', category: 'Pull' },
  { name: 'Bicep Curl', category: 'Pull' },
  // Legs
  { name: 'Goblet Squat', category: 'Legs' },
  { name: 'Split Squat', category: 'Legs' },
  { name: 'Walking Lunge', category: 'Legs' },
  { name: 'Single-Leg Romanian Deadlift', category: 'Legs' },
  // Core
  { name: 'Standing Ab Crunch', category: 'Core' },
  { name: 'Hanging Leg Raise', category: 'Core' },
  { name: 'Copenhagen Plank', category: 'Core' },
  // Calisthenics
  { name: 'Push-Up', category: 'Calisthenics' },
  { name: 'Pull-Up', category: 'Calisthenics' },
  { name: 'Inverted Row', category: 'Calisthenics' },
];

// Legacy exercises (backwards compatibility)
export const LEGACY_EXERCISES: Exercise[] = [
  { name: 'Bench Press', category: 'Chest' },
  { name: 'Squat', category: 'Legs' },
  { name: 'Deadlift', category: 'Back' },
  { name: 'Pull-Up', category: 'Back' },
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
  return EXERCISES.map(e => e.name);
}

export function searchExercises(query: string): Exercise[] {
  const lower = query.toLowerCase();
  return EXERCISES.filter(e => e.name.toLowerCase().includes(lower));
}

export function getExercisesByCategory(category: string): Exercise[] {
  if (category === 'All') return EXERCISES;
  return EXERCISES.filter(e => e.category === category);
}
