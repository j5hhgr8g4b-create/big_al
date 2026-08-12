# Big Al

Big Al is a mobile-first living cookbook for Restaurants.

**Mission:** Make cooking easy and enjoyable.

**Core loop:** Import → Save → Plan → Shop → Cook

## Current project state

- Active branch: `clean-milestone-4-sync`
- `main`: stale, unrelated history; do not use for active work
- M0–M20: complete
- M20.1 import security hardening: complete
- M21: engineering preparation complete; live closeout is the current focus
- M22: planned after sufficient private-beta evidence exists

The Big Al Supabase project is `cqcjacirzibfjecrruie`. It was restored on 2026-08-12 after being found inactive. Verify its current status before migration or live UAT work.

## Operating model

### GitHub — delivery truth

GitHub holds:

- code and migrations;
- tests and CI;
- working technical documentation;
- milestone control issues;
- bugs and polish items;
- ideas and future candidates;
- implementation evidence and technical handover.

### Notion — founder and business truth

Notion holds:

- business plans and financial thinking;
- founder decisions and rationale;
- durable product/brand strategy;
- launch/business context that is not an engineering work queue.

Do not maintain duplicate task trackers in both systems.

## Current delivery control

- Working roadmap: `docs/ROADMAP.md`
- Delivery workflow: `docs/WORKFLOW.md`
- Current status: `docs/CURRENT_STATUS.md`
- Handover: `docs/HANDOVER.md`
- M21 control issue: #19
- M22 control issue: #20
- Repository hygiene: #18

## What happens next

1. Confirm Supabase project `cqcjacirzibfjecrruie` is ACTIVE.
2. Verify migration history and apply `20260812202748_m21_beta_feedback.sql` if missing.
3. Verify `beta_feedback`, its RLS, grants and `submit_beta_feedback` RPC.
4. Run live two-user Restaurant isolation checks.
5. Run one supported public recipe import and one rejected localhost import.
6. Complete Import → Save → Plan → Shop → Cook as both users.
7. Verify feedback submission and isolation.
8. Only then begin the controlled private beta.

## Working environment

Primary Codespaces path:

```text
/workspaces/big_al
```

Before editing:

```bash
pwd
git branch --show-current
git status --short
git pull --ff-only
```

Expected branch: `clean-milestone-4-sync`.

## Standard checks

```bash
pnpm test
pnpm lint
pnpm typecheck
pnpm build
git diff --check
```

GitHub Actions also runs the same core quality checks on the active branch and pull requests.

## Product guardrails

Big Al is a living cookbook, planning tool, shopping companion and cooking companion. Keep food as the hero and prefer simplicity over feature quantity.

Do not introduce followers, likes, view counts, influencer mechanics, grocery price comparison, calorie tracking, full pantry inventory, or a generic AI chatbot.

## Start here

1. `AGENTS.md`
2. `docs/ROADMAP.md`
3. `docs/WORKFLOW.md`
4. `docs/CURRENT_STATUS.md`
5. `docs/HANDOVER.md`
6. `docs/milestones/MILESTONE_21.md`
7. `docs/product/USER_STORIES_AND_PROCESS_MAP.md`
