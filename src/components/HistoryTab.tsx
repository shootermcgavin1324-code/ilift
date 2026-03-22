// HistoryTab Component
// Displays workout history
// Uses @tanstack/react-virtual for virtualization

import { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
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
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: workouts.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 80, // Estimated row height
    overscan: 3,
  });

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
      <div 
        ref={parentRef}
        className="space-y-3"
        style={{ height: '500px', overflow: 'auto' }}
      >
        <div
          style={{
            height: `${virtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          {virtualizer.getVirtualItems().map((virtualRow) => {
            const w = workouts[virtualRow.index];
            return (
              <div
                key={virtualRow.key}
                data-index={virtualRow.index}
                ref={virtualizer.measureElement}
                className="absolute top-0 left-0 w-full"
                style={{
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                <div className="bg-gray-950 rounded-xl p-4">
                  <div className="flex justify-between">
                    <span className="font-bold">{w.exercise}</span>
                    <span className="text-yellow-500 font-black">+{w.score} XP</span>
                  </div>
                  <p className="text-gray-400 text-sm">{new Date(w.date).toLocaleDateString()}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
