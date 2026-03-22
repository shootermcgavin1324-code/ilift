// Leaderboard Component
// Squad leaderboard with medals and live indicators
// Uses @tanstack/react-virtual for virtualization

import { useRef } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';

interface LeaderboardProps {
  leaderboard: any[];
  user: any;
}

export default function Leaderboard({ leaderboard, user }: LeaderboardProps) {
  const parentRef = useRef<HTMLDivElement>(null);
  
  const virtualizer = useVirtualizer({
    count: leaderboard.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 80, // Estimated row height
    overscan: 3,
  });

  if (leaderboard.length === 0) {
    return (
      <div className="text-center py-8 rounded-xl" style={{ background: 'linear-gradient(135deg, #0f0f0f, #1a1a1a)', border: '1px solid #262626' }}>
        <p className="text-gray-400">No workouts yet. Be first!</p>
      </div>
    );
  }

  // Show top 10 in the leaderboard view
  const displayItems = leaderboard.slice(0, 10);

  return (
    <div 
      ref={parentRef} 
      className="space-y-2"
      style={{ height: '400px', overflow: 'auto' }}
    >
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map((virtualRow) => {
          const u = displayItems[virtualRow.index];
          const isUser = u.id === user?.id;
          
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
              <div 
                className="rounded-xl p-3 flex items-center gap-3 transition-all duration-200 hover:scale-[1.01]"
                style={{ 
                  background: isUser 
                    ? 'linear-gradient(135deg, rgba(250, 204, 21, 0.1) 0%, #1a1a1a 100%)' 
                    : 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)',
                  border: isUser ? '1px solid rgba(250, 204, 21, 0.3)' : '1px solid #262626'
                }}
              >
                {/* Rank */}
                <div className="w-8 text-center">
                  {virtualRow.index === 0 && <span className="text-xl">🥇</span>}
                  {virtualRow.index === 1 && <span className="text-xl">🥈</span>}
                  {virtualRow.index === 2 && <span className="text-xl">🥉</span>}
                  {virtualRow.index > 2 && <span className="text-gray-500 font-black">{virtualRow.index + 1}</span>}
                </div>
                
                {/* Avatar */}
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center font-bold"
                  style={{ 
                    background: isUser ? 'linear-gradient(135deg, #facc15, #eab308)' : '#262626', 
                    color: isUser ? '#000' : '#666' 
                  }}
                >
                  {u.name?.charAt(0).toUpperCase()}
                </div>
                
                {/* Info */}
                <div className="flex-1">
                  <p className={`font-bold ${isUser ? 'text-yellow-400' : 'text-white'}`}>{u.name}</p>
                  <p className="text-gray-500 text-xs">Level {Math.floor((u.total_xp || 0) / 500) + 1}</p>
                </div>
                
                {/* XP + Live indicator */}
                <div className="text-right">
                  <p className="text-white font-black text-lg">{(u.total_xp || 0).toLocaleString()}</p>
                  <p className="text-gray-500 text-xs">XP</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
