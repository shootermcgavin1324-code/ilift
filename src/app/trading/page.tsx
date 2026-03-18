'use client';

import { useState } from 'react';

interface Position {
  id: string;
  trader: string;
  market: string;
  outcome: string;
  shares: number;
  avgPrice: number;
  currentPrice: number;
  value: number;
  cost: number;
  pnl: number;
  pnlPercent: number;
  status: 'open' | 'closed';
  updated: string;
}

interface ContentPost {
  id: string;
  platform: 'instagram' | 'x';
  title: string;
  status: 'ready' | 'posted' | 'scheduled';
  scheduledDate?: string;
}

const COPY_TRADERS = [
  { name: 'BulkeyBull', address: '0x80c5b2d09808bf015bdbd377b3f32f7029333d', profit: '+$97K/mo', category: 'Politics/Fed', url: 'https://polymarket.com/@BulkeyBull' },
  { name: 'Curseaaaaaaaa', address: '0xbad457dc633bbb7b6cbe09dd5867a5e8e597acd7', profit: '+$33K/mo', category: 'Iran/Geopolitics', url: 'https://polymarket.com/@Curseaaaaaaaa' },
  { name: 'CemeterySun', address: '0x37c1874a60d348903594a96703e0507c518fc53a', profit: 'Unknown', category: 'Geopolitics', url: 'https://polymarket.com/@CemeterySun' },
  { name: 'HorizonSplendidView', address: '0x02227b8f5a9636e895607edd3185ed6ee5598ff7', profit: 'Unknown', category: 'Politics', url: 'https://polymarket.com/@HorizonSplendidView' },
  { name: 'beachboy4', address: '0xc2e7800b5af46e6093872b177b7a5e7f0563be51', profit: 'Unknown', category: 'Sports', url: 'https://polymarket.com/@beachboy4' },
];

const MOCK_POSITIONS: Position[] = [
  { id: '1', trader: 'BulkeyBull', market: 'Mark Kelly 2028', outcome: 'Yes', shares: 34741.2, avgPrice: 0.027, currentPrice: 0.027, value: 920.64, cost: 940.00, pnl: -19.32, pnlPercent: -2.05, status: 'open', updated: '2026-03-18' },
  { id: '2', trader: 'BulkeyBull', market: 'Fed -25bps March', outcome: 'Yes', shares: 115571.7, avgPrice: 0.01, currentPrice: 0.01, value: 288.93, cost: 1155.72, pnl: -866.79, pnlPercent: -75.0, status: 'open', updated: '2026-03-18' },
];

const CONTENT_POSTS: ContentPost[] = [
  { id: '1', platform: 'instagram', title: 'Pokémon - "You trained the AI"', status: 'scheduled', scheduledDate: '2026-03-18' },
  { id: '2', platform: 'instagram', title: '5-Story Roundup (Cuba, Midterms, Epstein, Mamdani, Immigration)', status: 'scheduled', scheduledDate: '2026-03-19' },
];

