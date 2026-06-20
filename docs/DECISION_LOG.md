# Decision Log

## Template

### YYYY-MM-DD — Decision Title

Decision:
-

Reason:
-

Alternatives Considered:
-

Impact:
-

Files Affected:
-

Approved By:
-

---

### 2026-06-20 — Use Local VS Code Project Folder

Decision:
Codex will work locally in /Users/Alex/Documents/Cookbook App using Visual Studio Code.

Reason:
GitHub Codespaces did not connect properly.

Alternatives Considered:
GitHub Codespaces.

Impact:
Local safety rules are stricter. Codex must never work outside the project folder.

Files Affected:
SAFE_CODEX_LOCAL_VSCODE_SETUP.md, LOCAL_CODEX_START_PROMPT.md

Approved By:
Founder

---

### 2026-06-20 — Milestone 0 Project Structure and Package Manager

Decision:
Use a `src`-based Next.js App Router structure and pnpm for local dependency management.

Reason:
Keep application code clearly separated from project configuration and governance files while using the existing project-local package cache and configuration.

Alternatives Considered:
A root-level `app` directory and npm.

Impact:
Routes live in `src/app`, shared interface code in `src/components`, service clients in `src/lib`, and dependencies are locked in `pnpm-lock.yaml`.

Files Affected:
package.json, pnpm-lock.yaml, pnpm-workspace.yaml, src/*, README.md, docs/ARCHITECTURE_DECISIONS.md

Approved By:
Founder, through approval to complete Milestone 0 and maintain a clear file structure.

---

### 2026-06-20 — Organize Product and Milestone Documentation

Decision:
Move product reference files into `docs/product`, add a documentation index, and track milestone completion under `docs/milestones`.

Reason:
Keep the root directory neat and make the current state, product references, and milestone history easy to find.

Alternatives Considered:
Leave all reference documents at the project root or place every document in a single flat `docs` directory.

Impact:
Startup and README references now use the organized paths. Required framework configuration and safety entry files remain at the root.

Files Affected:
LOCAL_CODEX_START_PROMPT.md, README.md, docs/README.md, docs/product/*, docs/milestones/*

Approved By:
Founder, through the request to organize created files before continuing.

---

### 2026-06-20 — Milestone 1 Auth and Restaurant Security Model

Decision:
Use Supabase cookie-based SSR sessions, automatically create one Profile and Chef for each Auth user, and create Restaurants atomically with an owner membership under RLS.

Reason:
Keep authentication consistent across browser and server rendering, guarantee the required user records, and prevent partial or unauthorized Restaurant creation.

Alternatives Considered:
Browser-only sessions, creating Profile and Chef rows in application code, and separate client inserts for Restaurant and membership.

Impact:
Adds `@supabase/ssr`, protected route groups, an Auth callback and proxy, four database tables, provisioning triggers, an authenticated Restaurant function, and membership-based policies.

Files Affected:
.env.example, package.json, src/app/*, src/lib/supabase/*, src/proxy.ts, supabase/*, docs/*

Approved By:
Founder, through approval to move forward with Milestone 1.

---

### 2026-06-20 — Use Webpack for Stable Production Output

Decision:
Run `next build --webpack` for production builds.

Reason:
Turbopack generated a successful build that failed at runtime with missing React client-manifest entries. The webpack output passed the same route checks without errors.

Alternatives Considered:
Keep the Turbopack output, ignore the runtime errors, or relocate the build directory without changing bundlers.

Impact:
Production builds are slightly slower but currently reliable. Development behavior is unchanged.

Files Affected:
package.json, docs/ARCHITECTURE_DECISIONS.md

Approved By:
Founder, through approval to complete Milestone 1.

---

### 2026-06-20 — Milestone 2 Recipe Write and Ingredient Model

Decision:
Save complete Recipes through an atomic database function and normalize Ingredients within each Restaurant.

Reason:
Keep Recipe details, ordered Ingredients, and ordered Steps consistent while preserving Restaurant data isolation and preparing for ingredient search.

Alternatives Considered:
Multiple client-side inserts without a transaction, global shared Ingredient rows, and unstructured ingredient text.

Impact:
Adds five tables, automatic Cookbooks, Restaurant-scoped Ingredient reuse, save/archive functions, RLS policies, and complete Cookbook Recipe screens.

Files Affected:
supabase/migrations/202606200002_milestone_2_cookbook_recipes.sql, src/app/(app)/cookbook/*, src/components/*, src/lib/recipes/*, src/lib/restaurants/*, docs/*

Approved By:
Founder, through approval to move forward with Milestone 2.

---

### 2026-06-20 — Milestone 3 Import-First Conversion

Decision:
Capture every new Recipe source as an Import, retain it in Needs Review, and convert it through the existing atomic Recipe save only after human structuring.

Reason:
Preserve source provenance, enforce the approved Import-first product rule, and avoid partial Import/Recipe links.

Alternatives Considered:
Continue direct Recipe creation, fetch and scrape URLs immediately, or simulate parser results without real extraction.

Impact:
Adds the `imports` table, capture and conversion functions, a manual Import screen, Needs Review queue, review screen, and Import-first navigation.

Files Affected:
supabase/migrations/202606200003_milestone_3_imports.sql, src/app/(app)/cookbook/*, src/components/recipe-form.tsx, src/lib/imports/*, docs/*

Approved By:
Founder, through approval to complete Milestone 3.

---

### 2026-06-20 — Milestone 4 Recipe Book Ownership and Search

Decision:
Model Recipe Books as many-to-many organizers and search literal title/Ingredient text within the current Restaurant.

Reason:
Allow Recipes to appear in multiple Books without transferring ownership, while providing predictable private MVP search.

Alternatives Considered:
Move Recipes into a single owning Book, duplicate Recipes between Books, or introduce global/full-text search infrastructure.

Impact:
Adds two tables, Book lifecycle and membership functions, Restaurant-scoped search, Book screens, Recipe organization controls, and Cookbook search.

Files Affected:
supabase/migrations/202606200004_milestone_4_recipe_books_search.sql, src/app/(app)/cookbook/*, src/components/*, src/lib/recipe-books/*, docs/*

Approved By:
Founder, through approval to move forward with Milestone 4.
