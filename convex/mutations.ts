import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const createUser = mutation({
  args: {
    kind: v.union(v.literal("human"), v.literal("agent")),
    clerkId: v.optional(v.string()),
    agentId: v.optional(v.string()),
    displayName: v.string(),
    machineId: v.optional(v.string()),
  },
  handler: async (ctx, { kind, clerkId, agentId, displayName, machineId }) => {
    return await ctx.db.insert("users", {
      kind,
      clerkId,
      agentId,
      displayName,
      machineId,
      active: true,
    });
  },
});

export const sendMessage = mutation({
  args: {
    threadId: v.id("threads"),
    authorUid: v.id("users"),
    body: v.string(),
    clientMessageId: v.optional(v.string()),
    replyTo: v.optional(v.id("messages")),
    type: v.optional(v.union(v.literal("text"), v.literal("event"), v.literal("system"))),
  },
  handler: async (
    ctx,
    { threadId, authorUid, body, clientMessageId, replyTo, type = "text" }
  ) => {
    // Idempotency: check if message already exists with this clientMessageId
    if (clientMessageId) {
      const existing = await ctx.db
        .query("messages")
        .withIndex("by_client_id", (q) =>
          q.eq("clientMessageId", clientMessageId)
        )
        .first();
      if (existing) return existing;
    }

    const messageId = await ctx.db.insert("messages", {
      threadId,
      authorUid,
      body,
      clientMessageId,
      replyTo,
      type,
    });

    // Create deliveries for all thread members
    const thread = await ctx.db.get(threadId);
    if (thread) {
      for (const targetUid of thread.members) {
        if (targetUid !== authorUid) {
          await ctx.db.insert("deliveries", {
            messageId,
            targetUid,
            status: "queued",
            attempts: 0,
          });
        }
      }
    }

    return messageId;
  },
});

export const createThread = mutation({
  args: {
    kind: v.union(v.literal("dm"), v.literal("group"), v.literal("project"), v.literal("ops")),
    title: v.string(),
    projectId: v.optional(v.id("projects")),
    members: v.array(v.id("users")),
  },
  handler: async (ctx, { kind, title, projectId, members }) => {
    return await ctx.db.insert("threads", {
      kind,
      title,
      projectId,
      members,
      archived: false,
    });
  },
});

export const addUserToThread = mutation({
  args: {
    threadId: v.id("threads"),
    userId: v.id("users"),
  },
  handler: async (ctx, { threadId, userId }) => {
    const thread = await ctx.db.get(threadId);
    if (!thread) throw new Error("Thread not found");
    
    if (!thread.members.includes(userId)) {
      await ctx.db.patch(threadId, {
        members: [...thread.members, userId],
      });
    }
    return threadId;
  },
});

export const markDelivered = mutation({
  args: {
    deliveryId: v.id("deliveries"),
  },
  handler: async (ctx, { deliveryId }) => {
    const delivery = await ctx.db.get(deliveryId);
    if (!delivery) throw new Error("Delivery not found");
    
    await ctx.db.patch(deliveryId, {
      status: "delivered",
      attempts: delivery.attempts + 1,
    });
    return deliveryId;
  },
});

export const createProject = mutation({
  args: {
    name: v.string(),
    slug: v.string(),
    assignedTo: v.array(v.id("users")),
  },
  handler: async (ctx, { name, slug, assignedTo }) => {
    return await ctx.db.insert("projects", {
      name,
      slug,
      assignedTo,
    });
  },
});
