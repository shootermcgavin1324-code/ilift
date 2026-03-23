// ============================================
// WORKOUT FUNCTIONS - Convex Backend
// ============================================

import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Save a workout
export const saveWorkout = mutation({
  args: {
    userClerkId: v.string(),
    userName: v.string(),
    userId: v.id("users"),
    exercise: v.string(),
    score: v.number(),
    date: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("workouts", {
      ...args,
      createdAt: now,
    });
  },
});

// Get workouts for a user
export const getUserWorkouts = query({
  args: { userClerkId: v.string() },
  handler: async (ctx, args) => {
    const workouts = await ctx.db
      .query("workouts")
      .withIndex("by_user", (q) => q.eq("userClerkId", args.userClerkId))
      .collect();

    // Sort by date descending
    return workouts.sort((a, b) => b.createdAt - a.createdAt);
  },
});

// Get workouts for a user by date
export const getWorkoutsByDate = query({
  args: {
    userClerkId: v.string(),
    date: v.string(),
  },
  handler: async (ctx, args) => {
    const workouts = await ctx.db
      .query("workouts")
      .withIndex("by_user_date", (q) => 
        q.eq("userClerkId", args.userClerkId).eq("date", args.date)
      )
      .collect();

    return workouts;
  },
});

// Check if user worked out today
export const hasWorkedOutToday = query({
  args: { userClerkId: v.string() },
  handler: async (ctx, args) => {
    const today = new Date().toISOString().split("T")[0];
    
    const workouts = await ctx.db
      .query("workouts")
      .withIndex("by_user_date", (q) => 
        q.eq("userClerkId", args.userClerkId).eq("date", today)
      )
      .first();

    return !!workouts;
  },
});

// Get all workouts for a group (for squad activity)
export const getSquadWorkouts = query({
  args: { groupCode: v.string() },
  handler: async (ctx, args) => {
    // Get all users in the group
    const users = await ctx.db
      .query("users")
      .withIndex("by_group", (q) => q.eq("group_id", args.groupCode))
      .collect();

    const clerkIds = users.map(u => u.clerkId);
    
    // Get recent workouts for all users
    const allWorkouts = await ctx.db
      .query("workouts")
      .filter((q) => q.or(
        ...clerkIds.map(id => q.eq(q.field("userClerkId"), id))
      ))
      .collect();

    // Return last 20 workouts sorted by date
    return allWorkouts
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 20);
  },
});
