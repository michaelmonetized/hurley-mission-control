import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    kind: v.union(v.literal("human"), v.literal("agent")),
    clerkId: v.optional(v.string()),
    agentId: v.optional(v.string()),
    displayName: v.string(),
    machineId: v.optional(v.string()),
    active: v.boolean(),
  })
    .index("by_clerk", ["clerkId"])
    .index("by_agent", ["agentId"]),

  projects: defineTable({
    name: v.string(),
    slug: v.string(),
    assignedTo: v.array(v.id("users")),
  }).index("by_slug", ["slug"]),

  threads: defineTable({
    kind: v.union(v.literal("dm"), v.literal("group"), v.literal("project"), v.literal("ops")),
    title: v.string(),
    projectId: v.optional(v.id("projects")),
    members: v.array(v.id("users")),
    archived: v.boolean(),
  }).index("by_project", ["projectId"]),

  messages: defineTable({
    threadId: v.id("threads"),
    authorUid: v.id("users"),
    body: v.string(),
    replyTo: v.optional(v.id("messages")),
    type: v.optional(v.union(v.literal("text"), v.literal("event"), v.literal("system"))),
    clientMessageId: v.optional(v.string()),
  })
    .index("by_thread", ["threadId"])
    .index("by_client_id", ["clientMessageId"]),

  deliveries: defineTable({
    messageId: v.id("messages"),
    targetUid: v.id("users"),
    status: v.union(v.literal("queued"), v.literal("delivered"), v.literal("failed")),
    attempts: v.number(),
    lastError: v.optional(v.string()),
  }).index("by_target", ["targetUid"]),

  presence: defineTable({
    uid: v.id("users"),
    online: v.boolean(),
    lastSeenAt: v.number(),
    machineMeta: v.optional(v.any()),
  }).index("by_uid", ["uid"]),
});
