'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const ACHIEVEMENTS = [
  { id: 'first_workout', name: 'First Steps', desc: 'Complete first workout', points: 50, emoji: '🎉' },
  { id: 'streak_7', name: 'On Fire', desc: '7 day streak', points: 100, emoji: '🔥' },
  { id: 'streak_30', name: 'Unstoppable', desc: '30 day streak', points: 250, emoji: '⚡' },
  { id: 'streak_100', name: 'Legend', desc: '100 day streak', points: 500, emoji: '👑' },
  { id: 'workout_100', name: 'Workout Club', desc: 'Complete 100 workouts', points: 300, emoji: '🏋️' },
  { id: 'xp_1000', name: 'Rising Star', desc: 'Earn 1000 XP', points: 200, emoji: '⭐' },
  { id: 'xp_5000', name: 'XP Master', desc: 'Earn 5000 XP', points: 500, emoji: '🌟' },
  { id: 'xp_10000', name: 'XP Legend', desc: 'Earn 10000 XP', points: 1000, emoji: '🏆' },
];

const QUICK_EXERCISES = [
  { name: 'Bench Press', emoji: '🏋️' }, 
  { name: 'Squat', emoji: '🦵' }, 
  { name: 'Deadlift', emoji: '💪' }, 
  { name: 'Pull-ups', emoji: '💪' }, 
  { name: 'Dips', emoji: '💪' },
  { name: 'Overhead Press', emoji: '🏋️' },
  { name: 'Barbell Row', emoji: '🏋️' },
  { name: 'Leg Press', emoji: '🦵' },
  { name: 'Romanian Deadlift', emoji: '🦵' },
  { name: 'Lat Pulldown', emoji: '💪' },
  { name: 'Cable Fly', emoji: '💪' },
  { name: 'Leg Curl', emoji: '🦵' },
  { name: 'Calf Raise', emoji: '🦵' },
  { name: 'Face Pull', emoji: '💪' },
  { name: 'Lateral Raise', emoji: '💪' },
  { name: 'Bicep Curl', emoji: '💪' },
  { name: 'Tricep Extension', emoji: '💪' },
  { name: 'Plank', emoji: '⏱️' },
  { name: 'Push-ups', emoji: '💪' },
  { name: 'Lunges', emoji: '🦵' },
];
const DAILY_CHALLENGE = { title: '50 Pull-ups', bonusXP: 100, emoji: '💪' };

// Animations
const styles = `
  @keyframes float {
    0% { transform: translateY(0) scale(1); opacity: 1; }
    50% { transform: translateY(-20px) scale(1.1); opacity: 0.8; }
    100% { transform: translateY(-40px) scale(1); opacity: 0; }
  }
  @keyframes pulse-glow {
    0%, 100% { box-shadow: 0 0 20px rgba(245, 196, 0, 0.3); }
    50% { box-shadow: 0 0 40px rgba(245, 196, 0, 0.6); }
  }
  @keyframes rank-pop {
    0% { transform: scale(1); }
    50% { transform: scale(1.1); }
    100% { transform: scale(1); }
  }
  .animate-float { animation: float 1.5s ease-out forwards; }
  .animate-pulse-glow { animation: pulse-glow 2s ease-in-out infinite; }
  .animate-rank-pop { animation: rank-pop 0.3s ease-out; }
  .shadow-lg-custom { box-shadow: 0 10px 40px -10px rgba(0,0,0,0.5); }
  .shadow-inner-glow { box-shadow: inset 0 2px 10px rgba(245, 196, 0, 0.1); }
`;

function FloatingXP({ amount }: { amount: number }) {
  return (
    <>
      <style>{styles}</style>
      <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-50">
        <div className="animate-float text-7xl font-black text-yellow-400 drop-shadow-2xl">+{amount} XP</div>
      </div>
    </>
  );
}

