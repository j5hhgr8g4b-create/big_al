# Project Handover

**Last updated:** 2026-08-16

## Resume point

Big Al is in **M21 — Controlled Private Beta**.

Engineering preparation and founder closeout are complete enough to proceed. The next session should **not re-audit the backlog before starting** unless something has materially changed since this handover.

Canonical branch:

```text
main
```

Production app:

```text
https://big-al-kappa.vercel.app
```

Supabase project:

```text
cqcjacirzibfjecrruie
```

The old unrelated June `main` history remains preserved at:

```text
archive/legacy-main-2026-06
```

`clean-milestone-4-sync` remains retired. Do not start new work from it.

## Current project state

### Complete / accepted

- M0–M20 complete.
- M21 engineering preparation complete.
- Stable Vercel production deployment from `main` exists.
- Production smoke checks exist.
- Supabase production is healthy and current required M21 migrations are live.
- Auth onboarding/recovery foundation is live for email/password private-beta use.
- Restaurant creation retry/duplicate defect is fixed.
- Browser-facing two-Restaurant isolation closeout was completed sufficiently to proceed.
- Supported public HTTPS recipe import works.
- `http://127.0.0.1/recipe` safely falls back to manual review.
- Core Import → Save → Plan → Shop → Cook founder retest was accepted sufficiently to proceed.
- Issue #50 is complete: every fresh Restaurant receives the five beta starter recipes automatically, including images.
- GitHub backlog was audited on 2026-08-16 and reconciled to the current state.

### Accepted limitations / not blockers for controlled beta

- Cook completion/persisted-cook evidence and beta feedback submission were not fully exercised in the final founder closeout. Treat as **NOT TESTED**, not FAIL.
- Ingredient/shopping interpretation remains literal in places; semantic AI refinement is deferred.
- Cook Mode instructions and general visual design still need later refinement.

## Next session focus

### Primary objective — begin controlled private beta

Do **not** start M22 yet.

Use approximately **3–5 friendly Restaurants** with minimal founder coaching and gather real usage evidence.

For each tester, observe whether they can naturally move through:

**Create account / sign in → Create Restaurant → Import → Save → Plan → Shop → Cook → Feedback**

Capture:

- whether the core loop is completed;
- where founder help is required;
- errors or blockers;
- confusing wording or flows;
- Shopping usefulness;
- Cook Mode usefulness;
- mobile/UI friction;
- whether the tester would use Big Al again the following week;
- whether the Restaurant concept is understood.

Classify every finding as:

- **BLOCKER**
- **IMPORTANT**
- **POLISH**
- **IDEA**

Do not turn every tester suggestion into product scope.

## Current active / relevant GitHub tickets

### #19 — M21 Private Beta closeout and execution

**Status:** READY FOR CONTROLLED PRIVATE BETA.

This is the main control issue for the next session. Add private-beta evidence here as it arrives. Keep M21 open until enough tester evidence exists for M22.

### #52 — Cookbook image-led recipe cards

Open UI polish. Replace the plain recipe-name list with food-led image cards while preserving Cookbook behaviour and Restaurant isolation.

Coordinate responsive work with #56.

### #56 — Mobile responsive UI cleanup

Open whole-app UI ticket.

Known founder observations:

- some mobile pages are slightly wider than the viewport and scroll horizontally;
- some inputs/forms overlap at mobile widths;
- responsive sizing needs a whole-app cleanup rather than a one-page patch.

Audit at 320px, 375px, 390px and 430px when this work is picked up.

### #47 — Existing Restaurant member create/edit UX

Open UX polish. Database duplicate protection is already fixed; remaining issue is that an existing member should not be shown a misleading create-another-Restaurant flow.

### #49 — Auth hardening

**PAUSED BY FOUNDER.**

Google OAuth code was built and merged, then deliberately hidden from testers. Do not configure or expose Google sign-in next session unless the founder explicitly reactivates #49.

Custom SMTP and the broader social-auth decision remain future hardening before broader beta/release.

### #20 — M22 Beta Findings and Launch Decision

Future milestone. Do not start until M21 has produced enough genuine tester evidence.

## Recommended next-session order

1. Read this handover and the latest state of #19 only.
2. Do **not** perform another whole-backlog audit unless evidence suggests drift.
3. Decide whether the session is primarily:
   - running/recording private-beta evidence; or
   - fixing a demonstrated beta blocker.
4. If a tester exposes a BLOCKER, create/update the smallest focused GitHub ticket and fix that before continuing beta.
5. If no blocker exists, keep collecting beta evidence rather than polishing speculative issues.
6. Address #52/#56/#47 only when founder priority or beta evidence justifies the polish work.
7. Leave #49 paused.
8. Start #20/M22 only after enough real beta evidence exists.

## GitHub working rules

GitHub owns live engineering/task truth. Notion owns durable founder/business/product truth.

Start repository changes from `main` using a short-lived branch such as:

- `feature/<name>`
- `fix/<name>`
- `polish/<name>`
- `security/<name>`
- `docs/<name>`

Run the required checks, open a PR to `main`, merge only when Quality CI passes, then retire the branch.

Do not push directly to `main` except for an explicit founder-approved emergency.

## Standard validation

```bash
pnpm test
pnpm lint
pnpm typecheck
pnpm build
git diff --check
```

For production-facing changes, also verify the live Vercel deployment and appropriate smoke/browser checks before treating the work as accepted.

## Do not do next

- Do not re-open #50; starter recipe seeding with images passed live acceptance.
- Do not expose Google sign-in; #49 is paused.
- Do not start M22 before private-beta evidence exists.
- Do not add speculative features during M21.
- Do not weaken RLS/security to make testing easier.
- Do not use `clean-milestone-4-sync` for new work.
- Do not merge the archived June history into `main`.
- Do not build followers, likes, public feeds, influencer mechanics, grocery comparison, calorie tracking, full pantry inventory or generic chatbot behaviour.

## Core control

**Mission:** Make cooking easy and enjoyable.

**Loop:** Import → Save → Plan → Shop → Cook.
