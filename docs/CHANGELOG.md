# Changelog

## Template

### YYYY-MM-DD — Milestone X
Summary:
Files Changed:
Database Changes:
Testing Required:
Known Issues:

---

### 2026-06-20 — Project Setup Documents
Summary:
Initial Codex build pack, safety rules, and governance rules created.

Files Changed:
README.md, SAFE_CODEX_GITHUB_SETUP.md, CODEX_RULES.md, PRODUCT_SPEC.md, DATABASE_SCHEMA.md, APP_SCREENS.md, BUILD_PLAN.md, docs/*

Database Changes:
None.

Testing Required:
Upload to GitHub repository and open Codespace.

Known Issues:
Application not built yet.

---

### 2026-06-20 — Milestone 0
Summary:
Created the Next.js TypeScript foundation with Tailwind CSS, a Supabase browser client factory, a mobile-first Kitchen screen, five-tab bottom navigation, and placeholder routes for future milestones.

Files Changed:
package.json, pnpm-lock.yaml, pnpm-workspace.yaml, .npmrc, .gitignore, .env.example, .nvmrc, next.config.ts, postcss.config.mjs, eslint.config.mjs, tsconfig.json, app/*, components/*, lib/supabase/client.ts, README.md, docs/DECISION_LOG.md, docs/CHANGELOG.md, docs/CURRENT_STATUS.md

Database Changes:
None.

Testing Required:
Run lint, type checking, and the production build in the Codespace with Node.js 20.9 or newer. A continuation attempt on 2026-06-20 could not execute the tools because the attached environment only provided Node.js 12.14.1. Manual testing remains: open the app at mobile and desktop widths and test every bottom navigation link.

Known Issues:
Supabase requires local environment values before data features can be used. Authentication and database tables are intentionally deferred to Milestone 1. The continuation environment did not include the requested `/workspaces/big_al` Git repository, so the required Milestone 0 commit and push remain pending.
