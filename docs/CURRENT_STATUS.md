# Current Status

## Current Milestone

Milestone 1 — Auth + Restaurants implementation complete; Supabase setup and end-to-end verification pending.

## Completed Milestones

- Milestone 0 — Project Setup

## What Works

- Next.js App Router with TypeScript and Tailwind CSS.
- Mobile-first application shell.
- Bottom navigation for Kitchen, Cookbook, Specials, Menu, and Pantry.
- Supabase browser client with environment variable validation.
- Lint, type checking, and production build checks.
- Organized product documentation and milestone tracking indexes.
- Supabase cookie-based SSR clients and session refresh proxy.
- Email/password account creation, confirmation callback, sign-in, and sign-out flows.
- Protected application routes with unauthenticated redirects.
- Profile and Chef provisioning migration for new and existing Auth users.
- Membership-secured Restaurants and atomic Restaurant creation.
- Empty-Restaurant onboarding from Kitchen.

## Known Issues

- Supabase requires real project values in `.env.local` before service-backed features can run.
- The Milestone 1 migration has not been applied to a Supabase project.
- Authenticated and RLS behavior has not yet been tested against a real Supabase project.
- Cookbook, Specials, Menu, and Pantry remain intentional placeholders for later milestones.

## Blocked Items

- Apply `supabase/migrations/202606200001_milestone_1_auth_restaurants.sql` to the intended Supabase project.
- Configure `.env.local` and the allowed Auth callback URL without committing secrets.
- Complete the authenticated and two-user RLS test checklist.

## Next Task

Verify Milestone 1 against the configured Supabase project. Do not begin Milestone 2 until this passes.
