'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface OnboardingData {
  fitness_goal: string;
  weight: number;
  height: number;
  body_fat?: number;
  age: number;
  experience: string;
  lifting_since: number;
  workouts_per_week: number;
}

// Animations
const styles = `
  @keyframes float {
    0% { transform: translateY(0) scale(1); opacity: 1; }
    50% { transform: translateY(-20px) scale(1.1); opacity: 0.8; }
    100% { transform: translateY(-40px) scale(1); opacity: 0; }
  }
  .animate-float { animation: float 1.5s ease-out forwards; }
`;

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<OnboardingData>({
    fitness_goal: '',
    weight: 150,
    height: 70,
    body_fat: undefined,
    age: 25,
    experience: '',
    lifting_since: 2020,
    workouts_per_week: 3,
  });
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [groupCode, setGroupCode] = useState('');
  const router = useRouter();

  // Pre-fill from localStorage if user exists or from landing page
  useEffect(() => {
    const userData = localStorage.getItem('ilift_user');
    const groupData = localStorage.getItem('ilift_group');
    const hasOnboarding = localStorage.getItem('ilift_onboarding');
    const pendingEmail = localStorage.getItem('ilift_pending_email');
    const pendingCode = localStorage.getItem('ilift_pending_code');
    
    // If already completed onboarding, go to dashboard
    if (userData && hasOnboarding) {
      router.push('/dashboard');
      return;
    }
    
    if (userData) {
      const user = JSON.parse(userData);
      setName(user.name || '');
      setEmail(user.email || '');
    }
    if (groupData) {
      const group = JSON.parse(groupData);
      setGroupCode(group.code || '');
    }
    // Check for pending values from landing page
    if (pendingEmail) {
      setEmail(pendingEmail);
      localStorage.removeItem('ilift_pending_email');
    }
    if (pendingCode) {
      setGroupCode(pendingCode);
      localStorage.removeItem('ilift_pending_code');
    }
  }, []);

  const next = () => setStep(step + 1);
  const back = () => setStep(step - 1);

  const submit = async () => {
    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'register', name, email, groupCode, onboarding: data })
    });
    
    const result = await res.json();
    
    if (result.success) {
      localStorage.setItem('ilift_user', JSON.stringify(result.user));
      localStorage.setItem('ilift_group', JSON.stringify(result.group));
      localStorage.setItem('ilift_onboarding', 'true');
      router.push('/dashboard');
    }
  };

  const goals = ['Muscle Gain', 'Weight Loss', 'Endurance', 'General Fitness'];

  return (
    <>
      <style>{styles}</style>
      <div className="min-h-screen bg-gray-950 text-white p-4">
        <div className="max-w-md mx-auto pt-8">
          {/* Progress */}
          <div className="flex gap-2 mb-8">
            {[1, 2, 3, 4, 5].map(i => (
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
                className="w-full p-4 rounded-xl bg-gray-900 border border-gray-700 text-white focus:border-yellow-400 focus:outline-none"
              />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-4 rounded-xl bg-gray-900 border border-gray-700 text-white focus:border-yellow-400 focus:outline-none"
              />
              <input
                type="text"
                placeholder="Group code (from friend)"
                value={groupCode}
                onChange={(e) => setGroupCode(e.target.value.toUpperCase())}
                className="w-full p-4 rounded-xl bg-gray-900 border border-gray-700 text-white focus:border-yellow-400 focus:outline-none uppercase"
              />
              
              <button onClick={next} disabled={!name || !email} className="w-full py-4 bg-yellow-400 rounded-xl font-black text-black disabled:opacity-50">
                Continue →
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h1 className="text-2xl font-black">What's your goal?</h1>
              <p className="text-gray-400">This helps us personalize your experience</p>
              
              {goals.map(goal => (
                <button
                  key={goal}
                  onClick={() => { setData({ ...data, fitness_goal: goal }); next(); }}
                  className={`w-full p-4 rounded-xl text-left font-bold transition-all ${
                    data.fitness_goal === goal 
                      ? 'bg-yellow-400 text-black' 
                      : 'bg-gray-800 border border-gray-700 text-white hover:border-yellow-400'
                  }`}
                >
                  {goal}
                </button>
              ))}
              
              <button onClick={back} className="w-full py-3 text-gray-400">← Back</button>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h1 className="text-2xl font-black">Your stats</h1>
              <p className="text-gray-400">Help us calculate your progress</p>
              
              <div>
                <label className="text-gray-400 text-sm">Weight (lbs)</label>
                <input
                  type="number"
                  value={data.weight}
                  onChange={(e) => setData({ ...data, weight: parseInt(e.target.value) })}
                  className="w-full p-4 rounded-xl bg-gray-900 border border-gray-700 text-white"
                />
              </div>
              
              <div>
                <label className="text-gray-400 text-sm">Body Fat % (optional)</label>
                <input
                  type="number"
                  placeholder="e.g. 15"
                  value={data.body_fat || ''}
                  onChange={(e) => setData({ ...data, body_fat: e.target.value ? parseInt(e.target.value) : undefined })}
                  className="w-full p-4 rounded-xl bg-gray-900 border border-gray-700 text-white placeholder-gray-600"
                />
              </div>
              
              <div>
                <label className="text-gray-400 text-sm">Height (inches)</label>
                <input
                  type="number"
                  value={data.height}
                  onChange={(e) => setData({ ...data, height: parseInt(e.target.value) })}
                  className="w-full p-4 rounded-xl bg-gray-900 border border-gray-700 text-white"
                />
              </div>
              
              <div>
                <label className="text-gray-400 text-sm">Age</label>
                <input
                  type="number"
                  value={data.age}
                  onChange={(e) => setData({ ...data, age: parseInt(e.target.value) })}
                  className="w-full p-4 rounded-xl bg-gray-900 border border-gray-700 text-white"
                />
              </div>
              
              <div className="flex gap-2">
                <button onClick={back} className="flex-1 py-3 text-gray-400">← Back</button>
                <button onClick={next} className="flex-1 py-3 bg-yellow-400 rounded-xl font-bold text-black">Continue →</button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <h1 className="text-2xl font-black">Experience level</h1>
              
              {[
                { id: 'beginner', label: 'Beginner', desc: '0-1 years' },
                { id: 'intermediate', label: 'Intermediate', desc: '2-4 years' },
                { id: 'advanced', label: 'Advanced', desc: '5+ years' },
              ].map(exp => (
                <button
                  key={exp.id}
                  onClick={() => { 
                    setData({ ...data, experience: exp.label, lifting_since: exp.id === 'beginner' ? 2025 : exp.id === 'intermediate' ? 2022 : 2019 }); 
                    next(); 
                  }}
                  className={`w-full p-4 rounded-xl text-left transition-all ${
                    data.experience === exp.label
                      ? 'bg-yellow-400 text-black' 
                      : 'bg-gray-800 border border-gray-700 text-white hover:border-yellow-400'
                  }`}
                >
                  <span className="font-bold">{exp.label}</span>
                  <span className="text-sm ml-2 opacity-70">({exp.desc})</span>
                </button>
              ))}
              
              <button onClick={back} className="w-full py-3 text-gray-400">← Back</button>
            </div>
          )}

          {step === 5 && (
            <div className="space-y-4">
              <h1 className="text-2xl font-black">You're ready!</h1>
              <p className="text-gray-400">Review and start competing</p>
              
              <div className="bg-gray-800 rounded-xl border border-gray-700 p-4 space-y-2">
                <p className="text-white"><span className="text-gray-400">Name:</span> {name}</p>
                <p className="text-white"><span className="text-gray-400">Goal:</span> {data.fitness_goal}</p>
                <p className="text-white"><span className="text-gray-400">Level:</span> {data.experience}</p>
                <p className="text-white"><span className="text-gray-400">Group:</span> {groupCode || 'None'}</p>
              </div>
              
              <div className="flex gap-2">
                <button onClick={back} className="flex-1 py-3 text-gray-400">← Back</button>
                <button onClick={submit} className="flex-1 py-3 bg-yellow-400 rounded-xl font-black text-black">Start! 🚀</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
