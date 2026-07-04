# Milestone 18 — Shopping List Reliability

Status: Complete on `clean-milestone-4-sync`.

## Scope

M18 beta-proofed Pantry/Shopping without expanding it into inventory management.

## Delivered

- Pantry now flags when the active Shopping list was generated for a different Menu date range.
- Clear Shopping list copy now states that Recipes and Menu plans are not removed.
- Generated Shopping display strips more common prep/instruction clutter such as roughly chopped, trimmed, washed, drained, rinsed, divided, for serving, and to serve.
- Common onion variants and more vegetable names categorise consistently under Fresh produce.
- M15 generic salt/pepper filtering remains preserved.

## Verification

- `pnpm lint`
- `pnpm typecheck`
- `pnpm build`
- `git diff --check`

## Database Changes

None.

## Notes

Shopping remains MVP-level and keyword-based. No grocery comparison, pack-size inference, inventory management, expiry prediction, barcode scanning, or nutrition work was added.
