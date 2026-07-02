# Current Status

## Branch Status

`main` is stale and must not be used for the next Codex task.

The current working branch is:

```txt
clean-milestone-4-sync
```

## Current Milestone

Milestones 0-8 are complete for the current build path. M11-M14 are now complete on `clean-milestone-4-sync`.

URL import foundation already exists and has been hardened. Attribution protection, Restaurant cooking preferences foundation, and MVP closeout QA are now in place.

Pantry/Shopping UAT cleanup is also in place on this branch: generated Shopping lists now filter obvious non-shopping basics, treat tiny spice amounts as buyable spice items, combine obvious same-unit duplicates, and show planned meal/date context.

Follow-up Shopping normalisation now strips obvious prep notes from generated item titles, combines garlic/onion-style variants more reliably, categorises tomato purée away from Fresh produce, and prioritises meal/date context over repeated source labels.

Garlic duplicate fallback is in place at both generation time and display time so older generated Shopping rows can render as one Garlic card before the user regenerates the list.

## Completed Milestones

- Milestone 0 — Project Setup
- Milestone 1 — Auth + Restaurants
- Milestone 2 — Cookbook + Recipes
- Milestone 3 — Imports
- Milestone 4 — Recipe Books + Search
- Milestone 5 — Menu
- Milestone 6 — Shopping
- Milestone 7 — Cook Mode
- Milestone 8 — Basic Big Al
- M11 — URL import hardening
- M12 — Attribution protection
- M13 — Restaurant preferences foundation
- M14 — MVP closeout QA

## Latest Verification Checkpoint

2026-07-02 M11-M14 UAT/regression pass completed:

- Branch confirmed as `clean-milestone-4-sync`; `main` remains stale.
- Supabase migrations are present through the M11-M14 anon RPC execute restriction follow-up.
- Code inspection covered Auth, Restaurant, Kitchen, Cookbook, URL Import, Recipe Books, Search, Menu, Pantry/Shopping, Cook Mode, and security/RLS paths.
- Local protected-route smoke tests confirmed logged-out app routes redirect to `/login`.
- `pnpm lint`, `pnpm typecheck`, `pnpm build`, and `git diff --check` passed.
- UAT report added at `docs/UAT_MVP_M11_M14.md`.
- Founder UAT with a live authenticated Supabase session is still required before launch sign-off.

2026-06-27 M6 live verification passed:

- Existing Supabase user login works.
- `pnpm lint` passed.
- `pnpm tsc --noEmit` passed.
- `pnpm exec next build --webpack` passed.
- Milestone 6 migration `202606200006_milestone_6_shopping.sql` was applied to the connected Supabase project.
- `shopping_lists` and `shopping_items` exist in Supabase with RLS enabled.
- Shopping generation from planned meals works in the app.
- Manual Shopping item add works.
- Purchased tick/untick works.
- Shopping state persists after refresh.

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
- Generated Shopping items filter obvious non-shopping basics such as water, ice, and generic salt/pepper.
- Generated Shopping items show common small measured spices as buyable items, with Recipe amounts in notes instead of as the main item.
- Generated Shopping items strip obvious prep notes such as peeled, chopped, minced, melted, optional, and note callouts from the display title.
- Generated Shopping items combine common garlic forms such as cloves garlic, garlic cloves, and garlic clove into Garlic when safe.
- Pantry defensively canonicalises older generated garlic rows at display time and toggles grouped generated rows together.
- Generated Shopping items include subtle Menu meal/date context and simple buy-closer guidance for obvious short-life items planned later.
- Pantry groups active Shopping items into lightweight shop sections without adding full inventory management.
- Pantry supports manual Shopping item additions and purchased tick/untick state.
- Shopping state persists through Supabase-backed reads after refresh.
- Recipe detail pages link to Cook Mode.
- Cook Mode shows one large readable Recipe step at a time with previous/next navigation.
- Cook Mode includes progress, Recipe context, Ingredients access, a simple timer, screen-awake guidance, and a persisted mark-cooked completion flow.
- Cook Mode records Recipe cook history and cook-again feedback for future Recipe trust signals.
- Specials now hosts a Basic Big Al entry point.
- Basic Big Al uses deterministic Restaurant-scoped reads from saved Recipes, Ingredients, Steps, Menu, Shopping, and cook history.
- Basic Big Al can find saved Recipes, suggest Recipes, surface planned Recipes, surface recently cooked Recipes, and show cook-again Recipes.
- Basic Big Al requires no paid AI provider, API key, model, billing setup, usage plan, or subscription.
- URL import foundation exists: URL/text imports are captured, reviewable, and convertible into saved Recipes.
- URL imports normalize common tracking parameters, preserve source URLs, extract JSON-LD Recipe data more reliably, and fall back to basic page metadata when structured recipe data is missing.
- Import review distinguishes extracted, partly extracted, and fallback states.
- Import review warns when the same source URL already exists as a saved Recipe or another pending Import.
- Recipes can store creator/source and source-site attribution separately from the Recipe description.
- Restaurant cooking preferences can store unit preference, oven type, hob type, and simple equipment limits.
- Recipe detail and Cook Mode show lightweight kitchen preference guidance when preferences are set.
- Import review now guards exact source URL duplicates: users see a strong warning, can open the existing Recipe, and must choose an explicit duplicate override before another copy can be saved.

## Known Issues / Watch Items

- Specials is now Basic Big Al; it should remain grounded helper behaviour, not a generic chatbot.
- Pantry is now the Shopping area; it should remain Shopping support and not become full pantry inventory management.
- Turbopack production output previously produced client-manifest runtime errors; production builds should continue to use webpack unless revalidated.
- A second-user cross-Restaurant RLS test remains on the regression checklist.
- URL extraction still depends on recipe pages exposing usable JSON-LD or basic metadata. It does not use AI, OCR, browser automation, or unsupported scraping workarounds.
- Duplicate detection remains MVP-level: exact source URL duplicates are guarded, same-title matches are warned, and existing duplicate Recipes are not deleted automatically.
- Attribution protection is MVP-level metadata capture and display; it is not a plagiarism checker or licensing system.
- Restaurant cooking preferences are guidance only. They do not automatically convert units, rewrite recipes, or adapt oven temperatures.
- Recipe search uses simple literal containment rather than ranked full-text search.
- Shopping cleanup is MVP-level and keyword-based. It combines only matching normalized Ingredient names with compatible units and simple numeric quantities. Unit conversion, pack-size inference, grocery pricing, pantry inventory, and expiry prediction are intentionally deferred.
- Cook Mode records cook history but does not yet display Times Cooked or Cook Again Rate in the UI.
- Basic Big Al is deterministic and intentionally simple. It does not generate new meal plans, search the internet, use paid AI, convert units, or make unsupported claims.

## Blocked Items

None, provided Codex confirms it is working inside `/workspaces/big_al` before editing.

## Next Task

Use `clean-milestone-4-sync` for the next Codex task. Do not use `main`; it is stale.

M11-M14 are complete and ready for founder UAT. Next implementation work should be explicitly approved before coding.

Do not build paid AI integration, grocery price comparison, full pantry inventory management, calorie tracking, unscoped meal generation, social mechanics, or features beyond M8 without explicit approval.

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

Before starting the next task, Codex must confirm:

- Branch is `clean-milestone-4-sync`.
- `main` is stale and is not the working source.
- Milestones 0-8 are complete.
- URL import foundation already exists.
