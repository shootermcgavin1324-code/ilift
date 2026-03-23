// HomeTab Component
// Main dashboard view with rank, streak, level, and leaderboard preview

'use client';

import { useState, memo } from 'react';
import { Flame, Target, Trophy, Zap, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { User as UserType } from '@/lib/types';
import { XPProgressBar, StreakFlame } from './animations';

interface User extends UserType {}

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
  onViewProfile?: (user: any) => void;
}

function HomeTab({ user, leaderboard, currentLevel, onLogWorkout, onViewProfile }: HomeTabProps) {
  const userRank = leaderboard.findIndex((u: any) => u.id === user.id) + 1;
  const rankAhead = leaderboard[userRank - 2];
  
  // Calculate XP progress
  const currentLevelXP = (currentLevel - 1) * 500;
  const nextLevelXP = currentLevel * 500;
  const xpIntoLevel = (user.total_xp || 0) - currentLevelXP;
  const xpToNextLevel = nextLevelXP - (user.total_xp || 0);
  const progressPercent = Math.min(100, (xpIntoLevel / 500) * 100);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-4 space-y-4"
    >
      {/* XP Progress Bar */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gray-950 rounded-xl p-4 border border-yellow-500/20"
      >
        <XPProgressBar 
          current={user.total_xp || 0} 
          nextLevel={nextLevelXP}
          label={`Level ${currentLevel}`}
        />
        <p className="text-gray-500 text-xs mt-2">
          {xpToNextLevel} XP to Level {currentLevel + 1}
        </p>
      </motion.div>

      {/* User Rank - Prominent */}
      {leaderboard.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-xl p-4 border border-yellow-400/30"
        >
          <p className="text-gray-400 text-sm">Your Rank</p>
          <motion.p 
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
            className="text-5xl font-black text-yellow-500 drop-shadow-lg"
          >
            #{userRank}
          </motion.p>
          {rankAhead && (
            <p className="text-gray-400 text-sm mt-2">
              <span className="text-white font-bold">{rankAhead.name}</span> is {rankAhead.total_xp - (user.total_xp || 0)} XP ahead
            </p>
          )}
        </motion.div>
      )}

      {/* Almost There - Close to next rank */}
      {leaderboard.length > 1 && rankAhead && (rankAhead.total_xp - (user.total_xp || 0)) < 50 && (
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-xl p-4 border border-orange-500/30"
        >
          <p className="text-orange-400 text-sm font-bold">⚠️ ALMOST THERE</p>
          <p className="text-white mt-1">
            Just <span className="text-orange-400 font-black">{rankAhead.total_xp - (user.total_xp || 0)} XP</span> away from #{userRank - 1}!
          </p>
          <p className="text-gray-400 text-xs mt-1">Log one more workout to pass them!</p>
        </motion.div>
      )}

      {/* Streak & Today's Activity */}
      <div className="grid grid-cols-2 gap-3">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-950 rounded-xl p-4 border border-orange-500/20"
        >
          <div className="flex items-center gap-2 mb-1">
            <Flame size={18} className="text-orange-400" />
            <p className="text-gray-400 text-xs">STREAK</p>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-2xl font-black text-orange-400">
              {user.streak || 0} <span className="text-sm text-gray-500">days</span>
            </p>
            {user.streak && user.streak >= 7 && (
              <motion.span
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                🔥
              </motion.span>
            )}
          </div>
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-950 rounded-xl p-4 border border-green-500/20"
        >
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
        </motion.div>
      </div>

      {/* Primary CTA - Log Workout */}
      <motion.button 
        onClick={onLogWorkout}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        whileHover={{ scale: 1.02, boxShadow: '0 8px 30px rgba(250, 204, 21, 0.4)' }}
        whileTap={{ scale: 0.98 }}
        className="w-full py-5 bg-yellow-400 rounded-xl font-black text-black text-xl transition-all duration-200 hover:shadow-lg hover:shadow-yellow-500/30"
      >
        LOG WORKOUT →
      </motion.button>

      {/* Leaderboard Preview */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-gray-950 rounded-xl p-4"
      >
        <div className="flex justify-between items-center mb-3">
          <p className="text-gray-400 text-sm">SQUAD LEADERBOARD</p>
          {leaderboard.length > 0 && (
            <span className="flex items-center gap-1.5">
              <motion.span 
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-2 h-2 rounded-full bg-green-500" 
              />
              <span className="text-xs text-green-500 font-medium uppercase tracking-wider">Live</span>
            </span>
          )}
        </div>
        {leaderboard.length === 0 ? (
          <p className="text-gray-400 text-center py-4">No workouts yet. Be first!</p>
        ) : (
          <div className="space-y-1">
            {leaderboard.slice(0, 5).map((u: any, i: number) => (
              <motion.div 
                key={u.id || u.email || i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * i }}
                onClick={() => u.id !== user.id && onViewProfile?.(u)}
                className={`flex justify-between items-center py-3 px-3 rounded-lg cursor-pointer transition-all ${
                  u.id === user.id 
                    ? 'bg-yellow-400/10 border border-yellow-400/30' 
                    : 'hover:bg-gray-800 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  {i === 0 && <span className="text-xl">🥇</span>}
                  {i === 1 && <span className="text-xl">🥈</span>}
                  {i === 2 && <span className="text-xl">🥉</span>}
                  {i > 2 && <span className="text-gray-400 font-bold w-5">#{i + 1}</span>}
                  <span className={u.id === user.id ? 'text-yellow-500 font-bold' : 'text-gray-300'}>
                    {u.name}
                  </span>
                  {u.id === user.id && (
                    <span className="text-xs text-yellow-500 bg-yellow-400/20 px-2 py-0.5 rounded-full">YOU</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {u.id !== user.id && (
                    <span className="text-xs text-gray-600">View</span>
                  )}
                  <span className="font-black text-gray-300">{u.total_xp || 0}</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

export default memo(HomeTab);