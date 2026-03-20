// Leaderboard Component
// Squad leaderboard with medals and live indicators

interface LeaderboardProps {
  leaderboard: any[];
  user: any;
}

export default function Leaderboard({ leaderboard, user }: LeaderboardProps) {
  if (leaderboard.length === 0) {
    return (
      <div className="text-center py-8 rounded-xl" style={{ background: 'linear-gradient(135deg, #0f0f0f, #1a1a1a)', border: '1px solid #262626' }}>
        <p className="text-gray-400">No workouts yet. Be first!</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-2">
      {leaderboard.slice(0, 10).map((u: any, i: number) => {
        const isUser = u.id === user.id;
        return (
          <div 
            key={u.id || u.email || i} 
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
              {i === 0 && <span className="text-xl">🥇</span>}
              {i === 1 && <span className="text-xl">🥈</span>}
              {i === 2 && <span className="text-xl">🥉</span>}
              {i > 2 && <span className="text-gray-500 font-black">{i + 1}</span>}
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
        );
      })}
    </div>
  );
}
