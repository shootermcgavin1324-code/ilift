'use client';

import { useEffect, useState } from 'react';
import { Zap } from 'lucide-react';

export function ConvexStatus() {
  const [status, setStatus] = useState<string>('Testing...');

  useEffect(() => {
    async function testConvex() {
      try {
        const CONVEX_URL = typeof window !== 'undefined' ? (process.env.NEXT_PUBLIC_CONVEX_URL || 'https://zealous-armadillo-692.convex.cloud') : 'https://zealous-armadillo-692.convex.cloud';
        
        // Just test if we can reach the endpoint
        const response = await fetch(CONVEX_URL, {
          method: 'GET',
        });
        
        if (response.ok || response.status === 200) {
          setStatus('Connected ✅');
        } else {
          setStatus(`Status: ${response.status}`);
        }
      } catch (e: any) {
        setStatus(`Error: ${e.message}`);
      }
    }
    
    testConvex();
    
    // Check every 5 seconds
    const interval = setInterval(testConvex, 5000);
    return () => clearInterval(interval);
  }, []);

  // Only show on localhost
  if (typeof window !== 'undefined' && !window.location.hostname.includes('localhost')) {
    return null;
  }

  const isConnected = status.includes('✅');
  const isError = status.includes('Error');

  return (
    <div className={`fixed top-4 right-4 z-50 px-3 py-2 rounded-full border ${
      isConnected ? 'bg-green-900/50 border-green-500/30' : 
      isError ? 'bg-red-900/50 border-red-500/30' : 
      'bg-yellow-900/50 border-yellow-500/30'
    }`}>
      <div className="flex items-center gap-2">
        <Zap size={14} className={isConnected ? 'text-green-400' : isError ? 'text-red-400' : 'text-yellow-400'} />
        <span className="text-xs text-gray-300">{status}</span>
      </div>
    </div>
  );
}
