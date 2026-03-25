// ============================================
// CHAT MESSAGE FUNCTIONS - Convex Backend
// ============================================

import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get messages for a group
export const getByGroup = query({
  args: { groupCode: v.string() },
  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_group_created", (q) => q.eq("groupCode", args.groupCode))
      .order("desc")
      .take(100);
    
    // Return in chronological order (oldest first)
    return messages.reverse();
  },
});

// Send a message
export const sendMessage = mutation({
  args: {
    groupCode: v.string(),
    userEmail: v.string(),
    userName: v.string(),
    text: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("messages", {
      groupCode: args.groupCode.toUpperCase(),
      userEmail: args.userEmail,
      userName: args.userName,
      text: args.text.slice(0, 280), // Limit message length
      createdAt: Date.now(),
    });
  },
});

// Get message count for a group
export const getCount = query({
  args: { groupCode: v.string() },
  handler: async (ctx, args) => {
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_group", (q) => q.eq("groupCode", args.groupCode))
      .collect();
    return messages.length;
  },
});