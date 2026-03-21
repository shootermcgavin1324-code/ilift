// LogTab Component
// Workout logging interface

import { useState } from 'react';

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

interface Set {
  weight: number;
  reps: number;
  rpe: number;
  done: boolean;
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
}: LogTabProps) {
  const [exerciseSearch, setExerciseSearch] = useState('');
  const [category, setCategory] = useState('All');

  const quickLog = (exerciseName: string) => {
    setCurrentExercise(exerciseName);
    setSets([
      { weight: 135, reps: 10, rpe: 7, done: false },
      { weight: 135, reps: 10, rpe: 7, done: false },
      { weight: 135, reps: 10, rpe: 7, done: false },
    ]);
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
      <input
        type="text"
        placeholder="Search exercises..."
        value={exerciseSearch}
        onChange={(e) => setExerciseSearch(e.target.value.toLowerCase())}
        className="w-full p-3 bg-gray-950 rounded-xl border border-gray-700"
      />

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-2 rounded-xl font-bold text-sm whitespace-nowrap ${
              category === cat 
                ? 'bg-yellow-500 text-black' 
                : 'bg-gray-900 text-gray-400'
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
            <button key={ex.name} onClick={() => quickLog(ex.name)} className="py-4 bg-gray-900 rounded-xl font-bold text-sm hover:bg-gray-800">
              {ex.name}
            </button>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold">{currentExercise}</h3>
            <button onClick={() => setCurrentExercise('')} className="text-gray-400">✕</button>
          </div>

          {sets.map((set, i) => (
            <div key={i} className={`p-3 rounded-xl flex items-center gap-3 ${set.done ? 'bg-green-900/30 border border-green-500/30' : 'bg-gray-900'}`}>
              <span className="text-gray-400 font-bold w-8">Set {i + 1}</span>
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
