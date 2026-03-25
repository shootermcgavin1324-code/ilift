// ============================================
// USER FUNCTIONS - Convex Backend
// Using email for localStorage auth
// ============================================

import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get user by email
export const getByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
    return user;
  },
});

// Get user by ID
export const getById = query({
  args: { id: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

// Create or update user
export const upsertUser = mutation({
  args: {
    email: v.string(),
    name: v.string(),
    groupCode: v.optional(v.string()),
    experience: v.optional(v.string()),
    fitnessGoal: v.optional(v.string()),
    totalWorkouts: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (existing) {
      // Update existing user
      await ctx.db.patch(existing._id, {
        name: args.name,
        group_id: args.groupCode?.toUpperCase(),
        experience: args.experience,
        fitnessGoal: args.fitnessGoal,
        updatedAt: Date.now(),
      });
      return existing._id;
    } else {
      // Create new user
      const now = Date.now();
      return await ctx.db.insert("users", {
        email: args.email,
        name: args.name,
        total_xp: 0,
        streak: 0,
        badges: [],
        group_id: args.groupCode?.toUpperCase(),
        bestStreak: 0,
        highestRank: 1,
        experience: args.experience,
        fitnessGoal: args.fitnessGoal,
        totalWorkouts: args.totalWorkouts || 0,
        createdAt: now,
        updatedAt: now,
      });
    }
  },
});

// Update user XP
export const addXP = mutation({
  args: {
    email: v.string(),
    xpToAdd: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (!user) throw new Error("User not found");

    const newXP = user.total_xp + args.xpToAdd;
    await ctx.db.patch(user._id, {
      total_xp: newXP,
      updatedAt: Date.now(),
    });

    return newXP;
  },
});

// Update streak
export const updateStreak = mutation({
  args: {
    email: v.string(),
    streak: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (!user) throw new Error("User not found");

    const newBestStreak = Math.max(user.bestStreak, args.streak);
    await ctx.db.patch(user._id, {
      streak: args.streak,
      bestStreak: newBestStreak,
      lastWorkoutDate: new Date().toISOString().split("T")[0],
      updatedAt: Date.now(),
    });

    return { streak: args.streak, bestStreak: newBestStreak };
  },
});

// Update user profile
export const updateProfile = mutation({
  args: {
    email: v.string(),
    updates: v.object({
      name: v.optional(v.string()),
      group_id: v.optional(v.string()),
      badges: v.optional(v.array(v.string())),
      experience: v.optional(v.string()),
      fitnessGoal: v.optional(v.string()),
      totalWorkouts: v.optional(v.number()),
      bestStreak: v.optional(v.number()),
      highestRank: v.optional(v.number()),
    }),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (!user) throw new Error("User not found");

    await ctx.db.patch(user._id, {
      ...args.updates,
      updatedAt: Date.now(),
    });

    return await ctx.db.get(user._id);
  },
});

// Get leaderboard for a squad
export const getLeaderboard = query({
  args: { groupCode: v.string() },
  handler: async (ctx, args) => {
    const users = await ctx.db
      .query("users")
      .withIndex("by_group", (q) => q.eq("group_id", args.groupCode))
      .collect();

    // Sort by XP descending
    return users.sort((a, b) => b.total_xp - a.total_xp);
  },
});

// Get squad members
export const getSquadMembers = query({
  args: { groupCode: v.string() },
  handler: async (ctx, args) => {
    const members = await ctx.db
      .query("users")
      .withIndex("by_group", (q) => q.eq("group_id", args.groupCode))
      .collect();

    return members.sort((a, b) => b.total_xp - a.total_xp);
  },
});

// Get all users (for testing)
export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("users").collect();
  },
});
