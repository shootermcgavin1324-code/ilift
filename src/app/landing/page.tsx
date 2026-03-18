'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Landing() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');

  useEffect(() => {
    // Check if already logged in (has completed onboarding)
    const hasOnboarding = localStorage.getItem('ilift_onboarding');
    const email = localStorage.getItem('ilift_email');
    if (hasOnboarding && email) {
      router.push('/dashboard');
    }
  }, [router]);

  const handleStart = () => {
    // Check if already logged in
    const hasOnboarding = localStorage.getItem('ilift_onboarding');
    const email = localStorage.getItem('ilift_email');
    if (hasOnboarding && email) {
      router.push('/dashboard');
      return;
    }
    
    // New user - go to onboarding
    if (email) localStorage.setItem('ilift_pending_email', email);
    if (code) localStorage.setItem('ilift_pending_code', code.toUpperCase());
    router.push('/onboarding');
  };

  const handleSignIn = () => {
    const hasOnboarding = localStorage.getItem('ilift_onboarding');
    const email = localStorage.getItem('ilift_email');
    if (hasOnboarding && email) {
      router.push('/dashboard');
    } else {
      router.push('/onboarding');
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      {/* Header */}
      <header className="p-6 flex justify-between items-center">
        <h1 className="text-3xl font-black"><span className="text-yellow-400">i</span>LIFT</h1>
      </header>

      {/* Main */}
      <main className="flex-1 px-6 pb-20">
        <div className="max-w-sm mx-auto">
          {/* Hero */}
          <div className="text-center py-8">
            <h2 className="text-5xl font-black mb-4">TRAIN<br/><span className="text-yellow-400">TOGETHER</span></h2>
            <p className="text-gray-400 text-lg">Compete with friends — even when you train alone.</p>
          </div>

          {/* Form */}
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Squad code (optional)"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              className="w-full p-4 rounded-xl bg-gray-900 border border-gray-700 text-white"
            />
            <input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 rounded-xl bg-gray-900 border border-gray-700 text-white"
            />
            <button 
              onClick={handleStart}
              className="w-full py-4 bg-yellow-400 rounded-xl font-black text-black text-xl"
            >
              GET STARTED →
            </button>
          </div>

          <p className="text-center text-gray-500 text-sm mt-6">
            Already have an account? <span onClick={handleSignIn} className="text-yellow-400">Sign in</span>
          </p>
        </div>
      </main>
    </div>
  );
}
