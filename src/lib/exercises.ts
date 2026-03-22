// Exercise data - extracted for reusability

export interface Exercise {
  name: string;
  category?: string;
}

export const QUICK_EXERCISES: Exercise[] = [
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
