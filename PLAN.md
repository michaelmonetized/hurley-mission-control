# PLAN — Hurley Mission Control

## Phase 0: Foundation (today)
- [x] Monorepo scaffold
- [ ] Convex schema + indexes
- [ ] Clerk auth + roles model
- [ ] Basic threads/messages UI

## Phase 1: Routing
- [ ] Daemon auth as agent user
- [ ] Subscription to assigned threads
- [ ] Outbound relay to Convex
- [ ] Delivery receipts + retries

## Phase 2: OpenClaw Plugin
- [ ] mission-control channel adapter
- [ ] message/send, reply threading, events
- [ ] loop protection + idempotency keys

## Phase 3: UX Polish
- [ ] Command palette + keyboard-first nav (Superhuman/Vim style)
- [ ] Snappy animations + optimistic sends
- [ ] Presence + unread + mention routing
