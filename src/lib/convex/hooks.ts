// ============================================
// CONVEX HOOKS - iLift Backend
// Simple wrapper around Convex React hooks
// ============================================

import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";

// ============================================
// USER HOOKS
// ============================================

// Get user by email
export function useUserByEmail(email: string) {
  return useQuery(api.users.getByEmail, { email });
}

// Get all users (for testing)
export function useAllUsers() {
  return useQuery(api.users.getAll);
}

// Get leaderboard for a squad
export function useLeaderboard(groupCode: string) {
  return useQuery(api.users.getLeaderboard, { groupCode });
}

// Get squad members
export function useSquadMembersConvex(groupCode: string) {
  return useQuery(api.users.getSquadMembers, { groupCode });
}

// Mutations
export function useUpsertUser() {
  return useMutation(api.users.upsertUser);
}

export function useAddXP() {
  return useMutation(api.users.addXP);
}

export function useUpdateStreak() {
  return useMutation(api.users.updateStreak);
}

export function useUpdateProfile() {
  return useMutation(api.users.updateProfile);
}

// ============================================
// WORKOUT HOOKS
// ============================================

export function useUserWorkouts(email: string) {
  return useQuery(api.workouts.getUserWorkouts, { userEmail: email });
}

export function useTodayWorkouts(email: string) {
  return useQuery(api.workouts.getWorkoutsByDate, { 
    userEmail: email, 
    date: new Date().toISOString().split("T")[0] 
  });
}

export function useHasWorkedOutToday(email: string) {
  return useQuery(api.workouts.hasWorkedOutToday, { userEmail: email });
}

export function useAddWorkout() {
  return useMutation(api.workouts.saveWorkout);
}

// ============================================
// PR HOOKS
// ============================================

export function useUserPRs(email: string) {
  return useQuery(api.prs.getUserPRs, { userEmail: email });
}

export function useSavePR() {
  return useMutation(api.prs.savePR);
}

// ============================================
// SQUAD HOOKS
// ============================================

export function useSquadByCode(code: string) {
  return useQuery(api.squads.getSquadByCode, { code: code.toUpperCase() });
}

export function useSquadMembersByCode(code: string) {
  return useQuery(api.squads.getSquadMembers, { code: code.toUpperCase() });
}

export function useCreateSquad() {
  return useMutation(api.squads.createSquad);
}

export function useJoinSquad() {
  return useMutation(api.squads.joinSquad);
}