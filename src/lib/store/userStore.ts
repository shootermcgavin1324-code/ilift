// ============================================
// USER STORE - Global user state
// ============================================

import { create } from 'zustand';
import type { User, Workout } from '../types';
import { getUser, updateUser, saveWorkout, getWorkouts, getBestStreak, setBestStreak, getHighestRank, setHighestRank, clearLocalData } from '../storage';

interface UserState {
  // User data
  user: User | null;
  loading: boolean;
  error: string | null;
  
  // User stats
  workouts: Workout[];
  bestStreak: number;
  highestRank: number;
  playerTitle: string;
  
  // Actions
  loadUser: () => Promise<void>;
  updateUserData: (updates: Partial<User>) => Promise<void>;
  addXP: (xp: number) => Promise<void>;
  logout: () => void;
}

export const useUserStore = create<UserState>((set, get) => ({
  user: null,
  loading: true,
  error: null,
  workouts: [],
  bestStreak: 0,
  highestRank: 0,
  playerTitle: 'ROOKIE',
  
  loadUser: async () => {
    set({ loading: true, error: null });
    try {
      const user = await getUser();
      const workouts = await getWorkouts();
      
      // Load best streak from storage
      const bestStreak = getBestStreak();
      const highestRank = getHighestRank();
      
      // Calculate player title
      const title = getPlayerTitle({
        totalXP: user.total_xp,
        streak: user.streak,
        badges: user.badges,
        workouts: workouts.length
      });
      
      set({ 
        user, 
        workouts, 
        bestStreak, 
        highestRank, 
        playerTitle: title,
        loading: false 
      });
    } catch (err) {
      set({ error: 'Failed to load user', loading: false });
    }
  },
  
  updateUserData: async (updates) => {
    const { user, bestStreak } = get();
    if (!user) return;
    
    const newBestStreak = Math.max(updates.streak || user.streak || 0, bestStreak);
    const updatedUser = { ...user, ...updates, bestStreak: newBestStreak };
    
    await updateUser(updatedUser);
    
    // Also sync streak to Convex
    if (updates.streak !== undefined && user.email) {
      try {
        const { updateStreak } = await import('@/lib/convex/client-wrapper');
        await updateStreak(user.email, updates.streak);
      } catch (e) {
        console.warn('Convex updateStreak failed:', e);
      }
    }
    
    // Update best streak if new streak is higher
    if (newBestStreak > bestStreak) {
      setBestStreak(newBestStreak);
    }
    
    set({ user: updatedUser, bestStreak: newBestStreak });
  },
  
  addXP: async (xp) => {
    const { user, bestStreak, highestRank } = get();
    if (!user) return;
    
    const newXP = (user.total_xp || 0) + xp;
    const newStreak = user.streak || 0;
    const currentLevel = Math.floor(newXP / 500) + 1;
    
    // Update best streak if new streak is higher
    const newBestStreak = newStreak > bestStreak ? newStreak : bestStreak;
    if (newStreak > bestStreak) {
      setBestStreak(newStreak);
    }
    
    // Update highest rank if current level is higher
    if (currentLevel > highestRank) {
      setHighestRank(currentLevel);
    }
    
    const updatedUser = { 
      ...user, 
      total_xp: newXP,
      streak: newStreak
    };
    
    await updateUser(updatedUser);
    set({ 
      user: updatedUser,
      bestStreak: newBestStreak,
      highestRank: Math.max(currentLevel, highestRank)
    });
  },
  
  logout: () => {
    clearLocalData();
    set({ user: null, workouts: [] });
  }
}));

// Helper for player title (imported from lib)
import { getPlayerTitle } from '../player';
