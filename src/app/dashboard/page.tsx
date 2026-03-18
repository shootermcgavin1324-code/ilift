'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Home, Dumbbell, Users, History, Award, Flame, Trophy, Target, Search, Camera, Video, Zap, Crown, Star, Activity, X } from 'lucide-react';
import { supabase, getUser, createUser, updateUser, saveWorkout, getUserWorkouts, getLeaderboard } from '@/lib/supabase';

const ACHIEVEMENTS = [
  { id: 'first_workout', name: 'First Steps', desc: 'Complete first workout', points: 50, icon: Star },
  { id: 'verified', name: 'Verified', desc: 'Upload video proof', points: 150, icon: Video },
  { id: 'streak_7', name: 'On Fire', desc: '7 day streak', points: 100, icon: Flame },
  { id: 'streak_30', name: 'Unstoppable', desc: '30 day streak', points: 250, icon: Zap },
  { id: 'streak_100', name: 'Legend', desc: '100 day streak', points: 500, icon: Crown },
  { id: 'workout_100', name: 'Workout Club', desc: 'Complete 100 workouts', points: 300, icon: Dumbbell },
  { id: 'xp_1000', name: 'Rising Star', desc: 'Earn 1000 XP', points: 200, icon: Star },
  { id: 'xp_5000', name: 'XP Master', desc: 'Earn 5000 XP', points: 500, icon: Activity },
  { id: 'xp_10000', name: 'XP Legend', desc: 'Earn 10000 XP', points: 1000, icon: Trophy },
];

