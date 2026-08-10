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

## Original Phase 3 Requirements

## Goal

Make Pantry/Shopping useful enough for real weekly shopping.

## Why this matters

Shopping is where Big Al should feel quietly smart. The user should not have to translate raw recipe ingredient lines into things they can actually buy.

Pantry should answer:

```text
What do I need to buy?
What meal is it for?
When do I need it?
```

## Scope

- Continue Pantry UAT fixes.
- Improve ingredient cleanup and display.
- Improve obvious duplicate grouping.
- Improve spice handling.
- Improve category placement.
- Improve meal/date context.
- Improve simple buy-closer guidance.
- Preserve checked/unchecked behaviour.
- Keep manual shopping items working.

## Must have

- Water and obvious non-shopping basics are excluded.
- Generic salt/pepper are excluded unless specific and buyable.
- Spices appear as buyable items, not teaspoon amounts.
- Garlic/onion-style duplicates combine where safe.
- Prep clutter is removed from main item titles.
- Meal/date context is visible.
- Fresh short-life guidance is subtle and practical.
- Checked grouped items behave correctly.

## Nice to have

- Shop now vs buy later grouping.
- Better UK-friendly ingredient naming.
- Better pantry staple categorisation.
- Better handling of oils, sauces and jars.

## Do not include

- Supermarket integrations.
- Grocery price comparison.
- Pack-size calculation.
- Expiry prediction.
- Full pantry stock tracking.
- Barcode scanning.
- Nutrition or calories.

## Acceptance criteria

- User can shop from the list without constantly translating recipe lines.
- Ingredients are not duplicated messily.
- Fresh items needed later are easy to spot.
- Cards remain calm and readable.
- Manual items and generated items can both be checked and unchecked.
- `pnpm lint`, `pnpm typecheck`, `pnpm build` and `git diff --check` pass.

## Edge cases

- Existing messy generated shopping rows.
- Garlic written as `3 cloves garlic`, `6 garlic cloves`, `1 garlic clove`.
- Spices measured in tsp/tbsp.
- Tomato purée/paste categorisation.
- Fresh herbs planned later in the week.
- Same ingredient with incompatible units.
- Manual shopping items mixed with generated items.

## Final report required

Codex must report:

1. Shopping flows tested.
2. Ingredient cleanup improvements.
3. Duplicate grouping behaviour.
4. Category changes.
5. Checkbox behaviour.
6. Files changed.
7. Commands run and results.
8. Known limitations.
9. Manual retests required.
