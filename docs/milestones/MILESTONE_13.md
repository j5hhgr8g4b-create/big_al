# Milestone 13 — Restaurant Preferences Foundation

Status: Complete

## Summary

Added a Restaurant-scoped cooking preferences foundation for unit preference, oven type, hob type, and simple equipment limits. Preferences can be edited from Kitchen and are shown as lightweight guidance on Recipe detail and Cook Mode.

## Files Changed

- `supabase/migrations/20260702164220_m11_m14_import_attribution_preferences.sql`
- `src/lib/restaurants/preferences.ts`
- `src/app/(app)/restaurants/preferences/page.tsx`
- `src/app/(app)/restaurants/preferences/actions.ts`
- `src/app/(app)/page.tsx`
- `src/app/(app)/cookbook/recipes/[recipeId]/page.tsx`
- `src/app/(app)/cookbook/recipes/[recipeId]/cook/page.tsx`

## Validation

- `pnpm lint`
- `pnpm typecheck`

## Known Limits

Preferences are guidance only. They do not automatically convert units, change oven temperatures, or rewrite recipe methods.
