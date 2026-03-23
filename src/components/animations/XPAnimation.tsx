// Animated XP Gain Display
// Shows floating +XP text when user gains experience

'use client';

import { motion, useAnimation } from 'framer-motion';
import { useEffect } from 'react';
import { Zap } from 'lucide-react';

interface XPAnimationProps {
  amount: number;
 show: boolean;
  onComplete?: () => void;
}

export function XPAnimation({ amount, show, onComplete }: XPAnimationProps) {
  const controls = useAnimation();

  useEffect(() => {
    if (show) {
      controls.start({
        opacity: [1, 1, 0],
        y: [0, -60],
        scale: [0.5, 1.2, 1],
      }).then(() => {
        onComplete?.();
      });
    }
  }, [show, controls, onComplete]);

  if (!show) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5, y: 20 }}
      animate={controls}
      transition={{ duration: 1.5, ease: 'easeOut' }}
      className="fixed inset-0 pointer-events-none flex items-center justify-center z-50"
    >
      <div className="flex items-center gap-3 bg-gray-900/90 backdrop-blur-sm px-8 py-4 rounded-2xl border-2 border-yellow-400 shadow-2xl shadow-yellow-500/30">
        <Zap className="text-yellow-400 w-8 h-8" fill="currentColor" />
        <span className="text-4xl font-black text-yellow-400">+{amount}</span>
        <span className="text-xl text-yellow-300 font-bold">XP</span>
      </div>
    </motion.div>
  );
}

// XP Counter - counts up from old to new value
interface XPCounterProps {
  value: number;
  previousValue?: number;
}

export function XPCounter({ value, previousValue = 0 }: XPCounterProps) {
  return (
    <motion.span
      key={value}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="text-yellow-400 font-black"
    >
      {value.toLocaleString()}
    </motion.span>
  );
}