// Animated Progress Bar Components
// Smooth, glowing progress indicators

'use client';

import { motion, useAnimation, useInView } from 'framer-motion';
import { useEffect, useRef } from 'react';

interface AnimatedProgressBarProps {
  value: number; // 0-100
  max?: number;
  color?: 'yellow' | 'green' | 'blue' | 'red' | 'orange';
  showLabel?: boolean;
  label?: string;
  height?: number;
  animated?: boolean;
}

const colorMap = {
  yellow: { bg: 'bg-yellow-400', glow: 'shadow-yellow-500/50', gradient: 'from-yellow-400 to-yellow-300' },
  green: { bg: 'bg-green-400', glow: 'shadow-green-500/50', gradient: 'from-green-400 to-green-300' },
  blue: { bg: 'bg-blue-400', glow: 'shadow-blue-500/50', gradient: 'from-blue-400 to-blue-300' },
  red: { bg: 'bg-red-400', glow: 'shadow-red-500/50', gradient: 'from-red-400 to-red-300' },
  orange: { bg: 'bg-orange-400', glow: 'shadow-orange-500/50', gradient: 'from-orange-400 to-orange-300' },
};

export function AnimatedProgressBar({
  value,
  max = 100,
  color = 'yellow',
  showLabel = true,
  label,
  height = 12,
  animated = true,
}: AnimatedProgressBarProps) {
  const percentage = Math.min(100, (value / max) * 100);
  const colors = colorMap[color];
  
  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-gray-400 text-xs">{label}</span>
          <span className="text-gray-300 text-xs font-mono">{Math.round(percentage)}%</span>
        </div>
      )}
      <div 
        className="bg-gray-800 rounded-full overflow-hidden"
        style={{ height }}
      >
        <motion.div
          initial={animated ? { width: 0 } : { width: `${percentage}%` }}
          animate={{ width: `${percentage}%` }}
          transition={{ 
            duration: animated ? 0.8 : 0, 
            ease: 'easeOut',
            delay: animated ? 0.2 : 0
          }}
          className={`h-full ${colors.bg} rounded-full ${colors.glow} shadow-lg`}
          style={{
            background: `linear-gradient(90deg, var(--${color === 'yellow' ? '#facc15' : color === 'green' ? '#4ade80' : '#60a5fa'}, 0%), var(--${color === 'yellow' ? '#eab308' : color === 'green' ? '#22c55e' : '#3b82f6'}))`
          }}
        >
          {/* Shimmer effect */}
          <motion.div
            animate={{ x: ['-100%', '100%'] }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity, 
              ease: 'easeInOut',
              repeatDelay: 2 
            }}
            className="h-full w-1/2 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12"
          />
        </motion.div>
      </div>
    </div>
  );
}

// XP Progress Bar with glow and pulse
interface XPProgressBarProps {
  current: number;
  nextLevel: number;
  label?: string;
}

export function XPProgressBar({ current, nextLevel, label }: XPProgressBarProps) {
  const percentage = Math.min(100, (current / nextLevel) * 100);
  
  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-400 text-sm">{label}</span>
        </div>
      )}
      <div className="h-3 bg-gray-900 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="h-full relative"
          style={{
            background: 'linear-gradient(90deg, #facc15 0%, #fbbf24 50%, #f59e0b 100%)',
            boxShadow: '0 0 12px rgba(250, 204, 21, 0.6)',
          }}
        >
          {/* Pulse glow */}
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 bg-yellow-300 rounded-full"
          />
        </motion.div>
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-gray-500 text-xs">{current} XP</span>
        <span className="text-yellow-400 text-xs font-bold">{nextLevel} XP</span>
      </div>
    </div>
  );
}

// Streak Flame with animation
interface StreakFlameProps {
  streak: number;
  size?: 'sm' | 'md' | 'lg';
}

export function StreakFlame({ streak, size = 'md' }: StreakFlameProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };
  
  return (
    <div className={`relative ${sizeClasses[size]} flex items-center justify-center`}>
      {/* Outer glow */}
      <motion.div
        animate={{ 
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="absolute inset-0 bg-orange-500 rounded-full blur-xl"
      />
      
      {/* Flame icon */}
      <motion.span
        animate={{ 
          y: [0, -2, 0],
          rotate: [-2, 2, -2],
        }}
        transition={{ duration: 0.8, repeat: Infinity }}
        className="text-3xl"
      >
        {streak >= 30 ? '🔥' : streak >= 7 ? '🔥' : '🔥'}
      </motion.span>
    </div>
  );
}