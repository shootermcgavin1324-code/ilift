// ProfileModal Component
// Displays a read-only user profile modal

'use client';

import { X, Flame, Trophy, Zap, Star } from 'lucide-react';
import { calculateLevelInfo, getPrestigeStars } from '@/lib/data';
import { ACHIEVEMENTS } from '@/lib/achievements';

interface ProfileModalProps {
  user: {
    id: string;
    name: string;
    total_xp: number;
    streak: number;
    badges: string[];
    group_id?: string;
  };
  onClose: () => void;
}

export default function ProfileModal({ user, onClose }: ProfileModalProps) {
  const levelInfo = calculateLevelInfo(user.total_xp || 0);
  const prestigeCount = Math.floor((user.total_xp || 0) / 55000);
  const prestigeStars = getPrestigeStars(prestigeCount);

  // Get user's badges
  const userBadges = user.badges || [];
  const earnedAchievements = ACHIEVEMENTS.filter(a => userBadges.includes(a.id));

  // Handle click outside to close
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleOverlayClick}
    >
      <div className="bg-gray-950 rounded-2xl w-full max-w-sm overflow-hidden border border-gray-800">
        {/* Header with close button */}
        <div className="flex justify-end p-3">
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Profile Content */}
        <div className="px-4 pb-6 space-y-4">
          {/* Avatar */}
          <div className="text-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-500/30 to-orange-500/30 flex items-center justify-center mx-auto mb-3 border-2 border-yellow-500/30">
              <span className="text-4xl font-black text-yellow-400">
                {user.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <h2 className="text-2xl font-black text-white">{user.name}</h2>
            <p className="text-gray-400 text-sm mt-1">Squad {user.group_id || 'NONE'}</p>
          </div>

          {/* Level & XP */}
          <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-800">
            <div className="flex items-baseline justify-center gap-2 mb-2">
              <span className="text-xl font-bold text-yellow-400">LEVEL {levelInfo.level}</span>
              {prestigeCount > 0 && (
                <span className="text-purple-400 text-sm font-bold">Prestige {prestigeCount}{prestigeStars}</span>
              )}
            </div>
            
            <div className="relative h-3 bg-gray-800 rounded-full overflow-hidden mb-2">
              <div 
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full"
                style={{ width: `${levelInfo.progressPercent}%` }}
              />
            </div>
            
            <p className="text-center text-gray-400 text-sm">
              {levelInfo.xpInCurrentLevel.toLocaleString()} / {levelInfo.xpToNextLevel} XP
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-900 rounded-xl p-3 text-center border border-gray-800">
              <Zap size={20} className="mx-auto text-yellow-400 mb-1" />
              <p className="text-xl font-black text-white">{(user.total_xp || 0).toLocaleString()}</p>
              <p className="text-gray-500 text-xs">Total XP</p>
            </div>
            <div className="bg-gray-900 rounded-xl p-3 text-center border border-gray-800">
              <Flame size={20} className="mx-auto text-orange-400 mb-1" />
              <p className="text-xl font-black text-white">{user.streak || 0}</p>
              <p className="text-gray-500 text-xs">Day Streak</p>
            </div>
          </div>

          {/* Badges */}
          <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
            <div className="flex items-center gap-2 mb-3">
              <Trophy size={18} className="text-yellow-400" />
              <p className="text-white text-sm font-bold">Achievements ({userBadges.length})</p>
            </div>
            
            {userBadges.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-2">No achievements yet</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {earnedAchievements.map(ach => (
                  <span 
                    key={ach.id}
                    className="bg-yellow-500/20 text-yellow-400 text-xs font-bold px-2 py-1 rounded-full"
                    title={ach.desc}
                  >
                    {ach.name}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* View Profile Badge */}
          <div className="text-center pt-2">
            <span className="inline-flex items-center gap-1 text-gray-500 text-xs">
              <Star size={12} />
              View Profile
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
