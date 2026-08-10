# Milestone 21 — Private Beta Testing

## Status

Next in Phase 3 — not started. M20 completed with a GO decision.

M21 is currently paused at the mandatory entry checks. On 2026-08-10 the checks were prepared but could not be executed because two authenticated test users / Restaurants and accessible live sessions were not available.

This is an operational dependency, not a demonstrated product, RLS, importer, or recovery failure.

Before broad tester activity, run the three entry checks recorded in M20:

1. Live two-user Restaurant isolation.
2. Supported public recipe import.
3. Rejected/unsafe import → manual-review recovery.

Do not mark M21 active until these checks are completed and recorded.

## Goal

Run a small controlled beta with invited Restaurants.

## Why this matters

Private beta is where Big Al proves it works for people who are not the founder. The goal is evidence, not growth.

This milestone should reveal what confuses users, what breaks, what feels useful and what must be fixed before wider release.

## Entry checks

### 1. Two-user Restaurant isolation

Use two separate normal authenticated users / Restaurants and verify that each cannot read or mutate the other's Cookbook, Menu, Shopping/Pantry, cooking history, or known-ID/detail routes.

The current M20 review found strong implementation evidence for isolation; the missing live second-user exercise remains a verification gap rather than a demonstrated failure.

### 2. Supported public recipe import

Use a normal public recipe URL through the live authenticated app and confirm fetch, extraction/review, attribution, save, and Cookbook visibility still work after M20 import-security hardening.

### 3. Rejected import recovery

Use a safe clearly rejected/non-public destination test and confirm the app fails safely into the existing manual-review path without crashing or exposing sensitive internal details.

### Entry stop conditions

Stop before broad beta activity if any check demonstrates:

- cross-Restaurant read or mutation
- importer security regression
- broken manual recovery
- core-loop crash

Do not silently patch a failed entry check; report and remediate deliberately.

## Scope

- Invite a small number of trusted testers after entry checks pass.
- Provide clear beta instructions.
- Ask testers to complete practical cooking tasks.
- Collect feedback and bug reports.
- Observe where testers get stuck.
- Log confusion points.
- Avoid adding new features during the beta unless a blocker prevents testing.

## Proposed beta size

3–5 Restaurants.

## Must have

- Entry checks passed and recorded.
- Small controlled tester group.
- Clear tester task list.
- Feedback collection route.
- Bug/confusion log.
- Evidence from real use of the core loop.
- Clear separation between blockers and nice-to-have requests.

## Nice to have

- Short onboarding note.
- Simple tester survey.
- Founder observation notes.
- Evidence grouped by Import, Cookbook, Menu, Pantry and Cook Mode.

## Do not include

- Public launch.
- Public waitlist.
- Referral mechanics.
- Social sharing features.
- Feature request free-for-all.
- New product areas during testing.

## Acceptance criteria

- All three M21 entry checks pass.
- At least a small number of invited testers attempt the core loop.
- Tester feedback is captured in a structured way.
- Bugs are logged with enough detail to reproduce.
- Confusion points are logged separately from bugs.
- Founder can identify whether Big Al helped testers decide what to cook, shop and cook successfully.

## Suggested tester tasks

1. Create or join a Restaurant.
2. Import or save one recipe.
3. Add that recipe to Menu.
4. Generate Pantry/Shopping support.
5. Cook from Cook Mode or review whether they would cook from it.
6. Report what felt easy, confusing or unnecessary.

## Feedback evidence

Capture where practical:

- whether the core loop was completed
- where the tester stopped
- whether founder help was required
- errors encountered
- Shopping usefulness
- Cook Mode usefulness
- major confusion points
- defects found
- whether the tester would use Big Al again next week

Classify findings as BLOCKER, IMPORTANT, POLISH, or IDEA. Do not turn every suggestion into a roadmap item.

## Edge cases

- Tester cannot sign up.
- Tester does not understand Restaurants.
- Tester imports a weak recipe source.
- Tester creates duplicates.
- Tester does not understand Pantry.
- Tester abandons before Cook Mode.
- Tester asks for features outside MVP scope.

## Final report required

The beta report must include:

1. Number of testers invited.
2. Number of testers active.
3. Core tasks completed.
4. Bugs found.
5. Confusion points.
6. Positive signals.
7. Feature requests parked.
8. Recommended fixes before wider release.
