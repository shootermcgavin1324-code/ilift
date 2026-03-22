'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createUser } from '@/lib/data';
import { icons } from '@/lib/icons';
import { hasCompletedOnboarding, getPendingEmail, getPendingCode, clearPendingEmail, clearPendingCode, setOnboardingComplete, getLocalUser } from '@/lib/storage';

export default function Onboarding() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [groupCode, setGroupCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [animating, setAnimating] = useState(false);
  
  // Stats
  const [weight, setWeight] = useState(150);
  const [height, setHeight] = useState(70);
  const [bodyFat, setBodyFat] = useState<number | ''>('');
  const [fitnessGoal, setFitnessGoal] = useState('');
  const [experience, setExperience] = useState('');

  useEffect(() => {
    // Check if already onboarded
    if (hasCompletedOnboarding()) {
      const user = getLocalUser();
      if (user?.email) {
        router.push('/dashboard');
        return;
      }
    }
    
    // Get pending values from landing page
    const pendingEmail = getPendingEmail();
    const pendingCode = getPendingCode();
    if (pendingEmail) setEmail(pendingEmail);
    if (pendingCode) setGroupCode(pendingCode);
  }, [router]);

  const goToStep = (newStep: number) => {
    setAnimating(true);
    setTimeout(() => {
      setStep(newStep);
      setAnimating(false);
    }, 150);
  };

  const next = () => {
    if (step < 5) {
      goToStep(step + 1);
    }
  };
  
  const back = () => {
    if (step > 1) {
      goToStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }
    if (!email.trim()) {
      setError('Please enter your email');
      return;
    }
    if (!password) {
      setError('Please create a password');
      return;
    }
    if (password.length < 4) {
      setError('Password must be at least 4 characters');
      return;
    }
    
    setLoading(true);
    setError('');
    
    const userData = {
      email: email.trim(),
      name: name.trim(),
      total_xp: 0,
      streak: 0,
      badges: [],
      group_id: groupCode || 'GOOP',
      onboarding: {
        name: name.trim(),
        groupCode: groupCode || 'GOOP',
        weight,
        height,
        bodyFat: bodyFat || undefined,
        fitnessGoal,
        experience
      }
    };
    
    // Save using hybrid data layer (localStorage + Supabase)
    await createUser(userData);
    setOnboardingComplete();
    clearPendingEmail();
    clearPendingCode();
    
    // Go to welcome screen instead of directly to dashboard
    setTimeout(() => {
      setStep(6); // Welcome screen
    }, 300);
  };

  const goToDashboard = () => {
    router.push('/dashboard');
  };

  // Styled classes
  const inputClass = "w-full p-4 rounded-xl bg-neutral-900 border border-neutral-800 text-white placeholder-gray-600 transition-all duration-200 focus:border-yellow-400/50 focus:shadow-[0_0_15px_rgba(250,204,21,0.2)]";
  const primaryBtnClass = "w-full py-4 rounded-xl font-bold text-black transition-all duration-200 hover:scale-[1.02] active:scale-[0.97]";
  const optionBtnClass = "w-full p-4 rounded-xl text-left font-semibold transition-all duration-200 border border-neutral-800";

  return (
    <div className="min-h-screen text-white p-8 pb-16" style={{ backgroundColor: '#050505' }}>
      {/* Background grid */}
      <div className="absolute inset-0 pointer-events-none" style={{
        backgroundImage: `linear-gradient(rgba(250, 204, 21, 0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(250, 204, 21, 0.015) 1px, transparent 1px)`,
        backgroundSize: '60px 60px',
        opacity: 0.3
      }} />

      <button 
        onClick={() => router.push('/')} 
        className="text-gray-600 hover:text-yellow-400 text-sm mb-6 transition-colors relative z-10"
      >
        ← Back
      </button>
      
      <div className={`max-w-sm mx-auto transition-all duration-200 ${animating ? 'opacity-0 -translate-y-2' : 'opacity-100'}`}>
        
        {/* Progress label */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-gray-500 font-bold tracking-widest uppercase">Progress</span>
          <span className="text-xs text-yellow-400 font-bold">Step {step > 5 ? 5 : step} of 5</span>
        </div>
        
        {/* Progress bar */}
        <div className="flex gap-2 mb-10">
          {[1, 2, 3, 4, 5].map(i => (
            <div 
              key={i} 
              className="h-1.5 flex-1 rounded-full transition-all duration-500"
              style={{
                background: i <= (step > 5 ? 5 : step) 
                  ? 'linear-gradient(90deg, #facc15, #eab308)' 
                  : '#1a1a1a',
                boxShadow: i === (step > 5 ? 5 : step) ? '0 0 10px rgba(250, 204, 21, 0.4)' : 'none'
              }}
            />
          ))}
        </div>

        {/* STEP 1: CREATE ACCOUNT */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <span dangerouslySetInnerHTML={{ __html: icons.xp }} />
              <span className="text-xs text-gray-500 font-bold tracking-widest">Step 1 of 5</span>
            </div>
            
            <h1 className="text-4xl font-black">ENTER THE ARENA</h1>
            <p className="text-gray-400 text-lg">Create your account and start competing</p>
            
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
              style={{ boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)' }}
            />
            <input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
              style={{ boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)' }}
            />
            <input
              type="password"
              placeholder="Create password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={inputClass}
              style={{ boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)' }}
            />
            <input
              type="text"
              placeholder="Squad code (optional)"
              value={groupCode}
              onChange={(e) => setGroupCode(e.target.value.toUpperCase())}
              className={inputClass}
              style={{ boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)' }}
            />
            
            {error && (
              <p className="text-gray-400 text-sm bg-neutral-900/50 p-3 rounded-lg border border-neutral-800">
                {error}
              </p>
            )}
            
            <button 
              onClick={next} 
              className={primaryBtnClass}
              style={{ 
                background: 'linear-gradient(135deg, #facc15 0%, #eab308 100%)',
                boxShadow: '0 4px 20px rgba(250, 204, 21, 0.4)'
              }}
            >
              Enter Arena →
            </button>
          </div>
        )}

        {/* STEP 2: STATS */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <span dangerouslySetInnerHTML={{ __html: icons.xp }} />
              <span className="text-xs text-gray-500 font-bold tracking-widest">Step 2 of 5</span>
            </div>
            
            <h1 className="text-4xl font-black">BUILD YOUR PROFILE</h1>
            <p className="text-gray-400 text-lg">This helps calculate your performance score</p>
            
            <div>
              <label className="text-gray-500 text-sm ml-1 mb-2 block">Weight (lbs)</label>
              <p className="text-gray-600 text-xs mb-2">Used for fair competition and ranking</p>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(parseInt(e.target.value) || 0)}
                className={inputClass}
                style={{ boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)' }}
              />
            </div>
            
            <div>
              <label className="text-gray-500 text-sm ml-1 mb-2 block">Height (inches)</label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(parseInt(e.target.value) || 0)}
                className={inputClass}
                style={{ boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)' }}
              />
            </div>
            
            <div>
              <label className="text-gray-500 text-sm ml-1 mb-2 block">Body Fat % (optional)</label>
              <input
                type="number"
                value={bodyFat}
                onChange={(e) => setBodyFat(e.target.value ? parseInt(e.target.value) : '')}
                placeholder="e.g. 15"
                className={inputClass}
                style={{ boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.3)' }}
              />
            </div>
            
            <button 
              onClick={next} 
              className={primaryBtnClass}
              style={{ 
                background: 'linear-gradient(135deg, #facc15 0%, #eab308 100%)',
                boxShadow: '0 4px 20px rgba(250, 204, 21, 0.4)'
              }}
            >
              Continue →
            </button>
            
            <button onClick={back} className="text-gray-600 hover:text-gray-400 text-sm w-full">← Back</button>
          </div>
        )}

        {/* STEP 3: GOALS */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <span dangerouslySetInnerHTML={{ __html: icons.rank }} />
              <span className="text-xs text-gray-500 font-bold tracking-widest">Step 3 of 5</span>
            </div>
            
            <h1 className="text-4xl font-black">WHAT ARE YOU TRAINING FOR?</h1>
            <p className="text-gray-400 text-lg">Your goal shapes how you compete</p>
            
            {['Muscle Gain', 'Weight Loss', 'Endurance', 'General Fitness'].map(goal => (
              <button
                key={goal}
                onClick={() => { setFitnessGoal(goal); next(); }}
                className={optionBtnClass}
                style={{
                  background: fitnessGoal === goal 
                    ? 'linear-gradient(135deg, rgba(250, 204, 21, 0.15) 0%, #1a1a1a 100%)' 
                    : '#0f0f0f',
                  border: fitnessGoal === goal ? '1px solid #facc15' : '1px solid #262626',
                  boxShadow: fitnessGoal === goal ? '0 0 20px rgba(250, 204, 21, 0.2)' : 'none'
                }}
              >
                <span className="font-bold" style={{ color: fitnessGoal === goal ? '#facc15' : '#fff' }}>{goal}</span>
              </button>
            ))}
            
            <button onClick={back} className="text-gray-600 hover:text-gray-400 text-sm w-full">← Back</button>
          </div>
        )}

        {/* STEP 4: EXPERIENCE */}
        {step === 4 && (
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <span dangerouslySetInnerHTML={{ __html: icons.squad }} />
              <span className="text-xs text-gray-500 font-bold tracking-widest">Step 4 of 5</span>
            </div>
            
            <h1 className="text-4xl font-black">KNOW YOUR LEVEL</h1>
            <p className="text-gray-400 text-lg">We match you against the right competition</p>
            
            {[
              { id: 'beginner', label: 'Beginner', desc: 'Learning the basics' },
              { id: 'intermediate', label: 'Intermediate', desc: 'Building consistency' },
              { id: 'advanced', label: 'Advanced', desc: 'Competing to win' },
            ].map(exp => (
              <button
                key={exp.id}
                onClick={() => { setExperience(exp.label); next(); }}
                className={optionBtnClass}
                style={{
                  background: experience === exp.label 
                    ? 'linear-gradient(135deg, rgba(250, 204, 21, 0.15) 0%, #1a1a1a 100%)' 
                    : '#0f0f0f',
                  border: experience === exp.label ? '1px solid #facc15' : '1px solid #262626',
                  boxShadow: experience === exp.label ? '0 0 20px rgba(250, 204, 21, 0.2)' : 'none'
                }}
              >
                <div className="flex flex-col items-start">
                  <span className="font-bold" style={{ color: experience === exp.label ? '#facc15' : '#fff' }}>{exp.label}</span>
                  <span className="text-xs text-gray-500">{exp.desc}</span>
                </div>
              </button>
            ))}
            
            <button onClick={back} className="text-gray-600 hover:text-gray-400 text-sm w-full">← Back</button>
          </div>
        )}

        {/* STEP 5: REVIEW */}
        {step === 5 && (
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <span dangerouslySetInnerHTML={{ __html: icons.rank }} />
              <span className="text-xs text-gray-500 font-bold tracking-widest">Step 5 of 5</span>
            </div>
            
            <h1 className="text-4xl font-black">YOU'RE IN</h1>
            <p className="text-gray-400 text-lg">Your squad is waiting. Let's see where you rank.</p>
            
            {/* Player Card */}
            <div className="rounded-xl p-5" style={{ 
              background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 100%)', 
              border: '1px solid #262626',
              boxShadow: '0 4px 30px rgba(0, 0, 0, 0.5)'
            }}>
              <div className="flex items-center justify-between mb-4 pb-3" style={{ borderBottom: '1px solid #262626' }}>
                <span className="text-yellow-400 font-bold">PLAYER CARD</span>
                <span className="text-xs text-gray-500">v2.0</span>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-xs text-gray-500 mb-1">RANK</div>
                  <div className="text-xl font-black text-yellow-400">-</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">XP</div>
                  <div className="text-xl font-black text-white">0</div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">STREAK</div>
                  <div className="text-xl font-black text-white">0</div>
                </div>
              </div>
            </div>
            
            {/* User info */}
            <div className="rounded-xl p-4 space-y-2" style={{ backgroundColor: '#0f0f0f', border: '1px solid #1a1a1a' }}>
              <p className="text-white text-sm"><span className="text-gray-600">Name:</span> {name}</p>
              <p className="text-white text-sm"><span className="text-gray-600">Goal:</span> {fitnessGoal}</p>
              <p className="text-white text-sm"><span className="text-gray-600">Level:</span> {experience}</p>
              <p className="text-white text-sm"><span className="text-gray-600">Squad:</span> {groupCode || 'GOOP'}</p>
            </div>
            
            <div className="flex gap-3">
              <button onClick={back} className="flex-1 py-4 text-gray-600 hover:text-gray-400 font-semibold">← Back</button>
              <button 
                onClick={handleSubmit} 
                disabled={loading} 
                className="flex-1 py-4 rounded-xl font-bold text-black transition-all duration-200 hover:scale-[1.02] active:scale-[0.97] disabled:opacity-50"
                style={{ 
                  background: 'linear-gradient(135deg, #facc15 0%, #eab308 100%)',
                  boxShadow: '0 4px 20px rgba(250, 204, 21, 0.4)'
                }}
              >
                {loading ? 'Creating...' : 'Start Competing'}
              </button>
            </div>
          </div>
        )}

        {/* STEP 6: WELCOME SCREEN */}
        {step === 6 && (
          <div className="space-y-8 text-center py-8">
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{
                background: 'linear-gradient(135deg, #facc15 0%, #eab308 100%)',
                boxShadow: '0 0 40px rgba(250, 204, 21, 0.5)'
              }}>
                <span className="text-4xl" style={{ color: '#000' }}>⚡</span>
              </div>
            </div>
            
            <h1 className="text-5xl font-black">WELCOME TO<br/><span className="text-yellow-400" style={{ textShadow: '0 0 30px rgba(250, 204, 21, 0.6)' }}>ILIFT</span></h1>
            
            <div className="space-y-3 py-4" style={{ borderTop: '1px solid #1a1a1a', borderBottom: '1px solid #1a1a1a' }}>
              <p className="text-xl font-bold text-yellow-400">🏆 You are currently UNRANKED</p>
              <p className="text-gray-400">Log your first workout to enter the leaderboard</p>
            </div>
            
            <button 
              onClick={goToDashboard} 
              className="w-full py-4 rounded-xl font-bold text-black transition-all duration-200 hover:scale-[1.02] active:scale-[0.97]"
              style={{ 
                background: 'linear-gradient(135deg, #facc15 0%, #eab308 100%)',
                boxShadow: '0 4px 25px rgba(250, 204, 21, 0.5)'
              }}
            >
              Log First Workout →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}