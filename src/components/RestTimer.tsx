// RestTimer Component
// Timer for rest between sets with animations

'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface RestTimerProps {
  restTimer: number | null;
  restTimeLeft: number;
  setRestTimer: (val: number | null) => void;
  setRestTimeLeft: (val: number) => void;
  startRestTimer: (seconds: number) => void;
}

export default function RestTimer({ restTimer, restTimeLeft, setRestTimer, setRestTimeLeft, startRestTimer }: RestTimerProps) {
  if (restTimer) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="rounded-xl p-6 text-center"
        style={{ 
          background: 'linear-gradient(135deg, rgba(250, 204, 21, 0.1) 0%, #1a1a1a 100%)',
          border: '1px solid rgba(250, 204, 21, 0.3)',
          boxShadow: '0 0 30px rgba(250, 204, 21, 0.2)'
        }}
      >
        <p className="text-gray-400 text-xs font-bold tracking-wider mb-2">REST TIMER</p>
        <motion.p 
          key={restTimeLeft}
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          className="text-7xl font-black text-yellow-400 mb-3"
          style={{ textShadow: '0 0 40px rgba(250, 204, 21, 0.5)' }}
        >
          {restTimeLeft}s
        </motion.p>
        <p className="text-gray-500 text-sm mb-3">Rest between sets</p>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => { setRestTimer(null); setRestTimeLeft(0); }} 
          className="px-6 py-2 rounded-lg text-gray-400 text-sm font-bold border border-gray-700 hover:border-gray-500 transition-all"
        >
          Skip Rest
        </motion.button>
      </motion.div>
    );
  }
  
  return (
    <div>
      <p className="text-gray-500 text-xs font-bold tracking-wider mb-2">REST TIMER</p>
      <div className="flex gap-2">
        {[60, 90, 120, 180].map((sec, i) => (
          <motion.button 
            key={sec} 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => startRestTimer(sec)} 
            className="flex-1 py-3 rounded-xl font-bold text-sm transition-all"
            style={{ 
              background: 'linear-gradient(135deg, #1a1a1a, #262626)',
              border: '1px solid #333'
            }}
          >
            {sec}s
          </motion.button>
        ))}
      </div>
    </div>
  );
}