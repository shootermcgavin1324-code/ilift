// ============================================
// EXERCISE DATABASE - Clean, standardized, deduplicated
// ============================================

export interface Exercise {
  name: string;
  category: 'Push' | 'Pull' | 'Legs' | 'Core' | 'Cardio' | 'Calisthenics';
}

// Categories for filtering
export const CATEGORIES = ['All', 'Push', 'Pull', 'Legs', 'Core', 'Cardio', 'Calisthenics'] as const;
export type Category = typeof CATEGORIES[number];

// Standardized exercise library - deduplicated
export const EXERCISES: Exercise[] = [
  // ============ PUSH ============
  { name: 'Barbell Bench Press', category: 'Push' },
  { name: 'Incline Dumbbell Press', category: 'Push' },
  { name: 'Flat Dumbbell Bench Press', category: 'Push' },
  { name: 'Alternating Incline Dumbbell Press', category: 'Push' },
  { name: 'Dumbbell Overhead Press', category: 'Push' },
  { name: 'Military Press', category: 'Push' },
  { name: 'Push-Ups', category: 'Push' },
  { name: 'Cable Tricep Extensions', category: 'Push' },
  { name: 'Dumbbell Front Raises', category: 'Push' },
  { name: 'Dumbbell Lateral Raises', category: 'Push' },
  { name: 'Cable Lateral Raise', category: 'Push' },

  // ============ PULL ============
  // Note: Pull-Ups moved to Calisthenics
  { name: 'Lat Pulldown (Underhand / Close Grip)', category: 'Pull' },
  { name: 'Lat Pulldown (Wide Grip)', category: 'Pull' },
  { name: 'Barbell Rows', category: 'Pull' },
  { name: 'Alternating Cable Rows', category: 'Pull' },
  { name: 'Dumbbell Rows', category: 'Pull' },
  { name: 'Single Arm Dumbbell Row', category: 'Pull' },
  { name: 'Chest Supported Dumbbell Rows', category: 'Pull' },
  { name: 'Low Dumbbell Rows', category: 'Pull' },
  { name: 'TRX Rows', category: 'Pull' },
  { name: 'Dumbbell Renegade Rows', category: 'Pull' },
  { name: 'Cable Curls', category: 'Pull' },
  { name: 'Alternating Dumbbell Bicep Curls', category: 'Pull' },
  { name: 'Dumbbell Hammer Curls', category: 'Pull' },
  { name: 'Rear Delt Fly', category: 'Pull' },
  { name: 'Incline Dumbbell Curl', category: 'Pull' },

  // ============ LEGS ============
  { name: 'Barbell Back Squat', category: 'Legs' },
  { name: 'Front Squat', category: 'Legs' },
  { name: 'Paused Squat', category: 'Legs' },
  { name: 'Barbell Deadlift', category: 'Legs' },
  { name: 'Deadlift (variation)', category: 'Legs' },
  { name: 'Bulgarian Split Squat', category: 'Legs' },
  { name: 'Dumbbell Split Squats', category: 'Legs' },
  { name: 'Dumbbell Reverse Lunges', category: 'Legs' },
  { name: 'Dumbbell Forward Walking Lunges', category: 'Legs' },
  { name: 'Lateral Lunges', category: 'Legs' },
  { name: 'Glute Bridges', category: 'Legs' },
  { name: 'Dumbbell Romanian Deadlift', category: 'Legs' },
  { name: 'Heavy Dumbbell Kickstand RDL', category: 'Legs' },
  { name: 'Barbell Good Mornings', category: 'Legs' },
  { name: 'Leg Curl Machine', category: 'Legs' },
  { name: 'Leg Extension Machine', category: 'Legs' },
  { name: 'Bodyweight Squats', category: 'Legs' },

  // ============ CORE ============
  { name: 'Ab Roller', category: 'Core' },
  { name: 'Hanging Leg Lifts', category: 'Core' },
  { name: 'Hanging Crunches', category: 'Core' },
  { name: 'GHR Crunches', category: 'Core' },
  { name: 'Beast Hold', category: 'Core' },
  { name: 'Alt Toe Touch Crunch', category: 'Core' },
  { name: 'Core Transitions', category: 'Core' },
  { name: 'Hamstring Iso Holds', category: 'Core' },

  // ============ CARDIO ============
  { name: 'Rower', category: 'Cardio' },
  { name: 'Bike', category: 'Cardio' },
  { name: 'Running', category: 'Cardio' },

  // ============ CALISTHENICS ============
  { name: 'Dips', category: 'Calisthenics' },
  { name: 'Muscle-Ups', category: 'Calisthenics' },
  { name: 'Pistol Squats', category: 'Calisthenics' },
  { name: 'Burpees', category: 'Calisthenics' },
  { name: 'Mountain Climbers', category: 'Calisthenics' },
  { name: 'Walking Lunges', category: 'Calisthenics' },
  { name: 'Pull-Ups', category: 'Calisthenics' },
  { name: 'Plank', category: 'Calisthenics' },
];

// Quick select exercises (most common for fast logging)
export const QUICK_EXERCISES: Exercise[] = [
  // Push
  { name: 'Barbell Bench Press', category: 'Push' },
  { name: 'Incline Dumbbell Press', category: 'Push' },
  { name: 'Push-Ups', category: 'Push' },
  { name: 'Dumbbell Lateral Raises', category: 'Push' },
  // Pull (Pull-Ups moved to Calisthenics)
  { name: 'Barbell Rows', category: 'Pull' },
  { name: 'Dumbbell Rows', category: 'Pull' },
  { name: 'Dumbbell Hammer Curls', category: 'Pull' },
  // Legs
  { name: 'Barbell Back Squat', category: 'Legs' },
  { name: 'Barbell Deadlift', category: 'Legs' },
  { name: 'Bulgarian Split Squat', category: 'Legs' },
  { name: 'Dumbbell Romanian Deadlift', category: 'Legs' },
  // Core
  { name: 'Ab Roller', category: 'Core' },
  { name: 'Hanging Leg Lifts', category: 'Core' },
  // Cardio
  { name: 'Rower', category: 'Cardio' },
  { name: 'Bike', category: 'Cardio' },
  { name: 'Running', category: 'Cardio' },

  // ============ CALISTHENICS ============
  { name: 'Dips', category: 'Calisthenics' },
  { name: 'Muscle-Ups', category: 'Calisthenics' },
  { name: 'Pistol Squats', category: 'Calisthenics' },
  { name: 'Burpees', category: 'Calisthenics' },
  { name: 'Mountain Climbers', category: 'Calisthenics' },
  { name: 'Plank', category: 'Calisthenics' },
];

// Helper functions
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

export function getCategoryColor(category: string): string {
  switch (category) {
    case 'Push': return 'text-blue-400';
    case 'Pull': return 'text-green-400';
    case 'Legs': return 'text-orange-400';
    case 'Core': return 'text-purple-400';
    case 'Cardio': return 'text-red-400';
    case 'Calisthenics': return 'text-yellow-400';
    default: return 'text-gray-400';
  }
}
