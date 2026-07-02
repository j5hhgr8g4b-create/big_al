# Changelog

## Template

### YYYY-MM-DD — Milestone X

Summary:
-

Files Changed:
-

Commands Run:
-

Database Changes:
-

Testing Required:
-

Known Issues:
-

---

### 2026-07-02 — MVP UAT and Regression Pass

Summary:
Completed a UAT/regression pass for the MVP through code inspection, local protected-route smoke testing, and required build checks. No low-risk app bugs were found that required code changes.

Files Changed:
Added `docs/UAT_MVP_M11_M14.md`. Updated `docs/CURRENT_STATUS.md`, `docs/CHANGELOG.md`, and `docs/milestones/README.md`.

Commands Run:
- `pwd`
- `git branch --show-current`
- `git status --short`
- `find supabase/migrations -maxdepth 1 -type f -name '*.sql' -print | sort`
- `grep -RInE ... docs/CURRENT_STATUS.md docs/milestones/README.md docs/CHANGELOG.md`
- `pnpm lint`
- `pnpm typecheck`
- `pnpm build`
- `git diff --check`
- `pnpm start`
- `./node_modules/.bin/next start`
- `curl -i http://localhost:3000/login`
- `curl -i` protected app routes

Database Changes:
None.

Testing Required:
Founder UAT still needs a live authenticated Supabase session to test sign-up/sign-in, Restaurant preferences persistence, URL Import save/discard, duplicate warnings, Recipe edit/archive, Menu planning, Shopping generation, Cook Mode mark-cooked, and second-user cross-Restaurant isolation.

Known Issues:
`pnpm start` failed locally with `unable to open database file`; direct `./node_modules/.bin/next start` worked for route smoke testing. No app-code launch blocker was found in static/build testing.

---

### 2026-07-02 — M11-M14 RPC Permission Follow-up

Summary:
Added a local migration matching the live database fix that restricts anonymous execution of the new M11-M14 write RPCs.

Files Changed:
Added `supabase/migrations/20260702171052_m11_m14_restrict_anon_rpc_execute.sql` and updated `docs/CHANGELOG.md`.

Commands Run:
- `pnpm dlx supabase migration new m11_m14_restrict_anon_rpc_execute`

Database Changes:
Migration revokes `anon` execute permission from attribution-aware `save_recipe`, attribution-aware `convert_import_to_recipe`, and `save_restaurant_cooking_preferences`. No remote Supabase command was run in this task.

Testing Required:
None locally. This migration records the live fix already applied.

Known Issues:
None.

---

### 2026-07-02 — M11-M14 Approved Batch

Summary:
Completed the approved post-M8 batch on `clean-milestone-4-sync`: URL import hardening, attribution protection, Restaurant cooking preferences foundation, and MVP closeout QA. The existing URL import foundation was improved in place rather than replaced.

Files Changed:
Updated URL import extraction/review, recipe attribution save/display, Restaurant cooking preferences, Recipe detail and Cook Mode guidance, Supabase migration history, and audit docs.

Commands Run:
- `pwd`
- `git branch --show-current`
- `git status --short`
- `grep -nE "Milestones 0-8|Milestones 0–8|URL import foundation|clean-milestone-4-sync|main is stale" docs/CURRENT_STATUS.md`
- `curl -fsSL https://supabase.com/changelog.md`
- `pnpm dlx supabase migration new m11_m14_import_attribution_preferences`
- `pnpm lint`
- `pnpm typecheck`

Database Changes:
Added migration `20260702164220_m11_m14_import_attribution_preferences.sql`. It adds `recipes.creator_source`, `recipes.source_site`, an active source URL index, `restaurant_cooking_preferences`, Restaurant-member RLS, and authenticated RPCs for attribution-aware Recipe saves and cooking preference saves. The migration file was created but not applied in this task.

Testing Required:
Apply the new migration, then manually test URL import happy path, partial extraction fallback, failed extraction fallback, duplicate source warnings, saving attribution, editing attribution, saving Restaurant cooking preferences, and viewing preference guidance on Recipe detail and Cook Mode.

