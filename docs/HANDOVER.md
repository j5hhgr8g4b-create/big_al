# Project Handover

**Last updated:** 2026-08-12

## Resume point

Big Al is in **M21 — Private Beta Testing**.

M21 engineering is complete. The milestone remains **NO-GO** because live deployment and two-user verification have not yet passed.

Canonical branch:

```text
main
```

The old unrelated June `main` history is preserved at:

```text
archive/legacy-main-2026-06
```

`clean-milestone-4-sync` is now a retired recovery branch. Do not start new work from it.

## Local Codespace branch migration

A Codespace created before the branch repair may still have a local `main` pointing at the old unrelated June history.

Before the next implementation task:

1. Confirm the working tree is clean.
2. Run `git fetch origin`.
3. If local `main` already matches `origin/main`, switch to it normally.
4. If local `main` is the old unrelated history, **do not merge or pull the histories together**. Delete/recreate only the local `main` reference from `origin/main` while on another clean branch.
5. Create the new task branch from the corrected local `main`.

The remote `main` is the source of truth. The archived June history must not be merged back into it.

## Latest implementation state

- `5fb4d1f — M20.1 complete import security test coverage`
- `b9a2abd — M21 prepare Big Al for private beta`
- M21 automated checks: 30 tests passed, lint/typecheck/build/diff-check passed
- GitHub Quality CI is installed for `main`
- Canonical `main` Quality CI is green
- The application history has been promoted safely to `main`

## Infrastructure state

Supabase project:

```text
cqcjacirzibfjecrruie
```

The project was found inactive on 2026-08-12 and a restore was requested successfully. Always check live status again before acting.

M21 migration requiring live verification/application:

```text
20260812202748_m21_beta_feedback.sql
```

## Exact next actions

1. Confirm Supabase project is ACTIVE.
2. Inspect live migration history.
3. Apply the M21 feedback migration only if it is missing.
4. Verify `beta_feedback`, its RLS/policies/grants and `submit_beta_feedback` RPC.
5. Create/use two normal users with separate Restaurants.
6. Run cross-Restaurant negative-access tests for Recipes, Imports, Menu, Shopping, preferences, Cook records and feedback.
7. Run one normal public HTTPS recipe import.
8. Submit `http://127.0.0.1/recipe` and confirm safe manual-review recovery.
9. Complete Import → Save → Plan → Shop → Cook → Feedback as User A.
10. Repeat independently as User B.
11. Record pass/fail evidence.
12. Only if every gate passes, mark M21 **GO — ready to begin private beta**.

## Branch workflow for future work

Start every repository change from `main` using a short-lived branch such as:

- `milestone/m22-beta-findings`
- `feature/<name>`
- `fix/<name>`
- `polish/<name>`
- `security/<name>`
- `docs/<name>`

Then implement, run checks, open a PR to `main`, merge only when Quality CI passes, and retire the branch.

Do not push directly to `main` except in an explicit founder-approved emergency.

## After M21 GO

Run a controlled beta with roughly 3–5 friendly Restaurants and minimal founder guidance. Collect evidence about completion of the cooking loop, confusion, defects, Shopping usefulness, Cook Mode usefulness and whether testers would use Big Al again the following week.

Classify findings as BLOCKER / IMPORTANT / POLISH / IDEA.

Do not turn every tester suggestion into a feature.

## Do not do next

- Do not start M22 before M21 GO and real beta evidence.
- Do not add speculative features during closeout.
- Do not weaken RLS or security to make testing easier.
- Do not reset or destructively alter the live database.
- Do not use `clean-milestone-4-sync` for new work.
- Do not merge the archived June history into `main`.
- Do not build followers, likes, public feeds, influencer mechanics, grocery comparison, calorie tracking, full pantry inventory or generic chatbot behaviour.

## Standard validation

```bash
pnpm test
pnpm lint
pnpm typecheck
pnpm build
git diff --check
```

## Core control

**Mission:** Make cooking easy and enjoyable.

**Loop:** Import → Save → Plan → Shop → Cook.