const QUICK_EXERCISES = [
  { name: 'Bench Press' }, { name: 'Squat' }, { name: 'Deadlift' },
  { name: 'Pull-ups' }, { name: 'Dips' }, { name: 'Overhead Press' },
  { name: 'Barbell Row' }, { name: 'Leg Press' }, { name: 'Romanian Deadlift' },
  { name: 'Lat Pulldown' }, { name: 'Cable Fly' }, { name: 'Leg Curl' },
  { name: 'Calf Raise' }, { name: 'Face Pull' }, { name: 'Bicep Curl' },
  { name: 'Tricep Pushdown' }, { name: 'Lateral Raise' }, { name: 'Cable Row' },
  { name: 'Leg Extension' }, { name: 'Hip Thrust' },
];

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [group, setGroup] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('home');
  const [showQuickLog, setShowQuickLog] = useState(false);
  const [currentExercise, setCurrentExercise] = useState('');
  const [exerciseSearch, setExerciseSearch] = useState('');
  const [sets, setSets] = useState([{ weight: 135, reps: 10, rpe: 7, done: false }]);
  const [submitted, setSubmitted] = useState(false);
  const [rpe, setRpe] = useState(7);
  const [toast, setToast] = useState<any>(null);
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);

  useEffect(() => {
    loadUserData();
  }, []);

  async function loadUserData() {
    const email = localStorage.getItem('ilift_email');
    if (!email) {
      router.push('/');
      return;
    }
    
    try {
      // Try to get from Supabase
      let userData = await getUser(email);
      
      if (!userData) {
        // Create new user from onboarding data
        const onboarding = JSON.parse(localStorage.getItem('ilift_onboarding_data') || '{}');
        const newUser = {
          email,
          name: onboarding.name || email.split('@')[0],
          total_xp: 0,
          streak: 0,
          badges: [],
          group_code: onboarding.groupCode || 'TEST',
          onboarding
        };
        const result = await createUser(newUser);
        userData = result.data;
      }
      
      setUser(userData);
      localStorage.setItem('ilift_user_id', userData.id);
      
      // Load workouts
      const userWorkouts = await getUserWorkouts(userData.id);
      setWorkouts(userWorkouts);
      
      // Load leaderboard
      const lb = await getLeaderboard(userData.group_code);
      setLeaderboard(lb);
      
    } catch (e) {
      console.error('Failed to load user:', e);
    }
    
    setLoading(false);
  }

  const logout = () => {
    localStorage.removeItem('ilift_email');
    localStorage.removeItem('ilift_user_id');
    router.push('/');
  };

  const calculateScore = () => {
    const doneSets = sets.filter(s => s.done);
    if (doneSets.length === 0) return 0;
    const avgRpe = doneSets.reduce((sum, s) => sum + s.rpe, 0) / doneSets.length;
    const streak = user?.streak || 0;
    return Math.round(50 * (avgRpe / 5) * (1 + streak * 0.05) * doneSets.length);
  };

  const quickLog = (exerciseName: string) => {
    setCurrentExercise(exerciseName);
    setSets([
      { weight: 135, reps: 10, rpe: 7, done: false },
      { weight: 135, reps: 10, rpe: 7, done: false },
      { weight: 135, reps: 10, rpe: 7, done: false },
    ]);
    setActiveTab('log');
    setShowQuickLog(false);
  };

  const completeWorkout = async () => {
    if (!currentExercise || sets.filter(s => s.done).length === 0) return;
    
    const score = calculateScore();
    const newXP = (user.total_xp || 0) + score;
    const newStreak = (user.streak || 0) + 1;
    
    // Check badges
    const newBadges = [...(user.badges || [])];
    if (newBadges.length === 0) newBadges.push('first_workout');
    if (newXP >= 1000 && !newBadges.includes('xp_1000')) newBadges.push('xp_1000');
    if (newStreak >= 7 && !newBadges.includes('streak_7')) newBadges.push('streak_7');
    
    try {
      // Update user in Supabase
      await updateUser(user.id, { 
        total_xp: newXP, 
        streak: newStreak, 
        badges: newBadges 
      });
      
      // Save workout to Supabase
      await saveWorkout({
        user_id: user.id,
        exercise: currentExercise,
        sets: sets.filter(s => s.done),
        score
      });
      
      // Update local state
      const updatedUser = { ...user, total_xp: newXP, streak: newStreak, badges: newBadges };
      setUser(updatedUser);
      
      // Reload data
      const userWorkouts = await getUserWorkouts(user.id);
      setWorkouts(userWorkouts);
      
      const lb = await getLeaderboard(user.group_code);
      setLeaderboard(lb);
      
      setSubmitted(true);
      setToast({ message: `Workout saved! +${score} XP`, type: 'success' });
      setTimeout(() => setSubmitted(false), 2500);
      setTimeout(() => {
        setSets([{ weight: 135, reps: 10, rpe: 7, done: false }]);
        setCurrentExercise('');
      }, 2500);
      
    } catch (e) {
      console.error('Failed to save workout:', e);
      setToast({ message: 'Failed to save workout', type: 'error' });
    }
  };

  const currentLevel = Math.floor((user?.total_xp || 0) / 500) + 1;
  const xpProgress = ((user?.total_xp || 0) % 500) / 5;
  const xpToNextLevel = 500 - ((user?.total_xp || 0) % 500);

  if (loading) {
    return <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white">Loading...</div>;
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-950 text-white pb-20">
      {/* Header */}
      <header className="px-4 pt-4 flex justify-between items-center">
        <h1 className="text-2xl font-black"><span className="text-yellow-400">i</span>LIFT</h1>
        <button onClick={logout}><X size={24} className="text-gray-400" /></button>
      </header>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 px-2 py-2 pb-6 z-50">
        <div className="flex justify-around">
          {[
            { id: 'home', icon: Home, label: 'Home' },
            { id: 'log', icon: Dumbbell, label: 'Log' },
            { id: 'history', icon: History, label: 'History' },
            { id: 'awards', icon: Award, label: 'Awards' },
            { id: 'profile', icon: Target, label: 'Profile' },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex flex-col items-center py-2 px-3 ${activeTab === tab.id ? 'text-yellow-400' : 'text-gray-500'}`}>
              <tab.icon size={22} />
              <span className="text-xs mt-1">{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Home Tab */}
      {activeTab === 'home' && (
        <div className="p-4 space-y-4">
          <div className="bg-gray-900 rounded-xl p-4">
            <p className="text-gray-400 text-sm">Your XP</p>
            <p className="text-4xl font-black text-yellow-400">{(user.total_xp || 0).toLocaleString()}</p>
            <div className="flex justify-between text-sm mt-2">
              <span className="text-gray-500">Level {currentLevel}</span>
              <span className="text-gray-500">{xpToNextLevel} to Level {currentLevel + 1}</span>
            </div>
            <div className="bg-gray-800 h-2 rounded-full mt-2">
              <div className="bg-yellow-400 h-2 rounded-full" style={{ width: `${xpProgress}%` }}></div>
            </div>
          </div>

          {/* Leaderboard */}
          <div className="bg-gray-900 rounded-xl p-4">
            <p className="text-gray-400 text-sm mb-3">Leaderboard</p>
            {leaderboard.slice(0, 5).map((u, i) => (
              <div key={u.id} className={`flex justify-between items-center py-2 ${u.id === user.id ? 'text-yellow-400' : 'text-gray-300'}`}>
                <span className="font-bold">#{i + 1} {u.name}</span>
                <span className="font-black">{u.total_xp || 0} XP</span>
              </div>
            ))}
          </div>

          <div className="bg-gray-900 rounded-xl p-4">
            <p className="text-gray-400 text-sm mb-2">Quick Log</p>
            <div className="grid grid-cols-4 gap-2">
              {QUICK_EXERCISES.slice(0, 8).map(ex => (
                <button key={ex.name} onClick={() => quickLog(ex.name)} className="py-3 bg-gray-800 rounded-lg text-xs font-bold hover:bg-gray-700">
                  {ex.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Log Tab */}
      {activeTab === 'log' && (
        <div className="p-4 space-y-4">
          <input
            type="text"
            placeholder="Search exercises..."
            value={exerciseSearch}
            onChange={(e) => setExerciseSearch(e.target.value.toLowerCase())}
            className="w-full p-3 bg-gray-900 rounded-xl border border-gray-700"
          />
          
          {!currentExercise ? (
            <div className="grid grid-cols-3 gap-2">
              {QUICK_EXERCISES.filter(e => !exerciseSearch || e.name.toLowerCase().includes(exerciseSearch)).map(ex => (
                <button key={ex.name} onClick={() => quickLog(ex.name)} className="py-4 bg-gray-800 rounded-xl font-bold text-sm hover:bg-gray-700">
                  {ex.name}
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold">{currentExercise}</h3>
                <button onClick={() => setCurrentExercise('')} className="text-gray-400">✕</button>
              </div>
              
              {sets.map((set, i) => (
                <div key={i} className={`p-3 rounded-xl flex items-center gap-3 ${set.done ? 'bg-green-900/30 border border-green-500/30' : 'bg-gray-800'}`}>
                  <span className="text-gray-400 font-bold w-8">Set {i + 1}</span>
                  <input type="number" value={set.weight} onChange={(e) => {
                    const newSets = [...sets];
                    newSets[i].weight = parseInt(e.target.value) || 0;
                    setSets(newSets);
                  }} className="w-20 p-2 bg-gray-900 rounded-lg text-center" placeholder="lbs" />
                  <span className="text-gray-500">×</span>
                  <input type="number" value={set.reps} onChange={(e) => {
                    const newSets = [...sets];
                    newSets[i].reps = parseInt(e.target.value) || 0;
                    setSets(newSets);
                  }} className="w-16 p-2 bg-gray-900 rounded-lg text-center" placeholder="Reps" />
                  <span className="text-gray-500">@</span>
                  <select value={set.rpe} onChange={(e) => {
                    const newSets = [...sets];
                    newSets[i].rpe = parseInt(e.target.value);
                    setSets(newSets);
                  }} className="bg-gray-900 p-2 rounded-lg">
                    {[5,6,7,8,9,10].map(r => <option key={r} value={r}>RPE {r}</option>)}
                  </select>
                  <button onClick={() => {
                    const newSets = [...sets];
                    newSets[i].done = !newSets[i].done;
                    setSets(newSets);
                  }} className={`ml-auto px-3 py-1 rounded-lg font-bold ${set.done ? 'bg-green-500 text-black' : 'bg-gray-700'}`}>
                    {set.done ? '✓' : 'Done'}
                  </button>
                </div>
              ))}
              
              <button onClick={() => setSets([...sets, { weight: 135, reps: 10, rpe: 7, done: false }])} className="w-full py-2 bg-gray-800 rounded-xl text-gray-400">+ Add Set</button>
              
              <button onClick={completeWorkout} className="w-full py-4 bg-yellow-400 rounded-xl font-black text-black text-lg">
                Complete Workout (+{calculateScore()} XP)
              </button>
            </div>
          )}
        </div>
      )}

      {/* History Tab */}
      {activeTab === 'history' && (
        <div className="p-4 space-y-3">
          <h2 className="text-xl font-bold">Workout History</h2>
          {workouts.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No workouts yet</p>
          ) : (
            workouts.map(w => (
              <div key={w.id} className="bg-gray-900 rounded-xl p-4">
                <div className="flex justify-between">
                  <span className="font-bold">{w.exercise}</span>
                  <span className="text-yellow-400 font-black">+{w.score} XP</span>
                </div>
                <p className="text-gray-500 text-sm">{new Date(w.date).toLocaleDateString()}</p>
              </div>
            ))
          )}
        </div>
      )}

      {/* Awards Tab */}
      {activeTab === 'awards' && (
        <div className="p-4 space-y-3">
          <div className="bg-gray-900 rounded-xl p-4 flex justify-between items-center">
            <div>
              <p className="text-gray-400">Badges</p>
              <p className="text-3xl font-black text-yellow-400">{user.badges?.length || 0} / {ACHIEVEMENTS.length}</p>
            </div>
          </div>
          
          {ACHIEVEMENTS.map(ach => {
            const earned = user.badges?.includes(ach.id);
            return (
              <div key={ach.id} className={`p-4 rounded-xl flex items-center gap-4 ${earned ? 'bg-gray-900 border-yellow-400/30' : 'bg-gray-900/50 opacity-50'}`}>
                <div className={earned ? 'text-yellow-400' : 'text-gray-600'}>
                  {ach.icon && <ach.icon size={28} />}
                </div>
                <div className="flex-1">
                  <p className="font-bold">{ach.name}</p>
                  <p className="text-gray-500 text-sm">{ach.desc}</p>
                </div>
                <span className="text-yellow-400 font-bold">+{ach.points}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="p-4 space-y-4">
          <div className="bg-gray-900 rounded-xl p-6 text-center">
            <div className="w-20 h-20 rounded-full bg-gray-800 flex items-center justify-center mx-auto mb-3">
              <Target size={40} className="text-gray-600" />
            </div>
            <h2 className="text-2xl font-black">{user.name}</h2>
            <p className="text-gray-400">{user.email}</p>
            <div className="mt-4 bg-gray-800 rounded-lg p-3">
              <p className="text-gray-400 text-sm">Level {currentLevel}</p>
              <p className="text-3xl font-black text-yellow-400">{(user.total_xp || 0).toLocaleString()} XP</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-900 rounded-xl p-4 text-center">
              <Flame size={28} className="mx-auto text-orange-400 mb-2" />
              <p className="text-2xl font-black">{user.streak || 0}</p>
              <p className="text-gray-500 text-sm">Day Streak</p>
            </div>
            <div className="bg-gray-900 rounded-xl p-4 text-center">
              <Award size={28} className="mx-auto text-purple-400 mb-2" />
              <p className="text-2xl font-black">{user.badges?.length || 0}</p>
              <p className="text-gray-500 text-sm">Badges</p>
            </div>
          </div>
          
          <div className="bg-gray-900 rounded-xl p-4">
            <p className="text-gray-400 text-sm mb-2">Squad Code</p>
            <p className="text-4xl font-black text-yellow-400">{user.group_code || 'TEST'}</p>
          </div>
        </div>
      )}

      {/* Success Overlay */}
      {submitted && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-40">
          <div className="text-center animate-bounce">
            <div className="text-8xl mb-4">🎉</div>
            <h2 className="text-5xl font-black">LOGGED!</h2>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-6 py-3 bg-green-500 rounded-xl font-bold">
          {toast.message}
        </div>
      )}
    </div>
  );
}
