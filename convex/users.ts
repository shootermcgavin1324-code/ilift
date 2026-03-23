// ============================================
// USER FUNCTIONS - Convex Backend
// ============================================

import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get user by Clerk ID
export const getByClerkId = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();
    return user;
  },
});

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

// Create or update user (called after Clerk sign-in)
export const upsertUser = mutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (existing) {
      // Update existing user
      await ctx.db.patch(existing._id, {
        name: args.name,
        email: args.email,
        updatedAt: Date.now(),
      });
      return existing._id;
    } else {
      // Create new user
      const now = Date.now();
      return await ctx.db.insert("users", {
        clerkId: args.clerkId,
        email: args.email,
        name: args.name,
        total_xp: 0,
        streak: 0,
        badges: [],
        group_id: undefined,
        bestStreak: 0,
        highestRank: 1,
        createdAt: now,
        updatedAt: now,
      });
    }
  },
});

// Update user XP and stats
export const addXP = mutation({
  args: {
    clerkId: v.string(),
    xpToAdd: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
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
    clerkId: v.string(),
    streak: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
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
    clerkId: v.string(),
    updates: v.object({
      name: v.optional(v.string()),
      group_id: v.optional(v.string()),
      badges: v.optional(v.array(v.string())),
    }),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
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

// Complete onboarding - create user with squad
export const completeOnboarding = mutation({
  args: {
    clerkId: v.string(),
    email: v.string(),
    name: v.string(),
    squadCode: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const upperCode = args.squadCode?.toUpperCase();
    
    // Check if user exists
    const existing = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (existing) {
      // Update existing user
      await ctx.db.patch(existing._id, {
        name: args.name,
        email: args.email,
        group_id: upperCode,
        updatedAt: now,
      });
      return existing._id;
    }

    // Create new user
    return await ctx.db.insert("users", {
      clerkId: args.clerkId,
      email: args.email,
      name: args.name,
      total_xp: 0,
      streak: 0,
      badges: [],
      group_id: upperCode,
      bestStreak: 0,
      highestRank: 1,
      createdAt: now,
      updatedAt: now,
    });
  },
});
