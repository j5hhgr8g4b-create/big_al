# Milestone 21 — Private Beta Testing

## Status

Preparation implemented on 2026-08-12. M20 completed with a GO decision.

M21 remains paused at the mandatory live entry checks because two authenticated test users / Restaurants and accessible live sessions were not available in the implementation environment.

This is an operational dependency, not a demonstrated product, RLS, importer, or recovery failure.

Before broad tester activity, run the three entry checks recorded in M20:

1. Live two-user Restaurant isolation.
2. Supported public recipe import.
3. Rejected/unsafe import → manual-review recovery.

Do not mark M21 active until these checks are completed and recorded.

## Preparation delivered

- The sign-in and Kitchen screens state the core loop in plain language.
- Existing first-use states in Kitchen, Cookbook, Menu, Pantry and Specials were reviewed and retained; each explains its purpose and points to the next useful action.
- Every authenticated app page has one unobtrusive `Send feedback` link and private-beta note.
- Feedback captures category, text, originating page, authenticated submitter, active Restaurant and database timestamp.
- Feedback rows are protected by RLS and an authenticated membership-checking submission RPC. Direct writes are not granted.
- Authentication failures now show generic practical messages while server logs retain the Supabase error code.
- Existing Restaurant-scoped records provide lifecycle evidence without a duplicate analytics system.

## Minimal lifecycle evidence

Use existing first-party rows rather than adding behavioural analytics:

| Beta milestone | Existing evidence |
| --- | --- |
| Restaurant established | `restaurants` / `restaurant_members` |
| Recipe imported or saved | `imports` / `recipes` |
| Meal planned | `meal_events` |
| Shopping list generated | `shopping_lists.generated_at` |
| Cook Mode completed / marked cooked | `recipe_cooks` |
| Feedback submitted | `beta_feedback` |

The application logs feedback success with category, page path and Restaurant ID. Failures log only the Supabase error code and Restaurant ID; feedback text and account details are not logged.

## Founder feedback review

Review `public.beta_feedback` in the authenticated Supabase Dashboard. Keep access to project administrators; do not expose a cross-Restaurant review screen to beta users. Sort by `created_at desc` and use `category`, `page_path` and `restaurant_id` to reproduce the report. Feedback text may contain user-provided personal information and should not be copied into public channels.

## Manual two-user UAT checklist

Use separate browser profiles or private sessions. Record user IDs, Restaurant IDs, timestamps and pass/fail outcomes in the beta evidence log; do not record passwords or session tokens.

### User A / Restaurant A

1. Create or sign into User A.
2. Create or access Restaurant A and reach Kitchen without prompting.
3. Import a supported public recipe URL.
4. Review extraction, source/creator attribution and duplicate warning behaviour.
5. Save the Recipe and confirm it appears in Cookbook.
6. Add it to Menu for a meal.
7. Generate the Shopping list and tick one item.
8. Open Cook Mode, complete the Recipe and mark it cooked.
9. Use `Send feedback` from Cook Mode and submit a test report.

### User B / Restaurant B

Repeat steps 1–9 with a different normal account and Restaurant B.

### Isolation attempts

While signed in as User A:

1. Confirm Restaurant B does not appear in Cookbook, Menu, Pantry/Shopping, Specials or preferences.
2. Open known Restaurant B Recipe, Recipe edit, Import review, Recipe Book and Cook Mode URLs. Each must return not-found/access-denied behaviour without leaking content.
3. Submit Restaurant B IDs to the existing Recipe, Menu, Shopping, Cook and preferences RPCs using the authenticated client or Supabase RLS Tester. Reads must return no B rows and mutations must fail or affect zero rows.
4. Query `beta_feedback` as User A. User A must not see User B's feedback.

Repeat the same attempts as User B against Restaurant A.

### Import-security entry checks

1. Complete one supported public HTTPS import through the live app and verify review, attribution, save and Cookbook visibility.
2. Submit a safe rejected destination such as `http://127.0.0.1/recipe` and confirm manual-review recovery, no crash and no internal diagnostic detail in the UI.

### Stop conditions

Stop the beta and record a blocker for any cross-Restaurant read/mutation, importer security regression, broken manual recovery, raw exception, or core-loop crash.

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
