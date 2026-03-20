// ChallengesTab Component
// Displays daily, weekly, monthly, and lifetime challenges

import { Clock, Calendar, Trophy } from 'lucide-react';

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

interface ChallengeCardProps {
  name: string;
  desc: string;
  xp: number;
  progress: number;
  color: string;
}

function ChallengeCard({ name, desc, xp, progress, color }: ChallengeCardProps) {
  return (
    <div className="bg-gray-950 rounded-xl p-4">
      <div className="flex justify-between items-start mb-2">
        <div>
          <p className="font-bold">{name}</p>
          <p className="text-gray-400 text-sm">{desc}</p>
        </div>
        <div className="text-right">
          <p className="text-yellow-500 font-black">+{xp} XP</p>
        </div>
      </div>
      <div className="bg-gray-900 rounded-full h-2">
        <div 
          className="h-2 rounded-full transition-all" 
          style={{ width: `${progress}%`, background: color }}
        ></div>
      </div>
      <p className="text-gray-600 text-xs mt-1">{progress}% complete</p>
    </div>
  );
}

export default function ChallengesTab() {
  return (
    <div className="p-4 space-y-6">
      <h2 className="text-xl font-bold">Challenges</h2>

      {/* Daily */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Clock size={18} className="text-yellow-500" />
          <h3 className="text-lg font-bold">Daily</h3>
        </div>
        <div className="space-y-2">
          {CHALLENGES.daily.map((ch) => (
            <ChallengeCard 
              key={ch.id}
              name={ch.name}
              desc={ch.desc}
              xp={ch.xp}
              progress={Math.min(100, Math.floor(Math.random() * 100))}
              color="linear-gradient(90deg, #eab308, #f97316)"
            />
          ))}
        </div>
      </div>

      {/* Weekly */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Calendar size={18} className="text-orange-400" />
          <h3 className="text-lg font-bold">Weekly</h3>
        </div>
        <div className="space-y-2">
          {CHALLENGES.weekly.map((ch) => (
            <ChallengeCard 
              key={ch.id}
              name={ch.name}
              desc={ch.desc}
              xp={ch.xp}
              progress={Math.min(100, Math.floor(Math.random() * 80))}
              color="linear-gradient(90deg, #f97316, #ef4444)"
            />
          ))}
        </div>
      </div>

      {/* Monthly */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Calendar size={18} className="text-purple-400" />
          <h3 className="text-lg font-bold">Monthly</h3>
        </div>
        <div className="space-y-2">
          {CHALLENGES.monthly.map((ch) => (
            <ChallengeCard 
              key={ch.id}
              name={ch.name}
              desc={ch.desc}
              xp={ch.xp}
              progress={Math.min(100, Math.floor(Math.random() * 60))}
              color="linear-gradient(90deg, #a855f7, #ec4899)"
            />
          ))}
        </div>
      </div>

      {/* Lifetime */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Trophy size={18} className="text-yellow-500" />
          <h3 className="text-lg font-bold">All-Time</h3>
        </div>
        <div className="space-y-2">
          {CHALLENGES.lifetime.map((ch) => (
            <ChallengeCard 
              key={ch.id}
              name={ch.name}
              desc={ch.desc}
              xp={ch.xp}
              progress={Math.min(100, Math.floor(Math.random() * 40))}
              color="linear-gradient(90deg, #eab308, #d97706)"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
