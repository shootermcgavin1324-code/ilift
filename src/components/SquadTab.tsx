// SquadTab Component
// Displays squad members and leaderboard

interface SquadTabProps {
  user: any;
  leaderboard: any[];
}

export default function SquadTab({ user, leaderboard }: SquadTabProps) {
  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">Your Squad</h2>
      <p className="text-gray-400 text-sm">People in your group ({user.group_id})</p>

      {leaderboard.length === 0 ? (
        <div className="text-center py-8 bg-gray-950/50 rounded-xl">
          <p className="text-gray-400">No one else in your squad yet!</p>
          <p className="text-gray-600 text-sm mt-1">Share the squad code: <span className="text-yellow-500 font-bold">{user.group_id}</span></p>
        </div>
      ) : (
        <div className="space-y-2">
          {leaderboard.map((member: any, i: number) => (
            <div 
              key={member.id} 
              className={`bg-gray-950 rounded-xl p-4 flex items-center gap-4 ${member.id === user.id ? 'border border-yellow-400/30' : ''}`}
            >
              <span className="text-2xl font-black text-gray-600 w-8">#{i + 1}</span>
              <div className="w-12 h-12 rounded-full bg-gray-900 flex items-center justify-center">
                <span className="text-xl font-bold text-gray-600">{member.name?.charAt(0)}</span>
              </div>
              <div className="flex-1">
                <p className="font-bold">{member.name}</p>
                <p className="text-gray-400 text-sm">Level {Math.floor((member.total_xp || 0) / 500) + 1}</p>
              </div>
              <div className="text-right">
                <p className="text-yellow-500 font-black text-xl">{(member.total_xp || 0).toLocaleString()}</p>
                <p className="text-gray-400 text-xs">XP</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
