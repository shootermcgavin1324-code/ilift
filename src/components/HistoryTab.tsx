// HistoryTab Component
// Displays workout history

import { Dumbbell } from 'lucide-react';

interface Workout {
  id: string;
  exercise: string;
  score: number;
  date: string;
}

interface HistoryTabProps {
  workouts: Workout[];
}

export default function HistoryTab({ workouts }: HistoryTabProps) {
  if (workouts.length === 0) {
    return (
      <div className="p-4 space-y-3">
        <h2 className="text-xl font-bold">Workout History</h2>
        <div className="text-center py-12 bg-gray-950/50 rounded-xl">
          <Dumbbell size={40} className="mx-auto text-gray-700 mb-3" />
          <p className="text-gray-400 font-medium">No workouts yet</p>
          <p className="text-gray-600 text-sm mt-1">Log your first workout to see it here!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-3">
      <h2 className="text-xl font-bold">Workout History</h2>
      {workouts.map((w: any) => (
        <div key={w.id} className="bg-gray-950 rounded-xl p-4">
          <div className="flex justify-between">
            <span className="font-bold">{w.exercise}</span>
            <span className="text-yellow-500 font-black">+{w.score} XP</span>
          </div>
          <p className="text-gray-400 text-sm">{new Date(w.date).toLocaleDateString()}</p>
        </div>
      ))}
    </div>
  );
}
