# Codex Rules

## Purpose

Work milestone by milestone, protect the core cooking loop, and avoid unnecessary approval interruptions for routine repository work.

## Canonical branch and milestone

- Canonical branch: `main`
- `main` is the only long-lived working branch and should remain deployable.
- `clean-milestone-4-sync` is retired and must not be used for new work.
- M0–M20 and M20.1 are complete.
- M21 engineering is complete; live closeout is still required before private beta.
- Do not start M22 until M21 is GO and private-beta evidence exists.

## Branch rule

All repository changes should branch from current `main` using a short-lived branch such as `milestone/...`, `feature/...`, `fix/...`, `polish/...`, `security/...` or `docs/...`.

Implementation workflow:

1. update local `main`;
2. create the task branch;
3. implement and test;
4. push the task branch;
5. open a PR to `main`;
6. merge only when Quality CI passes and required acceptance evidence is satisfied;
7. retire the branch.

Do not push directly to `main` except in an explicit founder-approved emergency.

## Standing working rules

Follow `AGENTS.md` for detailed permissions.

Within approved scope Codex may routinely:

- inspect and edit repository files;
- create a short-lived working branch;
- add or update tests;
- run project commands;
- inspect Git status, history and diffs;
- run `pnpm test`, `pnpm lint`, `pnpm typecheck`, `pnpm build`, and `git diff --check`;
- create migrations when explicitly required by the milestone;
- commit and push completed work to the task branch;
- open a PR to `main`;
- safely rebase the task branch onto current `main` when needed;
- merge after required checks and acceptance evidence pass.

Codex must stop before force-pushing, destructive database operations, changing production secrets, weakening RLS/security, bypassing failed CI, direct pushes to `main`, changing branch strategy, or making product-scope changes outside the approved task.

## Product guardrails

- Mission: **Make cooking easy and enjoyable.**
- Core loop: **Import → Save → Plan → Shop → Cook**.
- Food is the hero.
- Simplicity beats feature quantity.
- Restaurants, not households.
- Reward cooking behaviour, not popularity.

Do not add followers, following, likes, view counts, influencer mechanics, public feeds, grocery price comparison, calorie tracking, full pantry inventory, or generic chatbot behaviour.

## Source of truth

- GitHub owns delivery: code, migrations, tests, CI, working documentation, issues, ideas and technical evidence.
- Notion owns founder/business context: business plans, founder decisions and durable strategy.
- Do not maintain duplicate delivery trackers in Notion.

## Milestone completion

A milestone is not complete merely because code builds. Required automated checks, database work, live UAT and founder acceptance must pass where the milestone calls for them.

After meaningful work, update only the repository control documents that genuinely changed, especially:

- `docs/CURRENT_STATUS.md`
- `docs/HANDOVER.md`
- active milestone issue/record
- `docs/CHANGELOG.md` when implementation or milestone state materially changes
