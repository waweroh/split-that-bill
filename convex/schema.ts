import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export default defineSchema({
  // Store bills
  bills: defineTable({
    restaurant: v.string(),
    date: v.string(),
    createdAt: v.number(),
    createdBy: v.optional(v.string()), // Now optional user identifier
    totalAmount: v.number(),
    status: v.string(), // "active", "settled", "archived"
  }).index("by_createdAt", ["createdAt"]),

  // Store individual bill items
  items: defineTable({
    billId: v.id("bills"),
    name: v.string(),
    price: v.number(),
    createdAt: v.number(),
  }).index("by_billId", ["billId"]),

  // Store user selections (which items they've selected)
  selections: defineTable({
    billId: v.id("bills"),
    userId: v.string(), // Simple user identifier (could be a session ID)
    itemId: v.id("items"),
    createdAt: v.number(),
  })
    .index("by_billId_userId", ["billId", "userId"])
    .index("by_itemId", ["itemId"]),

  // Store payments made by users
  payments: defineTable({
    billId: v.id("bills"),
    userId: v.string(), // Simple user identifier
    amount: v.number(),
    createdAt: v.number(),
  }).index("by_billId_userId", ["billId", "userId"]),

  // Simple user table without authentication
  users: defineTable({
    name: v.string(),
    sessionId: v.string(), // Session identifier
    createdAt: v.number(),
  }).index("by_sessionId", ["sessionId"]),
})
