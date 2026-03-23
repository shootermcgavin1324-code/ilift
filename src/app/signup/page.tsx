'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { hasCompletedOnboarding, setPendingEmail, setPendingCode } from '@/lib/storage';

export default function SignUp() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');

  useEffect(() => {
    if (hasCompletedOnboarding()) {
      router.push('/dashboard');
    }
  }, [router]);

  const handleSignUp = () => {
    if (email) setPendingEmail(email);
    if (code) setPendingCode(code);
    router.push('/onboarding');
  };

  return (
    <div className="min-h-screen text-white flex flex-col relative overflow-hidden" style={{ backgroundColor: '#050505' }}>
      
      {/* Background grid */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: `linear-gradient(rgba(250, 204, 21, 0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(250, 204, 21, 0.015) 1px, transparent 1px)`,
        backgroundSize: '60px 60px',
        opacity: 0.3
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
        
        <button 
          onClick={() => router.push('/signin')} 
          className="text-gray-500 hover:text-yellow-400 text-sm font-medium transition-all"
        >
          Sign In
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-6 pb-24 relative z-10">
        <div className="max-w-sm w-full">
          
          {/* Headline */}
          <div className="text-center mb-8">
            <h1 className="text-5xl font-black leading-none mb-4 tracking-tight">
              JOIN THE<br/>
              <span className="text-yellow-400" style={{ textShadow: '0 0 40px rgba(250, 204, 21, 0.6)' }}>ARENA</span>
            </h1>
            <p className="text-gray-400 text-lg">Create your account and start competing.</p>
          </div>

          {/* Form */}
          <div className="space-y-4">
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email"
                className="w-full p-4 rounded-xl bg-neutral-900 border border-neutral-800 text-white placeholder-gray-600 transition-all duration-200 focus:border-yellow-400/50 focus:shadow-[0_0_15px_rgba(250,204,21,0.15)]"
                style={{ boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)' }}
              />
            </div>
            
            <div>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="Squad code (optional)"
                maxLength={6}
                className="w-full p-4 rounded-xl bg-neutral-900 border border-neutral-800 text-white placeholder-gray-600 transition-all duration-200 focus:border-yellow-400/50 focus:shadow-[0_0_15px_rgba(250,204,21,0.15)] uppercase"
                style={{ boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)' }}
              />
            </div>
            
            <button 
              onClick={handleSignUp}
              className="w-full py-4 rounded-xl font-bold text-black text-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.97]"
              style={{ 
                background: 'linear-gradient(135deg, #facc15 0%, #eab308 100%)',
                boxShadow: '0 4px 25px rgba(250, 204, 21, 0.5)'
              }}
            >
              Create Account
            </button>
          </div>

          {/* Secondary Actions */}
          <div className="mt-6 text-center">
            <p className="text-gray-500 text-sm">
              Already have an account?{' '}
              <button onClick={() => router.push('/signin')} className="text-yellow-400 hover:underline font-semibold">
                Sign in
              </button>
            </p>
          </div>
          
        </div>
      </main>
    </div>
  );
}
