'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Landing() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');

  useEffect(() => {
    // Check if already logged in
    const hasOnboarding = localStorage.getItem('ilift_onboarding');
    const email = localStorage.getItem('ilift_email');
    if (hasOnboarding && email) {
      router.push('/dashboard');
    }
  }, [router]);

  const handleNewUser = () => {
    // Save email and code for onboarding
    if (email) localStorage.setItem('ilift_pending_email', email);
    if (code) localStorage.setItem('ilift_pending_code', code.toUpperCase());
    router.push('/onboarding');
  };

  const handleReturningUser = () => {
    // Just go to dashboard - it will fetch your data from Supabase
    router.push('/dashboard');
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

          {/* Two Clear Options */}
          <div className="space-y-4">
            {/* NEW USER */}
            <div className="bg-gray-900 rounded-xl p-4 border border-gray-700">
              <h3 className="font-bold text-white mb-3">New User?</h3>
              <input
                type="text"
                placeholder="Squad code (optional)"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                className="w-full p-3 rounded-lg bg-gray-800 border border-gray-600 text-white mb-2"
              />
              <input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 rounded-lg bg-gray-800 border border-gray-600 text-white mb-3"
              />
              <button 
                onClick={handleNewUser}
                className="w-full py-3 bg-yellow-400 rounded-lg font-black text-black"
              >
                Create Account →
              </button>
            </div>

            {/* RETURNING USER */}
            <button 
              onClick={handleReturningUser}
              className="w-full py-4 bg-gray-800 rounded-xl font-bold text-white border border-gray-600 hover:border-yellow-400"
            >
              Already have an account? Sign In →
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
