# Milestone 5 — Menu

Status: Complete

Implemented: 2026-06-27

Completed: 2026-06-27

## Delivered

- Restaurant-scoped `meal_events` table with archive-only removal.
- Authenticated create/edit/archive functions for Menu planning.
- RLS so members can only read meal events for their Restaurants.
- Database validation that planned Recipes must belong to the same Restaurant and must not be archived.
- Menu page with This Week and Next Week planned meal sections.
- Menu add form for choosing an existing active Recipe, planned date, meal type, people eating, and optional note.
- Unplanned section showing active Cookbook Recipes not currently planned in the two-week Menu window.
- Recipe detail Add to Menu form.
- Serving context comparing Recipe servings with people eating.

## Local Verification

- `./node_modules/.bin/eslint .` passed.
- `./node_modules/.bin/next typegen && ./node_modules/.bin/tsc --noEmit` passed.
- `./node_modules/.bin/next build --webpack` passed.
- `pnpm lint`, `pnpm typecheck`, and `pnpm build` wrappers were attempted but pnpm stopped before running scripts because dependency build-script approval is pending for `sharp` and `unrs-resolver`.

## Live Verification

- Not performed in this local pass.
- The Milestone 5 migration still needs to be applied to the connected Supabase project.

## Regression Checklist

- Apply `202606200005_milestone_5_menu.sql` to Supabase.
- Confirm `meal_events` exists and RLS is enabled.
- Confirm anonymous access is denied.
- Confirm an authenticated Restaurant member can add, view, and archive a meal event.
- Confirm This Week and Next Week display planned meals.
- Confirm active Recipes appear in the picker and archived Recipes do not.
- Confirm a Recipe from another Restaurant cannot be planned.
- Repeat cross-Restaurant isolation with a second user when available.
- Confirm Shopping remains untouched until Milestone 6.
