# Current Status

## Current Milestone

Milestone 7 — Cook Mode is next.

Milestone 6 — Shopping is treated as completed for the current build path, with Supabase migration application and manual verification required in a connected environment.

## Completed Milestones

- Milestone 0 — Project Setup
- Milestone 1 — Auth + Restaurants
- Milestone 2 — Cookbook + Recipes
- Milestone 3 — Imports
- Milestone 4 — Recipe Books + Search
- Milestone 5 — Menu
- Milestone 6 — Shopping

## Latest Verification Checkpoint

2026-06-27 Codespaces checkpoint passed:

- Existing Supabase user login works.
- `pnpm lint` passed.
- `pnpm tsc --noEmit` passed.
- `pnpm exec next build --webpack` passed.
- Production route list includes `/`, `/login`, `/auth/callback`, `/cookbook`, `/menu`, `/pantry`, `/restaurants/new`, and `/specials`.

## What Works

- Next.js App Router with TypeScript and Tailwind CSS.
- Mobile-first application shell.
- Bottom navigation for Kitchen, Cookbook, Specials, Menu, and Pantry.
- Supabase browser client with environment variable validation.
- Lint, type checking, and webpack production build checks.
- Organized product documentation and milestone tracking indexes.
- Supabase cookie-based SSR clients and session refresh proxy.
- Email/password account creation, confirmation callback, sign-in, and sign-out flows.
- Protected application routes with unauthenticated redirects.
- Profile and Chef provisioning migration for new and existing Auth users.
- Membership-secured Restaurants and atomic Restaurant creation.
- Empty-Restaurant onboarding from Kitchen.
- Automatic one-per-Restaurant Cookbooks.
- Structured Recipes with creator, details, timing, servings, and difficulty.
- Restaurant-scoped normalized Ingredients and ordered Recipe Ingredients.
- Ordered Recipe Steps.
- Atomic Recipe creation and editing plus archive-only removal.
- Cookbook list and Recipe create, view, edit, and archive screens.
- Restaurant-scoped URL/text Import capture.
- Explicit placeholder parser metadata with manual review.
- Cookbook Needs Review queue.
- Atomic Import-to-Recipe conversion.
- Import-first Recipe creation from Kitchen and Cookbook.
- Restaurant-scoped Recipe Books with create, view, edit, and archive flows.
- Atomic add/remove Recipe Book membership controls on Recipes.
- Recipe search by title and Ingredient within the current Restaurant.
- Restaurant-scoped Menu planning with This Week and Next Week sections.
- Active Cookbook Recipes can be added to planned meal dates.
- Meal planning captures people eating and displays serving context.
- Meal events are archived rather than hard deleted.
- Restaurant-scoped Shopping lists and Shopping items.
- Pantry generates a Shopping list from planned Menu meals.
- Generated Shopping items consolidate matching Ingredients by normalized name and unit where practical for MVP.
- Pantry supports manual Shopping item additions and purchased tick/untick state.
- Shopping state persists through Supabase-backed reads after refresh.

## Known Issues / Watch Items

- Specials remains an intentional placeholder for later discovery work.
- Pantry is now the Shopping area; it should remain Shopping support and not become full pantry inventory management.
- Turbopack production output previously produced client-manifest runtime errors; production builds should continue to use webpack unless revalidated.
- A second-user cross-Restaurant RLS test remains on the regression checklist.
- Automatic Import parsing is intentionally a placeholder; URLs are stored but not fetched.
- Recipe search uses simple literal containment rather than ranked full-text search.
- Confirm the Milestone 5 and Milestone 6 migrations have been applied to the connected Supabase project before shared-environment Shopping verification.

## Blocked Items

None, provided Codex confirms it is working inside `/workspaces/big_al` before editing.

## Next Task

Apply and verify Milestone 6 — Shopping in the connected Supabase project, then begin Milestone 7 — Cook Mode only after a short readiness review.

M7 scope remains step-by-step cooking flow. Do not build grocery price comparison, full pantry inventory management, calorie tracking, AI meal generation, or social mechanics.

## Codex Working Directory Rule

Before any Codex task, run:

```bash
pwd
git status --short
```

Codex must only inspect and edit files inside:

```txt
/workspaces/big_al
```
