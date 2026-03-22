'use client';

import { useEffect, Suspense, lazy } from 'react';
import { useRouter } from 'next/navigation';
import { Home, Dumbbell, Users, Trophy, Target, X, Star, Video, Zap, Flame } from 'lucide-react';

// Core components - loaded immediately
import { HomeTab } from '@/components';

// Lazy load heavy tab components for code splitting
const SquadTab = lazy(() => import('@/components/SquadTab'));
const ChallengesTab = lazy(() => import('@/components/ChallengesTab'));
const HistoryTab = lazy(() => import('@/components/HistoryTab'));
const LogTab = lazy(() => import('@/components/LogTab'));

// Stores
import { useUserStore, useWorkoutStore, useUIStore } from '@/lib/store';

// Lib functions
import { calculateScore, processWorkout } from '@/lib/data';
import { checkBadges } from '@/lib/badges';
import { getPlayerTitle } from '@/lib/player';
import { ACHIEVEMENTS } from '@/lib/achievements';
import { getPRs, savePR, getBestStreak, setBestStreak, getHighestRank, setHighestRank, uploadVideo } from '@/lib/storage';

// Loading fallback for lazy components
function TabLoader() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
    </div>
  );
}

export default function Dashboard() {
  const router = useRouter();
  
  // === USER STORE ===
  const { 
    user, 
    loading, 
    workouts, 
    bestStreak, 
    highestRank, 
    playerTitle,
    loadUser, 
    logout: storeLogout 
  } = useUserStore();
  
  // === WORKOUT STORE ===
  const {
    currentExercise,
    exerciseSearch,
    sets,
    workoutSession,
    rpe,
    restTimer,
    restTimeLeft,
    favorites,
    showQuickLog,
    setCurrentExercise,
    setExerciseSearch,
    setSets,
    startRestTimer,
    stopRestTimer,
    setShowQuickLog,
    toggleFavorite,
    clearSession
  } = useWorkoutStore();
  
  // === UI STORE ===
  const {
    activeTab,
    toast,
    showPR,
    newBadges,
    leaderboard,
    videoUploading,
    setActiveTab,
    showToast,
    setShowPR,
    setNewBadges,
    clearNewBadges,
    setLeaderboard,
    setVideoUploading
  } = useUIStore();

  // Derived values
  const currentLevel = Math.floor((user?.total_xp || 0) / 500) + 1;
  const xpInCurrentLevel = (user?.total_xp || 0) % 500;
  const xpToNextLevel = 500 - xpInCurrentLevel;
  const xpProgressPercent = (xpInCurrentLevel / 500) * 100;
  const prestige = Math.floor((user?.total_xp || 0) / 10000);

  // Load user on mount
  useEffect(() => {
    loadUser();
  }, []);

  // Set up leaderboard after user loads
  useEffect(() => {
    if (user && !leaderboard.length) {
      const placeholders = [
        { id: 'p1', name: 'GymRat_Mike', total_xp: 2450, streak: 12 },
        { id: 'p2', name: 'LifterLisa', total_xp: 2100, streak: 8 },
        { id: 'p3', name: 'SwoleSam', total_xp: 1850, streak: 5 },
        { id: 'p4', name: 'FitQueen', total_xp: 1600, streak: 3 },
      ];
      const fullLeaderboard = [user, ...placeholders].sort((a, b) => (b.total_xp || 0) - (a.total_xp || 0));
      setLeaderboard(fullLeaderboard);
    }
  }, [user]);

  // Rest timer countdown
  useEffect(() => {
    if (restTimer && restTimeLeft > 0) {
      const interval = setInterval(() => {
        const newTime = restTimeLeft - 1;
        if (newTime <= 1) {
          clearInterval(interval);
          stopRestTimer();
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [restTimer, restTimeLeft]);

  const logout = () => {
    storeLogout();
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
    const newXP = (user?.total_xp || 0) + score;

    // Process workout with proper streak logic
    const { updatedUser, streakChanged, message } = processWorkout(user!);
    
    // Add XP to the updated user
    updatedUser.total_xp = newXP;
    
    // Check badges
    const totalWorkouts = workouts.length + 1;
    const { newlyEarned } = checkBadges(
      { total_xp: newXP, streak: updatedUser.streak, badges: user?.badges || [] },
      totalWorkouts
    );
    
    // Update badges
    updatedUser.badges = [...new Set([...(user?.badges || []), ...newlyEarned])];
    
    // Show badge notifications
    if (newlyEarned.length > 0) {
      setNewBadges(newlyEarned);
    }

    // Update user via store
    await useUserStore.getState().updateUserData(updatedUser);

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

    // Check for PR
    const prs = getPRs(user?.id || '');
    const prsData = await prs; // Await the promise
    const exerciseKey = currentExercise.toLowerCase();
    let isPR = false;
    let oldPR = 0;
    
    doneSets.forEach(set => {
      if (set.weight > (prsData[exerciseKey]?.maxWeight || 0)) {
        isPR = true;
        oldPR = prsData[exerciseKey]?.maxWeight || 0;
        prsData[exerciseKey] = {
          maxWeight: set.weight,
          date: new Date().toISOString()
        };
      }
    });
    
    if (isPR) {
      // Save to storage (both local and Supabase)
      await savePR(user?.id || '', currentExercise, doneSets[0].weight);
      setShowPR({ exercise: currentExercise, weight: doneSets[0].weight, oldPR });
    }

    clearSession();
    showToast(`Workout saved! +${score} XP`, 'success');
    
    // Clear new badges after 3 seconds
    setTimeout(() => clearNewBadges(), 3000);
  };

  if (loading || !user) {
    return <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white">Loading...</div>;
  }

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
            onClick={() => clearNewBadges()} 
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
            <button 
              key={tab.id} 
              onClick={() => setActiveTab(tab.id)} 
              className={`flex flex-col items-center py-2 px-3 ${activeTab === tab.id ? 'text-yellow-500' : 'text-gray-400'}`}
            >
              <tab.icon size={22} />
              <span className="text-xs mt-1">{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Tab Content */}
      {activeTab === 'home' && (
        <HomeTab 
          user={user} 
          leaderboard={leaderboard} 
          currentLevel={currentLevel}
          onLogWorkout={() => setActiveTab('log')}
        />
      )}

      {activeTab === 'log' && (
        <Suspense fallback={<TabLoader />}>
          <LogTab
            currentExercise={currentExercise}
            setCurrentExercise={setCurrentExercise}
            sets={sets}
            setSets={setSets}
            restTimer={restTimer}
            restTimeLeft={restTimeLeft}
            setRestTimer={stopRestTimer}
            setRestTimeLeft={() => stopRestTimer()}
            calculateScore={getScore}
            completeWorkout={completeWorkout}
            workoutSession={workoutSession}
            setWorkoutSession={() => {}}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
          />
        </Suspense>
      )}

      {activeTab === 'squad' && (
        <Suspense fallback={<TabLoader />}>
          <SquadTab user={user} leaderboard={leaderboard} />
        </Suspense>
      )}
      
      {activeTab === 'challenges' && (
        <Suspense fallback={<TabLoader />}>
          <ChallengesTab user={user} workouts={workouts} />
        </Suspense>
      )}

      {activeTab === 'history' && (
        <Suspense fallback={<TabLoader />}>
          <HistoryTab workouts={workouts} />
        </Suspense>
      )}

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
                      showToast('Video must be under 50MB', 'error');
                      return;
                    }
                    setVideoUploading(true);

                    // Upload to Supabase Storage
                    const videoUrl = await uploadVideo(user?.id || 'anonymous', file);
                    
                    if (videoUrl) {
                      const newBadges = [...(user.badges || [])];
                      if (!newBadges.includes('verified')) {
                        newBadges.push('verified');
                      }
                      useUserStore.getState().updateUserData({ ...user, badges: newBadges });

                      showToast('Video uploaded! Badge earned!', 'success');
                    } else {
                      showToast('Video upload failed', 'error');
                    }
                    setVideoUploading(false);
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

      {activeTab === 'profile' && (
        <div className="p-4 space-y-4">
          {/* Main Profile Card */}
          <div className="bg-gradient-to-b from-gray-900 to-gray-950 rounded-2xl p-6 text-center border border-gray-800">
            <div className="flex items-center justify-center gap-2 mb-3">
              <span className="bg-yellow-500/20 text-yellow-400 text-xs font-bold px-3 py-1 rounded-full border border-yellow-500/30">
                {playerTitle}
              </span>
            </div>
            
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-500/30 to-orange-500/30 flex items-center justify-center mx-auto mb-4 border-2 border-yellow-500/30">
              <Target size={48} className="text-yellow-400" />
            </div>
            <h2 className="text-3xl font-black text-white">{user.name}</h2>
            <p className="text-gray-400 text-sm mt-1">Squad {user.group_id || 'NONE'}</p>
            
            {/* XP Progress */}
            <div className="mt-6 bg-gray-900/50 rounded-xl p-4 border border-gray-800">
              <div className="flex justify-between items-end mb-2">
                <span className="text-lg font-bold text-yellow-400">LEVEL {currentLevel}</span>
                <span className="text-gray-400 text-xs">{xpToNextLevel} XP to next</span>
              </div>
              
              <div className="relative h-5 bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-yellow-500 via-yellow-400 to-orange-500 rounded-full transition-all"
                  style={{ width: `${xpProgressPercent}%` }}
                />
              </div>
              
              <p className="text-2xl font-black text-white mt-3">
                {xpInCurrentLevel.toLocaleString()} <span className="text-gray-500 text-lg">/ 500 XP</span>
              </p>
            </div>
          </div>

          {/* Stats Grid */}
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
          
          {/* Achievements */}
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

          {/* Onboarding Stats */}
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

          {/* PRs */}
          {(() => {
            const prsData = getPRs(user?.id || ''); // Sync call to localStorage
            const prs = prsData instanceof Promise ? {} : prsData;
            const prList = Object.entries(prs).filter(([_, v]: any) => v && v.maxWeight);
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
              className="flex-1 bg-blue-500/20 text-blue-400 font-bold py-3 rounded-xl border border-blue-500/30"
            >
              Share Progress
            </button>
            <button
              onClick={logout}
              className="px-6 py-3 rounded-xl font-bold text-gray-400 border border-gray-700 hover:border-gray-500"
            >
              Logout
            </button>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-20 left-1/2 -translate-x-1/2 px-6 py-3 rounded-xl font-bold text-sm z-50 ${
          toast.type === 'success' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
          toast.type === 'error' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
          'bg-blue-500/20 text-blue-400 border border-blue-500/30'
        }`}>
          {toast.message}
        </div>
      )}
    </div>
  );
}
