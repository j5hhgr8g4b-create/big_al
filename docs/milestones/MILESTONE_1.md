# Milestone 1 — Auth + Restaurants

Status: Complete

Implemented: 2026-06-20

Completed: 2026-06-20

## Delivered

- Supabase email/password sign-up, confirmation callback, sign-in, and sign-out.
- Cookie-based browser and server clients with a session refresh proxy.
- Protected application route group.
- `profiles`, `chefs`, `restaurants`, and `restaurant_members` migration.
- Automatic Profile and Chef creation for new users, plus existing-user backfill.
- Membership-based RLS and restricted grants.
- Atomic Restaurant and owner-membership creation.
- Kitchen onboarding for users without a Restaurant.

## Local Verification

- `pnpm lint` passed.
- `pnpm typecheck` passed.
- `pnpm build` passed with placeholder public configuration.
- `/login` returned 200 from the production server.
- Unauthenticated `/` redirected to `/login`.
- An invalid Auth callback redirected to a safe login error.

## Live Verification

- The migration ran successfully against the intended Supabase project.
- All four tables and the atomic Restaurant function were detected remotely.
- Anonymous table access and unauthenticated Restaurant creation were denied.
- A real account completed email confirmation and authenticated navigation.
- Profile and Chef provisioning succeeded.
- Restaurant creation and owner membership succeeded atomically.
- The authenticated Menu route rendered without server errors.
- Webpack production output passed route and runtime checks.

## Regression Checklist

- Repeat cross-Restaurant isolation with a second test user when available.
