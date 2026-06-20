# Milestone 3 — Imports

Status: Complete

Implemented: 2026-06-20

Completed: 2026-06-20

## Delivered

- Restaurant-scoped Import records for URL and pasted-text sources.
- Authenticated Import capture with no direct table writes.
- Explicit manual parser placeholder metadata.
- Needs Review queue in Cookbook.
- Import review screen using the structured Recipe form.
- Atomic Import-to-Recipe conversion and source linking.
- Import-first routing for all future Recipe creation.

## Local Verification

- `pnpm lint` passed.
- `pnpm typecheck` passed.
- `pnpm build` passed with webpack.
- Import capture and review routes compiled as protected dynamic routes.

## Live Verification

- The migration ran successfully against the intended Supabase project.
- The Import table and both Import functions were detected remotely.
- Anonymous Import reads and unauthenticated operations were denied.
- An authenticated Import was captured and opened in Needs Review.
- The Import source and parser placeholder were displayed.
- The Import was structured and converted into a Recipe.
- The resulting Recipe opened successfully and the pending Import left Needs Review.
- Production server logs remained clean through conversion.

## Regression Checklist

- Repeat Import isolation with a member of another Restaurant when a second test account is available.
- Exercise URL-only, text-only, combined, maximum-length, and invalid URL inputs.
