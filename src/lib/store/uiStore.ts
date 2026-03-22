// ============================================
// UI STORE - Global UI state
// ============================================

import { create } from 'zustand';

interface Toast {
  message: string;
  type: 'success' | 'error' | 'info';
}

interface UIState {
  // Navigation
  activeTab: string;
  
  // Loading states
  globalLoading: boolean;
  videoUploading: boolean;
  
  // Modals & Overlays
  toast: Toast | null;
  showPR: { exercise: string; weight: number; oldPR: number } | null;
  newBadges: string[];
  
  // Leaderboard
  leaderboard: any[];
  
  // Actions
  setActiveTab: (tab: string) => void;
  setGlobalLoading: (loading: boolean) => void;
  setVideoUploading: (uploading: boolean) => void;
  
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  hideToast: () => void;
  
  setShowPR: (pr: { exercise: string; weight: number; oldPR: number } | null) => void;
  setNewBadges: (badges: string[]) => void;
  clearNewBadges: () => void;
  
  setLeaderboard: (leaderboard: any[]) => void;
}

export const useUIStore = create<UIState>((set) => ({
  activeTab: 'home',
  globalLoading: false,
  videoUploading: false,
  toast: null,
  showPR: null,
  newBadges: [],
  leaderboard: [],
  
  setActiveTab: (tab) => set({ activeTab: tab }),
  setGlobalLoading: (loading) => set({ globalLoading: loading }),
  setVideoUploading: (uploading) => set({ videoUploading: uploading }),
  
  showToast: (message, type = 'info') => {
    set({ toast: { message, type } });
    setTimeout(() => set({ toast: null }), 3000);
  },
  
  hideToast: () => set({ toast: null }),
  
  setShowPR: (pr) => set({ showPR: pr }),
  setNewBadges: (badges) => set({ newBadges: badges }),
  clearNewBadges: () => set({ newBadges: [] }),
  
  setLeaderboard: (leaderboard) => set({ leaderboard })
}));
