'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Home, Dumbbell, Users, History, Award, Flame, Trophy, Target, Search, Camera, Video, Zap, Crown, Star, Activity, X, Target as TargetIcon, Calendar, Clock } from 'lucide-react';

// Tab Components
import { HomeTab, SquadTab, ChallengesTab, HistoryTab } from '@/components';
import { getUser, updateUser, saveWorkout, processWorkout } from '@/lib/data';

// Components available for integration:
// import { RankCard, Leaderboard, RestTimer, PostWorkoutModal } from '@/components';

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

// Challenge types
const CHALLENGES = {
  daily: [
    { id: 'daily_50pushups', name: '50 Push-ups', desc: 'Complete 50 push-ups today', target: 50, unit: 'pushups', xp: 100 },
    { id: 'daily_logworkout', name: 'Daily Workout', desc: 'Log at least one workout today', target: 1, unit: 'workout', xp: 50 },
    { id: 'daily_3sets', name: 'Volume King', desc: 'Complete 3 sets today', target: 3, unit: 'sets', xp: 75 },
  ],
  weekly: [
    { id: 'weekly_5workouts', name: '5x This Week', desc: 'Complete 5 workouts this week', target: 5, unit: 'workouts', xp: 300 },
    { id: 'weekly_streak3', name: '3 Day Streak', desc: 'Maintain a 3-day streak', target: 3, unit: 'days', xp: 200 },
  ],
  monthly: [
    { id: 'monthly_20workouts', name: '20 Club', desc: 'Complete 20 workouts this month', target: 20, unit: 'workouts', xp: 1000 },
    { id: 'monthly_5000xp', name: '5K XP Month', desc: 'Earn 5000 XP this month', target: 5000, unit: 'XP', xp: 1500 },
  ],
  lifetime: [
    { id: 'lifetime_100workouts', name: 'Century Club', desc: 'Complete 100 workouts', target: 100, unit: 'workouts', xp: 2500 },
    { id: 'lifetime_10kxp', name: '10K Total', desc: 'Earn 10000 XP total', target: 10000, unit: 'XP', xp: 5000 },
    { id: 'lifetime_30daystreak', name: 'Monthly Streak', desc: 'Achieve a 30-day streak', target: 30, unit: 'days', xp: 3000 },
  ]
};

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
  const [restTimer, setRestTimer] = useState<number | null>(null);
  const [restTimeLeft, setRestTimeLeft] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [rpe, setRpe] = useState(7);
  const [toast, setToast] = useState<any>(null);
  const [showPR, setShowPR] = useState<any>(null);
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [videoUploading, setVideoUploading] = useState(false);

  useEffect(() => {
    loadUserData();

    // Fallback: always set loading to false after 3 seconds
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // Rest timer countdown
  useEffect(() => {
    if (restTimer && restTimeLeft > 0) {
      const interval = setInterval(() => {
        setRestTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            setRestTimer(null);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [restTimer, restTimeLeft]);

  function startRestTimer(seconds: number) {
    setRestTimer(seconds);
    setRestTimeLeft(seconds);
  }

  async function loadUserData() {
    const email = localStorage.getItem('ilift_email');
    if (!email) {
      router.push('/');
      return;
    }

    // Use hybrid data layer - tries Supabase first, falls back to localStorage
    const userData = await getUser(email);

    setUser(userData);
    setWorkouts([]);
    setLeaderboard([userData]);
    setLoading(false);
  }

  const logout = () => { 
    localStorage.removeItem('ilift_email');
    localStorage.removeItem('ilift_password');
    localStorage.removeItem('ilift_onboarding');
    localStorage.removeItem('ilift_onboarding_data');
    localStorage.removeItem('ilift_user');
    localStorage.removeItem('ilift_user_id');
    localStorage.removeItem('ilift_workouts');
    router.push('/');
  };

  const calculateScore = () => {
    const doneSets = sets.filter(s => s.done);
    if (doneSets.length === 0) return 0;
    
    // XP = base + (RPE * multiplier) per set
    // Base: 10 XP per workout
    // RPE multiplier: RPE * 2
    const avgRpe = doneSets.reduce((sum, s) => sum + s.rpe, 0) / doneSets.length;
    const baseXP = 10;
    const rpeMultiplier = 2;
    
    // XP = 10 + (avgRPE * 2) * sets
    const xpEarned = baseXP + Math.round(avgRpe * rpeMultiplier * doneSets.length);
    
    return xpEarned;
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

    // Process workout with proper streak logic
    const { updatedUser, streakChanged, message } = processWorkout(user);
    
    // Add XP to the updated user
    updatedUser.total_xp = newXP;
    
    // Check badges based on TOTAL XP
    const totalXP = newXP; // This is now the total after adding
    const newBadges = [...(updatedUser.badges || [])];
    if (newBadges.length === 0) newBadges.push('first_workout');
    if (totalXP >= 1000 && !newBadges.includes('xp_1000')) newBadges.push('xp_1000');
    if (totalXP >= 5000 && !newBadges.includes('xp_5000')) newBadges.push('xp_5000');
    if (totalXP >= 10000 && !newBadges.includes('xp_10000')) newBadges.push('xp_10000');
    if (updatedUser.streak >= 7 && !newBadges.includes('streak_7')) newBadges.push('streak_7');
    if (updatedUser.streak >= 30 && !newBadges.includes('streak_30')) newBadges.push('streak_30');
    updatedUser.badges = newBadges;

    // Update local state
    setUser(updatedUser);

    // Save to localStorage
    localStorage.setItem('ilift_user', JSON.stringify(updatedUser));
    localStorage.setItem('ilift_onboarding_data', JSON.stringify(updatedUser));
    
    // Show streak message
    if (message) {
      console.log(message);
    }
    
    // Save to Supabase (hybrid - won't break if fails)
    await updateUser(updatedUser);

    // Add workout to history
    const doneSets = sets.filter(s => s.done);
    const volume = doneSets.reduce((acc, s) => acc + (s.weight * s.reps), 0);
    
    const workout = {
      id: Date.now().toString(),
      exercise: currentExercise,
      sets: doneSets,
      volume,
      score,
      date: new Date().toISOString()
    };
    const newWorkouts = [workout, ...workouts].slice(0, 50);
    setWorkouts(newWorkouts);
    localStorage.setItem('ilift_workouts', JSON.stringify(newWorkouts));
    
    // Save to Supabase (hybrid)
    await saveWorkout({ ...workout, user_name: user.name });

    // Check for PR
    const prs = JSON.parse(localStorage.getItem('ilift_prs') || '{}');
    const exerciseKey = currentExercise.toLowerCase();
    let isPR = false;
    let oldPR = 0;
    
    // Check weight PR for each set
    doneSets.forEach(set => {
      if (set.weight > (prs[exerciseKey]?.maxWeight || 0)) {
        isPR = true;
        oldPR = prs[exerciseKey]?.maxWeight || 0;
        prs[exerciseKey] = {
          ...prs[exerciseKey],
          maxWeight: set.weight,
          date: new Date().toISOString()
        };
      }
    });
    
    if (isPR) {
      localStorage.setItem('ilift_prs', JSON.stringify(prs));
      setShowPR({ exercise: currentExercise, weight: doneSets[0].weight, oldPR });
    }

    setSubmitted(true);
    setToast({ message: `Workout saved! +${score} XP`, type: 'success' });
    setTimeout(() => setSubmitted(false), 2500);
    setTimeout(() => {
      setSets([{ weight: 135, reps: 10, rpe: 7, done: false }]);
      setCurrentExercise('');
    }, 2500);
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
        <h1 className="text-2xl font-black"><span className="text-yellow-500">i</span>LIFT</h1>
        <button onClick={logout}><X size={24} className="text-gray-400" /></button>
      </header>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-gray-950 border-t border-gray-700 px-2 py-2 pb-6 z-50">
        <div className="flex justify-around">
          {[
            { id: 'home', icon: Home, label: 'Home' },
            { id: 'log', icon: Dumbbell, label: 'Log' },
            { id: 'squad', icon: Users, label: 'Squad' },
            { id: 'challenges', icon: Trophy, label: 'Goals' },
            { id: 'profile', icon: Target, label: 'Profile' },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex flex-col items-center py-2 px-3 ${activeTab === tab.id ? 'text-yellow-500' : 'text-gray-400'}`}>
              <tab.icon size={22} />
              <span className="text-xs mt-1">{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Home Tab - Leaderboard First */}
      {activeTab === 'home' && (
        <HomeTab 
          user={user} 
          leaderboard={leaderboard} 
          currentLevel={currentLevel}
          onLogWorkout={() => setActiveTab('log')}
        />
      )}

      {/* Log Tab */}
      {activeTab === 'log' && (
        <div className="p-4 space-y-4">
          <input
            type="text"
            placeholder="Search exercises..."
            value={exerciseSearch}
            onChange={(e) => setExerciseSearch(e.target.value.toLowerCase())}
            className="w-full p-3 bg-gray-950 rounded-xl border border-gray-700"
          />

          {!currentExercise ? (
            <div className="grid grid-cols-3 gap-2">
              {QUICK_EXERCISES.filter(e => !exerciseSearch || e.name.toLowerCase().includes(exerciseSearch)).map(ex => (
                <button key={ex.name} onClick={() => quickLog(ex.name)} className="py-4 bg-gray-900 rounded-xl font-bold text-sm hover:bg-gray-800">
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
                <div key={i} className={`p-3 rounded-xl flex items-center gap-3 ${set.done ? 'bg-green-900/30 border border-green-500/30' : 'bg-gray-900'}`}>
                  <span className="text-gray-400 font-bold w-8">Set {i + 1}</span>
                  <input type="number" value={set.weight} onChange={(e) => {
                    const newSets = [...sets];
                    newSets[i].weight = parseInt(e.target.value) || 0;
                    setSets(newSets);
                  }} className="w-20 p-2 bg-gray-950 rounded-lg text-center" placeholder="lbs" />
                  <span className="text-gray-400">×</span>
                  <input type="number" value={set.reps} onChange={(e) => {
                    const newSets = [...sets];
                    newSets[i].reps = parseInt(e.target.value) || 0;
                    setSets(newSets);
                  }} className="w-16 p-2 bg-gray-950 rounded-lg text-center" placeholder="Reps" />
                  <span className="text-gray-400">@</span>
                  <select value={set.rpe} onChange={(e) => {
                    const newSets = [...sets];
                    newSets[i].rpe = parseInt(e.target.value);
                    setSets(newSets);
                  }} className="bg-gray-950 p-2 rounded-lg">
                    {[5,6,7,8,9,10].map(r => <option key={r} value={r}>RPE {r}</option>)}
                  </select>
                  <button onClick={() => {
                    const newSets = [...sets];
                    newSets[i].done = !newSets[i].done;
                    setSets(newSets);
                  }} className={`ml-auto px-3 py-1 rounded-lg font-bold ${set.done ? 'bg-green-500 text-black' : 'bg-gray-800'}`}>
                    {set.done ? '✓' : 'Done'}
                  </button>
                </div>
              ))}

              <button onClick={() => setSets([...sets, { weight: 135, reps: 10, rpe: 7, done: false }])} className="w-full py-2 bg-gray-900 rounded-xl text-gray-400">+ Add Set</button>

              {/* Rest Timer */}
              {restTimer ? (
                <div className="bg-gray-900 rounded-xl p-4 text-center">
                  <p className="text-gray-400 text-sm mb-2">Rest Timer</p>
                  <p className="text-5xl font-black text-yellow-500">{restTimeLeft}s</p>
                  <button onClick={() => { setRestTimer(null); setRestTimeLeft(0); }} className="mt-2 text-gray-400 text-sm">Cancel</button>
                </div>
              ) : (
                <div className="flex gap-2">
                  {[60, 90, 120, 180].map(sec => (
                    <button key={sec} onClick={() => startRestTimer(sec)} className="flex-1 py-2 bg-gray-900 rounded-xl text-gray-400 text-sm font-bold hover:bg-gray-800">
                      {sec}s
                    </button>
                  ))}
                </div>
              )}

              <button onClick={completeWorkout} className="w-full py-4 bg-yellow-400 rounded-xl font-black text-black text-lg">
                Complete Workout (+{calculateScore()} XP)
              </button>
            </div>
          )}
        </div>
      )}

      {/* Squad Tab */}
      {activeTab === 'squad' && <SquadTab user={user} leaderboard={leaderboard} />}
      
      {activeTab === 'challenges' && <ChallengesTab />}

      {/* Challenges Tab */}
      {activeTab === 'challenges' && <ChallengesTab />}

      {/* History Tab */}
      {activeTab === 'history' && <HistoryTab workouts={workouts} />}

      {/* Awards Tab */}
      {activeTab === 'awards' && (
        <div className="p-4 space-y-3">
          <div className="bg-gray-950 rounded-xl p-4 flex justify-between items-center">
            <div>
              <p className="text-gray-400">Badges</p>
              <p className="text-3xl font-black text-yellow-500">{user.badges?.length || 0} / {ACHIEVEMENTS.length}</p>
            </div>
          </div>

          {/* Video Upload */}
          <div className="bg-gray-950 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-3">
              <Video size={24} className="text-purple-400" />
              <div>
                <p className="font-bold">Upload Video Proof</p>
                <p className="text-gray-400 text-sm">Verify your workouts to earn badges</p>
              </div>
            </div>

            {user.badges?.includes('verified') ? (
              <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-3 text-green-400 text-sm font-medium">
                ✓ Video verified! You earned the Verified badge.
              </div>
            ) : (
              <label className={`flex items-center justify-center gap-2 py-3 rounded-lg font-bold cursor-pointer ${
                videoUploading ? 'bg-gray-800 text-gray-400' : 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
              }`}>
                {videoUploading ? 'Uploading...' : (
                  <>
                    <Video size={18} />
                    <span>Choose Video</span>
                  </>
                )}
                <input
                  type="file"
                  accept="video/*"
                  className="hidden"
                  disabled={videoUploading}
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    if (file.size > 50 * 1024 * 1024) {
                      setToast({ message: 'Video must be under 50MB', type: 'error' });
                      return;
                    }
                    setVideoUploading(true);

                    // Save video as base64 for demo
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      const videoData = reader.result as string;
                      if (videoData) {
                        localStorage.setItem('ilift_video', videoData);
                      }

                      // Add verified badge
                      const newBadges = [...(user.badges || [])];
                      if (!newBadges.includes('verified')) {
                        newBadges.push('verified');
                      }
                      setUser({ ...user, badges: newBadges });
                      localStorage.setItem('ilift_user', JSON.stringify({ ...user, badges: newBadges }));

                      setToast({ message: 'Video saved! Badge earned!', type: 'success' });
                      setVideoUploading(false);
                    };
                    reader.readAsDataURL(file);
                  }}
                />
              </label>
            )}
          </div>

          {ACHIEVEMENTS.map(ach => {
            const earned = user.badges?.includes(ach.id);
            return (
              <div key={ach.id} className={`p-4 rounded-xl flex items-center gap-4 ${earned ? 'bg-gray-950 border-yellow-400/30' : 'bg-gray-950/50 opacity-50'}`}>
                <div className={earned ? 'text-yellow-500' : 'text-gray-600'}>
                  {ach.icon && <ach.icon size={28} />}
                </div>
                <div className="flex-1">
                  <p className="font-bold">{ach.name}</p>
                  <p className="text-gray-400 text-sm">{ach.desc}</p>
                </div>
                <span className="text-yellow-500 font-bold">+{ach.points}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="p-4 space-y-4">
          <div className="bg-gray-950 rounded-xl p-6 text-center">
            <div className="w-20 h-20 rounded-full bg-gray-900 flex items-center justify-center mx-auto mb-3">
              <Target size={40} className="text-gray-600" />
            </div>
            <h2 className="text-2xl font-black">{user.name}</h2>
            <p className="text-gray-400">{user.email}</p>
            {user.onboarding?.fitnessGoal && (
              <p className="mt-2 inline-block bg-purple-500/20 text-purple-400 px-3 py-1 rounded-full text-sm font-bold">
                Goal: {user.onboarding.fitnessGoal}
              </p>
            )}
            <div className="mt-4 bg-gray-900 rounded-lg p-3">
              <p className="text-gray-400 text-sm">Level {currentLevel}</p>
              <p className="text-3xl font-black text-yellow-500">{(user.total_xp || 0).toLocaleString()} XP</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-950 rounded-xl p-4 text-center">
              <Flame size={28} className="mx-auto text-orange-400 mb-2" />
              <p className="text-2xl font-black">{user.streak || 0}</p>
              <p className="text-gray-400 text-sm">Day Streak</p>
            </div>
            <div className="bg-gray-950 rounded-xl p-4 text-center">
              <Award size={28} className="mx-auto text-purple-400 mb-2" />
              <p className="text-2xl font-black">{user.badges?.length || 0}</p>
              <p className="text-gray-400 text-sm">Badges</p>
            </div>
          </div>

          {/* Onboarding Stats */}
          {user.onboarding && (
            <div className="bg-gray-950 rounded-xl p-4">
              <p className="text-gray-400 text-sm mb-3">My Stats</p>
              <div className="grid grid-cols-2 gap-2">
                {user.onboarding.weight && (
                  <div className="bg-gray-900 rounded-lg p-3">
                    <p className="text-gray-400 text-xs">Weight</p>
                    <p className="text-white font-bold">{user.onboarding.weight} lbs</p>
                  </div>
                )}
                {user.onboarding.height && (
                  <div className="bg-gray-900 rounded-lg p-3">
                    <p className="text-gray-400 text-xs">Height</p>
                    <p className="text-white font-bold">{Math.floor(user.onboarding.height / 12)}'{user.onboarding.height % 12}"</p>
                  </div>
                )}
                {user.onboarding.experience && (
                  <div className="bg-gray-900 rounded-lg p-3">
                    <p className="text-gray-400 text-xs">Experience</p>
                    <p className="text-white font-bold">{user.onboarding.experience}</p>
                  </div>
                )}
                {user.onboarding.bodyFat && (
                  <div className="bg-gray-900 rounded-lg p-3">
                    <p className="text-gray-400 text-xs">Body Fat</p>
                    <p className="text-white font-bold">{user.onboarding.bodyFat}%</p>
                  </div>
                )}
                {user.onboarding.age && (
                  <div className="bg-gray-900 rounded-lg p-3">
                    <p className="text-gray-400 text-xs">Age</p>
                    <p className="text-white font-bold">{user.onboarding.age}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* PRs Section */}
          {(() => {
            const prs = JSON.parse(localStorage.getItem('ilift_prs') || '{}');
            const prList = Object.entries(prs).filter(([_, v]: any) => v.maxWeight);
            if (prList.length === 0) return null;
            return (
              <div className="bg-gray-950 rounded-xl p-4">
                <p className="text-gray-400 text-sm mb-3">Personal Records 🏆</p>
                <div className="space-y-2">
                  {prList.slice(0, 5).map(([exercise, data]: any) => (
                    <div key={exercise} className="flex justify-between items-center bg-gray-900 rounded-lg p-3">
                      <span className="text-white font-bold capitalize">{exercise}</span>
                      <span className="text-yellow-400 font-black">{data.maxWeight} lbs</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}

          <div className="bg-gray-950 rounded-xl p-4">
            <p className="text-gray-400 text-sm mb-2">Squad Code</p>
            <p className="text-4xl font-black text-yellow-500">{user.group_id || 'TEST'}</p>
          </div>

          {/* Share Button */}
          <button
            onClick={() => {
              const text = `I'm level ${currentLevel} on iLift with ${user.total_xp || 0} XP! 💪🔥`;
              window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
            }}
            className="w-full py-3 bg-blue-500/20 text-blue-400 rounded-xl font-bold border border-blue-500/30"
          >
            Share Progress
          </button>

          {/* Logout Button */}
          <button
            onClick={logout}
            className="w-full py-3 bg-red-500/20 text-red-400 rounded-xl font-bold border border-red-500/30"
          >
            Log Out
          </button>
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

      {/* PR Celebration */}
      {showPR && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="text-center animate-bounce">
            <Trophy size={80} className="text-yellow-400 mx-auto mb-4" />
            <h2 className="text-4xl font-black text-yellow-400 mb-2">NEW PR!</h2>
            <p className="text-xl text-white mb-2">{showPR.exercise}</p>
            <p className="text-3xl font-bold text-white">{showPR.weight} lbs</p>
            <p className="text-gray-400 text-sm mt-2">Previous: {showPR.oldPR} lbs</p>
            <button 
              onClick={() => setShowPR(null)}
              className="mt-6 px-8 py-3 bg-yellow-400 text-black font-bold rounded-xl"
            >
              AWESOME!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
