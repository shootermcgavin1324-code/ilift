'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Home, Dumbbell, Users, History, Award, Flame, Trophy, Target, Search, Camera, Video, Zap, Crown, Star, Activity, X, Target as TargetIcon, Calendar, Clock } from 'lucide-react';

// Tab Components
import { HomeTab, SquadTab, ChallengesTab, HistoryTab, LogTab } from '@/components';
import { getUser, updateUser, saveWorkout, processWorkout } from '@/lib/data';

// Business logic - extracted to lib/
import { ACHIEVEMENTS } from '@/lib/achievements';
import { CHALLENGES } from '@/lib/challenges';
import { QUICK_EXERCISES } from '@/lib/exercises';
import { calculateScore } from '@/lib/xp';
import { checkBadges } from '@/lib/badges';
import { getPlayerTitle } from '@/lib/player';

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
  
  // Workout session - array of exercises with their sets
  const [workoutSession, setWorkoutSession] = useState<any[]>([]);
  
  // Favorites - stored per user in localStorage
  const [favorites, setFavorites] = useState<string[]>([]);
  const [userEmail, setUserEmail] = useState<string>('');
  
  // Game stats
  const [bestStreak, setBestStreak] = useState(0);
  const [highestRank, setHighestRank] = useState(0);

  // Load user email from localStorage on mount
  useEffect(() => {
    const email = localStorage.getItem('ilift_email');
    if (email) {
      setUserEmail(email);
    }
  }, []);

  // Load favorites when user email is available
  useEffect(() => {
    if (userEmail) {
      const favKey = `ilift_favorites_${userEmail}`;
      const saved = localStorage.getItem(favKey);
      if (saved) {
        try {
          setFavorites(JSON.parse(saved));
        } catch (e) {
          console.error('Failed to parse favorites:', e);
        }
      }
    }
  }, [userEmail]);

  const toggleFavorite = (exerciseName: string) => {
    if (!userEmail) return;
    const newFavs = favorites.includes(exerciseName)
      ? favorites.filter(f => f !== exerciseName)
      : [...favorites, exerciseName];
    setFavorites(newFavs);
    const favKey = `ilift_favorites_${userEmail}`;
    localStorage.setItem(favKey, JSON.stringify(newFavs));
  };
  const [restTimer, setRestTimer] = useState<number | null>(null);
  const [restTimeLeft, setRestTimeLeft] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [rpe, setRpe] = useState(7);
  const [toast, setToast] = useState<any>(null);
  const [showPR, setShowPR] = useState<any>(null);
  const [newBadges, setNewBadges] = useState<string[]>([]);
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
    
    // Load best streak and highest rank from localStorage
    const storedBestStreak = parseInt(localStorage.getItem('ilift_best_streak') || '0');
    const storedHighestRank = parseInt(localStorage.getItem('ilift_highest_rank') || '0');
    setBestStreak(storedBestStreak);
    setHighestRank(storedHighestRank);
    
    // Placeholder leaderboard for demo - replace with real Supabase data later
    const placeholders = [
      { id: 'p1', name: 'GymRat_Mike', total_xp: 2450, streak: 12 },
      { id: 'p2', name: 'LifterLisa', total_xp: 2100, streak: 8 },
      { id: 'p3', name: 'SwoleSam', total_xp: 1850, streak: 5 },
      { id: 'p4', name: 'FitQueen', total_xp: 1600, streak: 3 },
    ];
    
    // Combine user with placeholders, sorted by XP
    const fullLeaderboard = [userData, ...placeholders].sort((a, b) => (b.total_xp || 0) - (a.total_xp || 0));
    setLeaderboard(fullLeaderboard);
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

  const getScore = () => {
    const result = calculateScore(sets);
    return result.xpEarned;
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

    const score = getScore();
    const newXP = (user.total_xp || 0) + score;

    // Process workout with proper streak logic
    const { updatedUser, streakChanged, message } = processWorkout(user);
    
    // Add XP to the updated user
    updatedUser.total_xp = newXP;
    
    // Check badges using lib function
    const totalWorkouts = workouts.length + 1;
    const { newlyEarned } = checkBadges(
      { total_xp: newXP, streak: updatedUser.streak, badges: user.badges || [] },
      totalWorkouts
    );
    
    // Update badges
    updatedUser.badges = [...new Set([...(user.badges || []), ...newlyEarned])];
    
    // Show badge notifications
    if (newlyEarned.length > 0) {
      setNewBadges(newlyEarned);
    }

    // Update local state
    setUser(updatedUser);

    // Update best streak if exceeded
    if (updatedUser.streak > bestStreak) {
      setBestStreak(updatedUser.streak);
      localStorage.setItem('ilift_best_streak', updatedUser.streak.toString());
    }
    
    // Update highest rank if exceeded
    if (currentLevel > highestRank) {
      setHighestRank(currentLevel);
      localStorage.setItem('ilift_highest_rank', currentLevel.toString());
    }

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
    setTimeout(() => setToast(null), 3000);
  };

  const currentLevel = Math.floor((user?.total_xp || 0) / 500) + 1;
  const xpInCurrentLevel = (user?.total_xp || 0) % 500;
  const xpToNextLevel = 500 - xpInCurrentLevel;
  const xpProgressPercent = (xpInCurrentLevel / 500) * 100;
  
  // Prestige: every 10,000 XP = 1 prestige
  const prestige = Math.floor((user?.total_xp || 0) / 10000);
  
  // Player title based on stats - use state for client-side only
  const [playerTitle, setPlayerTitle] = useState('ROOKIE');
  
  // Update player title when user changes (needs client-side workout count)
  useEffect(() => {
    if (!user) return;
    const workouts = JSON.parse(localStorage.getItem('ilift_workouts') || '[]').length;
    const title = getPlayerTitle({
      totalXP: user.total_xp || 0,
      streak: user.streak || 0,
      badges: user.badges || [],
      workouts
    });
    setPlayerTitle(title);
  }, [user]);

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

      {/* Achievement Unlocked Notifications */}
      {newBadges.length > 0 && (
        <div className="px-4 py-2">
          {newBadges.map(badgeId => (
            <div 
              key={badgeId}
              className="mb-2 p-3 rounded-xl bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 animate-pulse"
            >
              <p className="text-yellow-400 font-bold text-sm">🏆 Achievement Unlocked!</p>
              <p className="text-white font-bold">{badgeId.replace('_', ' ').toUpperCase()}</p>
            </div>
          ))}
          <button 
            onClick={() => setNewBadges([])} 
            className="text-gray-500 text-xs"
          >
            Tap to dismiss
          </button>
        </div>
      )}

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
        <LogTab
          currentExercise={currentExercise}
          setCurrentExercise={setCurrentExercise}
          sets={sets}
          setSets={setSets}
          restTimer={restTimer}
          restTimeLeft={restTimeLeft}
          setRestTimer={setRestTimer}
          setRestTimeLeft={setRestTimeLeft}
          calculateScore={getScore}
          completeWorkout={completeWorkout}
          workoutSession={workoutSession}
          setWorkoutSession={setWorkoutSession}
          favorites={favorites}
          toggleFavorite={toggleFavorite}
        />
      )}

      {/* Squad Tab */}
      {activeTab === 'squad' && <SquadTab user={user} leaderboard={leaderboard} />}
      
      {/* Challenges Tab */}
      {activeTab === 'challenges' && <ChallengesTab user={user} workouts={workouts} />}

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
                  <Star size={28} />
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
          {/* Main Profile Card - High contrast */}
          <div className="bg-gradient-to-b from-gray-900 to-gray-950 rounded-2xl p-6 text-center border border-gray-800">
            {/* Player Header */}
            <div className="flex items-center justify-center gap-2 mb-3">
              <span className="bg-yellow-500/20 text-yellow-400 text-xs font-bold px-3 py-1 rounded-full border border-yellow-500/30">
                {playerTitle}
              </span>
            </div>
            
            {/* Avatar with glow */}
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-500/30 to-orange-500/30 flex items-center justify-center mx-auto mb-4 border-2 border-yellow-500/30">
              <Target size={48} className="text-yellow-400" />
            </div>
            <h2 className="text-3xl font-black text-white">{user.name}</h2>
            <p className="text-gray-400 text-sm mt-1">Squad {user.group_id || 'NONE'}</p>
            
            {/* XP Progress Bar - Prominent */}
            <div className="mt-6 bg-gray-900/50 rounded-xl p-4 border border-gray-800">
              <div className="flex justify-between items-end mb-2">
                <span className="text-lg font-bold text-yellow-400">LEVEL {currentLevel}</span>
                <span className="text-gray-400 text-xs">{xpToNextLevel} XP to next</span>
              </div>
              
              {/* Progress Bar */}
              <div className="relative h-5 bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-yellow-500 via-yellow-400 to-orange-500 rounded-full transition-all"
                  style={{ width: `${xpProgressPercent}%` }}
                />
                {/* Progress glow */}
                <div 
                  className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-white/30 to-transparent"
                  style={{ left: `${xpProgressPercent}%`, marginLeft: '-32px' }}
                />
              </div>
              
              <p className="text-2xl font-black text-white mt-3">
                {xpInCurrentLevel.toLocaleString()} <span className="text-gray-500 text-lg">/ 500 XP</span>
              </p>
            </div>
          </div>

          {/* Game-Style Stats - Cleaner with borders */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-900 rounded-xl p-4 text-center border border-gray-800">
              <Zap size={24} className="mx-auto text-yellow-400 mb-2" />
              <p className="text-2xl font-black text-white">{(user.total_xp || 0).toLocaleString()}</p>
              <p className="text-gray-500 text-xs uppercase tracking-wider">Total XP</p>
            </div>
            <div className="bg-gray-900 rounded-xl p-4 text-center border border-gray-800">
              <Dumbbell size={24} className="mx-auto text-blue-400 mb-2" />
              <p className="text-2xl font-black text-white">{workouts.length}</p>
              <p className="text-gray-500 text-xs uppercase tracking-wider">Workouts</p>
            </div>
            <div className="bg-gray-900 rounded-xl p-4 text-center border border-gray-800">
              <Flame size={24} className="mx-auto text-orange-400 mb-2" />
              <p className="text-2xl font-black text-white">{bestStreak || user.streak || 0}</p>
              <p className="text-gray-500 text-xs uppercase tracking-wider">Best Streak</p>
            </div>
            <div className="bg-gray-900 rounded-xl p-4 text-center border border-gray-800">
              <Trophy size={24} className="mx-auto text-yellow-400 mb-2" />
              <p className="text-2xl font-black text-white">{highestRank || currentLevel}</p>
              <p className="text-gray-500 text-xs uppercase tracking-wider">Highest Rank</p>
            </div>
          </div>
          
          {/* Achievements Preview */}
          {user.badges && user.badges.length > 0 && (
            <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
              <div className="flex justify-between items-center mb-3">
                <p className="text-white text-sm font-bold uppercase tracking-wider">Achievements</p>
                <button 
                  onClick={() => setActiveTab('awards')}
                  className="text-yellow-400 text-xs font-bold hover:underline"
                >
                  View All →
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {user.badges.slice(0, 4).map((badgeId: string) => {
                  const ach = ACHIEVEMENTS.find(a => a.id === badgeId);
                  if (!ach) return null;
                  return (
                    <span 
                      key={badgeId}
                      className="bg-yellow-500/20 text-yellow-400 text-xs font-bold px-2 py-1 rounded-full"
                    >
                      {ach.name}
                    </span>
                  );
                })}
                {user.badges.length > 4 && (
                  <span className="bg-gray-800 text-gray-400 text-xs font-bold px-2 py-1 rounded-full">
                    +{user.badges.length - 4} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Onboarding Stats - Collapsible */}
          {user.onboarding && (user.onboarding.experience || user.onboarding.bodyFat || user.onboarding.age) && (
            <details className="bg-gray-950 rounded-xl p-4">
              <summary className="text-gray-400 text-sm cursor-pointer hover:text-white">
                More Stats (click to expand)
              </summary>
              <div className="grid grid-cols-3 gap-2 mt-3">
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
            </details>
          )}

          {/* PRs Section - Only shows if you have records */}
          {(() => {
            const prs = JSON.parse(localStorage.getItem('ilift_prs') || '{}');
            const prList = Object.entries(prs).filter(([_, v]: any) => v.maxWeight);
            if (prList.length === 0) return null;
            return (
              <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
                <p className="text-white text-sm font-bold uppercase tracking-wider mb-3">Personal Records 🏆</p>
                <div className="space-y-2">
                  {prList.slice(0, 5).map(([exercise, data]: any) => (
                    <div key={exercise} className="flex justify-between items-center bg-gray-950 rounded-lg p-3 border border-gray-800">
                      <span className="text-white font-bold capitalize">{exercise}</span>
                      <span className="text-yellow-400 font-black">{data.maxWeight} lbs</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}

          {/* Share & Logout */}
          <div className="flex gap-3">
            <button
              onClick={() => {
                const text = `I'm level ${currentLevel} on iLift with ${user.total_xp || 0} XP! 💪🔥`;
                window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
              }}
              className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold"
            >
              Share
            </button>
            <button
              onClick={logout}
              className="flex-1 py-3 bg-gray-800 text-gray-400 rounded-xl font-bold"
            >
              Log Out
            </button>
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
