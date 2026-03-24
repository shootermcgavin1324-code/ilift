// ============================================
// SQUAD FUNCTIONS - Groups/Teams
// Using email for localStorage auth
// ============================================

import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Create a squad
export const createSquad = mutation({
  args: {
    code: v.string(),
    name: v.string(),
    createdBy: v.string(), // email
  },
  handler: async (ctx, args) => {
    // Check if squad already exists
    const existing = await ctx.db
      .query("squads")
      .withIndex("by_code", (q) => q.eq("code", args.code))
      .first();

    if (existing) {
      throw new Error("Squad code already exists");
    }

    return await ctx.db.insert("squads", {
      code: args.code.toUpperCase(),
      name: args.name,
      createdBy: args.createdBy,
      createdAt: Date.now(),
    });
  },
});

// Get squad by code
export const getSquadByCode = query({
  args: { code: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("squads")
      .withIndex("by_code", (q) => q.eq("code", args.code.toUpperCase()))
      .first();
  },
});

// Join a squad (update user's group_id)
export const joinSquad = mutation({
  args: {
    email: v.string(),
    squadCode: v.string(),
  },
  handler: async (ctx, args) => {
    // Verify squad exists
    const squad = await ctx.db
      .query("squads")
      .withIndex("by_code", (q) => q.eq("code", args.squadCode.toUpperCase()))
      .first();

    if (!squad) {
      throw new Error("Squad not found");
    }

    // Update user's group_id
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    await ctx.db.patch(user._id, {
      group_id: args.squadCode.toUpperCase(),
      updatedAt: Date.now(),
    });

    return squad;
  },
});

// Get squad members
export const getSquadMembers = query({
  args: { code: v.string() },
  handler: async (ctx, args) => {
    const members = await ctx.db
      .query("users")
      .withIndex("by_group", (q) => q.eq("group_id", args.code.toUpperCase()))
      .collect();

    return members.sort((a, b) => b.total_xp - a.total_xp);
  },
});
