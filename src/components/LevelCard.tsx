// LevelCard Component
// Call of Duty style level and prestige display

import { calculateLevelInfo, getPrestigeStars, formatLevelDisplay, MAX_LEVEL } from '@/lib/xp';

interface LevelCardProps {
  totalXP: number;
  onPrestige?: () => void;
}

export default function LevelCard({ totalXP, onPrestige }: LevelCardProps) {
  const levelInfo = calculateLevelInfo(totalXP);
  const prestigeCount = Math.floor(totalXP / (55 * 1000)); // Simplified prestige calc
  const stars = getPrestigeStars(prestigeCount);
  
  return (
    <div className="rounded-xl p-4 bg-gray-900 border border-gray-700">
      {/* Level Display */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <p className="text-gray-500 text-xs font-bold tracking-wider">LEVEL</p>
          <div className="flex items-baseline gap-2">
            <p className="text-4xl font-black text-white">
              {levelInfo.level}
            </p>
            {prestigeCount > 0 && (
              <span className="text-yellow-400 text-lg">{stars}</span>
            )}
          </div>
          {prestigeCount > 0 ? (
            <p className="text-yellow-400 text-sm font-bold">
              Prestige {prestigeCount}{stars}
            </p>
          ) : (
            <p className="text-gray-400 text-sm">
              XP to Level {levelInfo.level + 1}: {levelInfo.xpToNextLevel - levelInfo.xpInCurrentLevel}
            </p>
          )}
        </div>
        
        {/* Level Badge */}
        <div className={`px-3 py-1 rounded-lg font-bold text-sm ${
          levelInfo.level >= MAX_LEVEL 
            ? 'bg-purple-600 text-white animate-pulse' 
            : 'bg-gray-800 text-gray-300'
        }`}>
          {levelInfo.level >= MAX_LEVEL ? 'MAX' : `/${MAX_LEVEL}`}
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="relative h-4 bg-gray-800 rounded-full overflow-hidden mb-3">
        <div 
          className="absolute top-0 left-0 h-full bg-gradient-to-r from-yellow-500 to-yellow-400 transition-all duration-500"
          style={{ width: `${levelInfo.progressPercent}%` }}
        />
        {/* Progress markers */}
        <div className="absolute top-0 left-1/4 w-0.5 h-full bg-gray-700" />
        <div className="absolute top-0 left-2/4 w-0.5 h-full bg-gray-700" />
        <div className="absolute top-0 left-3/4 w-0.5 h-full bg-gray-700" />
      </div>
      
      {/* XP Info */}
      <div className="flex justify-between text-xs text-gray-500">
        <span>{levelInfo.xpInCurrentLevel} XP</span>
        <span>{levelInfo.xpToNextLevel} XP</span>
      </div>
      
      {/* Prestige Button */}
      {levelInfo.canPrestige && onPrestige && (
        <button
          onClick={onPrestige}
          className="mt-3 w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg transition-all animate-pulse"
        >
          ⭐ PRESTIGE NOW ⭐
        </button>
      )}
    </div>
  );
}
