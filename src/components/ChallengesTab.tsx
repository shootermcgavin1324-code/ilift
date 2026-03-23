// ChallengesTab Component
// Displays daily, weekly, monthly, and lifetime challenges

'use client';

import { motion } from 'framer-motion';
import { Clock, Calendar, Trophy, Flame, Dumbbell, Zap, Video, Star } from 'lucide-react';
import { User } from '@/lib/data';
import { CHALLENGES } from '@/lib/challenges';

interface Challenge {
  id: string;
  name: string;
  desc: string;
  target: number;
  unit: string;
  xp: number;
  type: 'daily' | 'weekly' | 'monthly' | 'lifetime';
}

interface ChallengeCardProps {
  challenge: Challenge;
  progress: number;
  color: string;
  earned: boolean;
}

function ChallengeCard({ challenge, progress, color, earned, remaining }: ChallengeCardProps & { remaining: string }) {
  return (
    <div className={`rounded-xl p-4 transition-all ${earned ? 'bg-gray-900/50 border-2 border-green-500/30 opacity-60' : 'bg-gray-950 border-2 border-transparent hover:border-yellow-500/20'}`}>
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          {earned && (
            <span className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
              <svg className="w-3 h-3 text-black" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </span>
          )}
          <div>
            <p className={`font-bold ${earned ? 'text-gray-400 line-through' : ''}`}>{challenge.name}</p>
            <p className="text-gray-500 text-sm">{challenge.desc}</p>
          </div>
        </div>
        <div className="text-right">
          <p className={`font-black ${earned ? 'text-green-400' : 'text-yellow-500'}`}>
            {earned ? '✓' : `+${challenge.xp} XP`}
          </p>
        </div>
      </div>
      <div className="bg-gray-900 rounded-full h-2 overflow-hidden">
        <div 
          className="h-2 rounded-full transition-all" 
          style={{ width: `${progress}%`, background: earned ? '#22c55e' : color }}
        ></div>
      </div>
      <div className="flex justify-between items-center mt-1">
        <p className={`text-xs ${earned ? 'text-green-400' : 'text-gray-500'}`}>
          {earned ? 'Completed!' : `${progress}% complete`}
        </p>
        {!earned && (
          <p className="text-xs text-yellow-400 font-medium">{remaining}</p>
        )}
      </div>
    </div>
  );
}

interface ChallengesTabProps {
  user: User;
  workouts?: any[];
}

