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
