// AchievementsTab Component
// Displays all achievements organized by category

'use client';

import { motion } from 'framer-motion';
import { Star, Zap, Trophy, Flame, Video } from 'lucide-react';
import { getAchievementsByCategory } from '@/lib/achievements';

interface AchievementsTabProps {
  user: any;
}

export default function AchievementsTab({ user }: AchievementsTabProps) {
  const userBadges = user?.badges || [];
  
  // Get achievements by category
  const dailyAchievements = getAchievementsByCategory('daily');
  const weeklyAchievements = getAchievementsByCategory('weekly');
  const alltimeAchievements = getAchievementsByCategory('alltime');
  const specialAchievements = getAchievementsByCategory('special');
  
  const earnedCount = userBadges.length;
  const totalCount = dailyAchievements.length + weeklyAchievements.length + alltimeAchievements.length + specialAchievements.length;

  return (
    <div className="p-4 space-y-6 overflow-y-auto pb-24">
      {/* Header Stats */}
      <div className="bg-gray-950 rounded-xl p-4 flex justify-between items-center">
        <div>
          <p className="text-gray-400">Achievements</p>
          <p className="text-3xl font-black text-yellow-500">{earnedCount} / {totalCount}</p>
        </div>
        <div className="text-right">
          <p className="text-gray-400 text-sm">Progress</p>
          <p className="text-xl font-bold text-white">{Math.round((earnedCount / totalCount) * 100)}%</p>
        </div>
      </div>

      {/* ⚡ Daily Achievements */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Zap size={20} className="text-yellow-400" />
          <h3 className="text-lg font-bold">⚡ Daily</h3>
        </div>
        <div className="space-y-2">
          {dailyAchievements.map((ach, i) => {
            const earned = userBadges.includes(ach.id);
            return (
              <motion.div 
                key={ach.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`p-4 rounded-xl flex items-center gap-4 ${earned ? 'bg-gray-950 border-2 border-yellow-400/30' : 'bg-gray-950/50 opacity-40'}`}
              >
                <div className={earned ? 'text-yellow-500' : 'text-gray-600'}>
                  <Star size={24} />
                </div>
                <div className="flex-1">
                  <p className="font-bold">{ach.name}</p>
                  <p className="text-gray-500 text-sm">{ach.desc}</p>
                </div>
                <span className="text-yellow-500 font-bold">+{ach.points}</span>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* 🏆 Weekly Achievements */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Trophy size={20} className="text-blue-400" />
          <h3 className="text-lg font-bold">🏆 Weekly</h3>
        </div>
        <div className="space-y-2">
          {weeklyAchievements.map((ach, i) => {
            const earned = userBadges.includes(ach.id);
            return (
              <motion.div 
                key={ach.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`p-4 rounded-xl flex items-center gap-4 ${earned ? 'bg-gray-950 border-2 border-blue-400/30' : 'bg-gray-950/50 opacity-40'}`}
              >
                <div className={earned ? 'text-blue-400' : 'text-gray-600'}>
                  <Star size={24} />
                </div>
                <div className="flex-1">
                  <p className="font-bold">{ach.name}</p>
                  <p className="text-gray-500 text-sm">{ach.desc}</p>
                </div>
                <span className="text-blue-400 font-bold">+{ach.points}</span>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* 🧠 All-Time Achievements */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Flame size={20} className="text-purple-400" />
          <h3 className="text-lg font-bold">🧠 All-Time</h3>
        </div>
        <div className="space-y-2">
          {alltimeAchievements.map((ach, i) => {
            const earned = userBadges.includes(ach.id);
            return (
              <motion.div 
                key={ach.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`p-4 rounded-xl flex items-center gap-4 ${earned ? 'bg-gray-950 border-2 border-purple-400/30' : 'bg-gray-950/50 opacity-40'}`}
              >
                <div className={earned ? 'text-purple-400' : 'text-gray-600'}>
                  <Star size={24} />
                </div>
                <div className="flex-1">
                  <p className="font-bold">{ach.name}</p>
                  <p className="text-gray-500 text-sm">{ach.desc}</p>
                </div>
                <span className="text-purple-400 font-bold">+{ach.points}</span>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* 🎥 Special Weekly Achievements */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Video size={20} className="text-red-400" />
          <h3 className="text-lg font-bold">🎥 Special Weekly</h3>
        </div>
        <div className="space-y-2">
          {specialAchievements.map((ach, i) => {
            const earned = userBadges.includes(ach.id);
            return (
              <motion.div 
                key={ach.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`p-4 rounded-xl flex items-center gap-4 ${earned ? 'bg-gray-950 border-2 border-red-400/30' : 'bg-gray-950/50 opacity-40'}`}
              >
                <div className={earned ? 'text-red-400' : 'text-gray-600'}>
                  <Star size={24} />
                </div>
                <div className="flex-1">
                  <p className="font-bold">{ach.name}</p>
                  <p className="text-gray-500 text-sm">{ach.desc}</p>
                </div>
                <span className="text-red-400 font-bold">+{ach.points}</span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
