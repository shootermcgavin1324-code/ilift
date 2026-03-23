'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { icons } from '@/lib/icons';
import { hasCompletedOnboarding, getPendingEmail, getPendingCode, clearPendingEmail, clearPendingCode, setOnboardingComplete, getLocalUser, saveLocalUser, createUser, setFitnessGoal, setExperience } from '@/lib/storage';

export default function Onboarding() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState(() => {
    if (typeof window !== 'undefined') {
      const pending = getPendingEmail();
      return pending || '';
    }
    return '';
  });
  const [groupCode, setGroupCode] = useState(() => {
    if (typeof window !== 'undefined') {
      const pending = getPendingCode();
      return pending || '';
    }
    return '';
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [animating, setAnimating] = useState(false);
  
  // Stats (for future use)
  const [_weight, setWeight] = useState(150);
  const [_height, setHeight] = useState(70);
  const [_bodyFat, setBodyFat] = useState<number | ''>('');
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
  }, [router]);

  useEffect(() => {
    // Clear pending values after first render
    clearPendingEmail();
    clearPendingCode();
  }, []);

  const goToStep = (newStep: number) => {
    setAnimating(true);
    setTimeout(() => {
      setStep(newStep);
      setAnimating(false);
    }, 150);
  };

  const handleComplete = async () => {
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const user = createUser({
        email,
        name: name.trim(),
        total_xp: 0,
        streak: 0,
        badges: [],
        group_id: groupCode || 'TEST',
      });

      clearPendingEmail();
      clearPendingCode();
      setOnboardingComplete();
      
      // Save fitness goal and experience from onboarding state
      if (fitnessGoal) setFitnessGoal(fitnessGoal);
      if (experience) setExperience(experience);
      
      router.push('/dashboard');
    } catch (err) {
      setError('Something went wrong. Try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-white flex flex-col relative overflow-hidden" style={{ backgroundColor: '#050505' }}>
      
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-neutral-800 z-50">
        <div 
          className="h-full transition-all duration-300"
          style={{ 
            width: `${(step / 6) * 100}%`,
            background: 'linear-gradient(90deg, #facc15, #eab308)',
            boxShadow: '0 0 10px rgba(250, 204, 21, 0.5)'
          }}
        />
      </div>

      {/* Header */}
      <header className="p-6 pt-8 flex justify-between items-center relative z-10">
        <div className="flex items-center gap-3">
          <div className="text-3xl font-black tracking-tighter">
            <span className="text-yellow-400" style={{ textShadow: '0 0 20px rgba(250, 204, 21, 0.6)' }}>i</span>
            <span className="text-white">LIFT</span>
          </div>
        </div>
        <div className="text-gray-500 text-sm font-medium">Step {step} of 6</div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-6 pb-24 relative z-10">
        <div className={`max-w-sm w-full transition-opacity duration-150 ${animating ? 'opacity-0' : 'opacity-100'}`}>
          
          {step === 1 && (
            <div className="text-center">
              <div className="text-6xl mb-6" dangerouslySetInnerHTML={{ __html: icons.xp }} />
              <h2 className="text-4xl font-black mb-4">ENTER<br/><span className="text-yellow-400">THE ARENA</span></h2>
              <p className="text-gray-400 mb-8">Your competitive fitness journey starts now.</p>
              <button 
                onClick={() => goToStep(2)}
                className="px-10 py-4 rounded-xl font-bold text-black bg-yellow-400 hover:bg-yellow-300 transition-all"
              >
                LET'S GO
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-black mb-2">BUILD YOUR<br/><span className="text-yellow-400">PROFILE</span></h2>
                <p className="text-gray-400">What should we call you?</p>
              </div>
              
              <div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="w-full p-4 rounded-xl bg-neutral-900 border border-neutral-800 text-white placeholder-gray-600 focus:border-yellow-400/50"
                />
              </div>

              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  className="w-full p-4 rounded-xl bg-neutral-900 border border-neutral-800 text-white placeholder-gray-600 focus:border-yellow-400/50"
                />
              </div>

              <button 
                onClick={() => goToStep(3)}
                disabled={!name.trim()}
                className="w-full py-4 rounded-xl font-bold text-black bg-yellow-400 hover:bg-yellow-300 transition-all disabled:opacity-50"
              >
                CONTINUE
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-black mb-2">TRAINING<br/><span className="text-yellow-400">GOAL</span></h2>
                <p className="text-gray-400">What are you working toward?</p>
              </div>
              
              <div className="space-y-3">
                {[
                  { id: 'strength', label: 'Build Strength', icon: '💪' },
                  { id: 'muscle', label: 'Build Muscle', icon: '🏋️' },
                  { id: 'endurance', label: 'Build Endurance', icon: '🏃' },
                  { id: 'weight', label: 'Lose Weight', icon: '⚖️' },
                ].map((goal) => (
                  <button
                    key={goal.id}
                    onClick={() => { setFitnessGoal(goal.id); goToStep(4); }}
                    className="w-full p-4 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-yellow-400/50 hover:bg-neutral-800 transition-all flex items-center gap-4"
                  >
                    <span className="text-2xl">{goal.icon}</span>
                    <span className="font-bold">{goal.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-black mb-2">KNOW YOUR<br/><span className="text-yellow-400">LEVEL</span></h2>
                <p className="text-gray-400">Your experience helps us calibrate.</p>
              </div>
              
              <div className="space-y-3">
                {[
                  { id: 'beginner', label: 'Beginner', desc: 'Less than 1 year' },
                  { id: 'intermediate', label: 'Intermediate', desc: '1-3 years' },
                  { id: 'advanced', label: 'Advanced', desc: '3-5 years' },
                  { id: 'expert', label: 'Expert', desc: '5+ years' },
                ].map((level) => (
                  <button
                    key={level.id}
                    onClick={() => { setExperience(level.id); goToStep(5); }}
                    className="w-full p-4 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-yellow-400/50 hover:bg-neutral-800 transition-all text-left"
                  >
                    <div className="font-bold">{level.label}</div>
                    <div className="text-gray-500 text-sm">{level.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-black mb-2">JOIN YOUR<br/><span className="text-yellow-400">SQUAD</span></h2>
                <p className="text-gray-400">Compete with friends. Leave blank to skip.</p>
              </div>
              
              <div>
                <input
                  type="text"
                  value={groupCode}
                  onChange={(e) => setGroupCode(e.target.value.toUpperCase())}
                  placeholder="SQUAD CODE"
                  maxLength={6}
                  className="w-full p-4 rounded-xl bg-neutral-900 border border-neutral-800 text-white text-center text-2xl font-bold tracking-widest placeholder-gray-600 focus:border-yellow-400/50"
                />
              </div>

              <button 
                onClick={() => goToStep(6)}
                className="w-full py-4 rounded-xl font-bold text-black bg-yellow-400 hover:bg-yellow-300 transition-all"
              >
                {groupCode ? 'JOIN SQUAD' : 'SKIP'}
              </button>
            </div>
          )}

          {step === 6 && (
            <div className="text-center space-y-6">
              <div className="text-6xl">🎮</div>
              <h2 className="text-4xl font-black">YOU&apos;RE<br/><span className="text-yellow-400">IN</span></h2>
              <p className="text-gray-400">Ready to outwork everyone?</p>
              
              {/* Player Card Preview */}
              <div className="p-6 rounded-xl bg-neutral-900 border border-yellow-500/30" style={{ boxShadow: '0 0 30px rgba(250, 204, 21, 0.2)' }}>
                <div className="text-yellow-400 font-black text-2xl mb-2">{name.toUpperCase()}</div>
                <div className="flex justify-center gap-6 text-sm">
                  <div>
                    <div className="text-gray-500">XP</div>
                    <div className="font-bold">0</div>
                  </div>
                  <div>
                    <div className="text-gray-500">STREAK</div>
                    <div className="font-bold">0</div>
                  </div>
                  <div>
                    <div className="text-gray-500">RANK</div>
                    <div className="font-bold">#--</div>
                  </div>
                </div>
              </div>

              {error && (
                <p className="text-red-400 text-sm">{error}</p>
              )}
              
              <button 
                onClick={handleComplete}
                disabled={loading}
                className="w-full py-4 rounded-xl font-bold text-black bg-yellow-400 hover:bg-yellow-300 transition-all disabled:opacity-50"
              >
                {loading ? 'ENTERING...' : 'ENTER ARENA'}
              </button>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
