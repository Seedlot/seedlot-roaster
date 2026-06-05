# DEPRECATED - Seedlot Roaster

This application is retired and must not be deployed.

Production `https://roast.seedlot.io` is Seedlot Roastery OS, maintained in:

- Local workspace: `../seedlot-roastery-os`
- GitHub repo: `Seedlot/seedlot-roastery-os`

Do not run `vercel deploy`, `npm run build`, or production work from this repository. The package scripts intentionally fail to prevent replacing Roastery OS with the old mini app.

# Historical Seedlot Roaster Context

## Project Overview

Free AI-powered roast profile builder for ROEST sample roasters. Users bring their own Anthropic API key (BYOK), describe their coffee, choose a flavor target, and get an optimized 9-point roast curve with machine settings and during-roast checklist.

**Tech Stack:** Next.js 16, React 19, TypeScript, Clerk (auth), Tailwind CSS 4, recharts, @anthropic-ai/sdk
**Port:** 3009 (dev)
**Deployment:** Vercel (automatic on push to main)
**Domain:** roast.seedlot.io

## Quick Start

```bash
npm install
npm run dev          # Start Next.js dev server (port 3009, Turbopack)
npm run build        # Build for production
npm run lint         # ESLint
```

## Repository Structure

```
seedlot-roaster/
├── CLAUDE.md
├── package.json
├── next.config.ts
├── src/
│   ├── app/
│   │   ├── layout.tsx              # ClerkProvider, fonts, metadata
│   │   ├── globals.css             # Seedlot brand theme
│   │   ├── page.tsx                # Wizard (useReducer, 7 steps)
│   │   ├── profile/[id]/page.tsx   # Shareable saved profile view
│   │   ├── my-profiles/page.tsx    # Authenticated user's saved profiles
│   │   └── api/
│   │       ├── generate/route.ts       # POST: Claude API streaming with user's key
│   │       ├── validate-key/route.ts   # POST: validate Anthropic API key
│   │       ├── save-profile/route.ts   # POST: proxy to CMS
│   │       ├── save-result/route.ts    # POST: proxy to CMS
│   │       └── track/route.ts          # POST: session analytics to CMS
│   ├── components/
│   │   ├── wizard/                 # Step components
│   │   ├── profile/                # Profile display components
│   │   └── ui/                     # Shared UI components
│   ├── lib/
│   │   ├── types.ts                # WizardState, RoastProfile, CurvePoint
│   │   ├── constants.ts            # Origins, processes, varieties, flavor profiles
│   │   ├── roast-knowledge.ts      # Knowledge base from seedlot-ai-roaster
│   │   ├── prompt-builder.ts       # WizardState → Claude prompt
│   │   ├── profile-parser.ts       # Claude response → structured RoastProfile
│   │   ├── roest-export.ts         # Profile → ROEST JSON / clipboard text
│   │   ├── cms.ts                  # CMS API client
│   │   └── session.ts              # Anonymous session ID
│   └── middleware.ts               # Clerk (all routes public)
```

## Environment Variables

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...   # Clerk publishable key
CLERK_SECRET_KEY=sk_...                    # Clerk secret key
NEXT_PUBLIC_CMS_URL=https://cms.seedlot.io # CMS API base URL
CMS_API_KEY=...                            # CMS internal API key
```

## Key Patterns

### BYOK (Bring Your Own Key)
Users provide their Anthropic API key at step 5. The key is used server-side in `/api/generate` to call Claude, then discarded. Never stored, logged, or cached.

### Wizard State Management
Same `useReducer` pattern as seedlot-coffee-club. 7-step flow: Welcome → Describe Coffee → Define Style → Select Roaster → API Key → Profile Result → Post-Roast Feedback.

### AI Integration
- Knowledge base embedded in `roast-knowledge.ts` (from seedlot-ai-roaster repo)
- `prompt-builder.ts` constructs system + user messages
- `/api/generate` streams Claude response via SSE
- `profile-parser.ts` extracts structured JSON from response
- Model: claude-sonnet-4-6

### CMS Integration
Data saved to 3 CMS collections: `roast-profiles`, `roast-results`, `roaster-sessions`. Anonymous session tracking via internal API key; profile saving requires Clerk auth.

## Coding Conventions

- TypeScript with Next.js App Router
- Path aliases: `@/*` → `src/*`
- Tailwind CSS v4 for styling (Seedlot brand theme)
- Server components by default, `"use client"` only when needed
- ESLint 9 flat config
