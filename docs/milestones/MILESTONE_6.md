# Milestone 6 — Shopping

Status: Complete

Implemented: 2026-06-27

Completed: 2026-06-27

## Delivered

- Restaurant-scoped `shopping_lists` table with one active Shopping list per Restaurant for MVP.
- Restaurant-scoped `shopping_items` table with generated/manual source, optional quantity/unit/notes, and purchased state.
- Authenticated Shopping functions for active-list creation, Menu-based generation, manual item creation, and purchased tick/untick.
- RLS so members can only read Shopping lists and items for their Restaurants.
- Pantry page with Menu generation, manual add form, active Shopping list, purchased section, and clear empty states.
- Generated Shopping items from active planned Meal Events in the current two-week Menu range.
- Practical MVP consolidation by normalized Ingredient name and matching unit.

## Local Verification

- `pnpm lint` passed.
- `pnpm tsc --noEmit` passed.
- `pnpm exec next build --webpack` passed.

## Live Verification

- Not performed in this local pass.
- The Milestone 6 migration still needs to be applied to the connected Supabase project.

## Regression Checklist

- Apply `202606200006_milestone_6_shopping.sql` to Supabase.
- Confirm `shopping_lists` and `shopping_items` exist and RLS is enabled.
- Confirm anonymous access is denied.
- Plan meals in Menu, then generate a Shopping list in Pantry.
- Confirm matching generated Ingredients consolidate when normalized name and unit match.
- Confirm manual Shopping items can be added.
- Confirm purchased items can be ticked and unticked.
- Refresh Pantry and confirm Shopping list state persists.
- Confirm regenerating from Menu replaces generated items while preserving manual items.
- Confirm a member cannot access another Restaurant's Shopping list or items.
