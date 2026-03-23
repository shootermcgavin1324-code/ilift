'use client';

export const dynamic = 'force-dynamic';

import { useEffect } from 'react';
import { icons } from '@/lib/icons';
import { useRouter } from 'next/navigation';
import { hasCompletedOnboarding } from '@/lib/storage';

export default function Landing() {
  const router = useRouter();

  useEffect(() => {
    if (hasCompletedOnboarding()) {
      router.push('/dashboard');
    }
  }, [router]);

  return (
    <div className="min-h-screen text-white flex flex-col relative overflow-hidden" style={{ backgroundColor: '#050505' }}>
      
      {/* Background - subtle grid */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: `
          linear-gradient(rgba(250, 204, 21, 0.02) 1px, transparent 1px),
          linear-gradient(90deg, rgba(250, 204, 21, 0.02) 1px, transparent 1px)
        `,
        backgroundSize: '70px 70px',
        filter: 'blur(0.5px)',
        opacity: 0.7
      }} />
      
      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-24 h-24 pointer-events-none bg-gradient-to-br from-yellow-500/10 to-transparent" />
      <div className="absolute bottom-0 right-0 w-24 h-24 pointer-events-none bg-gradient-to-tl from-yellow-500/5 to-transparent" />

      {/* Header */}
      <header className="p-6 pt-8 flex justify-between items-center relative z-10">
        <div className="flex items-center gap-3">
          <div className="text-3xl font-black tracking-tighter">
            <span className="text-yellow-400 drop-shadow-lg">i</span>
            <span className="text-white">LIFT</span>
          </div>
          <div className="px-2 py-1 rounded text-xs font-bold bg-gray-900 border border-gray-700">
            <span className="text-yellow-400">BETA</span>
          </div>
        </div>
        
        <button onClick={() => router.push('/signin')} className="text-gray-400 hover:text-yellow-400 text-sm font-medium transition-all">
          Sign In
        </button>
      </header>

      {/* Main */}
      <main className="flex-1 px-6 pb-24 relative z-10">
        <div className="max-w-sm mx-auto">
          
          {/* Hero Section */}
          <div 
            className="relative h-56 mb-6 rounded-xl overflow-hidden w-full bg-cover bg-center"
            style={{ backgroundImage: 'url(/images/hero.jpg)' }}
          />

          <div className="text-center mb-4">
            <h2 className="text-5xl font-black leading-none mb-3 tracking-tight">
              OUTWORK<br/>
              <span className="text-yellow-400 drop-shadow-xl">YOUR FRIENDS</span>
            </h2>
            
            <p className="text-gray-500 text-sm mb-6">Turn every workout into competition. Log effort. Earn XP. Climb the leaderboard.</p>
            
            {/* Primary CTA */}
            <button 
              onClick={() => router.push('/signup')}
              className="inline-block px-10 py-4 rounded-lg font-bold text-base bg-yellow-400 text-black hover:bg-yellow-300 transition-all duration-200 hover:scale-105 active:scale-97 shadow-lg shadow-yellow-500/30"
            >
              START COMPETING
            </button>
            
            {/* Secondary CTA */}
            <div className="mt-4">
              <button className="text-gray-500 text-sm hover:text-yellow-400 transition-colors underline underline-offset-4">
                View Leaderboard
              </button>
            </div>
          </div>

          {/* Stats Cards with hierarchy */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {[
              { label: 'XP SYSTEM', value: 'EARN', icon: icons.xp, highlight: false },
              { label: 'STREAKS', value: 'DAILY', icon: icons.streak, highlight: false },
              { label: 'RANK', value: '#1', icon: icons.rank, highlight: true },
              { label: 'SQUAD', value: 'PVP', icon: icons.squad, highlight: false },
            ].map((stat, i) => (
              <div 
                key={i}
                className={`p-4 rounded-xl border transition-all duration-200 hover:-translate-y-1 ${
                  stat.highlight 
                    ? 'bg-yellow-950/30 border-yellow-500/50 shadow-lg shadow-yellow-500/20' 
                    : 'bg-gray-900 border-gray-800'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-400 font-bold">{stat.label}</span>
                  <span className="flex items-center justify-center" dangerouslySetInnerHTML={{ __html: stat.icon }} />
                </div>
                <div className="text-xl font-black text-yellow-400">{stat.value}</div>
                {stat.highlight && (
                  <div className="text-xs text-yellow-400/70 mt-1">Top 5% this week</div>
                )}
              </div>
            ))}
          </div>

          {/* Section break - after stats */}
          <div className="relative h-32 mb-6 rounded-xl overflow-hidden bg-cover bg-center" style={{ backgroundImage: 'url(/images/stats-bg.jpg)' }} />

          {/* Feature Highlights - storytelling */}
          <div className="space-y-3 mb-6">
            {[
              { title: 'TRAIN HARDER', desc: 'Effort-based scoring rewards intensity over weight', icon: icons.xp },
              { title: 'STAY CONSISTENT', desc: 'Complete workouts and build daily streaks', icon: icons.streak },
              { title: 'COMPETE LIVE', desc: 'Battle friends on the leaderboard', icon: icons.rank },
              { title: 'UNLOCK STATUS', desc: 'Earn badges and milestones', icon: icons.squad },
            ].map((f, i) => (
              <div 
                key={i} 
                className="p-4 rounded-xl flex items-center justify-between bg-gray-900 border border-gray-800 transition-all duration-200"
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 flex items-center justify-center bg-transparent" dangerouslySetInnerHTML={{ __html: f.icon }} />
                  <div>
                    <div className="font-bold text-sm">{f.title}</div>
                    <div className="text-gray-500 text-xs">{f.desc}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
        </div>
      </main>
    </div>
  );
}