// Squad View Component - shows all group members
function SquadView({ user, group }: { user: { id: string; name: string; totalXP: number; streak: number } | null; group: { id: string; name: string; code: string } | null }) {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!group?.id) return;
    
    const groupId = group.id;
    
    async function fetchMembers() {
      try {
        const res = await fetch(`/api/group?groupId=${groupId}`);
        const data = await res.json();
        if (data.success) {
          setMembers(data.members || []);
        }
      } catch (e) {
        console.error('Failed to fetch members', e);
      } finally {
        setLoading(false);
      }
    }
    
    fetchMembers();
  }, [group?.id]);

  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white mb-4">👥 Your Squad</h2>
        <p className="text-gray-500 text-center">Loading...</p>
      </div>
    );
  }

  const sortedMembers = [...members].sort((a, b) => (b.totalXP || 0) - (a.totalXP || 0));

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-white">👥 Your Squad</h2>
        <span className="text-gray-500 text-sm">{group?.name}</span>
      </div>
      
      {members.length === 0 ? (
        <p className="text-gray-500 text-center">No squad members yet</p>
      ) : (
        sortedMembers.map((member, i) => (
          <div 
            key={member.id} 
            className={`bg-gray-900 rounded-xl border p-4 ${
              member.id === user?.id ? 'border-yellow-400/50' : 'border-gray-800'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="text-2xl font-black text-gray-600 w-8">
                #{i + 1}
              </div>
              <div className="w-12 h-12 rounded-xl bg-gray-800 flex items-center justify-center text-2xl">
                {member.id === user?.id ? '🎯' : '👤'}
              </div>
              <div className="flex-1">
                <p className={`font-bold ${member.id === user?.id ? 'text-yellow-400' : 'text-white'}`}>
                  {member.name || 'Unknown'} {member.id === user?.id && '(You)'}
                </p>
                <p className="text-gray-500 text-sm">Level {Math.floor((member.totalXP || 0) / 500) + 1}</p>
              </div>
              <div className="text-right">
                <p className="text-yellow-400 font-black text-xl">{(member.totalXP || 0).toLocaleString()}</p>
                <p className="text-orange-400 text-sm">🔥 {member.streak || 0}</p>
              </div>
            </div>
          </div>
        ))
      )}
      
      <div className="bg-gray-800/50 rounded-xl border border-gray-700 p-4 mt-6">
        <p className="text-gray-400 text-sm text-center">Share your squad code to invite friends</p>
        <p className="text-center text-2xl font-black text-yellow-400 mt-2">{group?.code || 'TEST'}</p>
      </div>
    </div>
  );
}

// Workout History Component - fetches from API
function WorkoutHistory({ user }: { user: { id: string; name: string } | null }) {
  const [workouts, setWorkouts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    
    const userId = user.id;
    
    async function fetchHistory() {
      try {
        const res = await fetch(`/api/workout?type=user&userId=${userId}`);
        const data = await res.json();
        if (data.success) {
          setWorkouts(data.workouts || []);
        }
      } catch (e) {
        console.error('Failed to fetch history', e);
      } finally {
        setLoading(false);
      }
    }
    
    fetchHistory();
  }, [user?.id]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white mb-4">📋 Workout History</h2>
        <p className="text-gray-500 text-center">Loading...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-white mb-4">📋 Workout History</h2>
      
      {workouts.length === 0 ? (
        <p className="text-gray-500 text-center">No workouts yet. Start logging!</p>
      ) : (
        workouts.map((workout) => (
          <div key={workout.id} className="bg-gray-900 rounded-xl border border-gray-800 p-4">
            <div className="flex justify-between items-center mb-2">
              <p className="font-bold text-white">
                {workout.exercises?.[0]?.name || 'Workout'}
              </p>
              <span className="text-yellow-400 font-black">+{workout.score} XP</span>
            </div>
            <p className="text-gray-500 text-sm">{formatDate(workout.date)}</p>
            {workout.exercises?.length > 0 && (
              <p className="text-gray-400 text-sm mt-2">
                {workout.exercises.length} exercise{workout.exercises.length > 1 ? 's' : ''}
              </p>
            )}
          </div>
        ))
      )}
    </div>
  );
}

interface Set {
  weight: number;
  reps: number;
  rpe: number;
  done: boolean;
}

export default function Dashboard() {
  const [user, setUser] = useState<{id: string; name: string; email: string; totalXP: number; streak: number; badges: string[]} | null>(null);
  const [group, setGroup] = useState<{id: string; name: string; code: string} | null>(null);
  const [rpe, setRpe] = useState(7);
  const [submitted, setSubmitted] = useState(false);
  const [activeTab, setActiveTab] = useState<'home' | 'log' | 'squad' | 'awards' | 'profile' | 'history'>('home');
  const [showQuickLog, setShowQuickLog] = useState(false);
  const [floatingXP, setFloatingXP] = useState<number | null>(null);
  const [restTimer, setRestTimer] = useState<number | null>(null);
  const [restTimeLeft, setRestTimeLeft] = useState(0);
  const [leaderboardPeriod, setLeaderboardPeriod] = useState<'daily' | 'weekly' | 'monthly' | 'lifetime'>('daily');
  const [currentExercise, setCurrentExercise] = useState('');
  const [sets, setSets] = useState<Set[]>([
    { weight: 135, reps: 10, rpe: 7, done: false },
    { weight: 135, reps: 10, rpe: 7, done: false },
    { weight: 135, reps: 10, rpe: 7, done: false },
  ]);
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem('ilift_user');
    const groupData = localStorage.getItem('ilift_group');
    const hasSeenOnboarding = localStorage.getItem('ilift_onboarding');
    
    if (!userData) {
      router.push('/');
    } else if (!hasSeenOnboarding) {
      // New user - show onboarding first
      router.push('/onboarding');
    } else {
      setUser(JSON.parse(userData)); 
      if (groupData) setGroup(JSON.parse(groupData)); 
    }
  }, [router]);

  // Rest timer countdown
  useEffect(() => {
    if (restTimer === null || restTimer <= 0) {
      if (restTimer !== null) {
        setRestTimer(null);
        setRestTimeLeft(0);
      }
      return;
    }
    const timeout = setTimeout(() => {
      setRestTimeLeft(restTimer - 1);
      setRestTimer(restTimer - 1);
    }, 1000);
    return () => clearTimeout(timeout);
  }, [restTimer]);

  const startRestTimer = (seconds: number) => {
    setRestTimeLeft(seconds);
    setRestTimer(seconds);
  };

  const currentLevel = Math.floor((user?.totalXP || 0) / 500) + 1;
  const xpToNextLevel = 500 - ((user?.totalXP || 0) % 500);
  const xpProgress = ((user?.totalXP || 0) % 500) / 500 * 100;

  const calculateScore = () => {
    const base = 50;
    const rpeMultiplier = rpe / 5;
    const streakBonus = user?.streak ? 1 + (user.streak * 0.05) : 1;
    return Math.floor(base * rpeMultiplier * streakBonus);
  };

  const updateSet = (index: number, field: keyof Set, value: number | boolean) => {
    const newSets = [...sets];
    newSets[index] = { ...newSets[index], [field]: value };
    setSets(newSets);
  };

  // Check for badge unlocks - from ilift-gamification skill
  const checkBadgeUnlocks = (totalXP: number, streak: number, existingBadges: string[]) => {
    const newBadges = [...existingBadges];
    const earnedBadgeIds = [];
    
    // First workout
    if (!existingBadges.includes('first_workout')) {
      newBadges.push('first_workout');
      earnedBadgeIds.push('first_workout');
    }
    // Streak badges
    if (streak >= 7 && !existingBadges.includes('streak_7')) {
      newBadges.push('streak_7');
      earnedBadgeIds.push('streak_7');
    }
    if (streak >= 30 && !existingBadges.includes('streak_30')) {
      newBadges.push('streak_30');
      earnedBadgeIds.push('streak_30');
    }
    if (streak >= 100 && !existingBadges.includes('streak_100')) {
      newBadges.push('streak_100');
      earnedBadgeIds.push('streak_100');
    }
    // XP badges
    if (totalXP >= 1000 && !existingBadges.includes('xp_1000')) {
      newBadges.push('xp_1000');
      earnedBadgeIds.push('xp_1000');
    }
    if (totalXP >= 5000 && !existingBadges.includes('xp_5000')) {
      newBadges.push('xp_5000');
      earnedBadgeIds.push('xp_5000');
    }
    if (totalXP >= 10000 && !existingBadges.includes('xp_10000')) {
      newBadges.push('xp_10000');
      earnedBadgeIds.push('xp_10000');
    }
    
    return { badges: newBadges, earned: earnedBadgeIds };
  };

  const quickLog = async (exerciseName: string) => {
    const score = calculateScore();
    setFloatingXP(score);
    
    // Call API to save workout
    if (user && group) {
      try {
        await fetch('/api/workout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            exercises: [{ name: exerciseName, sets: 3, reps: 10, weight: 135, rpe }],
            score,
            userName: user.name,
            userId: user.id,
            groupId: group.id
          })
        });
      } catch (e) {
        console.error('Failed to save workout', e);
      }
    }
    
    if (user) { 
      const newXP = (user.totalXP || 0) + score; 
      const newStreak = (user.streak || 0) + 1; 
      const { badges: newBadges, earned } = checkBadgeUnlocks(newXP, newStreak, user.badges || []);
      const updatedUser = { ...user, totalXP: newXP, streak: newStreak, badges: newBadges }; 
      setUser(updatedUser); 
      localStorage.setItem('ilift_user', JSON.stringify(updatedUser)); 
      
      // Show badge unlock notification if earned
      if (earned.length > 0) {
        // Could show a toast notification here
        console.log('Badges earned:', earned);
      }
    }
    setShowQuickLog(false);
    setSubmitted(true);
    setTimeout(() => { setSubmitted(false); }, 2500);
  };

  const logout = () => { localStorage.removeItem('ilift_user'); localStorage.removeItem('ilift_group'); router.push('/'); };

  const leaderboardData = {
    daily: [
      { name: 'Brenlee', score: 245, rank: 1, avatar: '👩', isTop3: true },
      { name: 'Taurus', score: 210, rank: 2, avatar: '👨', isTop3: true },
      { name: 'Sonk', score: 180, rank: 3, avatar: '🧑', isTop3: true },
      { name: user?.name || 'You', score: calculateScore(), rank: 4, isYou: true, avatar: '🎯' },
    ],
    weekly: [
      { name: 'Brenlee', score: 1245, rank: 1, avatar: '👩', isTop3: true },
      { name: 'Sonk', score: 980, rank: 2, avatar: '🧑', isTop3: true },
      { name: 'Taurus', score: 850, rank: 3, avatar: '👨', isTop3: true },
      { name: user?.name || 'You', score: calculateScore() * 5, rank: 4, isYou: true, avatar: '🎯' },
    ],
    monthly: [
      { name: 'Brenlee', score: 5245, rank: 1, avatar: '👩', isTop3: true },
      { name: 'Taurus', score: 3890, rank: 2, avatar: '👨', isTop3: true },
      { name: 'Sonk', score: 2450, rank: 3, avatar: '🧑', isTop3: true },
      { name: user?.name || 'You', score: calculateScore() * 20, rank: 4, isYou: true, avatar: '🎯' },
    ],
    lifetime: [
      { name: 'Brenlee', score: 24500, rank: 1, avatar: '👩', isTop3: true },
      { name: 'Taurus', score: 18900, rank: 2, avatar: '👨', isTop3: true },
      { name: 'Sonk', score: 12450, rank: 3, avatar: '🧑', isTop3: true },
      { name: user?.name || 'You', score: user?.totalXP || 0, rank: 4, isYou: true, avatar: '🎯' },
    ],
  };
  
  const currentLeaderboard = leaderboardData[leaderboardPeriod];
  const yourRank = currentLeaderboard.find(e => e.isYou)?.rank || 4;

  const feedPosts = [
    { id: 1, user: 'Brenlee', avatar: '👩', workout: 'Upper Body', exercises: ['Bench Press 3×10', 'Pull-ups 3×8', 'Overhead Press 3×10', 'Dips 3×12', 'Barbell Row 3×10'], minutes: 75, time: '2h ago', xp: 245, rpe: 8 },
    { id: 2, user: 'Taurus', avatar: '👨', workout: 'Leg Day', exercises: ['Squat 4×8', 'Leg Press 3×12', 'RDL 3×10', 'Leg Curl 3×12', 'Calf Raise 4×15'], minutes: 90, time: '4h ago', xp: 310, rpe: 9 },
  ];

  if (!user) return null;

  return (
    <>
      <style>{styles}</style>
      <div className="min-h-screen bg-gray-950 text-white">
        {/* Header */}
        <header className="px-4 pt-4 flex justify-between items-center pb-2">
          <h1 className="text-2xl font-black tracking-tight"><span className="text-yellow-400">i</span>LIFT</h1>
          <button onClick={logout} className="text-gray-500 hover:text-gray-300 transition-colors">✕</button>
        </header>

        {/* Tab Bar */}
        <div className="flex gap-1 px-4 mt-2">
          {[
            { id: 'home', label: 'Home' },
            { id: 'log', label: 'Log' },
            { id: 'squad', label: 'Squad' },
            { id: 'history', label: 'History' },
            { id: 'awards', label: 'Awards' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-3 text-sm font-bold transition-all border-b-2 ${
                activeTab === tab.id 
                  ? 'text-yellow-400 border-yellow-400' 
                  : 'text-gray-500 border-transparent hover:text-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-4 pb-28">
          {activeTab === 'home' && (
            <>
              {/* Your Rank Card - PROMINENT */}
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 p-5 mb-4 shadow-lg-custom relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/5 rounded-full blur-3xl"></div>
                <p className="text-gray-400 text-xs uppercase tracking-widest mb-2">Your Rank Today</p>
                <div className="flex items-center gap-5">
                  <div className="relative">
                    <span className="text-6xl font-black text-yellow-400 drop-shadow-lg">#{yourRank}</span>
                    {yourRank <= 3 && <div className="absolute -top-1 -right-2 text-2xl">🔥</div>}
                  </div>
                  <div className="flex-1">
                    <div className="bg-gray-800 rounded-full h-3 mb-2 shadow-inner">
                      <div className="bg-gradient-to-r from-yellow-400 to-orange-400 h-3 rounded-full transition-all duration-500" style={{ width: `${(5 - yourRank) * 20}%` }}></div>
                    </div>
                    <p className="text-gray-500 text-sm font-medium">{calculateScore()} XP today</p>
                  </div>
                </div>
              </div>

              {/* Leaderboard Period Toggle */}
              <div className="flex gap-2 mb-4">
                {(['daily', 'weekly', 'monthly', 'lifetime'] as const).map(p => (
                  <button 
                    key={p} 
                    onClick={() => setLeaderboardPeriod(p)} 
                    className={`px-4 py-2 text-sm font-bold rounded-lg transition-all ${
                      leaderboardPeriod === p 
                        ? 'bg-yellow-400 text-black shadow-lg shadow-yellow-400/30 scale-105' 
                        : 'bg-gray-800 text-gray-400 border border-gray-700 hover:border-gray-600'
                    }`}
                  >
                    {p === 'lifetime' ? '🏆 All Time' : p.charAt(0).toUpperCase() + p.slice(1)}
                  </button>
                ))}
              </div>

              {/* Leaderboard - HIERARCHY */}
              <div className="space-y-2">
                {currentLeaderboard.map((entry, i) => (
                  <div 
                    key={i} 
                    className={`flex items-center gap-3 p-4 rounded-xl border transition-all duration-200 hover:scale-[1.01] ${
                      entry.isYou 
                        ? 'bg-gradient-to-r from-yellow-400/10 to-transparent border-yellow-400/50 shadow-lg shadow-yellow-400/10' 
                        : entry.isTop3
                        ? 'bg-gradient-to-r from-gray-800 to-gray-900 border-gray-600'
                        : 'bg-gray-900 border-gray-800'
                    }`}
                  >
                    <span className={`text-2xl font-black w-10 text-center ${entry.isTop3 ? 'text-yellow-400' : 'text-gray-600'}`}>
                      {entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : entry.rank === 3 ? '🥉' : `#${entry.rank}`}
                    </span>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${entry.isYou ? 'bg-yellow-400/20 ring-2 ring-yellow-400' : 'bg-gray-800'}`}>
                      {entry.avatar}
                    </div>
                    <div className="flex-1">
                      <p className={`font-bold text-lg ${entry.isYou ? 'text-yellow-400' : 'text-white'}`}>
                        {entry.name} {entry.isYou && <span className="text-xs text-gray-500 ml-2">(You)</span>}
                      </p>
                      {entry.isTop3 && <p className="text-xs text-yellow-400/60">Top 3</p>}
                    </div>
                    <span className={`text-xl font-black ${entry.isYou ? 'text-yellow-400' : entry.isTop3 ? 'text-white' : 'text-gray-500'}`}>
                      {entry.score.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              {/* PRIMARY CTA - LOG WORKOUT */}
              <button 
                onClick={() => setActiveTab('log')} 
                className="w-full mt-6 py-5 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl font-black text-2xl text-black shadow-xl shadow-yellow-400/30 hover:shadow-yellow-400/50 hover:scale-[1.02] transition-all animate-pulse-glow"
              >
                💪 LOG WORKOUT
              </button>
            </>
          )}

          {activeTab === 'log' && (
            <>
              {/* Challenge Banner */}
              <div className="bg-gradient-to-r from-purple-900/50 to-purple-800/30 rounded-xl border border-purple-500/30 p-4 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-purple-300 font-bold">🏆 {DAILY_CHALLENGE.title}</span>
                  <span className="text-yellow-400 font-black text-lg">+{DAILY_CHALLENGE.bonusXP}</span>
                </div>
              </div>

              {!showQuickLog ? (
                <button 
                  onClick={() => setShowQuickLog(true)} 
                  className="w-full py-6 bg-gray-800 rounded-xl border-2 border-dashed border-gray-600 text-gray-400 font-bold hover:border-yellow-400 hover:text-yellow-400 transition-all mb-4"
                >
                  ⚡ Quick Log
                </button>
              ) : (
                <div className="space-y-3 mb-4">
                  <p className="text-gray-400 text-sm text-center font-medium">Tap to log:</p>
                  <div className="grid grid-cols-3 gap-2">
                    {QUICK_EXERCISES.map((ex, i) => (
                      <button 
                        key={i} 
                        onClick={() => quickLog(ex.name)} 
                        className="py-5 bg-gray-800 rounded-xl border border-gray-700 text-white font-bold hover:border-yellow-400 hover:scale-105 transition-all"
                      >
                        {ex.emoji} {ex.name}
                      </button>
                    ))}
                  </div>
                  <button onClick={() => setShowQuickLog(false)} className="w-full py-2 text-gray-500 text-sm hover:text-gray-400">← Back</button>
                </div>
              )}

              {/* Detailed Workout */}
              <div className="bg-gray-900 rounded-xl border border-gray-700 p-4 shadow-lg-custom">
                <input
                  type="text"
                  placeholder="Exercise name"
                  value={currentExercise}
                  onChange={(e) => setCurrentExercise(e.target.value)}
                  className="w-full p-4 rounded-lg bg-gray-800 border border-gray-700 text-white mb-4 focus:border-yellow-400 focus:outline-none transition-colors"
                />

                <div className="space-y-2 mb-4">
                  <div className="flex gap-2 text-xs text-gray-500 font-bold uppercase tracking-wide px-1">
                    <span className="w-8">Set</span>
                    <span className="flex-1 text-center">lbs</span>
                    <span className="flex-1 text-center">Reps</span>
                    <span className="flex-1 text-center">RPE</span>
                    <span className="w-8"></span>
                  </div>
                  {sets.map((set, i) => (
                    <div key={i} className="flex gap-2 items-center">
                      <span className="w-8 text-gray-400 font-bold">{i + 1}</span>
                      <input 
                        type="number" 
                        value={set.weight}
                        onChange={(e) => updateSet(i, 'weight', parseInt(e.target.value) || 0)}
                        className="flex-1 p-3 rounded-lg bg-gray-800 border border-gray-700 text-white text-center font-bold focus:border-yellow-400 focus:outline-none"
                      />
                      <input 
                        type="number" 
                        value={set.reps}
                        onChange={(e) => updateSet(i, 'reps', parseInt(e.target.value) || 0)}
                        className="flex-1 p-3 rounded-lg bg-gray-800 border border-gray-700 text-white text-center font-bold focus:border-yellow-400 focus:outline-none"
                      />
                      <input 
                        type="number" 
                        value={set.rpe}
                        onChange={(e) => updateSet(i, 'rpe', parseInt(e.target.value) || 0)}
                        className={`flex-1 p-3 rounded-lg text-center font-black ${
                          set.rpe >= 8 ? 'bg-red-500/20 text-red-400 border border-red-500/50' :
                          set.rpe >= 6 ? 'bg-yellow-400/20 text-yellow-400 border border-yellow-400/50' :
                          'bg-gray-700 text-gray-400 border border-gray-600'
                        }`}
                      />
                      <button 
                        onClick={() => updateSet(i, 'done', !set.done)}
                        className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold transition-all ${
                          set.done ? 'bg-green-500 text-white shadow-lg shadow-green-500/30' : 'bg-gray-700 text-gray-500 hover:bg-gray-600'
                        }`}
                      >
                        ✓
                      </button>
                    </div>
                  ))}
                </div>

                <button 
                  onClick={() => setSets([...sets, { weight: sets[sets.length-1]?.weight || 135, reps: sets[sets.length-1]?.reps || 10, rpe: 7, done: false }])}
                  className="w-full py-3 text-gray-500 text-sm border border-dashed border-gray-600 rounded-lg mb-4 hover:border-gray-500 hover:text-gray-400 transition-all"
                >
                  + Add Set
                </button>

                {/* RPE Bar */}
                <div className="flex justify-between items-center mb-3">
                  <span className="text-gray-400 font-medium">Effort Level</span>
                  <span className="text-yellow-400 font-black text-xl">{rpe}</span>
                </div>
                <div className="flex gap-1 mb-2">
                  {[5, 6, 7, 8, 9, 10].map(num => (
                    <button
                      key={num}
                      onClick={() => setRpe(num)}
                      className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all hover:scale-105 ${
                        rpe >= num 
                          ? rpe >= 8 ? 'bg-red-500 text-white shadow-lg shadow-red-500/30' : rpe >= 6 ? 'bg-yellow-400 text-black shadow-lg shadow-yellow-400/30' : 'bg-gray-600 text-white'
                          : 'bg-gray-700 text-gray-500'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>

                {/* Rest Timer */}
                <div className="mt-4">
                  <p className="text-gray-400 text-sm font-medium mb-2">⏱️ Rest Timer</p>
                  <div className="flex gap-2">
                    {[60, 90, 120, 180].map(seconds => (
                      <button
                        key={seconds}
                        onClick={() => startRestTimer(seconds)}
                        className="flex-1 py-2 bg-gray-800 rounded-lg text-sm font-bold text-gray-400 hover:bg-gray-700 hover:text-white transition-all border border-gray-700"
                      >
                        {seconds}s
                      </button>
                    ))}
                  </div>
                </div>

                {/* Score Preview */}
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg p-5 text-center mt-4 border border-gray-700 shadow-inner-glow">
                  <p className="text-gray-400 text-sm font-medium mb-1">You'll earn</p>
                  <p className="text-5xl font-black text-yellow-400 drop-shadow-lg">{calculateScore()} XP</p>
                </div>

                {/* Complete Workout Button */}
                <button 
                  onClick={async () => {
                    const score = calculateScore();
                    const exerciseName = currentExercise || 'Workout';
                    setFloatingXP(score);
                    
                    if (user && group) {
                      try {
                        await fetch('/api/workout', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            exercises: sets.filter(s => s.done).map(s => ({
                              name: currentExercise,
                              sets: 1,
                              reps: s.reps,
                              weight: s.weight,
                              rpe: s.rpe
                            })),
                            score,
                            userName: user.name,
                            userId: user.id,
                            groupId: group.id
                          })
                        });
                      } catch (e) {
                        console.error('Failed to save workout', e);
                      }
                    }
                    
                    if (user) { 
                      const newXP = (user.totalXP || 0) + score; 
                      const newStreak = (user.streak || 0) + 1; 
                      const { badges: newBadges, earned } = checkBadgeUnlocks(newXP, newStreak, user.badges || []);
                      const updatedUser = { ...user, totalXP: newXP, streak: newStreak, badges: newBadges }; 
                      setUser(updatedUser); 
                      localStorage.setItem('ilift_user', JSON.stringify(updatedUser)); 
                    }
                    setSubmitted(true);
                    setTimeout(() => { setSubmitted(false); setSets([
                      { weight: 135, reps: 10, rpe: 7, done: false },
                      { weight: 135, reps: 10, rpe: 7, done: false },
                      { weight: 135, reps: 10, rpe: 7, done: false },
                    ]); setCurrentExercise(''); }, 2500);
                  }}
                  disabled={!sets.some(s => s.done)}
                  className="w-full mt-4 py-4 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl font-black text-lg text-black shadow-lg shadow-yellow-400/30 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ✓ Complete Workout
                </button>
              </div>
            </>
          )}

          {activeTab === 'squad' && (
            <SquadView user={user} group={group} />
          )}

          {activeTab === 'history' && (
            <WorkoutHistory user={user} />
          )}

          {activeTab === 'awards' && (
            <div className="space-y-3">
              <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl border border-gray-700 p-4 mb-4">
                <p className="text-gray-400 text-sm">Your Badges</p>
                <p className="text-3xl font-black text-yellow-400">
                  {user?.badges?.length || 0} / {ACHIEVEMENTS.length}
                </p>
              </div>
              {ACHIEVEMENTS.map(ach => {
                const earned = user?.badges?.includes(ach.id);
                return (
                  <div 
                    key={ach.id} 
                    className={`rounded-xl border p-4 flex items-center gap-4 transition-all ${
                      earned 
                        ? 'bg-gray-900 border-yellow-400/50' 
                        : 'bg-gray-900/50 border-gray-800 opacity-50'
                    }`}
                  >
                    <div className={`text-3xl ${earned ? '' : 'grayscale'}`}>{ach.emoji}</div>
                    <div className="flex-1">
                      <p className={`font-bold ${earned ? 'text-white' : 'text-gray-500'}`}>{ach.name}</p>
                      <p className="text-gray-500 text-sm">{ach.desc}</p>
                    </div>
                    <div className={`font-black text-lg ${earned ? 'text-yellow-400' : 'text-gray-600'}`}>
                      {earned ? `+${ach.points}` : ach.points}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl border border-gray-700 p-6 text-center shadow-lg-custom">
                <div className="w-24 h-24 rounded-2xl bg-gray-800 flex items-center justify-center text-5xl mx-auto mb-4 ring-4 ring-yellow-400/20">
                  🎯
                </div>
                <h2 className="text-2xl font-black text-white">{user.name}</h2>
                <p className="text-gray-400">{user.email}</p>
                
                {/* Level Progress */}
                <div className="mt-5 bg-gray-900 rounded-xl p-4 border border-gray-700">
                  <div className="flex justify-between items-center mb-3">
                    <span className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black text-sm font-bold px-3 py-1 rounded-lg">Lvl {currentLevel}</span>
                    <span className="text-gray-500 text-sm">{xpToNextLevel} XP to Level {currentLevel + 1}</span>
                  </div>
                  <div className="bg-gray-800 rounded-full h-3 shadow-inner">
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-400 h-3 rounded-full transition-all duration-500" style={{ width: `${xpProgress}%` }}></div>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-gray-900 rounded-xl border border-gray-800 p-4 text-center hover:border-yellow-400/50 transition-all">
                  <p className="text-3xl font-black text-yellow-400">{(user.totalXP || 0).toLocaleString()}</p>
                  <p className="text-gray-500 text-xs font-medium mt-1">Total XP</p>
                </div>
                <div className="bg-gray-900 rounded-xl border border-gray-800 p-4 text-center hover:border-orange-400/50 transition-all">
                  <p className="text-3xl font-black text-orange-400">🔥 {user.streak || 0}</p>
                  <p className="text-gray-500 text-xs font-medium mt-1">Streak</p>
                </div>
                <div className="bg-gray-900 rounded-xl border border-gray-800 p-4 text-center hover:border-gray-600 transition-all">
                  <p className="text-3xl font-black text-white">{user.badges?.length || 0}</p>
                  <p className="text-gray-500 text-xs font-medium mt-1">Badges</p>
                </div>
              </div>

              {/* Group Code */}
              <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl border border-gray-700 p-5">
                <p className="text-gray-400 text-sm mb-2">Squad Code</p>
                <p className="text-4xl font-black text-yellow-400 tracking-widest">{group?.code || 'TEST'}</p>
              </div>
            </div>
          )}
        </div>
        
        {floatingXP && <FloatingXP amount={floatingXP} />}
        
        {/* Rest Timer Modal */}
        {restTimer !== null && restTimer > 0 && (
          <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
            <div className="text-center">
              <p className="text-gray-400 text-xl mb-4">Rest Timer</p>
              <div className="text-8xl font-black text-yellow-400 mb-8">{restTimeLeft}</div>
              <div className="flex gap-3 justify-center">
                <button 
                  onClick={() => { setRestTimer(null); setRestTimeLeft(0); }}
                  className="px-6 py-3 bg-gray-700 rounded-xl font-bold text-white"
                >
                  Skip
                </button>
                <button 
                  onClick={() => setRestTimeLeft(restTimeLeft + 30)}
                  className="px-6 py-3 bg-yellow-400 rounded-xl font-bold text-black"
                >
                  +30s
                </button>
              </div>
            </div>
          </div>
        )}
        
        {submitted && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-40">
            <div className="text-center animate-bounce">
              <div className="text-8xl mb-4">🎉</div>
              <h2 className="text-5xl font-black text-white mb-2">LOGGED!</h2>
              <p className="text-3xl text-yellow-400 font-black">+{calculateScore()} XP</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
