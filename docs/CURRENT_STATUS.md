# Current Status

**Last reconciled:** 2026-08-12

## Position

- Active branch: `clean-milestone-4-sync`
- Latest application commit before documentation reconciliation: `b9a2abd — M21 prepare Big Al for private beta`
- `main`: stale and has no common ancestor with the active branch; do not use it for active work
- M0–M20: complete
- M20.1 import fetch security hardening: complete
- M21 Private Beta Preparation: engineering complete
- M21 live closeout: **NO-GO pending infrastructure restore and live verification**
- M22: not started

## Automated evidence

M21 implementation report:

- `pnpm test`: 30 passed / 0 failed
- `pnpm lint`: passed
- `pnpm typecheck`: passed
- `pnpm build`: passed
- `git diff --check`: passed

M20.1 importer security coverage includes protocol restrictions, public DNS/IP validation, pinned connections, redirect validation, response size limits, HTML/XHTML enforcement, timeout handling and safe manual-review recovery.

## Supabase state

Project:

```text
cqcjacirzibfjecrruie
```

On 2026-08-12 the project was found `INACTIVE`. A restore was successfully requested and the latest observed state was `COMING_UP`.

Do not infer that the project is still restoring in a future session. Check its live status before continuing.

M21 migration still requiring live verification/application:

```text
20260812202748_m21_beta_feedback.sql
```

## M21 closeout gates

M21 becomes GO only when all of the following pass:

1. Supabase project is ACTIVE.
2. M21 migration is present in live migration history or is safely applied.
3. `beta_feedback`, RLS, grants and `submit_beta_feedback` RPC are verified live.
4. Two ordinary authenticated users have separate Restaurants.
5. Cross-Restaurant read/mutation attempts fail for Recipes, Imports, Menu, Shopping, preferences, Cook records and feedback.
6. One supported public HTTPS recipe import passes.
7. `http://127.0.0.1/recipe` is safely rejected into manual review.
8. User A completes Import → Save → Plan → Shop → Cook → Feedback.
9. User B independently completes the same loop.
10. Automated checks remain green.

## What works

The validated application spine remains:

**Import → Save → Plan → Shop → Cook**

Founder UAT previously passed the full live core loop. M16–M19 hardening improved reliability, import quality/attribution, Shopping reliability and Cook Mode. M20/M20.1 cleared the recipe importer security blocker. M21 added lightweight beta feedback, clearer first-use messaging and safer auth error copy.

## Known limitations accepted for beta

- Shopping normalisation is keyword/rule based rather than AI-driven.
- Recipe import quality depends on usable page metadata/JSON-LD.
- Unit/oven/hob preferences provide guidance rather than automatic recipe rewriting.
- Basic Big Al remains deterministic and intentionally simple.
- Cook Mode and Shopping still need real beta feedback for refinement.

These are not current M21 blockers unless live use demonstrates that they prevent the cooking loop.

## GitHub structural audit

- Active branch is not protected.
- No GitHub Actions workflow exists on the active branch.
- The repository default branch remains `main`, but `main` is stale/unrelated to the active history.
- No open pull request currently reconciles the active branch to `main`.

Do not change branch strategy casually. Resolve the default-branch/history problem deliberately before wider release or multi-contributor development.

## Next exact action

1. Check Supabase project status.
2. When ACTIVE, verify/apply the M21 migration.
3. Run the live two-user M21 closeout matrix.
4. If every gate passes, mark M21 GO and begin the controlled 3–5 Restaurant private beta.
5. Do not start M22 until real beta evidence exists.
