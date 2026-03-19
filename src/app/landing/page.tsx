'use client';

export const dynamic = 'force-dynamic';

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
    // Save for onboarding
    if (email) localStorage.setItem('ilift_pending_email', email);
    if (code) localStorage.setItem('ilift_pending_code', code.toUpperCase());
    router.push('/onboarding');
  };

  const handleSignIn = () => {
    // Go to dedicated sign in page
    router.push('/signin');
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      {/* Header */}
      <header className="p-6">
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

          {/* SIGN UP SECTION */}
          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-700 mb-4">
            <h3 className="text-xl font-black text-white mb-4">NEW USER? JOIN A SQUAD</h3>
            
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Squad code"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                className="w-full p-3 rounded-lg bg-gray-950 border bg-gray-600 text-white"
              />
              <input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 rounded-lg bg-gray-950 border bg-gray-600 text-white"
              />
              <button 
                onClick={handleNewUser}
                className="w-full py-3 bg-yellow-400 rounded-lg font-black text-white"
              >
                SIGN UP →
              </button>
            </div>
          </div>

          {/* SIGN IN SECTION */}
          <button 
            onClick={handleSignIn}
            className="w-full py-4 bg-gray-950 rounded-2xl font-bold text-white border bg-gray-600 hover:border-yellow-400"
          >
            ALREADY A MEMBER? SIGN IN →
          </button>
        </div>
      </main>
    </div>
  );
}
