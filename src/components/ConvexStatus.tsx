'use client';

import { useState, useEffect } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';

export function ConvexStatus() {
  const [isOnline, setIsOnline] = useState(true);
  
  useEffect(() => {
    setIsOnline(navigator.onLine);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className="fixed top-2 right-2 p-2 z-50">
      <div className={`px-2 py-1 rounded text-xs ${isOnline ? 'bg-green-900/80 text-green-300' : 'bg-red-900/80 text-red-300'}`}>
        {isOnline ? '🟢 Convex' : '🔴 Offline'}
      </div>
    </div>
  );
}
