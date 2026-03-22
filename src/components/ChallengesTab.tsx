// ChallengesTab Component
// Displays daily, weekly, monthly, and lifetime challenges

import { Clock, Calendar, Trophy, Flame, Dumbbell, Zap } from 'lucide-react';
import { User } from '@/lib/data';

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

function ChallengeCard({ challenge, progress, color, earned }: ChallengeCardProps) {
  return (
    <div className={`bg-gray-950 rounded-xl p-4 ${earned ? 'border-2 border-yellow-500/50' : ''}`}>
      <div className="flex justify-between items-start mb-2">
        <div>
          <p className="font-bold">{challenge.name}</p>
          <p className="text-gray-400 text-sm">{challenge.desc}</p>
        </div>
        <div className="text-right">
          <p className={`font-black ${earned ? 'text-green-400' : 'text-yellow-500'}`}>
            {earned ? '✓' : `+${challenge.xp} XP`}
          </p>
        </div>
      </div>
      <div className="bg-gray-900 rounded-full h-2">
        <div 
          className="h-2 rounded-full transition-all" 
          style={{ width: `${progress}%`, background: color }}
        ></div>
      </div>
      <p className="text-gray-600 text-xs mt-1">
        {earned ? 'Completed!' : `${progress}% complete`}
      </p>
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
  const calculateProgress = (challenge: Challenge): { progress: number; earned: boolean } => {
    const { target, id } = challenge;
    let current = 0;
    
    switch (id) {
      // Daily
      case 'daily_50pushups':
        current = Math.min(target, todaysPushups);
        break;
      case 'daily_logworkout':
        current = todaysWorkouts.length > 0 ? 1 : 0;
        break;
      case 'daily_3sets':
        current = Math.min(target, todaysSets);
        break;
        
      // Weekly
      case 'weekly_5workouts':
        current = Math.min(target, weekWorkouts.length);
        break;
      case 'weekly_streak3':
        current = Math.min(target, user.streak || 0);
        break;
        
      // Monthly
      case 'monthly_20workouts':
        current = Math.min(target, workouts.length); // Would need month filter
        break;
      case 'monthly_5000xp':
        current = Math.min(target, user.total_xp || 0);
        break;
        
      // Lifetime
      case 'lifetime_100workouts':
        current = Math.min(target, workouts.length);
        break;
      case 'lifetime_10kxp':
        current = Math.min(target, user.total_xp || 0);
        break;
      case 'lifetime_30daystreak':
        current = Math.min(target, user.streak || 0);
        break;
        
      default:
        current = 0;
    }
    
    const progress = Math.min(100, Math.round((current / target) * 100));
    const earned = current >= target;
    return { progress, earned };
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
      
      <h2 className="text-xl font-bold">Challenges</h2>

      {/* Daily */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Clock size={18} className="text-yellow-500" />
          <h3 className="text-lg font-bold">Daily</h3>
        </div>
        <div className="space-y-2">
          {dailyChallenges.map((ch) => {
            const { progress, earned } = calculateProgress(ch);
            return (
              <ChallengeCard 
                key={ch.id}
                challenge={ch}
                progress={progress}
                color="linear-gradient(90deg, #eab308, #f97316)"
                earned={earned}
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
            const { progress, earned } = calculateProgress(ch);
            return (
              <ChallengeCard 
                key={ch.id}
                challenge={ch}
                progress={progress}
                color="linear-gradient(90deg, #f97316, #ef4444)"
                earned={earned}
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
            const { progress, earned } = calculateProgress(ch);
            return (
              <ChallengeCard 
                key={ch.id}
                challenge={ch}
                progress={progress}
                color="linear-gradient(90deg, #a855f7, #ec4899)"
                earned={earned}
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
            const { progress, earned } = calculateProgress(ch);
            return (
              <ChallengeCard 
                key={ch.id}
                challenge={ch}
                progress={progress}
                color="linear-gradient(90deg, #eab308, #d97706)"
                earned={earned}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
