// RestTimer Component
// Timer for rest between sets

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
      <div 
        className="rounded-xl p-6 text-center"
        style={{ 
          background: 'linear-gradient(135deg, rgba(250, 204, 21, 0.1) 0%, #1a1a1a 100%)',
          border: '1px solid rgba(250, 204, 21, 0.3)',
          boxShadow: '0 0 30px rgba(250, 204, 21, 0.2)'
        }}
      >
        <p className="text-gray-400 text-xs font-bold tracking-wider mb-2">REST TIMER</p>
        <p className="text-7xl font-black text-yellow-400 mb-3" style={{ textShadow: '0 0 40px rgba(250, 204, 21, 0.5)' }}>
          {restTimeLeft}s
        </p>
        <p className="text-gray-500 text-sm mb-3">Rest between sets</p>
        <button 
          onClick={() => { setRestTimer(null); setRestTimeLeft(0); }} 
          className="px-6 py-2 rounded-lg text-gray-400 text-sm font-bold border border-gray-700 hover:border-gray-500 transition-all"
        >
          Skip Rest
        </button>
      </div>
    );
  }
  
  return (
    <div>
      <p className="text-gray-500 text-xs font-bold tracking-wider mb-2">REST TIMER</p>
      <div className="flex gap-2">
        {[60, 90, 120, 180].map(sec => (
          <button 
            key={sec} 
            onClick={() => startRestTimer(sec)} 
            className="flex-1 py-3 rounded-xl font-bold text-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            style={{ 
              background: 'linear-gradient(135deg, #1a1a1a, #262626)',
              border: '1px solid #333'
            }}
          >
            {sec}s
          </button>
        ))}
      </div>
    </div>
  );
}