Known Issues:
URL extraction remains MVP-first. It does not use paid AI, OCR, browser automation, nutrition extraction, unit conversion, recipe rewriting, plagiarism checks, licensing checks, or generic chatbot behavior.

---

### 2026-06-27 — Milestone 8

Summary:
Implemented Basic Big Al as a deterministic, Restaurant-scoped helper in Specials. Big Al can search saved Recipe data, suggest Recipes from stored signals, surface planned Recipes, surface recently cooked Recipes, and show cook-again Recipes without adding a paid AI provider.

Files Changed:
Added `src/lib/big-al/get-big-al.ts`. Updated `src/app/(app)/specials/page.tsx` and M8 product/audit documentation.

Commands Run:
- `pnpm lint`
- `pnpm tsc --noEmit`
- `pnpm exec next build --webpack`

Database Changes:
None. M8 reads existing Restaurant-scoped tables: Recipes, Ingredients, Recipe Steps, Menu Meal Events, Shopping Items, and Recipe Cook history. No migration was added.

Testing Required:
Open Specials as an existing user, confirm the Big Al entry point is understandable, search saved Recipes, use suggested prompts, confirm planned/recent/cook-again sections are grounded in the current Restaurant, confirm honest empty states, and confirm no paid AI setup is required.

Known Issues:
Basic Big Al is deterministic and intentionally limited. It does not use internet search, paid AI, advanced meal planning, ingredient substitution, unit conversion, calorie tracking, or unsupported external knowledge.

---

### 2026-06-27 — Milestone 7

Summary:
Implemented Cook Mode for saved Recipes. Restaurant members can start Cook Mode from Recipe detail, move through large readable steps with Previous/Next controls, see progress and Recipe context, use a simple timer, check Ingredients, mark the Recipe cooked, and persist cook-again feedback.

Files Changed:
Added `supabase/migrations/202606200007_milestone_7_cook_mode.sql`, `src/app/(app)/cookbook/recipes/[recipeId]/cook/page.tsx`, `src/app/(app)/cookbook/recipes/[recipeId]/cook/actions.ts`, `src/components/cook-timer.tsx`, and `docs/milestones/MILESTONE_7.md`. Updated Recipe detail and product/audit docs.

Commands Run:
- `pnpm lint`
- `pnpm tsc --noEmit`
- `pnpm exec next build --webpack`

Database Changes:
Added `recipe_cooks`, Restaurant-member read RLS, `record_recipe_cooked`, and `set_recipe_cook_again`. App users receive no direct write grants; Cook Mode writes through authenticated RPCs that validate Recipe access and Restaurant membership.

Testing Required:
Apply the Milestone 7 migration. Open a Recipe, start Cook Mode, move next and previous, confirm progress changes, open Ingredients, start/pause/reset the timer, mark cooked from the final step, confirm a `recipe_cooks` row is created, choose Cook again and confirm `cook_again = true`, repeat and choose Done for now to confirm `cook_again = false`. Repeat cross-Restaurant access checks when a second user is available.

Known Issues:
Times Cooked and Cook Again Rate are stored for future use but not displayed yet. Native screen-awake support is not wired in; Cook Mode shows guidance copy instead.

---

### 2026-06-27 — Milestone 6 Live Verification

Summary:
Applied and manually verified Milestone 6 Shopping against the connected Supabase project. Menu to Pantry generation works, manual item add works, purchased tick/untick works, and Shopping state persists after refresh.

Files Changed:
Updated `docs/CURRENT_STATUS.md`, `docs/milestones/MILESTONE_6.md`, and `docs/CHANGELOG.md` to record live verification and prepare Milestone 7.

Commands Run:
Supabase migration application and verification queries were run through the Supabase connector. App manual verification was completed by the founder.

