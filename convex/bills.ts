import { mutation, query } from "./_generated/server"
import { v } from "convex/values"

// Get all bills
export const getBills = query({
  handler: async (ctx) => {
    return await ctx.db.query("bills").order("desc").collect()
  },
})

// Get a specific bill with its items
export const getBill = query({
  args: { billId: v.id("bills") },
  handler: async (ctx, args) => {
    const bill = await ctx.db.get(args.billId)
    if (!bill) {
      return null
    }

    const items = await ctx.db
      .query("items")
      .withIndex("by_billId", (q) => q.eq("billId", args.billId))
      .collect()

    return { ...bill, items }
  },
})

// Create a new bill
export const createBill = mutation({
  args: {
    restaurant: v.string(),
    date: v.string(),
    items: v.array(
      v.object({
        name: v.string(),
        price: v.number(),
        quantity: v.number(),
      }),
    ),
    sessionId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Calculate total amount from items
    const totalAmount = args.items.reduce((sum, item) => sum + item.price * item.quantity, 0)

    // Create the bill
    const billId = await ctx.db.insert("bills", {
      restaurant: args.restaurant,
      date: args.date,
      createdAt: Date.now(),
      createdBy: args.sessionId,
      totalAmount,
      status: "active",
    })

    // Create individual items (expanding quantities)
    for (const item of args.items) {
      for (let i = 0; i < item.quantity; i++) {
        await ctx.db.insert("items", {
          billId,
          name: item.name,
          price: item.price,
          createdAt: Date.now(),
        })
      }
    }

    return billId
  },
})

// Update user selections
export const updateSelection = mutation({
  args: {
    billId: v.id("bills"),
    userId: v.string(),
    itemId: v.id("items"),
    selected: v.boolean(),
  },
  handler: async (ctx, args) => {
    // Check if selection already exists
    const existingSelections = await ctx.db
      .query("selections")
      .withIndex("by_billId_userId")
      .filter((q) => q.eq(q.field("billId"), args.billId))
      .filter((q) => q.eq(q.field("userId"), args.userId))
      .filter((q) => q.eq(q.field("itemId"), args.itemId))
      .collect()

    if (args.selected) {
      // Add selection if it doesn't exist
      if (existingSelections.length === 0) {
        return await ctx.db.insert("selections", {
          billId: args.billId,
          userId: args.userId,
          itemId: args.itemId,
          createdAt: Date.now(),
        })
      }
      return existingSelections[0]._id
    } else {
      // Remove selection if it exists
      for (const selection of existingSelections) {
        await ctx.db.delete(selection._id)
      }
      return null
    }
  },
})

// Get user selections for a bill
export const getUserSelections = query({
  args: {
    billId: v.id("bills"),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const selections = await ctx.db
      .query("selections")
      .withIndex("by_billId_userId")
      .filter((q) => q.eq("billId", q.value(args.billId)).eq("userId", args.userId))
      .collect()

    return selections.map((selection) => selection.itemId)
  },
})

// Update payment amount
export const updatePayment = mutation({
  args: {
    billId: v.id("bills"),
    userId: v.string(),
    amount: v.number(),
  },
  handler: async (ctx, args) => {
    // Check if payment record exists
    const existingPayments = await ctx.db
      .query("payments")
      .withIndex("by_billId_userId")
      .filter((q) => q.eq("billId", args.billId).eq("userId", args.userId))
      .collect()

    if (existingPayments.length > 0) {
      // Update existing payment
      return await ctx.db.patch(existingPayments[0]._id, {
        amount: args.amount,
      })
    } else {
      // Create new payment record
      return await ctx.db.insert("payments", {
        billId: args.billId,
        userId: args.userId,
        amount: args.amount,
        createdAt: Date.now(),
      })
    }
  },
})

// Get payment for a user on a bill
export const getPayment = query({
  args: {
    billId: v.id("bills"),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const payments = await ctx.db
      .query("payments")
      .withIndex("by_billId_userId", (q) => q.eq("billId", args.billId).eq("userId", args.userId))
      .collect()

    return payments.length > 0 ? payments[0].amount : 0
  },
})
