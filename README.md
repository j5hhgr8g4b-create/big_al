# Big Al — Local VS Code Codex Build Pack

Big Al is a mobile-first cooking companion for Restaurants.

Mission: Make cooking easy and enjoyable.

Vision: The cooking companion that made me enjoy cooking.

## MVP Loop

Import → Save → Plan → Shop → Cook

Build this loop first.

## Current Branch State

`main` is stale and must not be used for the next Codex task.

The current working branch is `clean-milestone-4-sync`.

Milestones 0-8 are complete. URL import foundation already exists.

The next approved batch is:

- M11 URL import hardening
- M12 attribution protection
- M13 Restaurant preferences foundation
- M14 MVP closeout QA

## Workspace Folder

/workspaces/big_al

Codex must not work outside this folder.

## Recommended Stack

- Next.js
- TypeScript
- Tailwind CSS
- Supabase
- PostgreSQL
- Supabase Auth
- Supabase Storage

## Local Setup

Requirements: Node.js 22 and pnpm.

1. Run `pnpm install`.
2. Run the SQL files in `supabase/migrations` against the intended Supabase project, in filename order.
3. Copy `.env.example` to `.env.local` and replace the placeholders with Supabase project values.
4. Add `http://localhost:3000/auth/callback` to the Supabase Auth redirect URLs.
5. Run `pnpm dev`.
6. Open `http://localhost:3000`.

Useful checks:

- `pnpm lint`
- `pnpm typecheck`
- `pnpm build`

## Project Structure

- `src/app` — App Router pages, layouts, and global styles.
- `src/components` — Shared interface components.
- `src/lib` — External service clients and shared application utilities.
- `supabase/migrations` — Ordered database schema and security changes.
- `docs/product` — Product specification, schema, screens, and build plan.
- `docs/milestones` — Milestone index and completion records.
- `docs` — Governance, decisions, changelog, and current status.

## Required Codex Reading Order

1. SAFE_CODEX_LOCAL_VSCODE_SETUP.md
2. CODEX_RULES.md
3. docs/PROJECT_GOVERNANCE.md
4. docs/product/PRODUCT_SPEC.md
5. docs/product/DATABASE_SCHEMA.md
6. docs/product/APP_SCREENS.md
7. docs/product/BUILD_PLAN.md
