// HomeTab Component
// Main dashboard view with rank, streak, level, and leaderboard preview

interface User {
  id: string;
  name: string;
  streak: number;
  total_xp: number;
}

interface LeaderboardEntry {
  id: string;
  name: string;
  total_xp: number;
}

interface HomeTabProps {
  user: User;
  leaderboard: LeaderboardEntry[];
  currentLevel: number;
  onLogWorkout: () => void;
}

export default function HomeTab({ user, leaderboard, currentLevel, onLogWorkout }: HomeTabProps) {
  const userRank = leaderboard.findIndex((u: any) => u.id === user.id) + 1;
  const rankAhead = leaderboard[userRank - 2];

  return (
    <div className="p-4 space-y-4">
      {/* User Rank - Prominent */}
      {leaderboard.length > 0 && (
        <div className="bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-xl p-4 border border-yellow-400/30">
          <p className="text-gray-400 text-sm">Your Rank</p>
          <p className="text-5xl font-black text-yellow-500">#{userRank}</p>
          {rankAhead && (
            <p className="text-gray-400 text-sm mt-2">
              <span className="text-white font-bold">{rankAhead.name}</span> is {rankAhead.total_xp - (user.total_xp || 0)} XP ahead
            </p>
          )}
        </div>
      )}

      {/* Streak & Level */}
      <div className="flex gap-3">
        <div className="flex-1 bg-gray-950 rounded-xl p-4">
          <p className="text-gray-400 text-sm">🔥 Streak</p>
          <p className="text-2xl font-black text-orange-400">{user.streak || 0} days</p>
        </div>
        <div className="flex-1 bg-gray-950 rounded-xl p-4">
          <p className="text-gray-400 text-sm">Level</p>
          <p className="text-2xl font-black text-yellow-500">{currentLevel}</p>
        </div>
      </div>

      {/* Primary CTA - Log Workout */}
      <button 
        onClick={onLogWorkout}
        className="w-full py-5 bg-yellow-400 rounded-xl font-black text-black text-xl"
      >
        LOG WORKOUT →
      </button>

      {/* Leaderboard Preview */}
      <div className="bg-gray-950 rounded-xl p-4">
        <p className="text-gray-400 text-sm mb-3">Today's Squad</p>
        {leaderboard.length === 0 ? (
          <p className="text-gray-400 text-center py-4">No workouts yet. Be first!</p>
        ) : (
          leaderboard.slice(0, 5).map((u: any, i: number) => (
            <div 
              key={u.id} 
              className={`flex justify-between items-center py-2 px-2 rounded-lg ${u.id === user.id ? 'bg-yellow-400/10 border border-yellow-400/30' : ''}`}
            >
              <div className="flex items-center gap-2">
                {i === 0 && <span>🥇</span>}
                {i === 1 && <span>🥈</span>}
                {i === 2 && <span>🥉</span>}
                {i > 2 && <span className="text-gray-400 font-bold w-5">#{i + 1}</span>}
                <span className={u.id === user.id ? 'text-yellow-500 font-bold' : 'text-gray-400'}>{u.name}</span>
              </div>
              <span className="font-black text-gray-400">{u.total_xp || 0}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
