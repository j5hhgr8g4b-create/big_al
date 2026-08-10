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
- The full-build user stories are directional controls, not permission to build future journeys now.

## Current project snapshot

Last updated: 2026-08-10

Current phase: Phase 3 — MVP Hardening & Beta Preparation

Next milestone: M21 — Private Beta Testing (not started)

Current branch:

```text
clean-milestone-4-sync
```

Current state:

- M0-M20 are complete on the working branch.
- Founder UAT passed for the full Import → Save → Plan → Shop → Cook loop.
- M20 Beta Readiness Review concluded GO; no technical M20 blocker remains.
- M21 is next but has not started.
- Phase 3 docs are prepared.
- Phase 3 operational controls are prepared in Notion.
- Full-build user stories have been upgraded with Black Belt-style process controls.
- Private beta has not started.
- Wider launch is not approved.

## Latest important commits

```text
17c6b7c M20 harden recipe URL import security
51e1eed Merge Phase 3 documentation with M15-M19 implementation
c75bf1f M19 cook mode beta polish
c89e546 M18 shopping list reliability
1e21a4b M17 import quality and attribution hardening
ed0133f M16 core reliability and error handling
7b6abfc M15 founder UAT pantry and core loop closeout
6641e3d docs: update handover after user story controls
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

## Latest documentation update

The user stories/process map has been updated to include:

- build permission levels
- journey control framework
- cross-journey CTQs
- global defect definitions
- SIPOC for each journey
- entry and exit conditions
- defect definitions
- critical-to-quality measures
- controls / detection methods
- evidence requirements
- lightweight FMEA
- Phase 3 and beta measurement plan

Important product control:

```text
The current active loop is Import → Save → Plan → Shop → Cook.
The full-build user stories are not permission to build every future journey now.
```

Local and GitHub were synchronized at `17c6b7c`, and the worktree was clean before this documentation closeout.

## Active blockers

Keep this list in sync with the Notion Launch Blocker Register.

| Blocker | Status | Next action |
| --- | --- | --- |
| M20 technical blockers | None | M20 concluded GO |
| Second-user Restaurant isolation not manually validated | M21 entry check | Run a targeted two-user negative-access matrix before broad tester activity; current RLS review found no demonstrated leak |

## Active documents

Use these before starting work:

```text
docs/HANDOVER.md
docs/CODEX_RESUME_AFTER_USAGE_RESET.md
docs/milestones/README.md
docs/milestones/PHASE_3_MVP_HARDENING_AND_BETA_PREPARATION.md
docs/milestones/MILESTONE_20.md
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
User Stories & Process Map — Full Build
Project Handover
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
8. Confirm M20 remains complete/GO and review the M21 entry checks.
9. Use the Black Belt user stories/process map as journey control, not as a feature backlog.
10. Continue only the current milestone unless founder explicitly changes scope.

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

Prepare to begin M21 Private Beta Testing. M21 has not started.

Priority order:

1. Confirm the branch is `clean-milestone-4-sync`, pull, and verify a clean worktree.
2. Run a live authenticated two-user Restaurant-isolation smoke test.
3. Run one live supported public recipe import.
4. Confirm a rejected or unsafe import reaches manual-review recovery.
5. Begin broad tester activity only after recording those entry checks.

These are beta-entry validation tasks, not product redesign tasks.

M21 should validate real use of Import → Save → Plan → Shop → Cook. Keep deterministic Shopping interpretation, source-dependent Cook Mode instructions, minor visual polish, one active/first Restaurant UX and lack of native screen-awake support as accepted limitations unless beta evidence shows they prevent successful cooking.

## Do not do next

- Do not treat M21 validation as permission for broad feature work.
- Do not begin M22 or wider-launch work.
- Do not add new product areas.
- Do not build followers/following, likes, public feeds, influencer mechanics, grocery price comparison, calorie tracking, full pantry inventory, public community features, generic AI chatbot functionality, advanced AI recipe interpretation, a major redesign or marketing/public-launch work.
- Do not treat future user stories as active build scope.
- Do not use `main` for active work.
- Do not run broad database changes without checking migration history.
