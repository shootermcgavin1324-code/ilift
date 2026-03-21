// RankCard Component
// Displays user's rank with dynamic messaging

interface RankCardProps {
  user: any;
  leaderboard: any[];
}

export default function RankCard({ user, leaderboard }: RankCardProps) {
  if (leaderboard.length === 0) return null;
  
  const userRank = leaderboard.findIndex((u: any) => u.id === user.id) + 1;
  const rankAhead = leaderboard[userRank - 2];
  const xpToNext = rankAhead ? rankAhead.total_xp - (user.total_xp || 0) + 10 : 0;
  const rankBehind = leaderboard[userRank];
  const passedBy = rankBehind ? (user.total_xp || 0) - rankBehind.total_xp : 0;
  const isLosing = rankAhead && xpToNext > 0;
  
  return (
    <div 
      className={`rounded-xl p-4 transition-all duration-300 ${
        isLosing 
          ? 'bg-red-950/30 border border-red-500/30 shadow-[0_0_25px_rgba(239,68,68,0.2)]'
          : 'bg-yellow-950/30 border border-yellow-500/30 shadow-[0_0_25px_rgba(250,204,21,0.2)]'
      }`}
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <p className="text-gray-500 text-xs font-bold tracking-wider">YOUR RANK</p>
          <p className={`text-5xl font-black ${isLosing ? 'text-red-500' : 'text-yellow-400'}`}>
            {userRank === 1 ? "#1 — LEADING" : `#${userRank}`}
          </p>
        </div>
        {userRank === 1 && <span className="text-2xl">👑</span>}
      </div>
      
      {/* Dynamic feedback */}
      <div className="space-y-1">
        {passedBy > 0 && (
          <p className="text-green-400 text-sm">↑ You passed {rankBehind?.name}</p>
        )}
        {rankAhead && xpToNext > 0 && (
          <p className="text-red-400 text-sm font-bold">
            ↓ You dropped to #{userRank} — +{xpToNext} XP to reclaim #{userRank - 1}
          </p>
        )}
        {!rankAhead && userRank === 1 && (
          <p className="text-yellow-400 text-sm font-bold">🏆 You're leading! Don't lose it!</p>
        )}
      </div>
    </div>
  );
}
