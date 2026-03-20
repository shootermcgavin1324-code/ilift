// ProfileTab Component
// User profile with stats, badges, and settings

import { Target, Flame, Award } from 'lucide-react';

interface User {
  name: string;
  email: string;
  total_xp: number;
  streak: number;
  badges: string[];
  onboarding?: {
    fitnessGoal?: string;
    weight?: number;
    height?: number;
    experience?: string;
    workoutDays?: number;
  };
}

interface ProfileTabProps {
  user: User;
  currentLevel: number;
  group_id?: string;
  onLogout: () => void;
}

const ACHIEVEMENTS = [
  { id: 'first_workout', name: 'First Steps', desc: 'Complete first workout', points: 50 },
  { id: 'verified', name: 'Verified', desc: 'Upload video proof', points: 150 },
  { id: 'streak_7', name: 'On Fire', desc: '7 day streak', points: 100 },
  { id: 'streak_30', name: 'Unstoppable', desc: '30 day streak', points: 250 },
  { id: 'streak_100', name: 'Legend', desc: '100 day streak', points: 500 },
  { id: 'workout_100', name: 'Workout Club', desc: 'Complete 100 workouts', points: 300 },
  { id: 'xp_1000', name: 'Rising Star', desc: 'Earn 1000 XP', points: 200 },
  { id: 'xp_5000', name: 'XP Master', desc: 'Earn 5000 XP', points: 500 },
  { id: 'xp_10000', name: 'XP Legend', desc: 'Earn 10000 XP', points: 1000 },
];

export default function ProfileTab({ user, currentLevel }: ProfileTabProps) {
  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="bg-gray-950 rounded-xl p-6 text-center">
        <div className="w-20 h-20 rounded-full bg-gray-900 flex items-center justify-center mx-auto mb-3">
          <span className="text-3xl font-black text-gray-600">{user.name?.charAt(0)}</span>
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

      {/* Stats Grid */}
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
            {user.onboarding.workoutDays && (
              <div className="bg-gray-900 rounded-lg p-3">
                <p className="text-gray-400 text-xs">Days/Week</p>
                <p className="text-white font-bold">{user.onboarding.workoutDays}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Achievements */}
      <div className="bg-gray-950 rounded-xl p-4">
        <p className="text-gray-400 text-sm mb-3">Achievements ({user.badges?.length || 0}/{ACHIEVEMENTS.length})</p>
        <div className="space-y-2">
          {ACHIEVEMENTS.map(ach => {
            const earned = user.badges?.includes(ach.id);
            return (
              <div 
                key={ach.id} 
                className={`flex items-center gap-3 p-2 rounded-lg ${earned ? 'bg-yellow-500/10' : 'bg-gray-900'}`}
              >
                <span className="text-xl">{earned ? '🏆' : '🔒'}</span>
                <div className="flex-1">
                  <p className={`font-bold text-sm ${earned ? 'text-white' : 'text-gray-500'}`}>{ach.name}</p>
                  <p className="text-gray-500 text-xs">{ach.desc}</p>
                </div>
                <span className={`font-black text-sm ${earned ? 'text-yellow-500' : 'text-gray-600'}`}>+{ach.points}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* PRs Section */}
      {(() => {
        if (typeof window === 'undefined') return null;
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

      {/* Squad Code */}
      <div className="bg-gray-950 rounded-xl p-4">
        <p className="text-gray-400 text-sm mb-2">Squad Code</p>
        <p className="text-4xl font-black text-yellow-500">{group_id || 'TEST'}</p>
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
        onClick={onLogout}
        className="w-full py-3 bg-red-500/20 text-red-400 rounded-xl font-bold border border-red-500/30"
      >
        Log Out
      </button>
    </div>
  );
}
