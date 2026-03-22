'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getUser } from '@/lib/data';
import { hasCompletedOnboarding, saveLocalUser } from '@/lib/storage';

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (hasCompletedOnboarding()) {
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
      const user = await getUser(email.trim());
      
      if (!user.email) {
        setError('No account found. Sign up first.');
        setLoading(false);
        return;
      }
      
      saveLocalUser(user);
      router.push('/dashboard');
      
    } catch (err) {
      setError('Something went wrong. Try again.');
    }
    
    setLoading(false);
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
          onClick={() => router.push('/')} 
          className="text-gray-500 hover:text-yellow-400 text-sm font-medium transition-all"
        >
          Create Account
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-6 pb-24 relative z-10">
        <div className="max-w-sm w-full">
          
          {/* Headline */}
          <div className="text-center mb-8">
            <h1 className="text-5xl font-black leading-none mb-4 tracking-tight">
              WELCOME<br/>
              <span className="text-yellow-400" style={{ textShadow: '0 0 40px rgba(250, 204, 21, 0.6)' }}>BACK</span>
            </h1>
            <p className="text-gray-400 text-lg">Pick up where you left off. Let's see where you rank.</p>
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
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password"
                className="w-full p-4 rounded-xl bg-neutral-900 border border-neutral-800 text-white placeholder-gray-600 transition-all duration-200 focus:border-yellow-400/50 focus:shadow-[0_0_15px_rgba(250,204,21,0.15)]"
                style={{ boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)' }}
              />
            </div>
            
            {error && (
              <p className="text-gray-400 text-sm bg-neutral-900/50 p-3 rounded-lg border border-neutral-800">
                {error}
              </p>
            )}
            
            <button 
              onClick={handleSignIn}
              disabled={loading}
              className="w-full py-4 rounded-xl font-bold text-black text-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.97] disabled:opacity-50"
              style={{ 
                background: 'linear-gradient(135deg, #facc15 0%, #eab308 100%)',
                boxShadow: '0 4px 25px rgba(250, 204, 21, 0.5)'
              }}
            >
              {loading ? 'Entering...' : 'Enter Arena'}
            </button>
          </div>

          {/* Secondary Actions */}
          <div className="mt-6 text-center space-y-2">
            <button className="text-gray-600 text-sm hover:text-gray-400 transition-colors">
              Forgot password?
            </button>
            <p className="text-gray-500 text-sm">
              New here?{' '}
              <button onClick={() => router.push('/')} className="text-yellow-400 hover:underline font-semibold">
                Create account
              </button>
            </p>
          </div>
          
        </div>
      </main>
    </div>
  );
}