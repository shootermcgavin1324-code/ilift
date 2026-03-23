// ProfileModal Component
// Displays a read-only user profile modal with animations

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Flame, Trophy, Zap, Star } from 'lucide-react';
import { calculateLevelInfo, getPrestigeStars } from '@/lib/data';
import { ACHIEVEMENTS } from '@/lib/achievements';
import { getFitnessGoal, getExperience } from '@/lib/storage';

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

  // Get onboarding data
  const fitnessGoal = getFitnessGoal();
  const experience = getExperience();

  // Format goal for display
  const goalLabels: Record<string, string> = {
    strength: 'Build Strength',
    muscle: 'Build Muscle',
    endurance: 'Build Endurance',
    weight: 'Lose Weight',
  };

  // Format experience for display
  const expLabels: Record<string, string> = {
    beginner: 'Beginner',
    intermediate: 'Intermediate',
    advanced: 'Advanced',
    expert: 'Expert',
  };

  // Handle click outside to close
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleOverlayClick}
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-gray-950 rounded-2xl w-full max-w-sm overflow-hidden border border-gray-800"
      >
        {/* Header with close button */}
        <div className="flex justify-end p-3">
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
          >
            <X size={18} />
          </motion.button>
        </div>

        {/* Profile Content */}
        <div className="px-4 pb-6 space-y-4">
          {/* Avatar */}
          <div className="text-center">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
              className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-500/30 to-orange-500/30 flex items-center justify-center mx-auto mb-3 border-2 border-yellow-500/30"
            >
              <span className="text-4xl font-black text-yellow-400">
                {user.name?.charAt(0).toUpperCase()}
              </span>
            </motion.div>
            <motion.h2 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-2xl font-black text-white"
            >
              {user.name}
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-gray-400 text-sm mt-1"
            >
              Squad {user.group_id || 'NONE'}
            </motion.p>
            {(fitnessGoal || experience) && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.35 }}
                className="flex justify-center gap-3 mt-2"
              >
                {fitnessGoal && (
                  <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded-full">
                    {goalLabels[fitnessGoal] || fitnessGoal}
                  </span>
                )}
                {experience && (
                  <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full">
                    {expLabels[experience] || experience}
                  </span>
                )}
              </motion.div>
            )}
          </div>

          {/* Level & XP */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-900/50 rounded-xl p-4 border border-gray-800"
          >
            <div className="flex items-baseline justify-center gap-2 mb-2">
              <span className="text-xl font-bold text-yellow-400">LEVEL {levelInfo.level}</span>
              {prestigeCount > 0 && (
                <span className="text-purple-400 text-sm font-bold">Prestige {prestigeCount}{prestigeStars}</span>
              )}
            </div>
            
            <div className="relative h-3 bg-gray-800 rounded-full overflow-hidden mb-2">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${levelInfo.progressPercent}%` }}
                transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full"
              />
            </div>
            
            <p className="text-center text-gray-400 text-sm">
              {levelInfo.xpInCurrentLevel.toLocaleString()} / {levelInfo.xpToNextLevel} XP
            </p>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gray-900 rounded-xl p-3 text-center border border-gray-800"
            >
              <Zap size={20} className="mx-auto text-yellow-400 mb-1" />
              <p className="text-xl font-black text-white">{(user.total_xp || 0).toLocaleString()}</p>
              <p className="text-gray-500 text-xs">Total XP</p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gray-900 rounded-xl p-3 text-center border border-gray-800"
            >
              <Flame size={20} className="mx-auto text-orange-400 mb-1" />
              <p className="text-xl font-black text-white">{user.streak || 0}</p>
              <p className="text-gray-500 text-xs">Day Streak</p>
            </motion.div>
          </div>

          {/* Badges */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-gray-900 rounded-xl p-4 border border-gray-800"
          >
            <div className="flex items-center gap-2 mb-3">
              <Trophy size={18} className="text-yellow-400" />
              <p className="text-white text-sm font-bold">Achievements ({userBadges.length})</p>
            </div>
            
            {userBadges.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-2">No achievements yet</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {earnedAchievements.map((ach, i) => (
                  <motion.span 
                    key={ach.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.7 + i * 0.1 }}
                    className="bg-yellow-500/20 text-yellow-400 text-xs font-bold px-2 py-1 rounded-full"
                    title={ach.desc}
                  >
                    {ach.name}
                  </motion.span>
                ))}
              </div>
            )}
          </motion.div>

          {/* View Profile Badge */}
          <div className="text-center pt-2">
            <span className="inline-flex items-center gap-1 text-gray-500 text-xs">
              <Star size={12} />
              View Profile
            </span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}