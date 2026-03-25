// ============================================
// WORKOUT STORE - Active workout session state
// ============================================

import { create } from 'zustand';
import type { SetData } from '../types';
import { calculateScore } from '../xp';
import { getLocalFavorites, setLocalFavorites, setFavorites as syncFavoritesToConvex } from '../storage';

interface WorkoutState {
  // Active workout session
  currentExercise: string;
  exerciseSearch: string;
  sets: SetData[];
  workoutSession: WorkoutExercise[];
  rpe: number;
  
  // Rest timer
  restTimer: number | null;
  restTimeLeft: number;
  
  // UI state
  showQuickLog: boolean;
  submitted: boolean;
  
  // Favorites (per user)
  favorites: string[];
  
  // Actions
  setCurrentExercise: (exercise: string) => void;
  setExerciseSearch: (search: string) => void;
  setSets: (sets: SetData[]) => void;
  addSet: () => void;
  removeSet: (index: number) => void;
  updateSet: (index: number, data: Partial<SetData>) => void;
  toggleSetDone: (index: number) => void;
  
  addExerciseToSession: (exercise: string) => void;
  clearSession: () => void;
  
  setRpe: (rpe: number) => void;
  toggleFavorite: (exerciseName: string) => void;
  
  // Timer actions
  startRestTimer: (seconds: number) => void;
  stopRestTimer: () => void;
  
  // Load favorites on app start
  loadFavorites: () => void;
  
  // UI actions
  setShowQuickLog: (show: boolean) => void;
  setSubmitted: (submitted: boolean) => void;
}

interface WorkoutExercise {
  name: string;
  sets: SetData[];
}

const DEFAULT_SETS: SetData[] = [
  { weight: 135, reps: 10, rpe: 7, done: false }
];

export const useWorkoutStore = create<WorkoutState>((set, get) => ({
  currentExercise: '',
  exerciseSearch: '',
  sets: [...DEFAULT_SETS],
  workoutSession: [],
  rpe: 7,
  restTimer: null,
  restTimeLeft: 0,
  showQuickLog: false,
  submitted: false,
  favorites: [],
  
  setCurrentExercise: (exercise) => set({ currentExercise: exercise }),
  setExerciseSearch: (search) => set({ exerciseSearch: search }),
  
  setSets: (sets) => set({ sets }),
  
  addSet: () => {
    const { sets, rpe } = get();
    const lastSet = sets[sets.length - 1];
    set({
      sets: [...sets, { 
        weight: lastSet?.weight || 135, 
        reps: lastSet?.reps || 10, 
        rpe, 
        done: false 
      }]
    });
  },
  
  removeSet: (index) => {
    const { sets } = get();
    set({ sets: sets.filter((_, i) => i !== index) });
  },
  
  updateSet: (index, data) => {
    const { sets } = get();
    const newSets = [...sets];
    newSets[index] = { ...newSets[index], ...data };
    set({ sets: newSets });
  },
  
  toggleSetDone: (index) => {
    const { sets } = get();
    const newSets = [...sets];
    newSets[index] = { ...newSets[index], done: !newSets[index].done };
    set({ sets: newSets });
  },
  
  addExerciseToSession: (exercise) => {
    const { workoutSession, sets } = get();
    const score = calculateScore(sets);
    
    set({
      workoutSession: [...workoutSession, { name: exercise, sets }],
      currentExercise: '',
      sets: [...DEFAULT_SETS]
    });
  },
  
  clearSession: () => set({ 
    workoutSession: [], 
    currentExercise: '',
    sets: [...DEFAULT_SETS],
    submitted: false
  }),
  
  setRpe: (rpe) => set({ rpe }),
  
  toggleFavorite: (exerciseName) => {
    const { favorites } = get();
    
    const newFavs = favorites.includes(exerciseName)
      ? favorites.filter(f => f !== exerciseName)
      : [...favorites, exerciseName];
    
    console.log('[FAVORITES] toggleFavorite:', exerciseName, 'newFavs:', newFavs);
    
    // Save to localStorage via storage layer
    setLocalFavorites(newFavs);
    set({ favorites: newFavs });
    
    // Sync to Convex (async, don't await)
    syncFavoritesToConvex(newFavs).catch(err => 
      console.warn('[FAVORITES] Failed to sync to Convex:', err)
    );
  },
  
  startRestTimer: (seconds) => {
    set({ restTimer: seconds, restTimeLeft: seconds });
  },
  
  stopRestTimer: () => {
    set({ restTimer: null, restTimeLeft: 0 });
  },
  
  setShowQuickLog: (show) => set({ showQuickLog: show }),
  setSubmitted: (submitted) => set({ submitted }),
  
  loadFavorites: () => {
    console.log('[STORE] loadFavorites called');
    const favs = getLocalFavorites();
    console.log('[STORE] loaded favorites:', favs);
    set({ favorites: favs });
  }
}));
