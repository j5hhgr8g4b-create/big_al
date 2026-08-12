# Big Al

Big Al is a mobile-first living cookbook for Restaurants.

**Mission:** Make cooking easy and enjoyable.

**Core loop:** Import → Save → Plan → Shop → Cook

## Current project state

- Active branch: `clean-milestone-4-sync`
- `main`: stale, unrelated history; do not use for active work
- M0–M20: complete
- M20.1 import security hardening: complete
- M21 Private Beta Preparation: engineering complete
- M21 status: **NO-GO pending infrastructure restore and live closeout validation**
- M22: closed until M21 passes and private-beta evidence exists

Latest application commit before this documentation reconciliation: `b9a2abd — M21 prepare Big Al for private beta`.

The Big Al Supabase project is `cqcjacirzibfjecrruie`. It was found inactive on 2026-08-12 and a restore was initiated. Verify the current project status before attempting migration or live UAT work.

## What happens next

1. Confirm Supabase project `cqcjacirzibfjecrruie` is ACTIVE.
2. Verify migration history and apply `20260812202748_m21_beta_feedback.sql` if missing.
3. Verify `beta_feedback`, its RLS, grants and `submit_beta_feedback` RPC.
4. Run live two-user Restaurant isolation checks.
5. Run one supported public recipe import and one rejected localhost import.
6. Complete Import → Save → Plan → Shop → Cook as both users.
7. Verify feedback submission and isolation.
8. Only then mark M21 GO and begin the controlled private beta.

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

## Source of truth

- Notion **App HQ**: live project position, founder decisions and next action.
- GitHub: implementation, migrations, tests, milestone records and technical audit trail.
- `docs/CURRENT_STATUS.md`: concise repository snapshot.
- `docs/HANDOVER.md`: exact resume point when work pauses.
- `AGENTS.md`: standing Codex permissions and safety boundaries.

Do not let repository snapshots contradict App HQ. If they diverge, reconcile them before new feature work.

## Product guardrails

Big Al is a living cookbook, planning tool, shopping companion and cooking companion. Keep food as the hero and prefer simplicity over feature quantity.

Do not introduce followers, likes, view counts, influencer mechanics, grocery price comparison, calorie tracking, full pantry inventory, or a generic AI chatbot.

## Documentation

Start here:

1. `AGENTS.md`
2. `docs/CURRENT_STATUS.md`
3. `docs/HANDOVER.md`
4. `docs/milestones/README.md`
5. `docs/milestones/MILESTONE_21.md`
6. `docs/product/USER_STORIES_AND_PROCESS_MAP.md`
7. `docs/PROJECT_GOVERNANCE.md`
