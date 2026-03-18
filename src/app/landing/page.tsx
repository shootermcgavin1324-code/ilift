'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Scale, Flame, Trophy, TrendingUp, ArrowRight } from 'lucide-react';

export default function Landing() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');

  useEffect(() => {
    // Check if already logged in - redirect to dashboard
    const userData = localStorage.getItem('ilift_user');
    const hasOnboarding = localStorage.getItem('ilift_onboarding');
    if (userData) {
      if (hasOnboarding) {
        router.push('/dashboard');
      } else {
        router.push('/onboarding');
      }
    }
  }, [router]);

  const handleJoin = () => {
    // Check if already logged in
    const userData = localStorage.getItem('ilift_user');
    const hasOnboarding = localStorage.getItem('ilift_onboarding');
    if (userData && hasOnboarding) {
      router.push('/dashboard');
      return;
    }
    
    // Store email and code to pass to onboarding
    if (email) localStorage.setItem('ilift_pending_email', email);
    if (code) localStorage.setItem('ilift_pending_code', code.toUpperCase());
    router.push('/onboarding');
  };

  const handleEnter = () => {
    // Check if already logged in
    const userData = localStorage.getItem('ilift_user');
    const hasOnboarding = localStorage.getItem('ilift_onboarding');
    if (userData) {
      if (hasOnboarding) {
        router.push('/dashboard');
      } else {
        router.push('/onboarding');
      }
    } else {
      // Stay on landing, focus email input
      document.getElementById('email-input')?.focus();
    }
  };

  return (
    <>
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        @keyframes pulse-soft {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 20px rgba(250, 204, 20, 0.2); }
          50% { box-shadow: 0 0 40px rgba(250, 204, 20, 0.4); }
        }
        .animate-float { animation: float 4s ease-in-out infinite; }
        .animate-pulse-soft { animation: pulse-soft 3s ease-in-out infinite; }
        .animate-slide-up { animation: slide-up 0.6s ease-out forwards; }
        .animate-glow { animation: glow 2s ease-in-out infinite; }
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
      `}</style>
      
      <div className="min-h-screen bg-gray-950 text-white overflow-hidden relative">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-yellow-400/10 rounded-full blur-[100px] animate-pulse-soft"></div>
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-[80px] animate-pulse-soft delay-200"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-yellow-400/5 rounded-full blur-[120px]"></div>
        </div>

        {/* Header */}
        <header className="relative z-10 flex justify-between items-center px-6 py-5">
          <h1 className="text-3xl font-black tracking-tight">
            <span className="text-yellow-400">i</span>LIFT
          </h1>
          <div className="flex gap-4">
            <button 
              onClick={handleEnter}
              className="text-gray-400 hover:text-white font-semibold transition-colors"
            >
              Sign In
            </button>
          </div>
        </header>

        {/* Hero */}
        <main className="relative z-10 px-6 pt-4 pb-16">
          {/* App Preview Mockup */}
          <div className="max-w-sm mx-auto mb-10 animate-slide-up">
            <div className="bg-gray-900/80 backdrop-blur-xl rounded-3xl border border-gray-800/50 p-3 shadow-2xl shadow-black/50">
              {/* Fake iPhone Notch */}
              <div className="flex justify-center mb-2">
                <div className="w-24 h-7 bg-gray-800 rounded-full"></div>
              </div>
              
              {/* Fake App UI */}
              <div className="bg-gray-900 rounded-2xl overflow-hidden">
                <div className="bg-gradient-to-br from-yellow-400/20 via-orange-400/10 to-transparent p-5 text-center border-b border-gray-800">
                  <p className="text-gray-400 text-xs uppercase tracking-widest mb-1">Your Rank Today</p>
                  <p className="text-6xl font-black text-yellow-400 drop-shadow-lg">#2</p>
                  <p className="text-gray-500 text-sm mt-2 font-medium">250 XP today</p>
                </div>
                
                <div className="p-3 space-y-1">
                  {[
                    { rank: '🥇', name: 'Brenlee', xp: '245', you: false },
                    { rank: '🥈', name: 'You', xp: '220', you: true },
                    { rank: '🥉', name: 'Taurus', xp: '180', you: false },
                  ].map((entry, i) => (
                    <div key={i} className={`flex items-center justify-between py-2 px-2 rounded-lg ${entry.you ? 'bg-yellow-400/10 border border-yellow-400/30' : ''}`}>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{entry.rank}</span>
                        <span className={`font-bold ${entry.you ? 'text-yellow-400' : 'text-gray-300'}`}>{entry.name}</span>
                      </div>
                      <span className={`font-black ${entry.you ? 'text-yellow-400' : 'text-gray-400'}`}>{entry.xp}</span>
                    </div>
                  ))}
                </div>
                
                <div className="p-3 border-t border-gray-800">
                  <button className="w-full py-3 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl font-black text-black shadow-lg shadow-yellow-400/25">
                    + LOG WORKOUT
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Headline */}
          <div className="text-center mb-8 animate-slide-up delay-100">
            <h2 className="text-4xl md:text-5xl font-black mb-4 leading-tight">
              Train Together.<br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">Compete Forever.</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-sm mx-auto leading-relaxed">
              The fitness app where effort beats absolute strength. Compete with friends—even when you train alone.
            </p>
          </div>

          {/* Features */}
          <div className="max-w-md mx-auto space-y-3 mb-10 animate-slide-up delay-200">
            <div className="flex items-center gap-4 bg-gray-900/60 backdrop-blur rounded-2xl p-4 border border-gray-800/50">
              <div className="w-12 h-12 rounded-xl bg-yellow-400/10 flex items-center justify-center"><Scale size={24} className="text-yellow-400" /></div>
              <div>
                <p className="font-bold text-white">Fair Competition</p>
                <p className="text-gray-500 text-sm">RPE-based scoring means anyone can win</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 bg-gray-900/60 backdrop-blur rounded-2xl p-4 border border-gray-800/50">
              <div className="w-12 h-12 rounded-xl bg-orange-400/10 flex items-center justify-center"><Flame size={24} className="text-orange-400" /></div>
              <div>
                <p className="font-bold text-white">Streaks & Levels</p>
                <p className="text-gray-500 text-sm">Build habits, earn badges, level up</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 bg-gray-900/60 backdrop-blur rounded-2xl p-4 border border-gray-800/50">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center"><Trophy size={24} className="text-purple-400" /></div>
              <div>
                <p className="font-bold text-white">Daily Battles</p>
                <p className="text-gray-500 text-sm">See where you rank every single day</p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="max-w-md mx-auto animate-slide-up delay-300">
            <div className="bg-gray-900/80 backdrop-blur rounded-2xl border border-gray-800/50 p-6 shadow-xl">
              <p className="text-center text-white font-bold mb-4">Join Your Squad</p>
              
              <input
                type="text"
                placeholder="Group code (from friend)"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                className="w-full p-4 rounded-xl bg-gray-800/80 border border-gray-700 text-white mb-3 focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/20 transition-all"
              />
              
              <input
                type="email"
                id="email-input"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-4 rounded-xl bg-gray-800/80 border border-gray-700 text-white mb-4 focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/20 transition-all"
              />
              
              <button 
                onClick={handleJoin}
                className="w-full py-4 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl font-black text-lg text-black shadow-xl shadow-yellow-400/20 hover:shadow-yellow-400/40 hover:scale-[1.02] transition-all animate-glow"
              >
                START COMPETING <ArrowRight size={20} className="inline ml-2" />
              </button>
            </div>
            
            <p className="text-center text-gray-500 text-sm mt-6">
              Already have an account? <button onClick={handleEnter} className="text-yellow-400 font-semibold hover:underline">Sign in</button>
            </p>
          </div>
        </main>

        {/* Footer */}
        <footer className="relative z-10 text-center py-6 text-gray-600 text-sm">
          <p>© 2026 iLift. Built for competitors.</p>
        </footer>
      </div>
    </>
  );
}
