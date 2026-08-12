# Codex Rules

## Purpose

Work milestone by milestone, protect the core cooking loop, and avoid unnecessary approval interruptions for routine repository work.

## Current branch and milestone

- Active branch: `clean-milestone-4-sync`
- `main` is stale and must not be used for active work.
- M0–M20 and M20.1 are complete.
- M21 engineering is complete; live closeout is still required before private beta.
- Do not start M22 until M21 is GO and private-beta evidence exists.

## Standing working rules

Follow `AGENTS.md` for detailed permissions.

Within the active milestone Codex may routinely:

- inspect and edit repository files;
- add or update tests;
- run project commands;
- inspect Git status, history and diffs;
- run `pnpm test`, `pnpm lint`, `pnpm typecheck`, `pnpm build`, and `git diff --check`;
- create migrations when explicitly required by the milestone;
- commit completed milestone work;
- push to the current working branch;
- perform a safe non-destructive rebase of the current branch onto its remote counterpart when required to reconcile remote changes before push.

Codex must stop before force-pushing, merging to `main`, destructive database operations, changing production secrets, weakening RLS/security, or making product-scope changes outside the approved milestone.

## Product guardrails

- Mission: **Make cooking easy and enjoyable.**
- Core loop: **Import → Save → Plan → Shop → Cook**.
- Food is the hero.
- Simplicity beats feature quantity.
- Restaurants, not households.
- Reward cooking behaviour, not popularity.

Do not add followers, following, likes, view counts, influencer mechanics, public feeds, grocery price comparison, calorie tracking, full pantry inventory, or generic chatbot behaviour.

## Source of truth

- Notion **App HQ** owns the live project position, founder decisions and immediate next action.
- GitHub owns code, migrations, tests and technical audit history.
- Repository status documents must remain concise and aligned with App HQ.

Do not use the old Work Tracker as a live source of truth; it has been archived in Notion.

## Milestone completion

A milestone is not complete merely because code builds. Required automated checks, database work, live UAT and founder acceptance must pass where the milestone calls for them.

After meaningful work, update only the repository control documents that genuinely changed, especially:

- `docs/CURRENT_STATUS.md`
- `docs/HANDOVER.md`
- active milestone record
- `docs/CHANGELOG.md` when implementation or milestone state materially changes
