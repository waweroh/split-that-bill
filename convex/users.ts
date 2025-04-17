import { mutation, query } from "./_generated/server"
import { v } from "convex/values"

// Get or create a user with a session ID
export const getOrCreateUser = mutation({
  args: {
    sessionId: v.string(),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if user exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_sessionId", (q) => q.eq("sessionId", args.sessionId))
      .first()

    if (existingUser) {
      return existingUser._id
    }

    // Create new user
    return await ctx.db.insert("users", {
      sessionId: args.sessionId,
      name: args.name,
      createdAt: Date.now(),
    })
  },
})

// Get user by session ID
export const getUserBySessionId = query({
  args: { sessionId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_sessionId", (q) => q.eq("sessionId", args.sessionId))
      .first()
  },
})
