'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Onboarding() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [groupCode, setGroupCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Stats
  const [weight, setWeight] = useState(150);
  const [height, setHeight] = useState(70);
  const [bodyFat, setBodyFat] = useState<number | ''>('');
  const [fitnessGoal, setFitnessGoal] = useState('');
  const [experience, setExperience] = useState('');

  useEffect(() => {
    // Check if already logged in
    const existingEmail = localStorage.getItem('ilift_email');
    const hasOnboarding = localStorage.getItem('ilift_onboarding');
    if (existingEmail && hasOnboarding) {
      router.push('/dashboard');
      return;
    }
    
    // Pre-fill from pending
    const pendingEmail = localStorage.getItem('ilift_pending_email');
    const pendingCode = localStorage.getItem('ilift_pending_code');
    if (pendingEmail) setEmail(pendingEmail);
    if (pendingCode) setGroupCode(pendingCode);
  }, [router]);

  const next = () => setStep(step + 1);
  const back = () => setStep(step - 1);

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
    
    // Save to localStorage first, then redirect
    localStorage.setItem('ilift_email', email.trim());
    localStorage.setItem('ilift_password', password);
    localStorage.setItem('ilift_onboarding', 'true');
    localStorage.setItem('ilift_onboarding_data', JSON.stringify({
      name: name.trim(),
      groupCode: groupCode || 'TEST',
      weight,
      height,
      bodyFat: bodyFat || undefined,
      fitnessGoal,
      experience
    }));
    
    // Small delay to ensure localStorage is saved, then redirect
    setTimeout(() => {
      router.push('/dashboard');
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <button onClick={() => router.push('/')} className="text-gray-400 text-sm mb-4">
        ← Back
      </button>
      
      <div className="max-w-sm mx-auto">
        {/* Progress */}
        <div className="flex gap-2 mb-8">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className={`h-2 flex-1 rounded-full ${i <= step ? 'bg-yellow-400' : 'bg-gray-800'}`} />
          ))}
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <h1 className="text-3xl font-black">Create Account</h1>
            <p className="text-gray-400">Set up your login</p>
            
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-4 rounded-xl bg-gray-950 border border-gray-700 text-white"
            />
            <input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 rounded-xl bg-gray-950 border border-gray-700 text-white"
            />
            <input
              type="password"
              placeholder="Create password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 rounded-xl bg-gray-950 border border-gray-700 text-white"
            />
            <input
              type="text"
              placeholder="Squad code (optional)"
              value={groupCode}
              onChange={(e) => setGroupCode(e.target.value.toUpperCase())}
              className="w-full p-4 rounded-xl bg-gray-950 border border-gray-700 text-white"
            />
            
            {error && <p className="text-red-400 text-sm">{error}</p>}
            
            <button onClick={next} className="w-full py-4 bg-yellow-400 rounded-xl font-black text-black">
              Continue →
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h1 className="text-3xl font-black">Your Stats</h1>
            <p className="text-gray-400">Help us personalize your experience</p>
            
            <div>
              <label className="text-gray-400 text-sm">Weight (lbs)</label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(parseInt(e.target.value) || 0)}
                className="w-full p-4 rounded-xl bg-gray-950 border border-gray-700 text-white mt-1"
              />
            </div>
            
            <div>
              <label className="text-gray-400 text-sm">Height (inches)</label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(parseInt(e.target.value) || 0)}
                className="w-full p-4 rounded-xl bg-gray-950 border border-gray-700 text-white mt-1"
              />
            </div>
            
            <div>
              <label className="text-gray-400 text-sm">Body Fat % (optional)</label>
              <input
                type="number"
                value={bodyFat}
                onChange={(e) => setBodyFat(e.target.value ? parseInt(e.target.value) : '')}
                placeholder="e.g. 15"
                className="w-full p-4 rounded-xl bg-gray-950 border border-gray-700 text-white mt-1"
              />
            </div>
            
            <button onClick={next} className="w-full py-4 bg-yellow-400 rounded-xl font-black text-black">
              Continue →
            </button>
            
            <button onClick={back} className="text-gray-400 text-sm">← Back</button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h1 className="text-3xl font-black">What's your goal?</h1>
            <p className="text-gray-400">Choose your fitness focus</p>
            
            {['Muscle Gain', 'Weight Loss', 'Endurance', 'General Fitness'].map(goal => (
              <button
                key={goal}
                onClick={() => { setFitnessGoal(goal); next(); }}
                className={`w-full p-4 rounded-xl text-left font-bold transition-all ${
                  fitnessGoal === goal
                    ? 'bg-yellow-400 text-black' 
                    : 'bg-gray-900 border border-gray-700 text-white hover:border-yellow-400'
                }`}
              >
                {goal}
              </button>
            ))}
            
            <button onClick={back} className="text-gray-400 text-sm">← Back</button>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <h1 className="text-3xl font-black">Your experience</h1>
            <p className="text-gray-400">This helps us customize</p>
            
            {[
              { id: 'beginner', label: 'Beginner', desc: '0-1 years' },
              { id: 'intermediate', label: 'Intermediate', desc: '2-4 years' },
              { id: 'advanced', label: 'Advanced', desc: '5+ years' },
            ].map(exp => (
              <button
                key={exp.id}
                onClick={() => { setExperience(exp.label); next(); }}
                className={`w-full p-4 rounded-xl text-left transition-all ${
                  experience === exp.label
                    ? 'bg-yellow-400 text-black' 
                    : 'bg-gray-900 border border-gray-700 text-white hover:border-yellow-400'
                }`}
              >
                <span className="font-bold">{exp.label}</span>
                <span className="text-sm ml-2 opacity-70">({exp.desc})</span>
              </button>
            ))}
            
            <button onClick={back} className="text-gray-400 text-sm">← Back</button>
          </div>
        )}

        {step === 5 && (
          <div className="space-y-4">
            <h1 className="text-3xl font-black">Ready!</h1>
            <p className="text-gray-400">Review and start competing</p>
            
            <div className="bg-gray-900 rounded-xl p-4 space-y-2">
              <p className="text-white"><span className="text-gray-400">Name:</span> {name}</p>
              <p className="text-white"><span className="text-gray-400">Email:</span> {email}</p>
              <p className="text-white"><span className="text-gray-400">Weight:</span> {weight} lbs</p>
              <p className="text-white"><span className="text-gray-400">Height:</span> {Math.floor(height/12)}'{height%12}"</p>
              {bodyFat && <p className="text-white"><span className="text-gray-400">Body Fat:</span> {bodyFat}%</p>}
              <p className="text-white"><span className="text-gray-400">Goal:</span> {fitnessGoal}</p>
              <p className="text-white"><span className="text-gray-400">Level:</span> {experience}</p>
              <p className="text-white"><span className="text-gray-400">Squad:</span> {groupCode || 'TEST'}</p>
            </div>
            
            <div className="flex gap-2">
              <button onClick={back} className="flex-1 py-4 text-gray-400">← Back</button>
              <button onClick={handleSubmit} disabled={loading} className="flex-1 py-4 bg-yellow-400 rounded-xl font-black text-black disabled:opacity-50">
                {loading ? 'Creating...' : 'START →'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
