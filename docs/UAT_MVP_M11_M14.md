# MVP UAT Report — M11-M14

Date: 2026-07-02

Branch: `clean-milestone-4-sync`

## 1. Executive Summary

MVP UAT and regression checks passed for code inspection, protected-route smoke testing, required build checks, founder Pantry/Shopping retesting, duplicate import handling retesting, and the full live core loop.

The full live core loop Import -> Save -> Plan -> Shop -> Cook has passed founder retest. The remaining M15 blocker is second-user Restaurant isolation only.

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
- Live Supabase project `cqcjacirzibfjecrruie` has `clear_active_shopping_list(uuid)` applied. `authenticated` can execute it; `anon` cannot.
- Founder retest passed for Pantry generic salt/pepper filtering.
- Founder retest passed for Clear Shopping list.
- Founder retest passed for duplicate import handling.
- Founder retest passed for the full live core loop: Import -> Save -> Plan -> Shop -> Cook.

## 4. Bugs Found And Fixed

- Founder UAT found that exact source URL duplicate warnings were too easy to bypass; the same imported Recipe could be saved twice from the review screen. The import review now blocks the normal save path for exact source duplicates, links to the existing Recipe, and requires the deliberate `Save anyway as a duplicate` override.
- Founder UAT found that Shopping generation copied raw Recipe ingredient lines too literally. Shopping list now filters non-shopping basics, handles spices as buyable items, combines obvious duplicates, and shows meal/date context.
- Founder UAT follow-up found garlic variants and prep notes still made the Shopping list feel like recipe text. Shopping list normalisation improved: prep notes are stripped from item titles, garlic/onion-style duplicates combine more reliably, tomato purée categorisation corrected, and meal/date context is prioritised over repeated source labels.
- Founder UAT found duplicate garlic cards still appeared from existing generated Shopping rows. Garlic and similar ingredient forms now canonicalise correctly, prep clutter is stripped before display, and regenerated shopping lists no longer show duplicate garlic cards.
- M15 Founder UAT found generic salt/pepper basics, cornflour slurry instructions, and carrots still needed cleanup. Generated Shopping lists now filter generic salt/pepper basics, show Cornflour as the buyable slurry item, and categorise carrots as Fresh produce.
- M15 Founder UAT follow-up found generic salt/black pepper rows with amounts, herb duplicates, duplicated oil titles, and green vegetables still needed cleanup. Pantry now filters generic salt/black pepper more defensively, groups fresh thyme/thyme as Thyme, cleans Oil Oil to Oil or Olive oil where clear, and categorises green vegetables as Fresh produce. Sugar remains visible for now.
- M15 Founder UAT follow-up found generic salt/black pepper variants and prepared potato items still needed cleanup. Pantry now filters broader generic salt/pepper punctuation and word-order variants, normalises Mashed/Roast/Boiled potatoes to Potatoes where safe, keeps Green vegetables as a vague item under Fresh produce, and leaves Red currant jelly and Red wine visible.
- M15 Founder UAT follow-up found Potatoes still categorised under Other and useful Green vegetables examples were lost. Potatoes now categorise as Fresh produce, and parenthetical examples like `such as asparagus and green beans` are preserved in Shopping item context while the title remains Green vegetables.
- M15 Founder UAT follow-up added a confirmed Clear Shopping list action and tightened generic salt/pepper filtering to exact basic-ingredient matches after measured amount stripping.

Non-app cleanup: `next-env.d.ts` was restored before UAT because Next typegen had flipped its generated route type path.

## 5. Bugs Found But Not Fixed

- Cross-Restaurant access could not be exercised live without a second authenticated user/session.

## 6. Manual Testing Still Required From Alex

- Repeat a targeted second-user/cross-Restaurant RLS check.

## 7. Recommended Launch Blockers

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
