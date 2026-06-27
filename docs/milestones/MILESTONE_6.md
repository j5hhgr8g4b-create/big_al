# Milestone 6 — Shopping

Status: Complete and live verified

Implemented: 2026-06-27

Completed: 2026-06-27

Live verified: 2026-06-27

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

- `202606200006_milestone_6_shopping.sql` applied to the connected Supabase project.
- Confirmed `shopping_lists` and `shopping_items` exist.
- Confirmed RLS is enabled on both Shopping tables.
- Confirmed Shopping functions exist in Supabase.
- Confirmed Menu → Pantry generation works in the app.
- Confirmed manual Shopping item add works.
- Confirmed purchased tick/untick works.
- Confirmed refresh persistence works.

## Regression Checklist

- Confirm `shopping_lists` and `shopping_items` exist and RLS is enabled.
- Confirm anonymous access is denied.
- Plan meals in Menu, then generate a Shopping list in Pantry.
- Confirm matching generated Ingredients consolidate when normalized name and unit match.
- Confirm manual Shopping items can be added.
- Confirm purchased items can be ticked and unticked.
- Refresh Pantry and confirm Shopping list state persists.
- Confirm regenerating from Menu replaces generated items while preserving manual items.
- Confirm a member cannot access another Restaurant's Shopping list or items.

## Deferred

- Unit conversion.
- Grocery price comparison.
- Full pantry inventory management.
- AI meal generation.