'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';

export default function Onboarding() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [groupCode, setGroupCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if already completed
    const userData = localStorage.getItem('ilift_user');
    const hasOnboarding = localStorage.getItem('ilift_onboarding');
    if (userData && hasOnboarding) {
      router.push('/dashboard');
    }
    
    // Pre-fill from pending
    const pendingEmail = localStorage.getItem('ilift_pending_email');
    const pendingCode = localStorage.getItem('ilift_pending_code');
    if (pendingEmail) setEmail(pendingEmail);
    if (pendingCode) setGroupCode(pendingCode);
  }, [router]);

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }
    if (!email.trim()) {
      setError('Please enter your email');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'register', 
          name, 
          email, 
          groupCode: groupCode || 'TEST',
          onboarding: {
            fitness_goal: 'General Fitness',
            weight: 150,
            height: 70,
            age: 25,
            experience: 'Beginner',
            lifting_since: 2024,
            workouts_per_week: 3
          }
        })
      });
      
      const result = await res.json();
      
      if (result.success) {
        localStorage.setItem('ilift_user', JSON.stringify(result.user));
        localStorage.setItem('ilift_group', JSON.stringify(result.group));
        localStorage.setItem('ilift_onboarding', 'true');
        router.push('/dashboard');
      } else {
        setError(result.error || 'Something went wrong');
      }
    } catch (e) {
      setError('Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-sm mx-auto pt-8">
        <h1 className="text-4xl font-black mb-2">
          <span className="text-yellow-400">i</span>LIFT
        </h1>
        <p className="text-gray-400 mb-8">Create your account to start competing</p>
        
        <div className="space-y-4">
          <div>
            <label className="text-gray-400 text-sm">Your Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full p-4 rounded-xl bg-gray-900 border border-gray-700 text-white mt-1"
            />
          </div>
          
          <div>
            <label className="text-gray-400 text-sm">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full p-4 rounded-xl bg-gray-900 border border-gray-700 text-white mt-1"
            />
          </div>
          
          <div>
            <label className="text-gray-400 text-sm">Squad Code (optional)</label>
            <input
              type="text"
              value={groupCode}
              onChange={(e) => setGroupCode(e.target.value.toUpperCase())}
              placeholder="e.g. TEST"
              className="w-full p-4 rounded-xl bg-gray-900 border border-gray-700 text-white mt-1"
            />
          </div>
          
          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}
          
          <button 
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-4 bg-yellow-400 rounded-xl font-black text-black text-lg mt-4 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Start Training →'}
          </button>
        </div>
      </div>
    </div>
  );
}
