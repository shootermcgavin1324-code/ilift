'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Onboarding() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [groupCode, setGroupCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Additional fields
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
    
    setLoading(true);
    setError('');
    
    // Save onboarding data
    localStorage.setItem('ilift_email', email.trim());
    localStorage.setItem('ilift_onboarding', 'true');
    localStorage.setItem('ilift_onboarding_data', JSON.stringify({
      name: name.trim(),
      groupCode: groupCode || 'TEST',
      fitnessGoal,
      experience
    }));
    
    setTimeout(() => {
      router.push('/dashboard');
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-sm mx-auto pt-8">
        {/* Progress */}
        <div className="flex gap-2 mb-8">
          {[1, 2, 3].map(i => (
            <div key={i} className={`h-2 flex-1 rounded-full ${i <= step ? 'bg-yellow-400' : 'bg-gray-700'}`} />
          ))}
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <h1 className="text-3xl font-black">Let's get started</h1>
            <p className="text-gray-400">Create your profile</p>
            
            <input
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-4 rounded-xl bg-gray-900 border border-gray-700 text-white"
            />
            <input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 rounded-xl bg-gray-900 border border-gray-700 text-white"
            />
            <input
              type="text"
              placeholder="Squad code (optional)"
              value={groupCode}
              onChange={(e) => setGroupCode(e.target.value.toUpperCase())}
              className="w-full p-4 rounded-xl bg-gray-900 border border-gray-700 text-white"
            />
            
            {error && <p className="text-red-400 text-sm">{error}</p>}
            
            <button onClick={next} className="w-full py-4 bg-yellow-400 rounded-xl font-black text-black">
              Continue →
            </button>
          </div>
        )}

        {step === 2 && (
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
                    : 'bg-gray-800 border border-gray-700 text-white hover:border-yellow-400'
                }`}
              >
                {goal}
              </button>
            ))}
            
            <button onClick={back} className="text-gray-400 text-sm">← Back</button>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h1 className="text-3xl font-black">Your experience</h1>
            <p className="text-gray-400">This helps us customize your experience</p>
            
            {[
              { id: 'beginner', label: 'Beginner', desc: '0-1 years' },
              { id: 'intermediate', label: 'Intermediate', desc: '2-4 years' },
              { id: 'advanced', label: 'Advanced', desc: '5+ years' },
            ].map(exp => (
              <button
                key={exp.id}
                onClick={() => { setExperience(exp.label); handleSubmit(); }}
                className={`w-full p-4 rounded-xl text-left transition-all ${
                  experience === exp.label
                    ? 'bg-yellow-400 text-black' 
                    : 'bg-gray-800 border border-gray-700 text-white hover:border-yellow-400'
                }`}
              >
                <span className="font-bold">{exp.label}</span>
                <span className="text-sm ml-2 opacity-70">({exp.desc})</span>
              </button>
            ))}
            
            <button onClick={back} className="text-gray-400 text-sm">← Back</button>
          </div>
        )}
      </div>
    </div>
  );
}
