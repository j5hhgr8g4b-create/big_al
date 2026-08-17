# Project Handover

**Last updated:** 2026-08-17

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
- GitHub backlog has been reconciled to the current controlled-beta state.

### Accepted limitations / not blockers for controlled beta

- Cook completion/persisted-cook evidence and beta feedback submission were not fully exercised in the final founder closeout. Treat as **NOT TESTED**, not FAIL.
- Ingredient/shopping interpretation remains literal in places; semantic AI refinement is deferred.
- Cook Mode instructions and general visual design still need later refinement.

## Current active / relevant GitHub tickets — execution order

### #19 — M21 Private Beta closeout and execution

**Status:** READY FOR CONTROLLED PRIVATE BETA.

This is the main control issue. Run the controlled private beta with approximately **3–5 friendly Restaurants** using the production app with minimal founder coaching.

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

Classify findings as **BLOCKER / IMPORTANT / POLISH / IDEA**.

Any genuine beta **BLOCKER** jumps ahead of the engineering queue below.

### #56 — Mobile UI: horizontal overflow and overlapping controls

**Status:** NEXT ENGINEERING PRIORITY.

Whole-app responsive cleanup. Audit login/auth, Kitchen, Cookbook, recipe detail/import/review, recipe-book forms, Menu, Shopping, Cook Mode, Pantry/preferences and Specials.

Verify at **320px, 375px, 390px and 430px**. Fix root responsive/layout rules rather than isolated page hacks. Preserve desktop/tablet behaviour and bottom navigation.

### #52 — Cookbook image-led recipe cards

**Status:** SECOND ENGINEERING PRIORITY.

Replace the plain recipe-name list with image-led recipe cards using existing `image_url` data and existing queries. Keep food as the hero, preserve Restaurant isolation and Cookbook behaviour, and coordinate responsive behaviour with #56.

### #49 — Auth hardening: custom SMTP

**Status:** THIRD ENGINEERING PRIORITY / ACTIVE FOR CUSTOM SMTP ONLY.

Email + password remains the only tester-facing sign-in method. Google sign-in remains hidden. Apple sign-in remains deferred.

Configure and live-test custom SMTP so signup confirmation and password recovery no longer rely on Supabase's built-in rate-limited sender. Keep secrets out of the repo. Do not re-enable or configure Google OAuth as part of this ticket.

If provider/dashboard/domain work requires founder action, reduce it to the smallest exact action, record it on #19/#49, then continue another independent ticket rather than idling.

### #47 — Existing Restaurant member create/edit UX

**Status:** FOURTH ENGINEERING PRIORITY.

Guard `/restaurants/new` for users who already belong to an active Restaurant and route them to a clear current-Restaurant edit/settings path instead. Preserve membership/RLS rules. Do not add multi-Restaurant switching.

### #20 — M22 Beta Findings and Launch Decision

**Status:** GATED — DO NOT START YET.

Start only when #19 has enough genuine private-beta evidence. M22 is an evidence/decision milestone, not a feature-building milestone.

## Parked / non-active tickets

The following remain open intentionally but are **not part of the current Codex execution queue** unless beta evidence and explicit founder prioritisation promote them:

- #5 — Cook-again wording polish.
- #7 — Expand Basic Big Al beyond search.
- #21 — Scope control / do not build yet.
- #22 — Recipe import attribution and plagiarism check.
- #23 — Restaurant cooking preferences and automatic recipe adjustments.
- #24 — Cook Mode don't-panic notes.
- #25 — Recipe scaling with sanity checks.
- #26 — Substitution helper.
- #27 — Beginner difficulty translation.
- #41 — Engineering workflow contract; reference/governance issue, not implementation work.

## Recommended next-session order

1. Use #19 as the controlling M21 issue and keep collecting real beta evidence.
2. If a tester exposes a BLOCKER, create/update the smallest focused issue and fix it before continuing ordinary polish work.
3. If no blocker is waiting, work #56.
4. Then work #52.
5. Then work #49 for custom SMTP only. Keep Google hidden and Apple deferred.
6. Then work #47.
7. Do not start #20/M22 until #19 contains enough genuine tester evidence.
8. Do not activate parked idea/polish tickets without beta evidence and founder prioritisation.

## GitHub working rules

GitHub owns live engineering/task truth. Notion owns durable founder/business/product truth.

Start repository changes from `main` using one short-lived branch per issue, for example:

- `feature/<name>`
- `fix/<name>`
- `polish/<name>`
- `security/<name>`
- `docs/<name>`

For each active implementation ticket:

**CODED → SELF-REVIEWED → CHECKS PASS → PR READY → MERGED → DEPLOYED → SMOKE PASS → LIVE ACCEPTED**

Before calling a PR ready, explicitly self-review scope, auth/RLS/tenant isolation, migration safety, secrets, unnecessary complexity, user-visible behaviour and whether acceptance criteria are actually proven.

Run the ticket-specific checks and normally:

```bash
pnpm test
pnpm lint
pnpm typecheck
pnpm build
git diff --check
```

For production-facing changes, also verify the live Vercel deployment and appropriate browser/smoke checks before treating the work as accepted.

Do not push directly to `main` except for an explicit founder-approved emergency.

## Do not do next

- Do not re-open #50; starter recipe seeding with images passed live acceptance.
- Do not expose or configure Google sign-in during #49; Google remains hidden.
- Do not add Apple sign-in during M21.
- Do not start M22 before private-beta evidence exists.
- Do not add speculative features during M21.
- Do not weaken RLS/security to make testing easier.
- Do not use `clean-milestone-4-sync` for new work.
- Do not merge the archived June history into `main`.
- Do not build followers, likes, public feeds, influencer mechanics, grocery comparison, calorie tracking, full pantry inventory or generic chatbot behaviour.

## Core control

**Mission:** Make cooking easy and enjoyable.

**Loop:** Import → Save → Plan → Shop → Cook.
