// ============================================
// PR FUNCTIONS - Personal Records
// ============================================

import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get all PRs for a user
export const getUserPRs = query({
  args: { userClerkId: v.string() },
  handler: async (ctx, args) => {
    const prs = await ctx.db
      .query("prs")
      .withIndex("by_user_exercise", (q) => q.eq("userClerkId", args.userClerkId))
      .collect();

    // Convert to map
    const prMap: Record<string, { maxWeight: number; date: string }> = {};
    prs.forEach((pr) => {
      prMap[pr.exercise] = {
        maxWeight: pr.maxWeight,
        date: pr.date,
      };
    });

    return prMap;
  },
});

// Save a PR (only if it's a new record)
export const savePR = mutation({
  args: {
    userClerkId: v.string(),
    userId: v.id("users"),
    exercise: v.string(),
    weight: v.number(),
  },
  handler: async (ctx, args) => {
    const today = new Date().toISOString().split("T")[0];

    // Check existing PR
    const existing = await ctx.db
      .query("prs")
      .withIndex("by_user_exercise", (q) => 
        q.eq("userClerkId", args.userClerkId).eq("exercise", args.exercise)
      )
      .first();

    if (existing) {
      if (args.weight > existing.maxWeight) {
        // Update PR
        await ctx.db.patch(existing._id, {
          maxWeight: args.weight,
          date: today,
          updatedAt: Date.now(),
        });
        return { isNewPR: true, maxWeight: args.weight };
      }
      return { isNewPR: false, maxWeight: existing.maxWeight };
    } else {
      // Create new PR
      await ctx.db.insert("prs", {
        userClerkId: args.userClerkId,
        userId: args.userId,
        exercise: args.exercise,
        maxWeight: args.weight,
        date: today,
        updatedAt: Date.now(),
      });
      return { isNewPR: true, maxWeight: args.weight };
    }
  },
});
