// PostWorkoutModal Component
// Reward screen after completing a workout with smooth animations

'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Zap, Flame, Trophy, ArrowRight } from 'lucide-react';

interface PostWorkoutModalProps {
  showXPGain: number | null;
  user: any;
  currentLevel: number;
  xpToNextLevel?: number;
  onLogAnother: () => void;
  onFinish: () => void;
}

export default function PostWorkoutModal({ showXPGain, user, currentLevel, xpToNextLevel: propXpToNextLevel, onLogAnother, onFinish }: PostWorkoutModalProps) {
  const [xpCount, setXpCount] = useState(0);
  const [shareToast, setShareToast] = useState<string | null>(null);

  // Generate share text with user stats
  const generateShareText = () => {
    const rank = user.highest_rank || 0;
    const streak = user.streak || 0;
    const xp = user.total_xp || 0;
    return `Crushing it on iLift! 🔥 Rank ${rank} | ${streak}-day streak | ${xp} XP`;
  };

  // Handle share button click
  const handleShare = async (platform: string) => {
    const shareText = generateShareText();
    
    try {
      await navigator.clipboard.writeText(shareText);
      setShareToast(`${platform} link copied! Paste to share`);
      setTimeout(() => setShareToast(null), 3000);
    } catch (err) {
      setShareToast('Could not copy to clipboard');
      setTimeout(() => setShareToast(null), 3000);
    }
  };
  
  // Animate XP counting up
  useEffect(() => {
    if (showXPGain) {
      setXpCount(0);
      const duration = 1500;
      const steps = 30;
      const increment = showXPGain / steps;
      let current = 0;
      const interval = setInterval(() => {
        current += increment;
        if (current >= showXPGain) {
          setXpCount(showXPGain);
          clearInterval(interval);
        } else {
          setXpCount(Math.floor(current));
        }
      }, duration / steps);
      return () => clearInterval(interval);
    }
  }, [showXPGain]);

  if (!showXPGain) return null;
  
  const xpToNext = propXpToNextLevel ?? 500;
  const progressPercent = ((user.total_xp || 0) % xpToNext) / xpToNext * 100;
  const nextLevelXP = (user.total_xp || 0) + xpToNext;
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ backgroundColor: '#050505' }}
    >
      <div className="text-center max-w-sm w-full px-6">
        
        {/* XP Reward - large animated display */}
        <motion.div 
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
          className="mb-8"
        >
          <motion.div 
            animate={{ 
              boxShadow: [
                '0 0 60px rgba(250, 204, 21, 0.6)',
                '0 0 80px rgba(250, 204, 21, 0.8)',
                '0 0 60px rgba(250, 204, 21, 0.6)'
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-block px-10 py-8 rounded-2xl"
            style={{ 
              background: 'linear-gradient(135deg, #facc15 0%, #eab308 100%)',
            }}
          >
            <motion.p 
              className="text-7xl font-black text-black"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              +{xpCount}
            </motion.p>
            <motion.p 
              className="text-xl font-bold text-black/70 mt-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              XP EARNED
            </motion.p>
          </motion.div>
        </motion.div>

        {/* Status Update with streak */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          {user.streak && user.streak > 0 ? (
            <div className="flex items-center justify-center gap-2">
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5, repeat: 2 }}
                className="text-3xl"
              >
                🔥
              </motion.span>
              <p className="text-2xl font-black text-white">
                {user.streak} DAY STREAK!
              </p>
            </div>
          ) : (
            <p className="text-xl font-bold text-gray-300">Workout complete!</p>
          )}
        </motion.div>

        {/* Level Progress */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mb-10"
        >
          <div className="flex items-center justify-center gap-2 mb-2">
            <Trophy size={18} className="text-yellow-400" />
            <p className="text-gray-400 text-sm font-bold">LEVEL {currentLevel}</p>
          </div>
          <div className="h-3 rounded-full overflow-hidden" style={{ background: '#1a1a1a' }}>
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 1, ease: 'easeOut', delay: 0.8 }}
              className="h-full rounded-full"
              style={{ 
                background: 'linear-gradient(90deg, #facc15, #eab308)',
                boxShadow: '0 0 15px rgba(250, 204, 21, 0.5)'
              }}
            />
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-gray-500 text-sm">{user.total_xp || 0} XP</span>
            <span className="text-yellow-400 text-sm font-bold">{nextLevelXP} XP</span>
          </div>
        </motion.div>

        {/* Next Actions */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="space-y-3"
        >
          <motion.button 
            onClick={onLogAnother}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-4 rounded-xl font-bold text-black text-lg flex items-center justify-center gap-2"
            style={{ 
              background: 'linear-gradient(135deg, #facc15 0%, #eab308 100%)',
              boxShadow: '0 4px 25px rgba(250, 204, 21, 0.5)'
            }}
          >
            Log Another Exercise
            <ArrowRight size={20} />
          </motion.button>

          {/* Share Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="pt-4 border-t border-gray-800"
          >
            <p className="text-gray-500 text-sm mb-3 font-medium">Share your progress</p>
            <div className="flex gap-2">
              <motion.button 
                onClick={() => handleShare('X')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-1 py-3 rounded-lg font-bold text-white text-sm flex items-center justify-center gap-2"
                style={{ background: '#000' }}
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                X
              </motion.button>
              <motion.button 
                onClick={() => handleShare('Instagram')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-1 py-3 rounded-lg font-bold text-white text-sm flex items-center justify-center gap-2"
                style={{ background: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)' }}
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153a4.908 4.908 0 0 1 1.153 1.772c.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 0 1-1.153 1.772 4.915 4.915 0 0 1-1.772 1.153c-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 0 1-1.772-1.153 4.904 4.904 0 0 1-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 0 1 1.153-1.772A4.897 4.897 0 0 1 5.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm6.5-.25a1.25 1.25 0 0 0-2.5 0 1.25 1.25 0 0 0 2.5 0zM12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6z"/></svg>
                Instagram
              </motion.button>
              <motion.button 
                onClick={() => handleShare('TikTok')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-1 py-3 rounded-lg font-bold text-white text-sm flex items-center justify-center gap-2"
                style={{ background: '#000' }}
              >
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
                TikTok
              </motion.button>
            </div>
          </motion.div>

          {/* Toast notification */}
          <AnimatePresence>
            {shareToast && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="mt-3 py-2 px-4 rounded-lg text-sm font-medium bg-gray-800 text-gray-300"
              >
                {shareToast}
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button 
            onClick={onFinish}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-4 rounded-xl font-bold text-gray-400 text-lg"
            style={{ 
              background: 'transparent',
              border: '1px solid #333'
            }}
          >
            Finish Workout
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}