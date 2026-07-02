# MVP UAT Report — M11-M14

Date: 2026-07-02

Branch: `clean-milestone-4-sync`

## 1. Executive Summary

MVP UAT and regression checks passed for code inspection, protected-route smoke testing, and required build checks. No low-risk app bugs were found that required code changes.

The MVP is ready for founder UAT. It is not ready for launch sign-off until Alex completes connected Supabase manual testing with a real authenticated account and at least one saved Recipe.

## 2. What Was Tested

- Auth page rendering and logged-out route protection.
- Restaurant creation and membership-scoped access paths by inspection.
- Kitchen and Restaurant cooking preferences by inspection.
- Cookbook list, empty states, Recipe detail, Recipe edit/archive, attribution display, and kitchen guidance by inspection.
- URL Import creation, extraction states, review prefill, duplicate warnings, save conversion, discard, and bad URL handling by inspection.
- Recipe Books, Recipe Book edit/detail, membership assignment, and search by inspection.
- Menu planning and empty states by inspection.
- Pantry/Shopping generation, manual item add, purchased toggle, and empty states by inspection.
- Cook Mode steps, Ingredients, kitchen guidance, mark cooked, and cook-again flow by inspection.
- Security/RLS posture through migration and server action review.
- Local route smoke tests for `/login`, `/`, `/cookbook`, `/menu`, `/pantry`, `/cookbook/imports/new`, `/restaurants/preferences`, and `/specials`.
- Required command suite.

## 3. What Passed

- `clean-milestone-4-sync` is the current branch and is not `main`.
- Initial UAT worktree was restored to clean before testing.
- Supabase migrations are present through `20260702171052_m11_m14_restrict_anon_rpc_execute.sql`.
- M0-M8 and M11-M14 are documented as complete.
- `/login` renders sign-in and create-account forms with labels and clear button text.
- Logged-out app routes return `307` redirects to `/login`.
- Required checks passed:
  - `pnpm lint`
  - `pnpm typecheck`
  - `pnpm build`
  - `git diff --check`
- App code paths remain Restaurant-scoped through current Restaurant lookup, Restaurant IDs, cookbook IDs, RLS reads, and authenticated RPCs.
- M11-M14 write RPCs are not expected for anonymous users and have an anon-execute revoke migration.

## 4. Bugs Found And Fixed

- Founder UAT found that exact source URL duplicate warnings were too easy to bypass; the same imported Recipe could be saved twice from the review screen. The import review now blocks the normal save path for exact source duplicates, links to the existing Recipe, and requires the deliberate `Save anyway as a duplicate` override.
- Founder UAT found that Shopping generation copied raw Recipe ingredient lines too literally. Shopping list now filters non-shopping basics, handles spices as buyable items, combines obvious duplicates, and shows meal/date context.
- Founder UAT follow-up found garlic variants and prep notes still made the Shopping list feel like recipe text. Shopping list normalisation improved: prep notes are stripped from item titles, garlic/onion-style duplicates combine more reliably, tomato purée categorisation corrected, and meal/date context is prioritised over repeated source labels.
- Founder UAT found duplicate garlic cards still appeared from existing generated Shopping rows. Garlic and similar ingredient forms now canonicalise correctly, prep clutter is stripped before display, and regenerated shopping lists no longer show duplicate garlic cards.

Non-app cleanup: `next-env.d.ts` was restored before UAT because Next typegen had flipped its generated route type path.

## 5. Bugs Found But Not Fixed

- `pnpm start` failed locally with `unable to open database file` from the pnpm runner. The equivalent local Next binary started successfully with elevated local-server permission.
- Authenticated browser UAT was not possible in this pass because no live user session was available to this agent.
- Cross-Restaurant access could not be exercised live without a second authenticated user/session.

## 6. Manual Testing Still Required From Alex

