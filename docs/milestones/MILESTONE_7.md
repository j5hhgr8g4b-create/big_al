# Milestone 7 — Cook Mode

Status: Complete

Implemented: 2026-06-27

Completed: 2026-06-27

## Delivered

- Cook Mode route at `/cookbook/recipes/[recipeId]/cook`.
- Recipe detail Cook button that starts Cook Mode.
- Large readable step-by-step layout.
- Previous and Next navigation through Recipe steps.
- Clear current step progress and progress bar.
- Recipe context for total time, servings, Ingredients, and exit back to Recipe detail.
- Simple start/pause/reset timer.
- Mark cooked action from the final step that persists a cook record.
- Cook again and Done for now feedback that persists `cook_again`.
- Screen-awake guidance copy instead of native wake-lock support.
- Restaurant-scoped access through existing Recipe reads and M7 cook-history RPCs.
- `recipe_cooks` table for future Times Cooked and Cook Again Rate trust signals.

## Local Verification

- `pnpm lint` passed.
- `pnpm tsc --noEmit` passed.
- `pnpm exec next build --webpack` passed.

## Live Verification

- Not performed in this local pass.
- The Milestone 7 migration still needs to be applied to the connected Supabase project.

## Regression Checklist

- Open a saved Recipe and confirm the Cook button appears.
- Start Cook Mode.
- Confirm the first step is large and readable on mobile.
- Use Next and Previous and confirm progress updates.
- Open Ingredients and confirm Recipe context is present.
- Start, pause, and reset the timer.
- Navigate to the final step and mark cooked.
- Confirm cooked feedback appears.
- Confirm a `recipe_cooks` row is created.
- Choose Cook again and confirm it sets `cook_again = true` and returns to step 1.
- Repeat cooking, choose Done for now, and confirm it sets `cook_again = false` and returns to Recipe detail.
- Confirm a member cannot open another Restaurant's Recipe in Cook Mode.

## Deferred

- Native screen-awake/wake-lock support.
- Voice control.
- AI cooking assistant.
