# Big Al — Codex GitHub Build Pack v2

Big Al is a mobile-first cooking companion for Restaurants.

Mission: Make cooking easy and enjoyable.

Vision: The cooking companion that made me enjoy cooking.

## Core MVP Loop
Import → Save → Plan → Shop → Cook

Build this loop first.

## Recommended Stack
- Next.js
- TypeScript
- Tailwind CSS
- Supabase
- PostgreSQL
- Supabase Auth
- Supabase Storage

## Product Principles
- Food is the hero.
- Administration is the enemy.
- Capture first, organise later.
- Cooking beats browsing.
- Proven recipes beat generated recipes.
- Big Al is not a generic AI chatbot.

## Required Codex Reading Order
1. SAFE_CODEX_GITHUB_SETUP.md
2. CODEX_RULES.md
3. docs/PROJECT_GOVERNANCE.md
4. PRODUCT_SPEC.md
5. DATABASE_SCHEMA.md
6. APP_SCREENS.md
7. BUILD_PLAN.md

## Local Setup

Requirements: Node.js 20.9 or newer. Node.js 22 is recommended and recorded in `.nvmrc`.

1. Copy `.env.example` to `.env.local`.
2. Add the Supabase project URL and anon key to `.env.local`.
3. Run `pnpm install`.
4. Run `pnpm dev`.
5. Open the forwarded port 3000 URL in Codespaces.

## Quality Checks

- `pnpm lint`
- `pnpm typecheck`
- `pnpm build`
