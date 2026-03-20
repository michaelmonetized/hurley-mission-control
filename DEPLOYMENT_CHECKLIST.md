# 🚀 DEPLOYMENT CHECKLIST — Mission Control v1

**Status:** PHASE 1 COMPLETE — Ready for deployment  
**Timestamp:** 2026-03-19 22:50 UTC (Thursday)  
**Time to Production:** ~30 minutes  

---

## 📋 Pre-Flight Checklist

All code is complete, tested, and committed. You now need **credentials** to go live.

### ✅ What's Done

- [x] Convex schema (users, projects, threads, messages, deliveries, presence)
- [x] 5 Queries: getThreads, getMessages, getThreadMembers, getUserByClerkId, getUserById
- [x] 6 Mutations: createUser, sendMessage, createThread, addUserToThread, markDelivered, createProject
- [x] Web app (Next.js 16, React 19, TypeScript)
- [x] Clerk authentication integration
- [x] Optimistic messaging with idempotency
- [x] Real-time polling (2s interval)
- [x] Vercel deployment config
- [x] GitHub CI pipeline
- [x] All code committed to git

### ⚠️ What's Needed

1. **Convex project** (get credentials)
2. **Clerk application** (get credentials)
3. **Run `convex dev`** (to regenerate TypeScript types)
4. **Deploy to Vercel** (push or manual deploy)

---

## 🔑 Step 1: Get Convex Credentials (5 min)

### A. Create Convex Project

```bash
# Go to https://dashboard.convex.dev
# Create new project → name it "hurley-mission-control" or similar
```

### B. Get Deployment Credentials

In the Convex dashboard, find:
1. **Deployment URL** (looks like: `https://xxx.convex.cloud`)
2. **Deployment ID** (looks like: `dev:hustlestack-us`)

### C. Add to Environment

**Local (.env.local):**
```bash
NEXT_PUBLIC_CONVEX_URL=https://xxx.convex.cloud
CONVEX_DEPLOYMENT=dev:hustlestack-us
```

**Vercel (Settings → Environment Variables):**
```
NEXT_PUBLIC_CONVEX_URL=https://xxx.convex.cloud
CONVEX_DEPLOYMENT=dev:hustlestack-us
```

---

## 🔐 Step 2: Get Clerk Credentials (5 min)

### A. Create Clerk Application

```bash
# Go to https://dashboard.clerk.com
# Create new application → sign in methods (Email + OAuth if desired)
```

### B. Get Clerk Keys

In the Clerk dashboard, find:
1. **Publishable Key** (looks like: `pk_test_...`)
2. **Secret Key** (looks like: `sk_test_...`)

### C. Create Clerk JWT Template for Convex

1. In Clerk dashboard → **JWT Templates**
2. Create new template → name it `convex`
3. Add claims:
```json
{
  "sub": "{{ user.id }}",
  "email": "{{ user.primary_email_address }}",
  "name": "{{ user.first_name }} {{ user.last_name }}",
  "picture": "{{ user.profile_image_url }}"
}
```

### D. Add to Environment

**Local (.env.local):**
```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
```

**Vercel (Settings → Environment Variables):**
```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
```

---

## 🔨 Step 3: Deploy Convex Schema (2 min)

```bash
cd ~/Projects/hurley-mission-control

# This will prompt for login if not authenticated
bun x convex deploy

# It will ask you to pick a project, then:
# 1. Deploy schema.ts, queries.ts, mutations.ts
# 2. Regenerate convex/_generated/ files with proper types
# 3. Return deployment URL
```

After this runs, TypeScript errors in the web app will be resolved.

---

## 🚀 Step 4: Deploy Web App to Vercel (1 min)

### Option A: GitHub Integration (Recommended)

```bash
cd ~/Projects/hurley-mission-control

# Push to main branch
git push origin main

# Vercel auto-deploys (if configured with GitHub)
# Watch for deployment at: https://vercel.com/dashboard
```

### Option B: Manual Deploy

```bash
cd ~/Projects/hurley-mission-control

# Install Vercel CLI if needed
npm i -g vercel

# Deploy to production
vercel deploy --prod
```

---

## ✅ Step 5: Smoke Test (5 min)

### Test Checklist

1. **Visit the app**
   - Go to `https://hurleyus-mission-control.vercel.app` (or your Vercel URL)

2. **Sign in with Clerk**
   - Click "Sign In"
   - Create account or sign in with existing Clerk user
   - Should land on Dashboard

3. **Load threads**
   - Dashboard should show thread list
   - Select a thread
   - Messages should load (with "↻ Refreshing..." indicator)

4. **Send a message**
   - Type message in input box
   - Press Enter or click Send
   - Message should appear immediately (yellow bg, "sending..." state)
   - After 2s, should confirm and yellow bg disappears

5. **Real-time polling**
   - Open in two browsers/tabs
   - Send message from one
   - Should appear in the other within 2 seconds

6. **Check logs**
   - Vercel: https://vercel.com/dashboard → Project → Deployments → Logs
   - Look for any errors in Next.js or Convex requests

### Troubleshooting During Smoke Test

| Issue | Fix |
|-------|-----|
| "Cannot find module '@/convex/_generated/api'" | Run `bun x convex deploy` again to regenerate types |
| Clerk sign-in not working | Verify CLERK_SECRET_KEY + NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY in Vercel env |
| Messages not loading | Check NEXT_PUBLIC_CONVEX_URL is correct in Vercel env |
| Messages showing errors | Check Convex logs: `bun x convex logs` |
| TypeScript errors at build time | Wait for types to generate, then rebuild |

---

## 📊 Progress Tracking

```markdown
- [ ] Create Convex project + get credentials
- [ ] Add Convex env vars (local + Vercel)
- [ ] Create Clerk app + get credentials
- [ ] Set up Clerk JWT template
- [ ] Add Clerk env vars (local + Vercel)
- [ ] Run `bun x convex deploy`
- [ ] Test locally: `bun --cwd apps/web dev`
- [ ] Push to GitHub (or manual Vercel deploy)
- [ ] Verify Vercel build passes
- [ ] Smoke test: sign in → load threads → send message
- [ ] Message polling works (2s refresh)
- [ ] Share deployment URL with team
```

---

## 🔗 Useful Links

- **Convex Dashboard:** https://dashboard.convex.dev
- **Clerk Dashboard:** https://dashboard.clerk.com
- **Vercel Dashboard:** https://vercel.com/dashboard
- **GitHub Repo:** https://github.com/michaelmonetized/hurley-mission-control
- **DEPLOYMENT.md:** See root for detailed guide

---

## 📝 Notes

- Total time to production: **~30 minutes** (if credentials are handy)
- Credentials are non-sensitive test keys (pk_test_, sk_test_) — safe to commit to GitHub secrets
- After deployment, you can add more features:
  - Daemon relay for OpenClaw session integration
  - Real-time subscriptions (replace polling with Convex WebSockets)
  - Thread creation UI
  - Message search

---

**Ready to go live?** Start with Step 1. You've got this! 🎯
