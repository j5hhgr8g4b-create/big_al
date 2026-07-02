# Milestone 12 — Attribution Protection

Status: Complete

## Summary

Added first-class creator/source and source-site attribution handling while preserving legacy description-based attribution. Imported and edited Recipes can store attribution separately from Recipe descriptions, and Recipe detail displays it clearly alongside the source link.

## Files Changed

- `supabase/migrations/20260702164220_m11_m14_import_attribution_preferences.sql`
- `src/components/recipe-form.tsx`
- `src/app/(app)/cookbook/recipes/actions.ts`
- `src/app/(app)/cookbook/recipes/[recipeId]/page.tsx`
- `src/app/(app)/cookbook/recipes/[recipeId]/edit/page.tsx`
- `src/lib/recipes/get-recipe.ts`

## Validation

- `pnpm lint`
- `pnpm typecheck`

## Known Limits

This is attribution capture and display, not plagiarism detection, rights clearance, or licensing enforcement.
