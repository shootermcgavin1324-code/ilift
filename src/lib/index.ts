// ============================================
// LIB INDEX - Easy imports from one place
// ============================================

// Types
export * from './types';

// Storage (hybrid)
export * from './storage';

// Individual modules
export * from './xp';
export * from './player';
export * from './badges';
export * from './challenges';
export * from './streak';

// Re-export from supabase (client only)
export { supabase, uploadVideo, uploadAvatar } from './supabase';

// Exercises & Icons
export * from './exercises';
export * from './icons';

// Achievements
export { ACHIEVEMENTS } from './achievements';

// State Management (Zustand)
export * from './store';
