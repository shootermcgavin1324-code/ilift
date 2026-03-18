'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // If already logged in, go to dashboard
    const hasOnboarding = localStorage.getItem('ilift_onboarding');
    const savedEmail = localStorage.getItem('ilift_email');
    if (hasOnboarding && savedEmail) {
      router.push('/dashboard');
    }
  }, [router]);

  const handleSignIn = async () => {
    if (!email.trim()) {
      setError('Please enter your email');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Check if user exists in Supabase
      const { data: user, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .eq('email', email.trim())
        .single();
      
      if (fetchError || !user) {
        setError('No account found with this email. Please sign up first.');
        setLoading(false);
        return;
      }
      
      // User exists - save and go to dashboard
      localStorage.setItem('ilift_email', email.trim());
      localStorage.setItem('ilift_onboarding', 'true');
      router.push('/dashboard');
      
    } catch (err) {
      setError('Something went wrong. Please try again.');
    }
    
    setLoading(false);
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
          
          <div>
            <label className="text-gray-400 text-sm">Your password</label>
            <input
              type="password"
              placeholder="Your password"
              className="w-full p-4 rounded-xl bg-gray-900 border border-gray-700 text-white mt-1"
            />
          </div>
          
          {error && <p className="text-red-400 text-sm">{error}</p>}
          
          <button 
            onClick={handleSignIn}
            disabled={loading}
            className="w-full py-4 bg-yellow-400 rounded-xl font-black text-black text-lg disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'SIGN IN →'}
          </button>
        </div>

        <p className="text-center text-gray-500 text-sm mt-8">
          New user? <span onClick={() => router.push('/')} className="text-yellow-400">Sign up instead</span>
        </p>
      </div>
    </div>
  );
}
