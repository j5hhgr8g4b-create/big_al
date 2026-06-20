# Milestone 1 — Auth + Restaurants

Status: Implementation complete; Supabase verification pending

Implemented: 2026-06-20

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

## Required Before Completion

1. Apply `supabase/migrations/202606200001_milestone_1_auth_restaurants.sql`.
2. Add project values to `.env.local`.
3. Allow `http://localhost:3000/auth/callback` in Supabase Auth settings.
4. Test account creation and email confirmation.
5. Confirm Profile and Chef provisioning.
6. Create a Restaurant and confirm its owner membership.
7. Test sign-in and sign-out.
8. Verify RLS isolation using a second user.
