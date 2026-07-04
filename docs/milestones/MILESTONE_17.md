# Milestone 17 — Import Quality & Attribution Hardening

Status: Complete on `clean-milestone-4-sync`.

## Scope

M17 tightened the existing URL import foundation for beta trust without rebuilding import from scratch.

## Delivered

- Import review now shows a compact confidence checklist for title, ingredients, method, creator/source, and source link.
- Import review reinforces that original creator/source, source site, and source URL should stay visible.
- Pending duplicate Imports now link directly to the other review screen.
- Recipe forms explain source preservation during import review.
- Server-side Recipe saves validate creator/source and source-site length.
- Source and image URL fields now use the same 2000-character browser limit as import capture.

## Verification

- `pnpm lint`
- `pnpm typecheck`
- `pnpm build`
- `git diff --check`

## Database Changes

None.

## Notes

Duplicate source URL protection remains in place. M17 does not add AI matching, merge flows, scraping workarounds, plagiarism scoring, or licensing checks.
