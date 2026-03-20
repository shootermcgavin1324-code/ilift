// PostWorkoutModal Component
// Reward screen after completing a workout

interface PostWorkoutModalProps {
  showXPGain: number | null;
  user: any;
  currentLevel: number;
  onLogAnother: () => void;
  onFinish: () => void;
}

export default function PostWorkoutModal({ showXPGain, user, currentLevel, onLogAnother, onFinish }: PostWorkoutModalProps) {
  if (!showXPGain) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ backgroundColor: '#050505' }}>
      <div className="text-center max-w-sm w-full px-6">
        
        {/* XP Reward */}
        <div className="mb-8 animate-[fadeIn_0.3s_ease-out]">
          <div 
            className="inline-block px-10 py-8 rounded-2xl"
            style={{ 
              background: 'linear-gradient(135deg, #facc15 0%, #eab308 100%)',
              boxShadow: '0 0 60px rgba(250, 204, 21, 0.6)'
            }}
          >
            <p className="text-7xl font-black text-black">+{showXPGain}</p>
            <p className="text-xl font-bold text-black/70 mt-1">XP EARNED</p>
          </div>
        </div>

        {/* Status Update */}
        <div className="mb-8 animate-[fadeIn_0.5s_ease-out_0.2s] opacity-0" style={{ animationFillMode: 'forwards' }}>
          {user.streak && user.streak > 0 ? (
            <p className="text-xl font-bold text-white">🔥 {user.streak} day streak!</p>
          ) : (
            <p className="text-xl font-bold text-gray-300">Workout complete!</p>
          )}
        </div>

        {/* Level Progress */}
        <div className="mb-10 animate-[fadeIn_0.5s_ease-out_0.4s] opacity-0" style={{ animationFillMode: 'forwards' }}>
          <p className="text-gray-500 text-sm font-bold mb-2">LEVEL {currentLevel}</p>
          <div className="h-3 rounded-full overflow-hidden" style={{ background: '#1a1a1a' }}>
            <div 
              className="h-full rounded-full transition-all duration-1000"
              style={{ 
                width: `${Math.min(((user.total_xp || 0) % 500) / 500 * 100, 100)}%`,
                background: 'linear-gradient(90deg, #facc15, #eab308)',
                boxShadow: '0 0 15px rgba(250, 204, 21, 0.5)'
              }}
            />
          </div>
          <p className="text-gray-500 text-sm mt-2">{(user.total_xp || 0)} / {currentLevel * 500} XP</p>
        </div>

        {/* Next Actions */}
        <div className="space-y-3 animate-[fadeIn_0.5s_ease-out_0.6s] opacity-0" style={{ animationFillMode: 'forwards' }}>
          <button 
            onClick={onLogAnother}
            className="w-full py-4 rounded-xl font-bold text-black text-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.97]"
            style={{ 
              background: 'linear-gradient(135deg, #facc15 0%, #eab308 100%)',
              boxShadow: '0 4px 25px rgba(250, 204, 21, 0.5)'
            }}
          >
            Log Another Exercise
          </button>
          <button 
            onClick={onFinish}
            className="w-full py-4 rounded-xl font-bold text-gray-400 text-lg transition-all duration-200 hover:text-white"
            style={{ 
              background: 'transparent',
              border: '1px solid #333'
            }}
          >
            Finish Workout
          </button>
        </div>
      </div>
    </div>
  );
}
