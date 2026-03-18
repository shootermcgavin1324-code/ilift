'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Landing() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');

  const handleJoin = () => {
    // Store temp user and redirect
    localStorage.setItem('ilift_user', JSON.stringify({ name: '', email, totalXP: 0, streak: 0, badges: [] }));
    router.push('/onboarding');
  };

  const handleEnter = () => {
    router.push('/');
  };

  return (
    <>
      <style>{`
        @keyframes float {
          0% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-pulse { animation: pulse 2s ease-in-out infinite; }
      `}</style>
      
      <div className="min-h-screen bg-gray-950 text-white overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-64 h-64 bg-yellow-400/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
        </div>

        {/* Header */}
        <header className="relative z-10 flex justify-between items-center p-6">
          <h1 className="text-2xl font-black">
            <span className="text-yellow-400">i</span>LIFT
          </h1>
          <div className="flex gap-4">
            <a href="/trading" className="text-gray-400 hover:text-white font-bold text-sm">
              Trading
            </a>
            <button 
              onClick={handleEnter}
              className="text-gray-400 hover:text-white font-bold"
            >
              Enter →
            </button>
          </div>
        </header>

        {/* Hero */}
        <main className="relative z-10 px-6 pt-8 pb-24">
          {/* App Preview Mockup */}
          <div className="max-w-md mx-auto mb-12">
            <div className="bg-gray-900 rounded-3xl border border-gray-800 p-4 shadow-2xl">
              {/* Fake iPhone Notch */}
              <div className="flex justify-center mb-2">
                <div className="w-20 h-6 bg-gray-800 rounded-full"></div>
              </div>
              
              {/* Fake App UI */}
              <div className="bg-gray-900 rounded-2xl overflow-hidden">
                <div className="bg-gradient-to-br from-yellow-400/20 to-orange-400/10 p-4 text-center">
                  <p className="text-gray-400 text-xs">Your Rank Today</p>
                  <p className="text-5xl font-black text-yellow-400">#2</p>
                  <p className="text-gray-500 text-sm mt-2">250 XP today</p>
                </div>
                
                <div className="p-4 space-y-2">
                  {['🥇 Brenlee  245 XP', '🥈 You      220 XP', '🥉 Taurus   180 XP'].map((entry, i) => (
                    <div key={i} className="flex justify-between text-sm py-2 border-b border-gray-800">
                      <span className={i === 1 ? 'text-yellow-400 font-bold' : 'text-gray-400'}>{entry}</span>
                    </div>
                  ))}
                </div>
                
                <div className="p-4">
                  <button className="w-full py-3 bg-yellow-400 rounded-xl font-black text-black">
                    + LOG WORKOUT
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Headline */}
          <div className="text-center mb-8">
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              Train Together.<br/>
              <span className="text-yellow-400">Compete Forever.</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-md mx-auto">
              The fitness app where effort beats absolute strength. Compete with friends—even when you train alone.
            </p>
          </div>

          {/* Features */}
          <div className="max-w-md mx-auto space-y-4 mb-12">
            <div className="flex items-center gap-4 bg-gray-900/50 rounded-xl p-4 border border-gray-800">
              <div className="text-3xl">⚖️</div>
              <div>
                <p className="font-bold text-white">Fair Competition</p>
                <p className="text-gray-400 text-sm">RPE-based scoring means anyone can win</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 bg-gray-900/50 rounded-xl p-4 border border-gray-800">
              <div className="text-3xl">🔥</div>
              <div>
                <p className="font-bold text-white">Streaks & Levels</p>
                <p className="text-gray-400 text-sm">Build habits, earn badges, level up</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 bg-gray-900/50 rounded-xl p-4 border border-gray-800">
              <div className="text-3xl">🏆</div>
              <div>
                <p className="font-bold text-white">Daily Battles</p>
                <p className="text-gray-400 text-sm">See where you rank every single day</p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="max-w-md mx-auto">
            <div className="bg-gray-900 rounded-2xl border border-gray-700 p-6">
              <p className="text-center text-white font-bold mb-4">Join Your Squad</p>
              
              <input
                type="text"
                placeholder="Group code (from friend)"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                className="w-full p-4 rounded-xl bg-gray-800 border border-gray-700 text-white mb-3 focus:border-yellow-400 focus:outline-none"
              />
              
              <input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-4 rounded-xl bg-gray-800 border border-gray-700 text-white mb-4 focus:border-yellow-400 focus:outline-none"
              />
              
              <button 
                onClick={handleJoin}
                className="w-full py-4 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl font-black text-black text-lg shadow-lg shadow-yellow-400/30"
              >
                START COMPETING →
              </button>
            </div>
            
            <p className="text-center text-gray-500 text-sm mt-6">
              Already have an account? <button onClick={handleEnter} className="text-yellow-400 font-bold">Sign in</button>
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
