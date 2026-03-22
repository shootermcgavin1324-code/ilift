// LogTab Component
// Workout logging interface

import { useState } from 'react';
import type { SetData } from '@/lib/types';

const CATEGORIES = ['All', 'Push', 'Pull', 'Legs', 'Cardio'];

const QUICK_EXERCISES = [
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
  { name: 'Cycling', category: 'Cardio' },
  { name: 'Rowing', category: 'Cardio' },
  { name: 'Jump Rope', category: 'Cardio' },
  // Other
  { name: 'Plank', category: 'Legs' },
  { name: 'Cable', category: 'Push' },
  { name: 'Machine', category: 'Legs' },
  { name: 'Dumbbell', category: 'Push' },
  { name: 'Other', category: 'Push' },
];

interface Set extends SetData {}

interface WorkoutExercise {
  name: string;
  sets: Set[];
}

interface LogTabProps {
  currentExercise: string;
  setCurrentExercise: (e: string) => void;
  sets: Set[];
  setSets: (s: Set[]) => void;
  restTimer: number | null;
  restTimeLeft: number;
  setRestTimer: (n: number | null) => void;
  setRestTimeLeft: (n: number) => void;
  calculateScore: () => number;
  completeWorkout: () => void;
  workoutSession: WorkoutExercise[];
  setWorkoutSession: (s: WorkoutExercise[]) => void;
  favorites: string[];
  toggleFavorite: (name: string) => void;
}

