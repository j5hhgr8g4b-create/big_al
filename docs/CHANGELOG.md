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
Confirm files are placed in /Users/Alex/Documents/Cookbook App.

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
Moved product reference files to `docs/product`; added `docs/README.md`, `docs/milestones/README.md`, and `docs/milestones/MILESTONE_0.md`; updated live references and audit records.

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
