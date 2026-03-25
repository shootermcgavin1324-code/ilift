import { ConvexReactClient } from "convex/react";

const convexUrl = typeof window !== "undefined" 
  ? (process.env.NEXT_PUBLIC_CONVEX_URL || "https://zealous-armadillo-692.convex.cloud")
  : "https://zealous-armadillo-692.convex.cloud";

export const convex = new ConvexReactClient(convexUrl);

export async function getUser(email: string) {
  return await convex.query(api.users.getByEmail, { email });
}

export async function getAllUsers() {
  return await convex.query(api.users.getAll);
}

export async function upsertUser(email: string, name: string, groupCode: string, experience?: string, fitnessGoal?: string, totalWorkouts?: number, favorites?: string[], profilePhoto?: string) {
  return await convex.mutation(api.users.upsertUser, { 
    email, 
    name, 
    groupCode,
    experience,
    fitnessGoal,
    totalWorkouts,
    favorites,
    profilePhoto
  });
}

export async function addXP(email: string, xpToAdd: number) {
  return await convex.mutation(api.users.addXP, { email, xpToAdd });
}

export async function updateStreak(email: string, streak: number) {
  return await convex.mutation(api.users.updateStreak, { email, streak });
}

export async function updateProfile(email: string, updates: { name?: string; group_id?: string; badges?: string[]; experience?: string; fitnessGoal?: string; totalWorkouts?: number; bestStreak?: number; highestRank?: number; favorites?: string[]; profilePhoto?: string }) {
  return await convex.mutation(api.users.updateProfile, { email, updates });
}

export async function getLeaderboard(groupCode: string) {
  return await convex.query(api.users.getLeaderboard, { groupCode });
}

export async function getSquadMembers(groupCode: string) {
  return await convex.query(api.users.getSquadMembers, { groupCode });
}

export async function saveWorkout(userEmail: string, exercise: string, score: number, date: string, userName?: string) {
  return await convex.mutation(api.workouts.saveWorkout, {
    userEmail,
    exercise,
    score,
    date,
    userName
  });
}

export async function getWorkouts(userEmail: string) {
  return await convex.query(api.workouts.getUserWorkouts, { userEmail });
}

export async function getWorkoutsByDate(userEmail: string, date: string) {
  return await convex.query(api.workouts.getWorkoutsByDate, { userEmail, date });
}

export async function hasWorkedOutToday(userEmail: string) {
  return await convex.query(api.workouts.hasWorkedOutToday, { userEmail });
}

export async function getPRs(userEmail: string) {
  return await convex.query(api.prs.getUserPRs, { userEmail });
}

export async function savePR(userEmail: string, exercise: string, weight: number) {
  return await convex.mutation(api.prs.savePR, { userEmail, exercise, weight });
}

// ============================================
// MESSAGE FUNCTIONS
// ============================================

export async function getMessages(groupCode: string) {
  return await convex.query(api.messages.getByGroup, { groupCode });
}

export async function sendMessage(groupCode: string, userEmail: string, userName: string, text: string) {
  return await convex.mutation(api.messages.sendMessage, { groupCode, userEmail, userName, text });
}

export async function getMessageCount(groupCode: string) {
  return await convex.query(api.messages.getCount, { groupCode });
}

import { api } from "../../../convex/_generated/api";
