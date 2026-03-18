'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If already logged in, go to dashboard
    const hasOnboarding = localStorage.getItem('ilift_onboarding');
    const savedEmail = localStorage.getItem('ilift_email');
    if (hasOnboarding && savedEmail) {
      router.push('/dashboard');
    }
  }, [router]);

  const handleSignIn = () => {
    if (!email.trim()) {
      alert('Please enter your email');
      return;
    }
    
    // Save email and go to dashboard - it will fetch your data
    localStorage.setItem('ilift_email', email.trim());
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6 flex flex-col">
      <button onClick={() => router.push('/')} className="text-gray-400 text-sm mb-8">
        ← Back
      </button>

      <div className="max-w-sm mx-auto flex-1">
        <h1 className="text-4xl font-black mb-2">WELCOME<br/>BACK</h1>
        <p className="text-gray-400 mb-8">Sign in to continue training</p>
        
        <div className="space-y-4">
          <div>
            <label className="text-gray-400 text-sm">Your email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full p-4 rounded-xl bg-gray-900 border border-gray-700 text-white mt-1"
            />
          </div>
          
          <button 
            onClick={handleSignIn}
            className="w-full py-4 bg-yellow-400 rounded-xl font-black text-black text-lg"
          >
            SIGN IN →
          </button>
        </div>

        <p className="text-center text-gray-500 text-sm mt-8">
          New user? <span onClick={() => router.push('/')} className="text-yellow-400">Sign up instead</span>
        </p>
      </div>
    </div>
  );
}
