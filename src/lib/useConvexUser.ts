// ============================================
// CONvex USER HOOK - Replace zustand store
// ============================================

import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { useAuth, useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';

export function useConvexUser() {
  const { userId, isLoaded: authLoaded } = useAuth();
  const { user: clerkUser, isLoaded: clerkLoaded } = useUser();
  
  // Query user from Convex
  const convexUser = useQuery(
    api.users.getByClerkId, 
    userId ? { clerkId: userId } : 'skip'
  );
  
  // Query user's workouts
  const workouts = useQuery(
    api.workouts.getUserWorkouts,
    userId ? { userClerkId: userId } : 'skip'
  );
  
  // Query leaderboard for user's squad
  const leaderboard = useQuery(
    api.users.getLeaderboard,
    convexUser?.group_id ? { groupCode: convexUser.group_id } : 'skip'
  );
  
  // Query user's PRs
  const userPRs = useQuery(
    api.prs.getUserPRs,
    userId ? { userClerkId: userId } : 'skip'
  );
  
  // Mutations
  const addXP = useMutation(api.users.addXP);
  const updateStreak = useMutation(api.users.updateStreak);
  const updateProfile = useMutation(api.users.updateProfile);
  const saveWorkout = useMutation(api.workouts.saveWorkout);
  const savePRMutation = useMutation(api.prs.savePR);
  
  // Loading state
  const loading = !authLoaded || !clerkLoaded || convexUser === undefined;
  
  // Derived values
  const currentLevel = Math.floor((convexUser?.total_xp || 0) / 500) + 1;
  const xpInCurrentLevel = (convexUser?.total_xp || 0) % 500;
  const xpToNextLevel = 500 - xpInCurrentLevel;
  const xpProgressPercent = (xpInCurrentLevel / 500) * 100;
  const prestige = Math.floor((convexUser?.total_xp || 0) / 10000);
  
  // Get player title
  const getPlayerTitle = (xp: number, streak: number, badges: string[]) => {
    if (prestige > 0) return 'LEGEND';
    if (xp >= 50000) return 'UNSTOPPABLE';
    if (xp >= 25000) return 'XP MASTER';
    if (xp >= 10000) return 'COLLECTOR';
    if (xp >= 5000) return 'GRINDER';
    if (streak >= 30) return 'ON FIRE';
    if (streak >= 7) return 'ACTIVE';
    return 'ROOKIE';
  };
  
  const playerTitle = getPlayerTitle(
    convexUser?.total_xp || 0,
    convexUser?.streak || 0,
    convexUser?.badges || []
  );
  
  return {
    // User data
    user: convexUser,
    clerkUser,
    loading,
    
    // Workouts
    workouts: workouts || [],
    
    // Leaderboard
    leaderboard: leaderboard || [],
    
    // Derived
    currentLevel,
    xpInCurrentLevel,
    xpToNextLevel,
    xpProgressPercent,
    prestige,
    playerTitle,
    
    // Mutations
    actions: {
      addXP: async (xp: number) => {
        if (!userId) return;
        await addXP({ clerkId: userId, xpToAdd: xp });
      },
      
      updateStreak: async (streak: number) => {
        if (!userId) return;
        await updateStreak({ clerkId: userId, streak });
      },
      
      updateProfile: async (updates: { name?: string; group_id?: string; badges?: string[] }) => {
        if (!userId) return;
        await updateProfile({ clerkId: userId, updates });
      },
      
      logWorkout: async (exercise: string, score: number) => {
        if (!userId || !clerkUser) return;
        const today = new Date().toISOString().split('T')[0];
        await saveWorkout({
          userClerkId: userId,
          userName: clerkUser.firstName || 'Athlete',
          userId: convexUser?._id!,
          exercise,
          score,
          date: today,
        });
      },
      
      checkAndSavePR: async (exercise: string, weight: number) => {
        if (!userId || !convexUser?._id) return null;
        return await savePRMutation({
          userClerkId: userId,
          userId: convexUser._id,
          exercise,
          weight,
        });
      },
    },
  };
}
