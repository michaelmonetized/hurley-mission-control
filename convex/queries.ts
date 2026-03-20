import { query } from "./_generated/server";
import { v } from "convex/values";

export const getThreads = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    // Filter threads by members (get all and filter client-side for now)
    const threads = await ctx.db
      .query("threads")
      .collect();
    return threads.filter((thread: any) => thread.members.includes(userId));
  },
});

export const getMessages = query({
  args: { threadId: v.id("threads"), limit: v.optional(v.number()) },
  handler: async (ctx, { threadId, limit = 50 }) => {
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_thread", (q) => q.eq("threadId", threadId))
      .order("desc")
      .take(limit);
    return messages.reverse();
  },
});

export const getThreadMembers = query({
  args: { threadId: v.id("threads") },
  handler: async (ctx, { threadId }) => {
    const thread = await ctx.db.get(threadId);
    if (!thread) return [];
    
    const members = await Promise.all(
      thread.members.map((uid: string) => ctx.db.get(uid as any))
    );
    return members.filter(Boolean);
  },
});

export const getUserByClerkId = query({
  args: { clerkId: v.string() },
  handler: async (ctx, { clerkId }) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk", (q) => q.eq("clerkId", clerkId))
      .first();
    return user;
  },
});

export const getUserById = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    return await ctx.db.get(userId);
  },
});
