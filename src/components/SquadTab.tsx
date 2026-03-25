// SquadTab Component
// Displays squad members and leaderboard

'use client';
import { useState, useEffect } from 'react';
import { Send, Share2, Copy, Check } from 'lucide-react';
import ProfileModal from './ProfileModal';
import { getGroupMessages, sendGroupMessage } from '@/lib/storage';

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
  const [selectedProfile, setSelectedProfile] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  
  const copySquadCode = async () => {
    const code = user.group_id || 'TEST';
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  // Find user's rank (use email as fallback since we don't have id)
  const userKey = user.id || user.email;
  const userRank = leaderboard.findIndex((m: any) => (m.id || m.email) === userKey) + 1;
  const nextPlayer = userRank > 0 && userRank < leaderboard.length ? leaderboard[userRank] : null;
  const xpToPass = nextPlayer ? Math.max(0, (nextPlayer.total_xp || 0) - (user.total_xp || 0)) : 0;
  
  // Chat state - load from Convex (with local fallback)
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [loadingMessages, setLoadingMessages] = useState(true);
  
  // Load messages from Convex on mount
  useEffect(() => {
    async function loadMessages() {
      const groupCode = user?.group_id || 'TEST';
      try {
        const convexMsgs = await getGroupMessages(groupCode);
        if (convexMsgs && convexMsgs.length > 0) {
          // Convert Convex messages to UI format
          setMessages(convexMsgs.map((m: any) => ({
            id: m.id || Math.random().toString(36),
            type: 'user' as const,
            name: m.userName,
            text: m.text,
            time: formatTime(m.createdAt)
          })));
        } else {
          // No messages yet - show welcome
          setMessages([
            { id: '1', type: 'system', name: 'System', text: 'Welcome to the squad chat!', time: 'now' },
          ]);
        }
      } catch (err) {
        console.warn('Failed to load messages:', err);
        setMessages([
          { id: '1', type: 'system', name: 'System', text: 'Welcome to the squad chat!', time: 'now' },
        ]);
      }
      setLoadingMessages(false);
    }
    loadMessages();
  }, [user?.group_id]);
  
  // Helper to format timestamp
  function formatTime(timestamp: number): string {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'now';
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h`;
    return `${Math.floor(hours / 24)}d`;
  }
  
  const handleSend = async () => {
    if (!inputValue.trim()) return;
    
    const newMsg: Message = {
      id: Date.now().toString(),
      type: 'user',
      name: user.name || 'You',
      text: inputValue.trim(),
      time: 'now'
    };
    
    // Add to UI immediately (optimistic)
    setMessages(prev => [...prev, newMsg]);
    setInputValue('');
    
    // Send to Convex
    try {
      const groupCode = user?.group_id || 'TEST';
      await sendGroupMessage(groupCode, user?.email || '', user?.name || 'You', inputValue.trim());
    } catch (err) {
      console.warn('Failed to send message to Convex:', err);
      // Message is already in UI, will be in local fallback
    }
  };
  
  return (
    <div className="p-4 space-y-4">
      {/* Squad Status Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">SQUAD</h2>
        <div className="flex items-center gap-2">
          <button 
            onClick={copySquadCode}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/30 rounded-lg transition-all"
          >
            {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} className="text-yellow-500" />}
            <span className="text-xs font-bold text-yellow-500">{copied ? 'COPIED!' : user.group_id}</span>
          </button>
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
          <p className="text-gray-400 text-sm mt-2">Share the squad code with friends to join!</p>
          <button 
            onClick={copySquadCode}
            className="mt-2 flex items-center justify-center gap-2 w-full py-2 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-lg transition-all"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? 'COPIED!' : 'COPY CODE'}
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {leaderboard.map((member: any, i: number) => {
            const memberKey = member.id || member.email;
            const xpDiff = (user.total_xp || 0) - (member.total_xp || 0);
            const isCurrentUser = memberKey === userKey;
            const hasRecentActivity = member.last_activity && (Date.now() - new Date(member.last_activity).getTime()) < 24 * 60 * 60 * 1000;
            
            return (
              <div 
                key={member.id || member.email || i} 
                onClick={() => !isCurrentUser && setSelectedProfile(member)}
                className={`bg-gray-950 rounded-xl p-4 flex items-center gap-3 cursor-pointer ${isCurrentUser ? 'border-2 border-yellow-400/50 shadow-[0_0_15px_rgba(234,179,8,0.2)]' : 'border border-transparent hover:border-gray-800 hover:bg-gray-900/50'}`}
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
          {loadingMessages ? (
            <div className="text-center py-4 text-gray-500 text-sm">Loading messages...</div>
          ) : messages.map((msg) => (
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
      <button 
        onClick={async () => {
          const code = user?.group_id || 'TEST';
          // Try native share on mobile, fallback to clipboard
          if (navigator.share) {
            try {
              await navigator.share({
                title: 'Join my iLift Squad!',
                text: `Use my squad code "${code}" to join my squad on iLift and compete on the leaderboard!`,
                url: window.location.origin
              });
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
              return;
            } catch (e) {
              // User cancelled or error, fall through to clipboard
            }
          }
          // Fallback to clipboard
          try {
            await navigator.clipboard.writeText(code);
          } catch {
            // Clipboard API failed - show alert with code instead
            alert(`Squad code: ${code}`);
          }
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }}
        className="w-full bg-gray-900 hover:bg-gray-800 border border-gray-800 hover:border-yellow-500/30 text-white py-3 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2"
      >
        {copied ? <Check className="w-4 h-4 text-green-500" /> : <span className="text-lg">+</span>}
        {copied ? 'COPIED!' : 'Invite Teammates'}
      </button>

      {/* Profile Modal */}
      {selectedProfile && (
        <ProfileModal 
          user={selectedProfile} 
          onClose={() => setSelectedProfile(null)} 
        />
      )}
    </div>
  );
}