export default function ChallengesTab({ user, workouts = [] }: ChallengesTabProps) {
  const today = new Date().toISOString().split('T')[0];
  
  // Get today's date string
  const getTodayDate = () => new Date().toISOString().split('T')[0];
  
  // Calculate today's stats
  const todaysWorkouts = workouts.filter(w => w.date && w.date.startsWith(today));
  const todaysSets = todaysWorkouts.length;
  const todaysPushups = todaysWorkouts
    .filter(w => w.exercise?.toLowerCase().includes('push'))
    .reduce((sum, w) => sum + (w.score || 0), 0);
  
  // Calculate this week's workouts
  const startOfWeek = new Date();
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
  const weekWorkouts = workouts.filter(w => w.date && new Date(w.date) >= startOfWeek);
  
  // Calculate progress for each challenge
  const calculateProgress = (challenge: Challenge): { progress: number; earned: boolean; remaining: string } => {
    const { target, id } = challenge;
    let current = 0;
    let remaining = '';
    
    switch (id) {
      // Daily
      case 'daily_50pushups':
        current = Math.min(target, todaysPushups);
        remaining = `${target - current} pushups left`;
        break;
      case 'daily_logworkout':
        current = todaysWorkouts.length > 0 ? 1 : 0;
        remaining = current > 0 ? 'Done!' : '1 workout to go';
        break;
      case 'daily_3sets':
        current = Math.min(target, todaysSets);
        remaining = `${target - current} sets left`;
        break;
        
      // Weekly
      case 'weekly_5workouts':
        current = Math.min(target, weekWorkouts.length);
        remaining = `${target - current} workouts left`;
        break;
      case 'weekly_streak3':
        current = Math.min(target, user.streak || 0);
        remaining = `${target - current} days left`;
        break;
        
      // Monthly
      case 'monthly_20workouts':
        current = Math.min(target, workouts.length);
        remaining = `${target - current} workouts left`;
        break;
      case 'monthly_5000xp':
        current = Math.min(target, user.total_xp || 0);
        remaining = `${target - current} XP to go`;
        break;
        
      // Lifetime
      case 'lifetime_100workouts':
        current = Math.min(target, workouts.length);
        remaining = `${target - current} workouts left`;
        break;
      case 'lifetime_10kxp':
        current = Math.min(target, user.total_xp || 0);
        remaining = `${target - current} XP to go`;
        break;
      case 'lifetime_30daystreak':
        current = Math.min(target, user.streak || 0);
        remaining = `${target - current} days left`;
        break;
        
      default:
        current = 0;
        remaining = 'In progress';
    }
    
    const progress = Math.min(100, Math.round((current / target) * 100));
    const earned = current >= target;
    return { progress, earned, remaining };
  };
  
  // Flatten challenges with their type
  const allChallenges = [
    ...CHALLENGES.daily.map(c => ({ ...c, type: 'daily' as const })),
    ...CHALLENGES.weekly.map(c => ({ ...c, type: 'weekly' as const })),
    ...CHALLENGES.monthly.map(c => ({ ...c, type: 'monthly' as const })),
    ...CHALLENGES.lifetime.map(c => ({ ...c, type: 'lifetime' as const })),
  ];
  
  const dailyChallenges = allChallenges.filter(c => c.type === 'daily');
  const weeklyChallenges = allChallenges.filter(c => c.type === 'weekly');
  const monthlyChallenges = allChallenges.filter(c => c.type === 'monthly');
  const lifetimeChallenges = allChallenges.filter(c => c.type === 'lifetime');
  
  return (
    <div className="p-4 space-y-6">
      {/* User Stats Summary */}
      <div className="bg-gray-900 rounded-xl p-4 flex justify-around">
        <div className="text-center">
          <Flame className="w-6 h-6 text-orange-500 mx-auto mb-1" />
          <p className="text-xl font-black">{user.streak || 0}</p>
          <p className="text-xs text-gray-400">Streak</p>
        </div>
        <div className="text-center">
          <Zap className="w-6 h-6 text-yellow-500 mx-auto mb-1" />
          <p className="text-xl font-black">{user.total_xp || 0}</p>
          <p className="text-xs text-gray-400">Total XP</p>
        </div>
        <div className="text-center">
          <Dumbbell className="w-6 h-6 text-blue-500 mx-auto mb-1" />
          <p className="text-xl font-black">{workouts.length}</p>
          <p className="text-xs text-gray-400">Workouts</p>
        </div>
      </div>

      {/* Featured Challenge Section */}
      {(() => {
        // Find active (not completed) challenge to feature
        const activeChallenge = allChallenges.find(c => {
          const { earned } = calculateProgress(c);
          return !earned;
        });
        
        if (!activeChallenge) return null;
        
        const { progress, remaining } = calculateProgress(activeChallenge);
        
        const getTypeColor = (type: string) => {
          switch (type) {
            case 'daily': return 'from-yellow-500 to-orange-500';
            case 'weekly': return 'from-orange-500 to-red-500';
            case 'monthly': return 'from-purple-500 to-pink-500';
            case 'lifetime': return 'from-yellow-500 to-amber-600';
            default: return 'from-yellow-500 to-orange-500';
          }
        };
        
        return (
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-5 border-2 border-yellow-500/30 relative overflow-hidden">
            {/* Background glow */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-yellow-500/10 rounded-full blur-2xl"></div>
            
            <div className="flex items-center gap-2 mb-3">
              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              <span className="text-yellow-400 text-sm font-bold uppercase tracking-wider">Featured Challenge</span>
            </div>
            
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="text-2xl font-black text-white mb-1">{activeChallenge.name}</p>
                <p className="text-gray-400">{activeChallenge.desc}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-black text-yellow-400">+{activeChallenge.xp} XP</p>
              </div>
            </div>
            
            {/* Progress bar */}
            <div className="bg-gray-950 rounded-full h-3 mb-3 overflow-hidden">
              <div 
                className="h-full rounded-full bg-gradient-to-r shadow-lg"
                style={{ width: `${progress}%`, background: `linear-gradient(90deg, #eab308, #f97316)` }}
              ></div>
            </div>
            
            <div className="flex justify-between items-center">
              <p className="text-gray-500 text-sm">{progress}% complete • <span className="text-yellow-400">{remaining}</span></p>
              <button 
                className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-2 rounded-lg text-sm transition-colors border border-gray-700"
                disabled
              >
                <Video className="w-4 h-4" />
                <span>Upload Video</span>
              </button>
            </div>
          </div>
        );
      })()}
      
      <h2 className="text-xl font-bold">Challenges</h2>

      {/* Daily */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Clock size={18} className="text-yellow-500" />
          <h3 className="text-lg font-bold">Daily</h3>
        </div>
        <div className="space-y-2">
          {dailyChallenges.map((ch) => {
            const { progress, earned, remaining } = calculateProgress(ch);
            return (
              <ChallengeCard 
                key={ch.id}
                challenge={ch}
                progress={progress}
                color="linear-gradient(90deg, #eab308, #f97316)"
                earned={earned}
                remaining={remaining}
              />
            );
          })}
        </div>
      </div>

      {/* Weekly */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Calendar size={18} className="text-orange-400" />
          <h3 className="text-lg font-bold">Weekly</h3>
        </div>
        <div className="space-y-2">
          {weeklyChallenges.map((ch) => {
            const { progress, earned, remaining } = calculateProgress(ch);
            return (
              <ChallengeCard 
                key={ch.id}
                challenge={ch}
                progress={progress}
                color="linear-gradient(90deg, #f97316, #ef4444)"
                earned={earned}
                remaining={remaining}
              />
            );
          })}
        </div>
      </div>

      {/* Monthly */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Calendar size={18} className="text-purple-400" />
          <h3 className="text-lg font-bold">Monthly</h3>
        </div>
        <div className="space-y-2">
          {monthlyChallenges.map((ch) => {
            const { progress, earned, remaining } = calculateProgress(ch);
            return (
              <ChallengeCard 
                key={ch.id}
                challenge={ch}
                progress={progress}
                color="linear-gradient(90deg, #a855f7, #ec4899)"
                earned={earned}
                remaining={remaining}
              />
            );
          })}
        </div>
      </div>

      {/* Lifetime */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Trophy size={18} className="text-yellow-500" />
          <h3 className="text-lg font-bold">All-Time</h3>
        </div>
        <div className="space-y-2">
          {lifetimeChallenges.map((ch) => {
            const { progress, earned, remaining } = calculateProgress(ch);
            return (
              <ChallengeCard 
                key={ch.id}
                challenge={ch}
                progress={progress}
                color="linear-gradient(90deg, #eab308, #d97706)"
                earned={earned}
                remaining={remaining}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
