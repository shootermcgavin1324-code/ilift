// ============================================
// WORKOUT FUNCTIONS - Convex Backend
// Using email for localStorage auth
// ============================================

import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Save a workout
export const saveWorkout = mutation({
  args: {
    userEmail: v.string(),
    userName: v.optional(v.string()),
    exercise: v.string(),
    score: v.number(),
    date: v.string(),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    
    // Insert the workout
    await ctx.db.insert("workouts", {
      userEmail: args.userEmail,
      userName: args.userName || 'User',
      exercise: args.exercise,
      score: args.score,
      date: args.date,
      createdAt: now,
    });

    // Update user's total XP
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.userEmail))
      .first();

    if (user) {
      const newXP = user.total_xp + args.score;
      await ctx.db.patch(user._id, {
        total_xp: newXP,
        updatedAt: now,
      });
    }

    return { success: true, xpAdded: args.score };
  },
});

// Get workouts for a user
export const getUserWorkouts = query({
  args: { userEmail: v.string() },
  handler: async (ctx, args) => {
    const workouts = await ctx.db
      .query("workouts")
      .withIndex("by_user", (q) => q.eq("userEmail", args.userEmail))
      .collect();

    // Sort by date descending
    return workouts.sort((a, b) => b.createdAt - a.createdAt);
  },
});

// Get workouts for a user by date
export const getWorkoutsByDate = query({
  args: {
    userEmail: v.string(),
    date: v.string(),
  },
  handler: async (ctx, args) => {
    const workouts = await ctx.db
      .query("workouts")
      .withIndex("by_user_date", (q) => 
        q.eq("userEmail", args.userEmail).eq("date", args.date)
      )
      .collect();

    return workouts;
  },
});

// Check if user worked out today
export const hasWorkedOutToday = query({
  args: { userEmail: v.string() },
  handler: async (ctx, args) => {
    const today = new Date().toISOString().split("T")[0];
    
    const workouts = await ctx.db
      .query("workouts")
      .withIndex("by_user_date", (q) => 
        q.eq("userEmail", args.userEmail).eq("date", today)
      )
      .first();

    return !!workouts;
  },
});