export default function LogTab({
  currentExercise,
  setCurrentExercise,
  sets,
  setSets,
  restTimer,
  restTimeLeft,
  setRestTimer,
  setRestTimeLeft,
  calculateScore,
  completeWorkout,
  workoutSession,
  setWorkoutSession,
  favorites,
  toggleFavorite,
}: LogTabProps) {
  const [exerciseSearch, setExerciseSearch] = useState('');
  const [category, setCategory] = useState('All');

  // Add exercise to current workout session
  const addToWorkout = (exerciseName: string) => {
    const newExercise = {
      name: exerciseName,
      sets: [
        { weight: 135, reps: 10, rpe: 7, done: false },
        { weight: 135, reps: 10, rpe: 7, done: false },
        { weight: 135, reps: 10, rpe: 7, done: false },
      ]
    };
    setWorkoutSession([...workoutSession, newExercise]);
    setCurrentExercise(exerciseName);
    setSets(newExercise.sets);
  };

  // Remove exercise from workout session
  const removeFromWorkout = (index: number) => {
    const updated = workoutSession.filter((_, i) => i !== index);
    setWorkoutSession(updated);
    if (index === workoutSession.length - 1 && updated.length > 0) {
      const last = updated[updated.length - 1];
      setCurrentExercise(last.name);
      setSets(last.sets);
    } else if (updated.length === 0) {
      setCurrentExercise('');
      setSets([{ weight: 135, reps: 10, rpe: 7, done: false }]);
    }
  };

  const quickLog = (exerciseName: string) => {
    addToWorkout(exerciseName);
  };

  const startRestTimer = (seconds: number) => {
    setRestTimer(seconds);
    setRestTimeLeft(seconds);
    let timeLeft = seconds;
    const interval = setInterval(() => {
      timeLeft--;
      if (timeLeft <= 0) {
        clearInterval(interval);
        setRestTimer(null);
        setRestTimeLeft(0);
      } else {
        setRestTimeLeft(timeLeft);
      }
    }, 1000);
  };

  return (
    <div className="p-4 space-y-4">
      {/* Current Workout Section */}
      {workoutSession.length > 0 && (
        <div className="bg-gray-950 rounded-xl p-4 border border-yellow-500/20">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-bold text-yellow-400">CURRENT WORKOUT</h3>
            <span className="text-xs text-gray-500">{workoutSession.length} exercise{workoutSession.length !== 1 ? 's' : ''}</span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {workoutSession.map((ex, i) => (
              <div 
                key={i}
                className={`flex-shrink-0 px-3 py-2 rounded-lg flex items-center gap-2 cursor-pointer ${
                  currentExercise === ex.name 
                    ? 'bg-yellow-500/20 border border-yellow-500/50' 
                    : 'bg-gray-900 border border-gray-800'
                }`}
                onClick={() => {
                  setCurrentExercise(ex.name);
                  setSets(ex.sets);
                }}
              >
                <span className="text-sm font-bold text-white">{ex.name}</span>
                <button 
                  onClick={(e) => { e.stopPropagation(); removeFromWorkout(i); }}
                  className="text-gray-500 hover:text-red-400"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Favorites Section */}
      {favorites.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h3 className={`text-sm font-bold transition-all duration-200 ${favorites.length > 0 ? 'text-purple-400 drop-shadow-md' : 'text-gray-500'}`}>
              ★ FAVORITES
            </h3>
            <div className="flex-1 h-px bg-gray-800"></div>
          </div>
          <div className="flex flex-wrap gap-2">
            {favorites.map(fav => (
              <button
                key={fav}
                onClick={() => quickLog(fav)}
                className="px-3 py-2 bg-purple-500/10 border border-purple-500/30 rounded-lg text-sm font-bold text-purple-300 hover:bg-purple-500/20"
              >
                {fav} +
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Preset Workouts Section */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-bold text-blue-400 drop-shadow-md">
            ⚡ PRESET WORKOUTS
          </h3>
          <div className="flex-1 h-px bg-gray-800"></div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => {
              const exercises = ['Bench Press', 'Squat', 'Pull Up'];
              exercises.forEach((ex, i) => {
                setTimeout(() => quickLog(ex), i * 100);
              });
            }}
            className="px-3 py-2 bg-blue-500/10 border border-blue-500/30 rounded-lg text-sm font-bold text-blue-300 hover:bg-blue-500/20"
          >
            Push Day +
          </button>
          <button
            onClick={() => {
              const exercises = ['Deadlift', 'Barbell Row', 'Pull Up'];
              exercises.forEach((ex, i) => {
                setTimeout(() => quickLog(ex), i * 100);
              });
            }}
            className="px-3 py-2 bg-green-500/10 border border-green-500/30 rounded-lg text-sm font-bold text-green-300 hover:bg-green-500/20"
          >
            Pull Day +
          </button>
          <button
            onClick={() => {
              const exercises = ['Squat', 'Leg Press', 'Calf Raise'];
              exercises.forEach((ex, i) => {
                setTimeout(() => quickLog(ex), i * 100);
              });
            }}
            className="px-3 py-2 bg-orange-500/10 border border-orange-500/30 rounded-lg text-sm font-bold text-orange-300 hover:bg-orange-500/20"
          >
            Leg Day +
          </button>
        </div>
      </div>

      <input
        type="text"
        placeholder="Search exercises..."
        value={exerciseSearch}
        onChange={(e) => setExerciseSearch(e.target.value.toLowerCase())}
        className="w-full p-3 bg-gray-950 rounded-xl border border-gray-700"
      />

      {/* Section Header: All Exercises */}
      <div className="flex items-center gap-2">
        <h3 className="text-sm font-bold text-gray-300 drop-shadow-md">ALL EXERCISES</h3>
        <div className="flex-1 h-px bg-gray-800"></div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-2 rounded-xl font-bold text-sm whitespace-nowrap transition-all duration-200 ${
              category === cat 
                ? 'bg-yellow-500 text-black shadow-lg shadow-yellow-500/40 scale-105' 
                : 'bg-gray-900 text-gray-400 hover:bg-gray-800 hover:text-gray-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {!currentExercise ? (
        <div className="grid grid-cols-3 gap-2">
          {QUICK_EXERCISES.filter(e => 
            (category === 'All' || e.category === category) &&
            (!exerciseSearch || e.name.toLowerCase().includes(exerciseSearch))
          ).map(ex => (
            <div 
              key={ex.name} 
              onClick={() => quickLog(ex.name)} 
              className={`py-3 rounded-xl font-bold text-sm text-center relative transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer ${
                workoutSession.some(w => w.name === ex.name)
                  ? 'bg-yellow-500/20 border-2 border-yellow-500 text-yellow-400' 
                  : 'bg-gray-900 border border-gray-800 hover:border-yellow-500/50'
              }`}
            >
              {ex.name}
              {workoutSession.some(w => w.name === ex.name) && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center">
                  <span className="text-black text-xs">✓</span>
                </span>
              )}
              <button
                onClick={(e) => { e.stopPropagation(); toggleFavorite(ex.name); }}
                className={`absolute top-1 right-1 text-xs ${favorites.includes(ex.name) ? 'text-yellow-400' : 'text-gray-600 opacity-0 hover:opacity-100'}`}
              >
                {favorites.includes(ex.name) ? '★' : '☆'}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold">{currentExercise}</h3>
            <button onClick={() => setCurrentExercise('')} className="text-gray-400">✕</button>
          </div>

          {sets.map((set, i) => (
            <div key={i} className={`p-3 rounded-xl flex items-center gap-3 transition-all duration-200 ${set.done ? 'bg-green-900/20 border border-green-500/20 opacity-50 scale-[0.98]' : (sets.findIndex(s => !s.done) === i ? 'bg-yellow-500/20 border-2 border-yellow-500/50 shadow-lg shadow-yellow-500/20 scale-[1.02]' : 'bg-gray-900')}`}>
              <span className="text-gray-400 font-bold w-8">{i + 1}</span>
              <input type="number" value={set.weight} onChange={(e) => {
                const newSets = [...sets];
                newSets[i].weight = parseInt(e.target.value) || 0;
                setSets(newSets);
              }} className="w-20 p-2 bg-gray-950 rounded-lg text-center" placeholder="lbs" />
              <span className="text-gray-400">×</span>
              <input type="number" value={set.reps} onChange={(e) => {
                const newSets = [...sets];
                newSets[i].reps = parseInt(e.target.value) || 0;
                setSets(newSets);
              }} className="w-16 p-2 bg-gray-950 rounded-lg text-center" placeholder="Reps" />
              <span className="text-gray-400">@</span>
              <select value={set.rpe} onChange={(e) => {
                const newSets = [...sets];
                newSets[i].rpe = parseInt(e.target.value);
                setSets(newSets);
              }} className="bg-gray-950 p-2 rounded-lg">
                {[5,6,7,8,9,10].map(r => <option key={r} value={r}>RPE {r}</option>)}
              </select>
              <button onClick={() => {
                const newSets = [...sets];
                newSets[i].done = !newSets[i].done;
                setSets(newSets);
              }} className={`ml-auto px-3 py-1 rounded-lg font-bold ${set.done ? 'bg-green-500 text-black' : 'bg-gray-800'}`}>
                {set.done ? '✓' : 'Done'}
              </button>
              {set.done && <span className="text-xs text-yellow-400 animate-pulse">+{Math.round(set.rpe * set.reps * 0.5)}</span>}
            </div>
          ))}

          <button onClick={() => setSets([...sets, { weight: 135, reps: 10, rpe: 7, done: false }])} className="w-full py-2 bg-gray-900 rounded-xl text-gray-400">+ Add Set</button>

          {/* Rest Timer */}
          {restTimer ? (
            <div className="bg-gray-900 rounded-xl p-4 text-center">
              <p className="text-gray-400 text-sm mb-2">Rest Timer</p>
              <p className="text-5xl font-black text-yellow-500">{restTimeLeft}s</p>
              <button onClick={() => { setRestTimer(null); setRestTimeLeft(0); }} className="mt-2 text-gray-400 text-sm">Cancel</button>
            </div>
          ) : (
            <div className="flex gap-2">
              {[60, 90, 120, 180].map(sec => (
                <button key={sec} onClick={() => startRestTimer(sec)} className="flex-1 py-2 bg-gray-900 rounded-xl text-gray-400 text-sm font-bold hover:bg-gray-800">
                  {sec}s
                </button>
              ))}
            </div>
          )}

          <button onClick={completeWorkout} className="w-full py-4 bg-yellow-400 rounded-xl font-black text-black text-lg">
            Complete Workout (+{calculateScore()} XP)
          </button>
        </div>
      )}
    </div>
  );
}