export default function Trading() {
  const [positions] = useState<Position[]>(MOCK_POSITIONS);
  const [activeTab, setActiveTab] = useState<'positions' | 'traders' | 'content' | 'settings'>('content');
  
  const totalInvested = positions.reduce((sum, p) => sum + p.cost, 0);
  const totalValue = positions.reduce((sum, p) => sum + p.value, 0);
  const totalPnL = positions.reduce((sum, p) => sum + p.pnl, 0);

  return (
    <>
      <style>{`
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(34, 197, 94, 0.3); }
          50% { box-shadow: 0 0 40px rgba(34, 197, 94, 0.6); }
        }
      `}</style>
      
      <div className="min-h-screen bg-gray-950 text-white">
        {/* Header */}
        <header className="px-4 pt-4 flex justify-between items-center pb-2">
          <div>
            <h1 className="text-2xl font-black"><span className="text-green-400">⌘</span> Mission Control</h1>
            <p className="text-gray-400 text-sm">Trading & Content</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Sim Balance</p>
            <p className="text-green-400 font-black">$9,763.22</p>
          </div>
        </header>

        {/* Stats Bar */}
        <div className="px-4 py-3 bg-gray-900/50 border-y border-gray-800">
          <div className="flex justify-between items-center">
            <div className="text-center">
              <p className="text-gray-500 text-xs">Invested</p>
              <p className="text-white font-black">${totalInvested.toFixed(0)}</p>
            </div>
            <div className="text-center">
              <p className="text-gray-500 text-xs">Content Ready</p>
              <p className="text-yellow-400 font-black">{CONTENT_POSTS.filter(p => p.status !== 'posted').length}</p>
            </div>
            <div className="text-center">
              <p className="text-gray-500 text-xs">Mode</p>
              <p className="text-yellow-400 font-bold text-sm">DRY-RUN</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 px-4 mt-4">
          {[
            { id: 'positions', label: 'Trading' },
            { id: 'traders', label: 'Traders' },
            { id: 'content', label: 'Content' },
            { id: 'settings', label: 'Rules' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-3 text-sm font-bold border-b-2 ${
                activeTab === tab.id 
                  ? 'text-green-400 border-green-400' 
                  : 'text-gray-500 border-transparent'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-4 pb-24">
          {activeTab === 'positions' && (
            <div className="space-y-3">
              {positions.map(pos => (
                <div key={pos.id} className="bg-gray-900 rounded-xl border border-gray-800 p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-bold text-white">{pos.market}</p>
                      <p className="text-gray-500 text-sm">{pos.trader} • {pos.outcome}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-green-400 font-black">${pos.value.toFixed(0)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'traders' && (
            <div className="space-y-3">
              {COPY_TRADERS.map((trader, i) => (
                <div key={i} className="bg-gray-900 rounded-xl border border-gray-800 p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-bold text-white">{trader.name}</p>
                      <p className="text-gray-500 text-sm">{trader.category}</p>
                    </div>
                    <span className="text-green-400 font-bold text-sm">{trader.profit}</span>
                  </div>
                  <div className="flex gap-2">
                    <a href={trader.url} target="_blank" className="flex-1 py-2 bg-gray-700 text-gray-300 rounded-lg font-bold text-sm text-center">
                      View
                    </a>
                    <button className="flex-1 py-2 bg-green-500/20 text-green-400 rounded-lg font-bold text-sm border border-green-500/30">
                      Copy
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'content' && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-white">Scheduled Posts</h2>
              
              {CONTENT_POSTS.map(post => (
                <div key={post.id} className="bg-gray-900 rounded-xl border border-gray-800 p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{post.platform === 'instagram' ? '📸' : '𝕏'}</span>
                      <div>
                        <p className="font-bold text-white">{post.title}</p>
                        <p className="text-gray-500 text-sm">{post.scheduledDate}</p>
                      </div>
                    </div>
                    <span className={`text-xs font-bold px-2 py-1 rounded ${
                      post.status === 'scheduled' ? 'bg-yellow-400/20 text-yellow-400' :
                      post.status === 'posted' ? 'bg-green-400/20 text-green-400' :
                      'bg-gray-700 text-gray-400'
                    }`}>
                      {post.status.toUpperCase()}
                    </span>
                  </div>
                  <button className="w-full py-2 bg-green-500/20 text-green-400 rounded-lg font-bold text-sm border border-green-500/30">
                    Mark as Posted
                  </button>
                </div>
              ))}
              
              <div className="pt-4 border-t border-gray-800">
                <h3 className="text-sm font-bold text-gray-500 mb-3">TODAY</h3>
                <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-xl border border-purple-500/30 p-4">
                  <p className="font-bold text-white mb-1">📸 Pokémon Story</p>
                  <p className="text-gray-400 text-sm">"You trained the AI. Now it's delivering your pizza."</p>
                  <button className="mt-3 w-full py-2 bg-white text-black rounded-lg font-bold text-sm">
                    Post Now
                  </button>
                </div>
              </div>
              
              <div className="pt-4">
                <h3 className="text-sm font-bold text-gray-500 mb-3">TOMORROW</h3>
                <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 rounded-xl border border-blue-500/30 p-4">
                  <p className="font-bold text-white mb-1">📸 5-Story Roundup</p>
                  <p className="text-gray-400 text-sm">Cuba, Midterms, Epstein, Mamdani, Immigration</p>
                  <button className="mt-3 w-full py-2 bg-gray-700 text-gray-400 rounded-lg font-bold text-sm">
                    Schedule
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-4">
              <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
                <p className="font-bold text-white mb-3">Trading Rules</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Max position:</span>
                    <span className="text-white font-bold">$100</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Max risk:</span>
                    <span className="text-white font-bold">2%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Min EV:</span>
                    <span className="text-white font-bold">5%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Copy mode:</span>
                    <span className="text-yellow-400 font-bold">Manual</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-900 rounded-xl border border-gray-800 p-4">
                <p className="font-bold text-white mb-3">Content Rules</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Post format:</span>
                    <span className="text-white font-bold">Reply only</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Approval:</span>
                    <span className="text-white font-bold">Always</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
