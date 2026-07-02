# Project Handover

## Purpose

Use this page whenever Big Al work pauses because of Codex usage limits, context limits, founder availability or a planned handover.

The goal is simple: the next session should be able to resume without rediscovering the project state.

Update this page at the end of each meaningful work session.

## Golden rules

- Current working branch is `clean-milestone-4-sync` unless explicitly changed.
- `main` is stale and must not be used for active work.
- Do not start new feature work unless the active milestone says so.
- Big Al's mission is to make cooking easy and enjoyable.
- Protect the core loop: Import → Save → Plan → Shop → Cook.
- Prefer fixing launch blockers over adding features.
- Preserve attribution and Restaurant-scoped data.
- Do not build social mechanics, grocery price comparison, calorie tracking, full pantry inventory or generic chatbot behaviour.

## Current project snapshot

Last updated: 2026-07-02

Current phase: Phase 3 — MVP Hardening & Beta Preparation

Current milestone: M15 — Founder UAT Closeout

Current branch:

```text
clean-milestone-4-sync
```

Current state:

- M0-M14 are technically complete on the working branch.
- Founder UAT is in progress.
- Phase 3 docs are prepared.
- The next active work is M15 Founder UAT Closeout.
- Private beta has not started.
- Wider launch is not approved.

## Latest important commits

Add the latest commits here when work pauses.

```text
5fc0446 docs: update milestone tracker for Phase 3
5a8d153 docs: add Codex reset handoff for founder UAT
7f659fb chore: mirror shopping list RPC permission fix
```

## Latest Supabase state

Project:

```text
cqcjacirzibfjecrruie
```

Known remote state:

```text
shopping-list cleanup migration applied
generate_shopping_list_from_meal_events RPC exists
authenticated can execute: yes
anon can execute: no
```

Update this section whenever a migration is applied remotely.

## Active blockers

Keep this list in sync with the Notion Launch Blocker Register.

| Blocker | Status | Next action |
| --- | --- | --- |
| Live authenticated end-to-end UAT not complete | Open | Complete M15 checklist |
| Duplicate import handling not fully confirmed | Open | Retest exact duplicate URL and override flow |
| Pantry/Shopping quality not fully accepted | Open | Retest generation and existing messy rows |
| Second-user Restaurant isolation not manually validated | Open | Test with a second user/Restaurant |

## Active documents

Use these before starting work:

```text
docs/CODEX_RESUME_AFTER_USAGE_RESET.md
docs/milestones/README.md
docs/milestones/PHASE_3_MVP_HARDENING_AND_BETA_PREPARATION.md
docs/milestones/MILESTONE_15.md
docs/product/USER_STORIES_AND_PROCESS_MAP.md
docs/UAT_MVP_M11_M14.md
docs/CURRENT_STATUS.md
docs/CHANGELOG.md
```

Notion active pages:

```text
App HQ
Build Status
Phase 3 Progress Dashboard
Founder UAT Closeout Checklist
Launch Blocker Register
Phase 3 — MVP Hardening & Beta Preparation
Launch Readiness Checklist
```

## Resume checklist

At the start of the next session:

1. Confirm branch is `clean-milestone-4-sync`.
2. Confirm you are not on `main`.
3. Pull latest changes.
4. Check `git status --short`.
5. Read this handover page.
6. Read `docs/CODEX_RESUME_AFTER_USAGE_RESET.md` if Codex usage had paused.
7. Check Notion Launch Blocker Register.
8. Continue only the current milestone unless founder explicitly changes scope.

## Standard validation commands

Run after any code changes:

```bash
pnpm lint
pnpm typecheck
pnpm build
git diff --check
```

## Handover update template

Copy this section and fill it in when work pauses.

```text
Date:
Session reason for pause:
Current phase:
Current milestone:
Current branch:
Latest commit(s):
Supabase migrations applied:
Files changed:
Checks run:
Checks passed/failed:
What was completed:
What is still open:
Known blockers:
Next exact action:
Do not do next:
Notes for founder:
```

## Current next action

Continue M15 Founder UAT Closeout.

Priority order:

1. Retest Pantry/Shopping after the latest cleanup.
2. Retest duplicate URL import handling.
3. Complete live authenticated core loop.
4. Test second-user Restaurant isolation.
5. Update Founder UAT Closeout Checklist and Launch Blocker Register.

## Do not do next

- Do not start M16 until M15 has a clear result.
- Do not build M21 Private Beta Testing until M20 gives a go decision.
- Do not add new product areas.
- Do not use `main` for active work.
- Do not run broad database changes without checking migration history.