Database Changes:
Applied `202606200006_milestone_6_shopping.sql` to the connected Supabase project. Confirmed `shopping_lists` and `shopping_items` exist, RLS is enabled, and Shopping RPC functions exist.

Testing Required:
Retain second-user cross-Restaurant Shopping isolation in the regression checklist. Keep Menu → Pantry → Refresh as a smoke test before M7 work.

Known Issues:
Shopping consolidation is intentionally MVP-simple: same normalized Ingredient name and same unit only. Unit conversion, grocery price comparison, full pantry inventory, AI meal generation, and social mechanics remain out of scope.

---

### 2026-06-27 — Milestone 6

Summary:
Implemented Restaurant-scoped Shopping lists in Pantry. Members can generate a list from planned Menu meals, consolidate matching Ingredients by normalized name and unit where practical, manually add items, and tick or untick purchased items.

Files Changed:
Added `supabase/migrations/202606200006_milestone_6_shopping.sql`, `src/lib/shopping/get-shopping.ts`, `src/app/(app)/pantry/actions.ts`, and `docs/milestones/MILESTONE_6.md`. Updated Pantry UI and product/audit docs.

Commands Run:
- `pnpm lint`
- `pnpm tsc --noEmit`
- `pnpm exec next build --webpack`

Database Changes:
Added `shopping_lists` and `shopping_items`; active-list helper, generation, manual-add, and purchased-toggle functions; indexes, update triggers, restricted grants, and Restaurant-member RLS. The migration has now been applied to the connected Supabase project and live verified.

Testing Required:
Retain the Menu → Pantry → Refresh smoke test and repeat cross-Restaurant isolation with a second user when available.

Known Issues:
MVP consolidation only combines matching normalized Ingredient names with the same unit; it does not convert units or compare grocery prices. Pantry remains Shopping support only, not full pantry inventory.

---

### 2026-06-27 — Milestone 6 Readiness Checkpoint

Summary:
Recorded the current post-M5 checkpoint before beginning Milestone 6 — Shopping. Existing user login works and the app passes lint, type checking, and webpack production build from Codespaces.

Files Changed:
Updated `docs/CURRENT_STATUS.md` and `docs/CHANGELOG.md`. Created GitHub issue #3 for M6 Shopping readiness and build scope.

Commands Run:
- `pnpm lint`
- `pnpm tsc --noEmit`
- `pnpm exec next build --webpack`

Database Changes:
None in this checkpoint.

Testing Required:
Before implementing M6, confirm Menu behaviour manually: plan meals, refresh, check persistence, and confirm the Supabase project has the Milestone 5 migration needed for meal events. During M6, test Plan meals → Generate shopping list → Tick off items → Refresh → Confirm persistence.

Known Issues:
Specials remains placeholder. Pantry should become Shopping support only, not full pantry inventory. Turbopack production build remains a watch item; webpack build is the validated production build path.

---

### 2026-06-20 — Local VS Code Safety Setup

Summary:
Created local Codex safety and governance documents.