- Sign up and sign in with a real account.
- Confirm logged-in Kitchen loads the expected Restaurant.
- Create or access a Restaurant.
- Save Restaurant cooking preferences, refresh, and confirm persistence.
- Try invalid preference values if testing via request tooling.
- Import a strong structured recipe URL.
- Import a weak/no-structured-data URL and confirm partial/fallback review.
- Confirm an exact duplicate source URL shows the strong duplicate warning, links to the existing Recipe, hides the normal Save button, and only saves through `Save anyway as a duplicate`.
- Confirm same-title possible duplicates show a softer warning and still allow normal saving.
- Confirm duplicate pending Import warnings.
- Save an Import and confirm the Recipe is created and the Import is converted.
- Discard an Import.
- Edit a Recipe and confirm attribution fields persist.
- Archive a Recipe and Recipe Book where appropriate.
- Search Recipes by title and ingredient.
- Plan Recipes in Menu.
- Generate and update Shopping items.
- Plan a meal with water in the ingredients and confirm water is not shown in the generated Shopping list.
- Plan a meal with generic salt and pepper and confirm generic salt/pepper is excluded by default.
- Plan a meal with specific salt or peppercorns and confirm specific buyable versions may remain.
- Plan a meal with spices measured in tsp/tbsp and confirm the spice name is the main item while the Recipe amount is secondary.
- Plan meals with `3 cloves garlic`, `6 garlic cloves`, and `1 garlic clove` and confirm one Garlic item appears with total cloves or readable recipe amounts.
- Confirm existing generated rows such as `3 cloves garlic (peeled and minced)`, `6 garlic cloves (, minced)`, and `Garlic Clove` display as one Garlic card before regeneration where they share generated Shopping state.
- Plan a meal with `1 large onion (peeled and finely chopped)` and confirm the main title is Onion, not the prep instruction.
- Plan a meal with `2 tbsp tomato puree (tomato paste in US)` and confirm Tomato purée appears under Tins, jars & packets or Pantry staples, not Fresh produce.
- Plan two meals with onions and confirm the generated onion item combines where safe.
- Plan two meals with the same ingredient but incompatible quantities and confirm the list does not crash and amounts remain readable.
- Plan meals across different dates and confirm Shopping items show the planned meal date context.
- Add a short-life ingredient for a later meal and confirm the item subtly says to buy closer to cooking day.
- Confirm each generated item shows subtle meal context without making the card noisy.
- Confirm checked/unchecked Shopping list behaviour still works.
- Use Cook Mode, mark cooked, and save cook-again feedback.
- Repeat a targeted second-user/cross-Restaurant RLS check.

## 7. Recommended Launch Blockers

- Complete connected Supabase founder UAT for Auth, Restaurant preferences, URL Import, Recipe save/edit, Menu, Shopping, and Cook Mode.
- Confirm the latest migrations have been applied to the intended Supabase project.
- Complete at least one second-user cross-Restaurant isolation check.

## 8. Non-Blocking Polish

- Add a lightweight scripted browser test harness later if repeated UAT becomes frequent.
- Consider a small live-data smoke checklist for every migration batch.
- The `pnpm start` local runner issue is worth monitoring, but it did not block `pnpm build` or direct Next server testing.

## 9. Commands Run And Results

- `pwd` — passed; workspace is `/workspaces/big_al`.
- `git branch --show-current` — passed; branch is `clean-milestone-4-sync`.
- `git status --short` — clean after restoring generated-only `next-env.d.ts` churn.
- `find supabase/migrations ...` — passed; M11-M14 migrations are present.
- `grep ... docs/CURRENT_STATUS.md docs/milestones/README.md docs/CHANGELOG.md` — passed; M0-M8 and M11-M14 completion is documented.
- `pnpm lint` — passed.
- `pnpm typecheck` — passed.
- `pnpm build` — passed.
- `git diff --check` — passed.
- `pnpm start` — failed with pnpm runner error: `unable to open database file`.
- `./node_modules/.bin/next start` — started successfully with elevated local-server permission.
- `curl -i http://localhost:3000/login` — passed; login rendered `200`.
- `curl -i` protected app routes — passed; returned `307` to `/login`.

## 10. Files Changed

- `docs/UAT_MVP_M11_M14.md`
- `docs/CURRENT_STATUS.md`
- `docs/CHANGELOG.md`
- `docs/milestones/README.md`
- `supabase/migrations/20260702174752_uat_shopping_list_cleanup.sql`
- `src/lib/shopping/get-shopping.ts`
- `src/app/(app)/pantry/page.tsx`
