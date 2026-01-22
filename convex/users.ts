import type { UserJSON } from "@clerk/backend";
import { v } from "convex/values";

import { internalMutation, mutation, query } from "./_generated/server";

// =============================================================================
// Internal Mutations (Webhook)
// =============================================================================

export const upsertFromClerk = internalMutation({
  args: { data: v.any() },
  handler: async (ctx, { data }) => {
    const clerkUser = data as UserJSON;
    const userAttributes = {
      clerkId: clerkUser.id,
      email: clerkUser.email_addresses[0]?.email_address ?? "",
      firstName: clerkUser.first_name ?? undefined,
      lastName: clerkUser.last_name ?? undefined,
      imageUrl: clerkUser.image_url ?? undefined,
    };

    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkUser.id))
      .unique();

    if (existingUser) {
      await ctx.db.patch(existingUser._id, userAttributes);
      return existingUser._id;
    }

    return await ctx.db.insert("users", userAttributes);
  },
});

export const deleteFromClerk = internalMutation({
  args: { clerkUserId: v.string() },
  handler: async (ctx, { clerkUserId }) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkUserId))
      .unique();

    if (user) {
      await ctx.db.delete(user._id);
    }
  },
});

// =============================================================================
// Queries
// =============================================================================

export const current = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    return user;
  },
});

// =============================================================================
// Mutations
// =============================================================================

export const store = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Called store without authentication present");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (user !== null) {
      // User already exists, update if needed
      if (
        user.firstName !== identity.givenName ||
        user.lastName !== identity.familyName ||
        user.imageUrl !== identity.pictureUrl
      ) {
        await ctx.db.patch(user._id, {
          firstName: identity.givenName,
          lastName: identity.familyName,
          imageUrl: identity.pictureUrl,
        });
      }
      return user._id;
    }

    // Create new user
    return await ctx.db.insert("users", {
      clerkId: identity.subject,
      email: identity.email ?? "",
      firstName: identity.givenName,
      lastName: identity.familyName,
      imageUrl: identity.pictureUrl,
    });
  },
});
