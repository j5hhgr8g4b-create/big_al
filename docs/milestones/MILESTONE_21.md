# Milestone 21 — Private Beta Testing

## Status

**Engineering complete — live closeout NO-GO.**

M21 implementation was completed on 2026-08-12 in `b9a2abd — M21 prepare Big Al for private beta`.

Automated verification passed:

- 30 tests passed / 0 failed
- lint passed
- typecheck passed
- build passed
- `git diff --check` passed

No new code defect was found during the closeout attempt. The remaining blocker is live environment access and verification.

## Infrastructure state

Supabase project:

```text
cqcjacirzibfjecrruie
```

On 2026-08-12 the project was found inactive. Restore was requested successfully; latest observed state was `COMING_UP`.

Check the live project status before continuing.

Migration requiring live verification/application:

```text
20260812202748_m21_beta_feedback.sql
```

## Preparation delivered

M21 added:

- concise core-loop messaging on sign-in and Kitchen;
- lightweight in-app `Send feedback` access across authenticated pages;
- feedback validation and Restaurant-aware submission;
- `beta_feedback` migration with RLS/restricted grants and membership-checking RPC;
- safer generic authentication error messages;
- focused automated feedback/security coverage;
- a two-user UAT plan for live Restaurant isolation.

The implementation deliberately did **not** add heavyweight analytics, a support platform, a new onboarding wizard or speculative features.

## GO gates

M21 can move to **GO — ready to begin private beta** only when every gate below passes.

- [ ] Supabase project is ACTIVE.
- [ ] Live migration history is checked.
- [ ] `20260812202748_m21_beta_feedback.sql` is applied if missing.
- [ ] `beta_feedback`, RLS, grants and `submit_beta_feedback` RPC are verified live.
- [ ] User A and User B exist as ordinary authenticated users.
- [ ] Restaurant A and Restaurant B are separate.
- [ ] Cross-Restaurant access attempts fail for Recipes.
- [ ] Cross-Restaurant access attempts fail for Imports.
- [ ] Cross-Restaurant access attempts fail for Menu.
- [ ] Cross-Restaurant access attempts fail for Shopping.
- [ ] Cross-Restaurant access attempts fail for preferences.
- [ ] Cross-Restaurant access attempts fail for Cook records.
- [ ] Cross-Restaurant access attempts fail for feedback.
- [ ] One supported public HTTPS recipe import succeeds.
- [ ] `http://127.0.0.1/recipe` is safely rejected into manual review.
- [ ] User A completes Import → Save → Plan → Shop → Cook → Feedback.
- [ ] User B independently completes Import → Save → Plan → Shop → Cook → Feedback.
- [ ] Required automated checks remain green.

## Two-user live UAT

Use separate browser profiles/sessions and normal authenticated access. Do not substitute service-role or mocked identities for the isolation check.

For each user:

1. Sign in and access their own Restaurant.
2. Import a supported public recipe.
3. Review attribution and save it.
4. Confirm it appears in Cookbook.
5. Plan it in Menu.
6. Generate/use Shopping.
7. Open Cook Mode and mark the recipe cooked.
8. Submit beta feedback.

Then attempt known-ID/URL and RPC access against the other Restaurant. Reads must return no other-Restaurant data; mutations must fail or affect zero rows.

## Import security check

Run both:

1. A normal public HTTPS recipe import through the live app.
2. `http://127.0.0.1/recipe` and confirm no private request succeeds, no raw diagnostic detail is exposed, and manual-review recovery remains available.

## Private beta after GO

Run a controlled beta with approximately **3–5 friendly Restaurants**.

Send each tester the stable beta URL together with the concise [private beta tester guide](../PRIVATE_BETA_TESTER_GUIDE.md).

The primary task is:

**Import → Save → Plan → Shop → Cook**

Capture:

- whether the loop was completed;
- where users stopped;
- founder help required;
- errors and confusion;
- Shopping usefulness;
- Cook Mode usefulness;
- defects;
- whether they would use Big Al again the following week.

Classify findings as **BLOCKER / IMPORTANT / POLISH / IDEA**.

## Guardrails

M21 validates the product already built. Do not expand it into public launch, social mechanics, advanced AI, grocery comparison, calorie tracking, full pantry inventory or a redesign.

## Exit

If any live gate fails, fix only the demonstrated blocker and rerun the affected check.

Do not start M22 until M21 is GO and real private-beta evidence exists.
