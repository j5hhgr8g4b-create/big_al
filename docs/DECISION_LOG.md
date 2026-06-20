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
