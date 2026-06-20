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
