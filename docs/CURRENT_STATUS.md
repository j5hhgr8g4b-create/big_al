# Current Status

**Last reconciled:** 2026-08-12

## Position

- Canonical branch: `main`
- Legacy June `main` history preserved at `archive/legacy-main-2026-06`
- `clean-milestone-4-sync` is a retired recovery branch and must not be used for new work
- M0–M20: complete
- M20.1 import fetch security hardening: complete
- M21 Private Beta Preparation: engineering complete
- M21 live closeout: **NO-GO pending live Supabase and two-user verification**
- M22: not started

## Repository health

- The real Big Al application history is now on `main`.
- The old unrelated June history was preserved before `main` was repointed.
- GitHub Actions Quality workflow targets pushes to `main` and pull requests targeting `main`.
- The corrected pnpm build-approval configuration passes Quality CI.
- The repaired canonical `main` passes Quality CI.
- `clean-milestone-4-sync` has been fast-forwarded to the canonical code state and is retired for new work.
- Branch protection still needs to be enabled in GitHub repository settings.

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

On 2026-08-12 the project was found `INACTIVE` and a restore was requested. Always check live status before continuing.

M21 migration requiring live verification/application:

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

## Accepted beta limitations

- Shopping normalisation is keyword/rule based rather than AI-driven.
- Recipe import quality depends on usable page metadata/JSON-LD.
- Unit/oven/hob preferences provide guidance rather than automatic recipe rewriting.
- Basic Big Al remains deterministic and intentionally simple.
- Cook Mode and Shopping still need real beta feedback for refinement.

These are not current blockers unless live use demonstrates they prevent the cooking loop.

## Branch workflow from now on

- `main` is the only long-lived working branch and should remain deployable.
- Create a short-lived branch for every repository change.
- Open a PR back to `main`.
- Require Quality CI to pass before merge.
- Delete/retire the temporary branch after merge.
- Do not push directly to `main` except in an explicit founder-approved emergency.

## Next exact action

1. Enable lightweight branch protection/rules for `main` when repository settings access is available.
2. Check Supabase project status.
3. When ACTIVE, verify/apply the M21 migration.
4. Run the live two-user M21 closeout matrix.
5. If every gate passes, mark M21 GO and begin the controlled 3–5 Restaurant private beta.
6. Do not start M22 until real beta evidence exists.
