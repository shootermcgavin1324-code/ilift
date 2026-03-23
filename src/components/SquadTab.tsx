// SquadTab Component
// Displays squad members and leaderboard

'use client';
import { useState } from 'react';
import { Send } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'system';
  name: string;
  text: string;
  time: string;
}

interface SquadTabProps {
  user: any;
  leaderboard: any[];
}

export default function SquadTab({ user, leaderboard }: SquadTabProps) {
  // Find user's rank
  const userRank = leaderboard.findIndex((m: any) => m.id === user.id) + 1;
  const nextPlayer = userRank > 0 && userRank < leaderboard.length ? leaderboard[userRank] : null;
  const xpToPass = nextPlayer ? Math.max(0, (nextPlayer.total_xp || 0) - (user.total_xp || 0)) : 0;
  
  // Chat state
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', type: 'system', name: 'System', text: 'Welcome to the squad chat!', time: 'now' },
    { id: '2', type: 'user', name: user.name || 'You', text: 'Lets go everyone 💪', time: '1m' },
  ]);
  const [inputValue, setInputValue] = useState('');
  
  const handleSend = () => {
    if (!inputValue.trim()) return;
    const newMsg: Message = {
      id: Date.now().toString(),
      type: 'user',
      name: user.name || 'You',
      text: inputValue.trim(),
      time: 'now'
    };
    setMessages([...messages, newMsg]);
    setInputValue('');
  };
  
  return (
    <div className="p-4 space-y-4">
      {/* Squad Status Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">SQUAD</h2>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          <span className="text-xs text-green-500 font-bold">LIVE</span>
        </div>
      </div>

      {/* User Rank Status */}
      {userRank > 0 && (
        <div className="bg-gray-900 rounded-xl p-4 border border-yellow-500/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Your Rank</p>
              <p className="text-3xl font-black text-white">#{userRank}</p>
            </div>
            {nextPlayer && xpToPass > 0 && (
              <div className="text-right">
                <p className="text-gray-400 text-sm">To pass #{userRank + 1}</p>
                <p className="text-xl font-bold text-yellow-400">+{xpToPass.toLocaleString()} XP</p>
              </div>
            )}
            {userRank === 1 && (
              <div className="text-right">
                <p className="text-yellow-400 text-sm font-bold">👑 LEADING</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Leaderboard Section */}
      <div>
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Leaderboard</h3>
        <p className="text-gray-500 text-xs mb-2">People in your group ({user.group_id})</p>

      {leaderboard.length === 0 ? (
        <div className="text-center py-8 bg-gray-950/50 rounded-xl">
          <p className="text-gray-400">No one else in your squad yet!</p>
          <p className="text-gray-600 text-sm mt-1">Share the squad code: <span className="text-yellow-500 font-bold">{user.group_id}</span></p>
        </div>
      ) : (
        <div className="space-y-2">
          {leaderboard.map((member: any, i: number) => {
            const xpDiff = (user.total_xp || 0) - (member.total_xp || 0);
            const isCurrentUser = member.id === user.id;
            const hasRecentActivity = member.last_activity && (Date.now() - new Date(member.last_activity).getTime()) < 24 * 60 * 60 * 1000;
            
            return (
              <div 
                key={member.id || member.email || i} 
                className={`bg-gray-950 rounded-xl p-4 flex items-center gap-3 ${isCurrentUser ? 'border-2 border-yellow-400/50 shadow-[0_0_15px_rgba(234,179,8,0.2)]' : 'border border-transparent hover:border-gray-800'}`}
              >
                {i === 0 && <span className="text-2xl">🥇</span>}
                {i === 1 && <span className="text-2xl">🥈</span>}
                {i === 2 && <span className="text-2xl">🥉</span>}
                {i > 2 && <span className="text-xl font-black text-gray-600 w-6">#{i + 1}</span>}
                
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center">
                    <span className="text-lg font-bold text-gray-600">{member.name?.charAt(0)}</span>
                  </div>
                  {/* Activity indicator */}
                  {hasRecentActivity && (
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-950"></span>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className={`font-bold truncate ${isCurrentUser ? 'text-yellow-400' : ''}`}>
                      {member.name}
                    </p>
                    {isCurrentUser && (
                      <span className="text-[10px] font-black bg-yellow-500 text-black px-1.5 py-0.5 rounded">YOU</span>
                    )}
                    {hasRecentActivity && !isCurrentUser && (
                      <span className="text-xs text-green-400">active</span>
                    )}
                  </div>
                  {/* Show level with prestige */}
                  {(() => {
                    const memberLevel = Math.floor((member.total_xp || 0) / 55000);
                    const level = Math.floor(((member.total_xp || 0) % 55000) / 500) + 1;
                    const stars = memberLevel > 0 ? '⭐'.repeat(Math.min(memberLevel, 10)) : '';
                    return (
                      <p className="text-gray-500 text-xs">
                        {memberLevel > 0 ? `Prestige ${memberLevel}${stars} ` : ''}Level {level}
                      </p>
                    );
                  })()}
                </div>
                
                <div className="text-right">
                  <p className="text-yellow-500 font-black">{(member.total_xp || 0).toLocaleString()}</p>
                  {!isCurrentUser && (
                    <p className={`text-xs ${xpDiff > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {xpDiff > 0 ? `+${xpDiff}` : `${xpDiff}`}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Feed Section */}
      <div>
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Feed & Chat</h3>
        <div className="bg-gray-900/50 rounded-xl p-3 space-y-2 max-h-40 overflow-y-auto">
          {/* System events */}
          <div className="flex items-center gap-2 text-sm">
            <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
            <span className="text-gray-300"><span className="font-bold text-yellow-400">You</span> logged a workout</span>
            <span className="text-gray-600 text-xs ml-auto">now</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            <span className="text-gray-300"><span className="font-bold">Alex</span> earned +50 XP</span>
            <span className="text-gray-600 text-xs ml-auto">2m</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            <span className="text-gray-300"><span className="font-bold">Sam</span> passed <span className="text-gray-400">Lisa</span></span>
            <span className="text-gray-600 text-xs ml-auto">5m</span>
          </div>
          
          {/* Chat messages */}
          {messages.map((msg) => (
            <div key={msg.id} className={`flex items-center gap-2 text-sm ${msg.type === 'user' ? 'bg-gray-800/50 -mx-2 px-2 py-1 rounded' : ''}`}>
              <span className={`w-2 h-2 rounded-full ${msg.type === 'user' ? 'bg-blue-500' : 'bg-gray-500'}`}></span>
              <span className={`font-bold ${msg.type === 'user' ? 'text-blue-400' : 'text-gray-400'}`}>{msg.name}:</span>
              <span className="text-gray-300">{msg.text}</span>
              <span className="text-gray-600 text-xs ml-auto">{msg.time}</span>
            </div>
          ))}
        </div>
        
        {/* Chat Input */}
        <div className="space-y-1">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value.slice(0, 140))}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Say something..."
              maxLength={140}
              className="flex-1 bg-gray-900 border border-gray-800 rounded-xl px-4 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-yellow-500/50"
            />
            <button 
              onClick={handleSend}
              disabled={!inputValue.trim()}
              className="bg-yellow-500 hover:bg-yellow-400 disabled:bg-gray-800 disabled:text-gray-600 text-black p-2 rounded-xl transition-colors"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs text-gray-600 text-right">{inputValue.length}/140</p>
        </div>
      </div>
      </div>
      
      {/* Invite Button */}
      <button className="w-full bg-gray-900 hover:bg-gray-800 border border-gray-800 hover:border-yellow-500/30 text-white py-3 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2">
        <span className="text-lg">+</span> Invite Teammates
      </button>
    </div>
  );
}
