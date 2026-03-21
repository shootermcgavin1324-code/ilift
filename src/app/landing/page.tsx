'use client';

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { icons } from '@/lib/icons';
import { useRouter } from 'next/navigation';

export default function Landing() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [hovering, setHovering] = useState<string | null>(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const hasOnboarding = localStorage.getItem('ilift_onboarding');
    const email = localStorage.getItem('ilift_email');
    if (hasOnboarding && email) {
      router.push('/dashboard');
    }
    
    // Parallax effect
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [router]);

  const handleNewUser = () => {
    if (email) localStorage.setItem('ilift_pending_email', email);
    if (code) localStorage.setItem('ilift_pending_code', code.toUpperCase());
    router.push('/onboarding');
  };

  const handleSignIn = () => {
    router.push('/signin');
  };

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
      <div className="absolute top-0 left-0 w-24 h-24 pointer-events-none" style={{
        background: 'linear-gradient(135deg, rgba(250, 204, 21, 0.06) 0%, transparent 70%)'
      }} />
      <div className="absolute bottom-0 right-0 w-24 h-24 pointer-events-none" style={{
        background: 'linear-gradient(315deg, rgba(250, 204, 21, 0.04) 0%, transparent 70%)'
      }} />

      {/* Header */}
      <header className="p-6 pt-8 flex justify-between items-center relative z-10">
        <div className="flex items-center gap-3">
          <div className="text-3xl font-black tracking-tighter">
            <span className="text-yellow-400" style={{ textShadow: '0 0 20px rgba(250, 204, 21, 0.6)' }}>i</span>
            <span className="text-white">LIFT</span>
          </div>
          <div className="px-2 py-1 rounded text-xs font-bold" style={{ 
            background: 'linear-gradient(135deg, #1a1a1a, #0f0f0f)',
            border: '1px solid #333'
          }}>
            <span className="text-yellow-400">BETA</span>
          </div>
        </div>
        
        <button onClick={handleSignIn} className="text-gray-400 hover:text-yellow-400 text-sm font-medium transition-all">
          Sign In
        </button>
      </header>

      {/* Main */}
      <main className="flex-1 px-6 pb-24 relative z-10">
        <div className="max-w-sm mx-auto">
          
          {/* Hero Section - with background image */}
          <div 
            className="relative h-56 mb-6 rounded-xl overflow-hidden w-full"
            style={{ 
              backgroundImage: 'url(/images/hero.jpg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              boxShadow: '0 0 0 1px #1a1a1a'
            }}
          />

          <div className="text-center mb-4">
            <h2 className="text-5xl font-black leading-none mb-3 tracking-tight">
              OUTWORK<br/>
              <span className="text-yellow-400" style={{ textShadow: '0 0 40px rgba(250, 204, 21, 0.6)' }}>YOUR FRIENDS</span>
            </h2>
            
            <p className="text-gray-500 text-sm mb-6">Turn every workout into competition. Log effort. Earn XP. Climb the leaderboard.</p>
            
            {/* Primary CTA */}
            <button 
              onClick={handleNewUser}
              className="inline-block px-10 py-4 rounded-lg font-bold text-base transition-all duration-200 hover:scale-105 active:scale-97"
              style={{ 
                background: 'linear-gradient(135deg, #facc15 0%, #eab308 100%)',
                boxShadow: '0 4px 30px rgba(250, 204, 21, 0.5)',
                color: '#000'
              }}
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
                className="p-4 rounded-xl transition-all duration-200 hover:-translate-y-1"
                style={{ 
                  background: stat.highlight 
                    ? 'linear-gradient(135deg, rgba(250, 204, 21, 0.15) 0%, rgba(30, 30, 30, 1) 100%)'
                    : 'linear-gradient(135deg, rgba(20, 20, 20, 1) 0%, rgba(30, 30, 30, 1) 100%)',
                  border: stat.highlight ? '1px solid rgba(250, 204, 21, 0.5)' : '1px solid #333333',
                  boxShadow: stat.highlight 
                    ? '0 8px 30px rgba(250, 204, 21, 0.25)'
                    : '0 4px 15px rgba(0, 0, 0, 0.4)',
                  transform: hovering === `stat-${i}` ? 'translateY(-4px)' : 'translateY(0)'
                }}
                onMouseEnter={() => setHovering(`stat-${i}`)}
                onMouseLeave={() => setHovering(null)}
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
          <div 
            className="relative h-32 mb-6 rounded-xl overflow-hidden"
            style={{ 
              backgroundImage: 'url(/images/stats-bg.jpg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />

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
                className="p-4 rounded-xl flex items-center justify-between transition-all duration-200"
                style={{ 
                  background: 'rgba(30, 30, 30, 1)',
                  border: '1px solid #333333',
                  transform: hovering === `feature-${i}` ? 'translateX(4px)' : 'translateX(0)'
                }}
                onMouseEnter={() => setHovering(`feature-${i}`)}
                onMouseLeave={() => setHovering(null)}
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 flex items-center justify-center bg-transparent" dangerouslySetInnerHTML={{ __html: f.icon }} />
                  <div>
                    <div className="text-white font-bold text-sm tracking-wide">{f.title}</div>
                    <div className="text-gray-500 text-xs mt-0.5">{f.desc}</div>
                  </div>
                </div>
                <div 
                  className="text-gray-600 transition-all duration-200"
                  style={{ transform: hovering === `feature-${i}` ? 'translateX(6px)' : 'translateX(0)' }}
                >
                  →
                </div>
              </div>
            ))}
          </div>

          {/* Section break - after features */}
          <div 
            className="relative h-32 mb-6 rounded-xl overflow-hidden"
            style={{ 
              backgroundImage: 'url(/images/features-bg.jpg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          />

          {/* Sign Up Form */}
          <div 
            className="rounded-xl p-5 mb-4 transition-all duration-300"
            style={{ 
              background: 'linear-gradient(135deg, rgba(25, 25, 25, 1) 0%, rgba(35, 35, 35, 1) 100%)',
              border: '1px solid #333333'
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white tracking-wide">NEW PLAYER?</h3>
              <div className="text-xs text-gray-400 font-mono">v2.0</div>
            </div>
            
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Squad code (optional)"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                className="w-full p-3.5 rounded-lg bg-neutral-900 border border-neutral-700 text-white text-sm placeholder-gray-500 transition-all duration-200 focus:border-yellow-400/50 focus:shadow-[0_0_10px_rgba(250,204,21,0.1)]"
              />
              <input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3.5 rounded-lg bg-neutral-900 border border-neutral-700 text-white text-sm placeholder-gray-500 transition-all duration-200 focus:border-yellow-400/50 focus:shadow-[0_0_10px_rgba(250,204,21,0.1)]"
              />
              <button 
                onClick={handleNewUser}
                className="w-full py-3.5 rounded-lg font-bold text-sm uppercase tracking-wider transition-all duration-200 hover:scale-[1.02] active:scale-[0.97]"
                style={{ 
                  background: 'linear-gradient(135deg, #facc15 0%, #eab308 100%)',
                  boxShadow: '0 4px 20px rgba(250, 204, 21, 0.4)',
                  color: '#000'
                }}
              >
                Start Competing
              </button>
              
              {/* Microcopy */}
              <p className="text-center text-gray-600 text-xs mt-2">
                Join your squad and start climbing today
              </p>
            </div>
          </div>

          {/* Bottom */}
          <p className="text-center text-gray-600 text-sm">
            Already competing?{' '}
            <button onClick={handleSignIn} className="text-yellow-400 hover:underline font-semibold">
              Sign In
            </button>
          </p>
        </div>
      </main>
    </div>
  );
}