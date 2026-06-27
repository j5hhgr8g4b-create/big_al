# Current Status

## Current Milestone

Milestone 5 — Menu completed. Next: Milestone 6 — Shopping.

## Completed Milestones

- Milestone 0 — Project Setup
- Milestone 1 — Auth + Restaurants
- Milestone 2 — Cookbook + Recipes
- Milestone 3 — Imports
- Milestone 4 — Recipe Books + Search
- Milestone 5 — Menu

## What Works

- Next.js App Router with TypeScript and Tailwind CSS.
- Mobile-first application shell.
- Bottom navigation for Kitchen, Cookbook, Specials, Menu, and Pantry.
- Supabase browser client with environment variable validation.
- Lint, type checking, and production build checks.
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

## Known Issues

- Specials and Pantry remain intentional placeholders for later milestones.
- Turbopack production output produced client-manifest runtime errors; production builds use webpack.
- A second-user cross-Restaurant RLS test remains on the regression checklist.
- Automatic Import parsing is intentionally a placeholder; URLs are stored but not fetched.
- Recipe search uses simple literal containment rather than ranked full-text search.
- Milestone 5 migration has not yet been applied to the connected Supabase project in this local pass.
- `pnpm` script wrappers currently stop on dependency build-script approval; direct local binaries passed lint, typecheck, and build.

## Blocked Items

None.

## Next Task

Begin Milestone 6 only after approval: Shopping lists and Shopping items generated from planned meals.
