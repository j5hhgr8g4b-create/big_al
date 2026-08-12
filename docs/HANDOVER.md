# Project Handover

**Last updated:** 2026-08-12

## Resume point

Big Al is in **M21 — Private Beta Testing**.

M21 engineering is complete. The milestone remains **NO-GO** because live deployment and two-user verification have not yet passed.

Active branch:

```text
clean-milestone-4-sync
```

Do not use `main`; it is stale and unrelated to the active branch history.

## Latest implementation state

- `5fb4d1f — M20.1 complete import security test coverage`
- `b9a2abd — M21 prepare Big Al for private beta`
- M21 automated checks: 30 tests passed, lint/typecheck/build/diff-check passed
- Working tree was reported clean and synchronized after M21

## Infrastructure state

Supabase project:

```text
cqcjacirzibfjecrruie
```

The project was found inactive on 2026-08-12. Restore was requested successfully. Latest observed status: `COMING_UP`.

Always check the live status again before acting.

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

## After M21 GO

Run a controlled beta with roughly 3–5 friendly Restaurants and minimal founder guidance. Collect evidence about completion of the cooking loop, confusion, defects, Shopping usefulness, Cook Mode usefulness and whether testers would use Big Al again the following week.

Classify findings as:

- BLOCKER
- IMPORTANT
- POLISH
- IDEA

Do not turn every tester suggestion into a feature.

## Do not do next

- Do not start M22 before M21 GO and real beta evidence.
- Do not add speculative features during closeout.
- Do not weaken RLS or security to make testing easier.
- Do not reset or destructively alter the live database.
- Do not use or merge into `main` without an explicit branch-strategy decision.
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
