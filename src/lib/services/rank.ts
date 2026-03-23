// ============================================
// RANK SERVICE - Leaderboard & ranking logic
// Consolidated from components
// ============================================

export interface RankResult {
  rank: number;
  rankAhead: LeaderboardEntry | null;
  xpToNextRank: number;
  isAlmostThere: boolean;
  isOnFire: boolean;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  total_xp: number;
  streak?: number;
}

// Calculate user's rank and related info
export function calculateRank(
  userId: string,
  userXP: number,
  leaderboard: LeaderboardEntry[]
): RankResult {
  if (leaderboard.length === 0) {
    return {
      rank: 1,
      rankAhead: null,
      xpToNextRank: 0,
      isAlmostThere: false,
      isOnFire: false,
    };
  }

  // Sort by XP descending
  const sorted = [...leaderboard].sort((a, b) => (b.total_xp || 0) - (a.total_xp || 0));
  
  // Find user's position
  const userIndex = sorted.findIndex((u) => u.id === userId);
  const rank = userIndex >= 0 ? userIndex + 1 : sorted.length + 1;
  
  // Get the person ahead
  const rankAhead = userIndex > 0 ? sorted[userIndex - 1] : null;
  
  // Calculate XP gap
  const xpToNextRank = rankAhead 
    ? (rankAhead.total_xp || 0) - userXP 
    : 0;
  
  // Check if "almost there" (within 50 XP of passing)
  const isAlmostThere = rankAhead !== null && xpToNextRank > 0 && xpToNextRank < 50;
  
  // Check if on fire (top 3)
  const isOnFire = rank <= 3;

  return {
    rank,
    rankAhead,
    xpToNextRank,
    isAlmostThere,
    isOnFire,
  };
}

// Get medal emoji for rank
export function getMedalEmoji(rank: number): string {
  switch (rank) {
    case 1:
      return '🥇';
    case 2:
      return '🥈';
    case 3:
      return '🥉';
    default:
      return '';
  }
}

// Format rank display
export function formatRank(rank: number): string {
  return `#${rank}`;
}