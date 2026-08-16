# M21 Core-Loop Live UAT Runbook

Use this runbook for the live closeout in issue #19 after the stable beta origin, onboarding, and Restaurant creation are available. It reconciles the [private beta tester guide](PRIVATE_BETA_TESTER_GUIDE.md) with the stricter evidence required for M21.

Stable beta origin: `https://big-al-kappa.vercel.app`

## Test data and session rules

- Use two separate browser profiles: User A and User B.
- Use two ordinary Supabase Auth accounts. Do not use service-role access, mocked identities, seeded Restaurant rows, or copied cookies as evidence.
- Use one fresh test Restaurant per user, clearly named for the run.
- Keep email addresses, passwords, tokens, record IDs and private diagnostic details out of GitHub comments.
- If an email or session is stale, mark the affected gate `NOT TESTED`, obtain a fresh session, and rerun it.

## Human-only preparation

1. Confirm the stable origin opens independently of Codespaces.
2. Confirm Supabase Auth Site URL and the two stable callback URLs are saved.
3. For each profile, create/confirm or sign in to the ordinary user.
4. Create that user's Restaurant through `/restaurants/new`.
5. Keep the two profiles separate for the entire run.

Do not combine preparation failures with application-loop failures. Record the first failing step and stop that user's run until the smallest demonstrated blocker is understood.

## User A and User B journey

Run every step independently for both users and record the result immediately.

| Step | Action | Required evidence |
|---|---|---|
| Account | Open the stable URL, authenticate, and reach the user's Kitchen | Authenticated app shell loads; correct Restaurant is shown |
| Create Restaurant | Create a new Restaurant through the normal form | New Restaurant name appears; owner membership exists; Kitchen is reachable |
| Import | Open Cookbook → Import recipe and paste the supported URL below | Import review loads with title, ingredients and method or safe manual fallback |
| Save | Review attribution/details and save the Recipe | Recipe is saved and visible in Cookbook |
| Plan | Add the saved Recipe to Menu for a chosen date | Menu shows the planned meal for the user's Restaurant |
| Shop | Generate/use Shopping from the planned meal | Shopping list contains expected ingredients and can be viewed |
| Cook | Open Cook Mode and complete the final action “Finish and mark cooked” | Success state appears and a persisted Cook record ID is captured privately |
| Feedback | Use Send feedback on the relevant page | Feedback submission succeeds; category/page/result recorded privately |

### Supported import test

Use this public HTTPS Recipe page for both users unless it becomes unavailable:

`https://www.bbcgoodfood.com/recipes/easy-chicken-curry`

It is a normal public recipe page with structured recipe content and a stable, non-social URL. If it stops importing successfully, record the URL/status and choose another public page with visible Recipe JSON-LD; do not weaken import security or treat a fragile login-wall page as the test source.

## Required import-security regression

Run as an authenticated user through the live app after the normal import succeeds:

1. Submit `http://127.0.0.1/recipe`.
2. Confirm the request is rejected before any private-network fetch.
3. Confirm no raw stack trace, hostname-resolution detail or internal diagnostic is shown.
4. Confirm the existing manual-review recovery remains available.

The automated regression already covers loopback/private destination rejection and manual-review fallback. The live gate requires the browser-visible result as well.

## Isolation handoff

After both users complete their own journeys, run the seven-domain two-direction matrix in [M21 isolation verification](M21_ISOLATION_VERIFICATION.md): Recipes, Imports, Menu, Shopping, Restaurant preferences, Cook records and beta feedback.

The matrix must prove both:

- own data is visible and usable; and
- the opposite user's known URL/ID cannot be read or mutated.

## Evidence format for #19

```text
M21 core-loop UAT — [UTC date/time]
Origin: https://big-al-kappa.vercel.app

| Gate | User A | User B | Evidence note |
| Account/session | NOT TESTED | NOT TESTED | |
| Restaurant creation + Kitchen | NOT TESTED | NOT TESTED | |
| Public HTTPS import | NOT TESTED | NOT TESTED | |
| Save/Cookbook | NOT TESTED | NOT TESTED | |
| Menu/Plan | NOT TESTED | NOT TESTED | |
| Shopping | NOT TESTED | NOT TESTED | |
| Cook Mode persisted record | NOT TESTED | NOT TESTED | |
| Feedback submission | NOT TESTED | NOT TESTED | |
| localhost rejection/manual review | NOT TESTED | NOT TESTED | |
| Seven-domain isolation | NOT TESTED | NOT TESTED | See M21 isolation matrix |

Overall: GO only if every cell passes; otherwise NO-GO
Founder help required: [none / exact step]
Defects: [BLOCKER / IMPORTANT / POLISH / none]
```

## Retry and cleanup

- Retry a normal form submission once after refreshing the page and confirming the session is still valid.
- Do not create duplicate Restaurants, Menu events, Recipes or feedback entries while retrying.
- If a record was created but the UI did not redirect, verify it privately before retrying; use the existing record rather than creating a duplicate.
- If a run cannot be completed, leave the data intact for diagnosis and record the exact step, user direction and visible error without posting secrets.

## Human versus automated evidence

Automatable before/after each deployment:

- `pnpm smoke:production`
- `pnpm test`
- quality workflow checks
- live HTTP/status and Vercel runtime-log inspection

Human-only for M21 acceptance:

- fresh inbox confirmation and password recovery;
- two ordinary authenticated sessions;
- Restaurant creation through the UI;
- attribution review and save judgment;
- Shopping usefulness;
- Cook Mode completion and persisted Cook record;
- feedback submission;
- cross-Restaurant browser reads/mutations.

Never promote an automated or structural check into a live PASS claim.
