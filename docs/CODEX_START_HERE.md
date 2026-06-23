# Codex Start Here

This repository is prepared so Codex can work without guessing the product direction.

## Beginner explanation

GitHub stores the app code and project instructions.

Codex should use this repo like its workbench. It should read the instructions, make one small change, run checks, and explain what changed.

## Before starting a Codex task

1. Open the repo in GitHub Codespaces.
2. Confirm the terminal is inside the repo.
3. Run `node -v`. It should be Node 20.9 or newer. Node 22 is preferred.
4. Run `pnpm install`.
5. Copy `.env.example` to `.env.local` when Supabase values are ready.
6. Run `pnpm dev`.

## First Codex task to use

Use this prompt:

```text
Read AGENTS.md, SAFE_CODEX_GITHUB_SETUP.md, CODEX_RULES.md, docs/PROJECT_GOVERNANCE.md, PRODUCT_SPEC.md, DATABASE_SCHEMA.md, APP_SCREENS.md, BUILD_PLAN.md, and docs/CURRENT_STATUS.md.

Plan Milestone 0 verification only. Do not build Milestone 1 yet. Inspect the repo, identify missing setup issues, and tell me the exact checks to run. Do not edit files until I approve the plan.
```

## After the plan is approved

Use this prompt:

```text
Implement only the approved Milestone 0 verification fixes. Run pnpm lint, pnpm typecheck, and pnpm build. Update docs/CHANGELOG.md and docs/CURRENT_STATUS.md. Do not start Milestone 1.
```

## Important

Do not ask Codex to "carry on" broadly. Give it one milestone or one bug at a time.
