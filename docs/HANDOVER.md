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

Next milestone: M21 — Private Beta Testing (not started; paused at entry checks)

Current branch:

```text
clean-milestone-4-sync
```

Current state:

- M0-M20 are complete on the working branch.
- Founder UAT passed for the full Import → Save → Plan → Shop → Cook loop.
- M20 Beta Readiness Review concluded GO; no technical M20 blocker remains.
- M21 is next but has not started.
- An M21 entry-check attempt was made on 2026-08-10, but the mandatory live checks could not be executed because two authenticated test users / accessible live sessions were not available.
- No product or security failure was demonstrated by that pause.
- Private beta has not started.
- Wider launch is not approved.

## Latest important commits

```text
fbefe85 docs: close M20 beta readiness review
17c6b7c M20 harden recipe URL import security
51e1eed Merge Phase 3 documentation with M15-M19 implementation
c75bf1f M19 cook mode beta polish
c89e546 M18 shopping list reliability
1e21a4b M17 import quality and attribution hardening
ed0133f M16 core reliability and error handling
7b6abfc M15 founder UAT pantry and core loop closeout
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

M20 is closed with a GO decision. The next work is M21 entry validation, not feature development.

M21 entry checks required before broad tester activity:

1. Live authenticated two-user Restaurant-isolation smoke test.
2. Live supported public recipe import regression test.
3. Live rejected/unsafe import → manual-review recovery test.

The first attempt to execute these checks was paused because authenticated test accounts/sessions were not available. This is an operational dependency, not a demonstrated product blocker.

## Active blockers

Keep this list in sync with the Notion Launch Blocker Register.

| Blocker | Status | Next action |
| --- | --- | --- |
| M20 technical blockers | None | M20 concluded GO |
| M21 live entry validation | Waiting on test access | Create/use two normal authenticated test users/Restaurants and accessible live sessions, then run the three entry checks |
| Second-user Restaurant isolation | Verification gap | Run targeted two-user negative-access matrix before broad tester activity; current RLS review found no demonstrated leak |

## Active documents

Use these before starting work:

```text
docs/HANDOVER.md
docs/CODEX_RESUME_AFTER_USAGE_RESET.md
docs/milestones/README.md
docs/milestones/PHASE_3_MVP_HARDENING_AND_BETA_PREPARATION.md
docs/milestones/MILESTONE_20.md
docs/milestones/MILESTONE_21.md
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
Launch Blocker Register
Phase 3 — MVP Hardening & Beta Preparation
M20 — Beta Readiness Review
M21 — Private Beta Testing
Project Handover
```

## Resume checklist

At the start of the next session:

1. Confirm branch is `clean-milestone-4-sync`.
2. Confirm you are not on `main`.
3. Pull latest changes.
4. Check `git status --short`.
5. Read this handover page.
6. Confirm M20 remains complete/GO.
7. Do not mark M21 active until the three live entry checks have been run and recorded.
8. Arrange two normal authenticated test users/Restaurants and accessible live sessions.
9. Run the M21 entry checks in order.
10. Use the Black Belt user stories/process map as journey control, not as a feature backlog.

## Standard validation commands

Run after any code changes:

```bash
pnpm lint
pnpm typecheck
pnpm build
git diff --check
```

## Handover update template

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

Resume M21 entry validation only when authenticated test access is available.

Priority order:

1. Arrange two normal authenticated test accounts/Restaurants and separate live sessions.
2. Run the two-user Restaurant-isolation smoke test, including direct known-ID/URL attempts where practical.
3. Run one live supported public recipe import and confirm save/attribution/Cookbook regression behavior.
4. Run one safe rejected/unsafe import case and confirm manual-review recovery without crash or sensitive detail exposure.
5. Record the results.
6. Only if all three pass, mark M21 active and begin the controlled 3–5 Restaurant private beta.

## Do not do next

- Do not treat the missing test accounts as a product defect.
- Do not start broad tester activity before the entry checks pass.
- Do not start M22 or wider-launch work.
- Do not add new product areas.
- Do not build followers/following, likes, public feeds, influencer mechanics, grocery price comparison, calorie tracking, full pantry inventory, public community features, generic AI chatbot functionality, advanced AI recipe interpretation, a major redesign or marketing/public-launch work.
- Do not use `main` for active work.
- Do not run broad database changes without checking migration history.
