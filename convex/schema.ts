// ============================================
// CONVEX SCHEMA - iLift Database
// Simplified for localStorage auth (no Clerk)
// ============================================

import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Users table - indexed by email (for localStorage auth)
  users: defineTable({
    email: v.string(),
    name: v.string(),
    total_xp: v.number(),
    streak: v.number(),
    badges: v.array(v.string()),
    group_id: v.optional(v.string()),
    lastWorkoutDate: v.optional(v.string()),
    bestStreak: v.number(),
    highestRank: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_email", ["email"])
    .index("by_group", ["group_id"]),

  // Workouts table
  workouts: defineTable({
    userEmail: v.string(),
    userName: v.optional(v.string()),
    exercise: v.string(),
    score: v.number(),
    date: v.string(),
    createdAt: v.number(),
  })
    .index("by_user", ["userEmail"])
    .index("by_date", ["date"])
    .index("by_user_date", ["userEmail", "date"]),

  // Personal Records
  prs: defineTable({
    userEmail: v.string(),
    exercise: v.string(),
    maxWeight: v.number(),
    date: v.string(),
    updatedAt: v.number(),
  })
    .index("by_user_exercise", ["userEmail", "exercise"]),

  // Squads/Groups
  squads: defineTable({
    code: v.string(),
    name: v.string(),
    createdBy: v.string(),
    createdAt: v.number(),
  })
    .index("by_code", ["code"]),
});
