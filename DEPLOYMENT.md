# Deployment Guide

## Overview

This is a monorepo for the Hurley Mission Control web app and daemon.

- **Web app:** Next.js 16, Clerk auth, Convex backend
- **Daemon:** Node.js relay service for OpenClaw session messaging
- **Backend:** Convex serverless database

## Prerequisites

1. **Convex Account** (https://convex.dev)
   - Create a new project
   - Note the deployment URL (e.g., `https://xxx.convex.cloud`)
   - Note the deployment ID (e.g., `dev:hustlestack-us`)

2. **Clerk Account** (https://dashboard.clerk.com)
   - Create an application
   - Note the publishable key and secret key
   - Set up JWT template for Convex auth

3. **Vercel Account** (https://vercel.com)
   - Connect your GitHub repo
   - Set environment variables (see below)

## Environment Variables

Create `.env.local` locally:

```bash
# Convex
NEXT_PUBLIC_CONVEX_URL=https://xxx.convex.cloud
CONVEX_DEPLOYMENT=dev:your-deployment

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Clerk auth URLs (these are defaults)
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
```

In Vercel, set the same variables (minus `NEXT_PUBLIC_` prefix for server-only vars).

## Local Development

```bash
# Install dependencies
bun install

# Start Convex dev server
bun x convex dev

# In another terminal, start the web app
bun --cwd apps/web dev

# Open http://localhost:3410
```

## Deploy to Production

### 1. Deploy Convex Schema

```bash
bun x convex deploy
```

This will:
- Authenticate to your Convex project
- Deploy the schema (schema.ts, queries.ts, mutations.ts)
- Generate TypeScript types

### 2. Deploy Web App to Vercel

```bash
vercel deploy --prod
```

Or push to main branch if Vercel is configured with GitHub integration.

### 3. Verify Deployment

1. Visit https://hurleyus-mission-control.vercel.app
2. Sign in with Clerk
3. Check that threads load
4. Send a test message to verify real-time polling

## Troubleshooting

### "Cannot find module '@/convex/_generated/api'"

Run `bun x convex dev` or `bun x convex deploy` to regenerate types.

### "Convex auth failed"

Ensure CLERK_SECRET_KEY is set in Vercel, and the JWT template is configured in Clerk.

### Messages not appearing in real-time

Check that `NEXT_PUBLIC_CONVEX_URL` is correct. The polling interval is 2 seconds by default.

## Architecture

```
client (Next.js)
  ↓ (Clerk JWT)
  ↓
Convex serverless DB
  ↑
  ↑ (ConvexProvider)
  ↑
Dashboard
  ├─ Thread list (useQuery)
  ├─ Message feed (useQuery + polling every 2s)
  └─ Message input (useMutation + optimistic UI)
```

## Next Steps

- [ ] Add Convex `useSubscription` for true real-time (replaces polling)
- [ ] Implement daemon relay service for OpenClaw
- [ ] Add message search + filtering
- [ ] Implement thread creation UI
