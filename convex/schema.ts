// ============================================
// CONVEX SCHEMA - iLift Database
// ============================================

import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Users table
  users: defineTable({
    clerkId: v.string(),           // Clerk user ID
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
    .index("by_clerk_id", ["clerkId"])
    .index("by_email", ["email"])
    .index("by_group", ["group_id"]),

  // Workouts table
  workouts: defineTable({
    userId: v.id("users"),
    userClerkId: v.string(),
    userName: v.string(),
    exercise: v.string(),
    score: v.number(),
    date: v.string(),
    createdAt: v.number(),
  })
    .index("by_user", ["userClerkId"])
    .index("by_date", ["date"])
    .index("by_user_date", ["userClerkId", "date"]),

  // Personal Records
  prs: defineTable({
    userId: v.id("users"),
    userClerkId: v.string(),
    exercise: v.string(),
    maxWeight: v.number(),
    date: v.string(),
    updatedAt: v.number(),
  })
    .index("by_user_exercise", ["userClerkId", "exercise"]),

  // Squads/Groups
  squads: defineTable({
    code: v.string(),              // Squad code (e.g., "GOOP")
    name: v.string(),
    createdBy: v.string(),         // Clerk ID of creator
    createdAt: v.number(),
  })
    .index("by_code", ["code"]),
});
