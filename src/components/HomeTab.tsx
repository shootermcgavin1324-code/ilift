// HomeTab Component
// Main dashboard view with rank, streak, level, and leaderboard preview

import { Flame, Target, Trophy, Zap } from 'lucide-react';

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
  
  // Calculate XP progress
  const currentLevelXP = (currentLevel - 1) * 500;
  const nextLevelXP = currentLevel * 500;
  const xpIntoLevel = (user.total_xp || 0) - currentLevelXP;
  const xpToNextLevel = nextLevelXP - (user.total_xp || 0);
  const progressPercent = Math.min(100, (xpIntoLevel / 500) * 100);

  return (
    <div className="p-4 space-y-4">
      {/* XP Progress Bar */}
      <div className="bg-gray-950 rounded-xl p-4 border border-yellow-500/20">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <Zap size={18} className="text-yellow-400" />
            <span className="text-gray-400 text-sm">Level {currentLevel}</span>
          </div>
          <span className="text-yellow-400 font-bold text-sm">{xpToNextLevel} XP to Level {currentLevel + 1}</span>
        </div>
        <div className="h-3 bg-gray-900 rounded-full overflow-hidden">
          <div 
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{ 
              width: `${progressPercent}%`,
              background: 'linear-gradient(90deg, #facc15, #eab308)',
              boxShadow: '0 0 10px rgba(250, 204, 21, 0.5)'
            }}
          />
        </div>
        <p className="text-gray-500 text-xs mt-2">
          {user.total_xp || 0} / {nextLevelXP} XP
        </p>
      </div>

      {/* User Rank - Prominent */}
      {leaderboard.length > 0 && (
        <div className="bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-xl p-4 border border-yellow-400/30 animate-in fade-in zoom-in-95 duration-300">
          <p className="text-gray-400 text-sm">Your Rank</p>
          <p className="text-5xl font-black text-yellow-500 drop-shadow-lg">#{userRank}</p>
          {rankAhead && (
            <p className="text-gray-400 text-sm mt-2">
              <span className="text-white font-bold">{rankAhead.name}</span> is {rankAhead.total_xp - (user.total_xp || 0)} XP ahead
            </p>
          )}
        </div>
      )}

      {/* Almost There - Close to next rank */}
      {leaderboard.length > 1 && rankAhead && (rankAhead.total_xp - (user.total_xp || 0)) < 50 && (
        <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-xl p-4 border border-orange-500/30">
          <p className="text-orange-400 text-sm font-bold">⚠️ ALMOST THERE</p>
          <p className="text-white mt-1">
            Just <span className="text-orange-400 font-black">{rankAhead.total_xp - (user.total_xp || 0)} XP</span> away from #{userRank - 1}!
          </p>
          <p className="text-gray-400 text-xs mt-1">Log one more workout to pass them!</p>
        </div>
      )}

      {/* Streak & Today's Activity */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gray-950 rounded-xl p-4 border border-orange-500/20">
          <div className="flex items-center gap-2 mb-1">
            <Flame size={18} className="text-orange-400" />
            <p className="text-gray-400 text-xs">STREAK</p>
          </div>
          <p className="text-2xl font-black text-orange-400">
            {user.streak || 0} <span className="text-sm text-gray-500">days</span>
          </p>
          {user.streak && user.streak >= 7 && (
            <p className="text-orange-300 text-xs mt-1">🔥 On fire!</p>
          )}
        </div>
        <div className="bg-gray-950 rounded-xl p-4 border border-green-500/20">
          <div className="flex items-center gap-2 mb-1">
            <Trophy size={18} className="text-green-400" />
            <p className="text-gray-400 text-xs">TODAY</p>
          </div>
          <p className="text-2xl font-black text-green-400">
            {leaderboard.length > 0 ? leaderboard.length : 0} <span className="text-sm text-gray-500">workouts</span>
          </p>
          <p className="text-gray-500 text-xs mt-1">
            {leaderboard.length === 0 ? 'Be the first!' : `${leaderboard.length} squad members trained`}
          </p>
        </div>
      </div>

      {/* Primary CTA - Log Workout */}
      <button 
        onClick={onLogWorkout}
        className="w-full py-5 bg-yellow-400 rounded-xl font-black text-black text-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg hover:shadow-yellow-500/30"
      >
        LOG WORKOUT →
      </button>

      {/* Leaderboard Preview */}
      <div className="bg-gray-950 rounded-xl p-4">
        <div className="flex justify-between items-center mb-3">
          <p className="text-gray-400 text-sm">SQUAD LEADERBOARD</p>
          {leaderboard.length > 0 && (
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs text-green-500 font-medium uppercase tracking-wider">Live</span>
            </span>
          )}
        </div>
        {leaderboard.length === 0 ? (
          <p className="text-gray-400 text-center py-4">No workouts yet. Be first!</p>
        ) : (
          leaderboard.slice(0, 5).map((u: any, i: number) => (
            <div 
              key={u.id || u.email || i} 
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
