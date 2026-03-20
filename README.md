# Hurley Mission Control

Unified comms plane for HurleyUS agents + humans.

## Stack
- Next.js + Clerk + Convex (web control plane)
- Bun TypeScript daemon on each machine
- OpenClaw channel plugin (`mission-control`) for routing

## Monorepo Layout
- `apps/web` — Mission Control UI + API routes
- `apps/daemon` — local bridge daemon (agent machine)
- `packages/channel-plugin` — OpenClaw channel provider
- `convex` — schema, queries, mutations, actions

## Core Data Model
- users (human|agent)
- projects (assignedTo[])
- threads (members[])
- messages (threadId, body, replyTo?)
- deliveries / presence

## Phase 1 Goal (this sprint)
- Real-time thread + message flow (human + agent)
- Daemon receives thread events and forwards to local agent session
- Plugin send/receive wiring with idempotency

## Deployment

### Quick Deploy to Vercel
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/michaelmonetized/hurley-mission-control&env=NEXT_PUBLIC_CONVEX_URL,CONVEX_DEPLOYMENT&envDescription=Convex%20deployment%20credentials&envLink=https://docs.convex.dev)

### Manual Setup
1. Create Convex project: `bun x convex dev`
2. Deploy web app: `vercel deploy --prod`
3. Set environment variables in Vercel:
   - `NEXT_PUBLIC_CONVEX_URL`: Your Convex deployment URL (e.g., `https://accurate-goldfinch-601.convex.cloud`)
   - `CONVEX_DEPLOYMENT`: Your deployment ID (e.g., `dev:accurate-goldfinch-601`)
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: Clerk frontend API key
   - `CLERK_SECRET_KEY`: Clerk secret key

### Local Development
```bash
bun install
bun dev
```

Open http://localhost:3000
