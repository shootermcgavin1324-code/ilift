// ============================================
// CONVEX CLIENT WRAPPER - Async API
// Uses Convex JavaScript client for non-React contexts
// ============================================

import { ConvexReactClient } from "convex/react";
import { api } from "../../../convex/_generated/api";

// Create and export singleton Convex client
const convexUrl = typeof window !== "undefined" 
  ? (process.env.NEXT_PUBLIC_CONVEX_URL || "https://fiery-aardvark-482.convex.cloud")
  : "https://fiery-aardvark-482.convex.cloud";

export const convex = new ConvexReactClient(convexUrl);

// ============================================
// USER FUNCTIONS
// ============================================

// Get user by email
export async function getUser(email: string) {
  return await convex.query(api.users.getByEmail, { email });
}

// Get all users (for testing)
export async function getAllUsers() {
  return await convex.query(api.users.getAll);
}

// Create or update user
export async function upsertUser(email: string, name: string, groupCode?: string) {
  return await convex.mutation(api.users.upsertUser, { 
    email, 
    name, 
    groupCode 
  });
}

// Add XP to user
export async function addXP(email: string, xpToAdd: number) {
  return await convex.mutation(api.users.addXP, { email, xpToAdd });
}

// Update streak
export async function updateStreak(email: string, streak: number) {
  return await convex.mutation(api.users.updateStreak, { email, streak });
}

// Update profile
export async function updateProfile(
  email: string, 
  updates: { name?: string; group_id?: string; badges?: string[] }
) {
  return await convex.mutation(api.users.updateProfile, { email, updates });
}

// Get leaderboard for a squad
export async function getLeaderboard(groupCode: string) {
  return await convex.query(api.users.getLeaderboard, { groupCode });
}

// Get squad members
export async function getSquadMembers(groupCode: string) {
  return await convex.query(api.users.getSquadMembers, { groupCode });
}

// ============================================
// WORKOUT FUNCTIONS
// ============================================

// Save workout
export async function saveWorkout(
  userEmail: string,
  exercise: string,
  score: number,
  date: string,
  userName?: string
) {
  return await convex.mutation(api.workouts.saveWorkout, {
    userEmail,
    userName,
    exercise,
    score,
    date,
  });
}

// Get user workouts
export async function getWorkouts(userEmail: string) {
  return await convex.query(api.workouts.getUserWorkouts, { userEmail });
}

// Get workouts by date
export async function getWorkoutsByDate(userEmail: string, date: string) {
  return await convex.query(api.workouts.getWorkoutsByDate, { userEmail, date });
}

// Check if user worked out today
export async function hasWorkedOutToday(userEmail: string) {
  return await convex.query(api.workouts.hasWorkedOutToday, { userEmail });
}

// ============================================
// PR FUNCTIONS
// ============================================

// Get user PRs
export async function getPRs(userEmail: string) {
  return await convex.query(api.prs.getUserPRs, { userEmail });
}

// Save PR
export async function savePR(userEmail: string, exercise: string, weight: number) {
  return await convex.mutation(api.prs.savePR, { userEmail, exercise, weight });
}