Files Changed:
SAFE_CODEX_LOCAL_VSCODE_SETUP.md, LOCAL_CODEX_START_PROMPT.md, CODEX_RULES.md, docs/*

Commands Run:
None.

Database Changes:
None.

Testing Required:
Confirm files are placed in the intended local project folder.

Known Issues:
Application not built yet.

---

### 2026-06-20 — Milestone 0

Summary:
Created the Next.js TypeScript foundation with Tailwind CSS, a Supabase browser client, environment placeholders, a mobile app shell, and five-tab bottom navigation.

Files Changed:
Added project configuration, dependency lockfile, `src/app`, `src/components`, `src/lib`, and updated README and audit documents.

Commands Run:
Verified the working folder and required files; checked Git state and tool versions; ran `git init`; installed project dependencies with pnpm; ran `pnpm lint`, `pnpm typecheck`, and `pnpm build`; reviewed Git status and the source layout.

Database Changes:
None.

Testing Required:
Add real Supabase values to `.env.local`, run `pnpm dev`, and confirm the five navigation tabs at mobile and desktop widths.

Known Issues:
Supabase is not connected until local environment values are provided. Feature pages are intentional Milestone 0 placeholders.

---

### 2026-06-20 — Post-Milestone 0 File Organization

Summary:
Grouped product references and milestone records into clear documentation folders and added navigation indexes.

Files Changed:
Moved product reference files to `docs/product`; added `docs/README.md`, `docs/milestones/README.md`, and updated live references and audit records.

Commands Run:
Reviewed the project tree and document references; moved documentation files; ran lint and type checking; reran the production build with temporary local network permission required by Turbopack; ran Git verification.

Database Changes:
None.

Testing Required:
Confirm all document links resolve and project checks remain successful.

Known Issues:
None introduced.

---

### 2026-06-20 — Milestone 1 Implementation

Summary:
Implemented Supabase SSR authentication, automatic Profile and Chef provisioning, membership-secured Restaurants, and the Restaurant creation flow.

Files Changed:
Added protected and auth route groups, server actions, callback and session proxy, Supabase clients, submit UI, the Milestone 1 migration and setup guide, and updated project documentation.

Commands Run:
Installed `@supabase/ssr`; reviewed official Supabase SSR, Auth user, trigger, and RLS guidance; ran `pnpm lint`, `pnpm typecheck`, and `pnpm build`; started the production server and checked login, protected-root redirect, and invalid-callback behavior; reviewed Git status and project structure.

Database Changes:
Migration adds `profiles`, `chefs`, `restaurants`, and `restaurant_members`; Auth provisioning and timestamp triggers; membership helper functions; atomic Restaurant creation; indexes, grants, and RLS policies. The migration has not yet been applied to a Supabase project.

Testing Required:
Apply the migration, add local Supabase values, test sign-up and email confirmation, confirm automatic Profile and Chef rows, create a Restaurant, confirm owner membership, verify sign-in/sign-out, and test RLS with a second user.

Known Issues:
No Supabase project or `.env.local` is connected, so migration execution and authenticated end-to-end tests are pending.

#### Migration Setup Recovery

Updated the Milestone 1 migration to restart safely after a partial SQL Editor run by preserving existing tables and indexes, replacing named triggers and policies, and retaining conflict-safe user backfills.

---

### 2026-06-20 — Milestone 1 Completion Verification

Summary:
Connected the Supabase project, applied and remotely detected the full schema, completed a real account and Restaurant flow, and stabilized production output with webpack.

Files Changed:
Updated the production build script, architecture and decision records, current status, Milestone 1 record, and changelog.

Commands Run:
Queried Supabase Auth and REST endpoints; verified four tables and the Restaurant RPC; ran lint, type checking, Turbopack and webpack builds; ran the production server; checked public and protected routes; inspected runtime logs.

Database Changes:
Applied the Milestone 1 migration. Confirmed `profiles`, `chefs`, `restaurants`, `restaurant_members`, and `create_restaurant`. Anonymous table access and unauthenticated Restaurant creation were denied.

Testing Required:
Keep a two-user cross-Restaurant RLS isolation test in the regression checklist when a second test account is available.

Known Issues:
No open Milestone 1 functional issues. Turbopack production output is not used because it produced client-manifest runtime errors.

---

### 2026-06-20 — Milestone 2

Summary:
Implemented automatic Cookbooks and complete structured Recipe creation, viewing, editing, and archiving.

Files Changed:
Added the Milestone 2 migration, Cookbook and Recipe routes, atomic Recipe server actions, dynamic Recipe form, Recipe data helpers, and updated product and audit documentation.

Commands Run:
Ran lint, type checking, webpack production builds, Supabase REST/RPC schema checks, the production server, public route checks, and an authenticated Recipe lifecycle test.

Database Changes:
Added `cookbooks`, `recipes`, `ingredients`, `recipe_ingredients`, and `recipe_steps`; Cookbook provisioning; atomic save/archive functions; indexes, grants, and Restaurant-scoped RLS policies.

Testing Required:
Retain second-user cross-Restaurant Recipe isolation in the regression checklist. Exercise unusual decimal quantities and long Recipe content during future regression passes.

Known Issues:
No open Milestone 2 functional issues. Search, Imports, Recipe Books, Cook Mode, and image storage remain later milestones.

---

### 2026-06-20 — Milestone 3

Summary:
Implemented Import-first Recipe capture, a Needs Review queue, explicit placeholder parsing, and atomic conversion into structured Recipes.

Files Changed:
Added the Milestone 3 migration, Import actions and routes, Import reader, Needs Review Cookbook section, Kitchen Import action, Recipe conversion support, and updated product and audit documentation.

Commands Run:
Ran lint, type checking, webpack production builds, Supabase REST/RPC schema checks, the production server, and an authenticated Import-to-Recipe lifecycle test.

Database Changes:
Added `imports`, an Import access helper, authenticated Import capture, atomic Import-to-Recipe conversion, indexes, restricted grants, and Restaurant-member RLS.

Testing Required:
Retain second-user cross-Restaurant Import isolation in the regression checklist. Exercise URL-only, text-only, and combined Imports during future regression passes.

Known Issues:
Automatic parsing is intentionally a placeholder. URL fetching, scraping, and AI extraction are not implemented.

---

### 2026-06-20 — Milestone 4

Summary:
Implemented Recipe Books, atomic Recipe organization, and private Recipe search by title or Ingredient.

Files Changed:
Added the Milestone 4 migration, Recipe Book actions and routes, Book form and picker components, reusable Recipe cards, Book reader, Cookbook search, and updated product and audit documentation.

Commands Run:
Ran lint, type checking, webpack production builds, Supabase REST/RPC schema checks, the production server, and authenticated Book and search lifecycle tests.

Database Changes:
Added `recipe_books`, `recipe_book_recipes`, Book access/save/archive/membership functions, Restaurant-scoped Recipe search, indexes, restricted grants, and RLS.

Testing Required:
Retain second-user cross-Restaurant Book/search isolation in the regression checklist. Exercise duplicate titles and larger Book memberships in later regression passes.

Known Issues:
No open Milestone 4 functional issues. Search is intentionally simple literal containment for MVP.

---

### 2026-06-27 — Milestone 5

Summary:
Implemented the Restaurant-scoped Menu planning layer with meal events, This Week and Next Week views, unplanned Recipe ideas, add-to-date flows, people eating, and serving context.

Files Changed:
Added `supabase/migrations/202606200005_milestone_5_menu.sql`, `src/lib/menu/get-menu.ts`, `src/app/(app)/menu/actions.ts`, and `docs/milestones/MILESTONE_5.md`; updated `src/app/(app)/menu/page.tsx`, `src/app/(app)/cookbook/recipes/[recipeId]/page.tsx`, and audit/product docs.

Commands Run:
Read required governance/product docs; restored dependencies with `CI=true pnpm install --frozen-lockfile`; ran `./node_modules/.bin/eslint .`, `./node_modules/.bin/next typegen && ./node_modules/.bin/tsc --noEmit`, and `./node_modules/.bin/next build --webpack`.

Database Changes:
Added `meal_events`, `can_access_meal_event`, `save_meal_event`, `archive_meal_event`, active planning indexes, update trigger, restricted grants, and Restaurant-member RLS. The migration was created but not applied to the connected Supabase project during this local pass.

Testing Required:
Apply the Milestone 5 migration to Supabase, add a Recipe to this week and next week, confirm people eating and serving context display, remove a planned meal, verify archived Recipes are not offered, and repeat cross-Restaurant isolation with a second user.

Known Issues:
`pnpm` script wrappers previously stopped on dependency build-script approval for `sharp` and `unrs-resolver`; the latest Codespaces checkpoint passed `pnpm lint`, `pnpm tsc --noEmit`, and `pnpm exec next build --webpack`.
