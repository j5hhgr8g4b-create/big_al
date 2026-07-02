# Milestone 15 — Founder UAT Closeout

## Status

Planned for Phase 3.

## Goal

Complete live founder testing and fix launch-blocking bugs before Big Al is shown to invited beta testers.

## Why this matters

Before anyone else uses Big Al, the founder needs confidence that the core loop works with real authentication, real Restaurant data, real recipe imports, real Menu planning, real Pantry generation and real Cook Mode use.

This milestone is about proving the current MVP baseline, not adding new features.

## Scope

- Complete the founder UAT checklist.
- Test live sign-up and sign-in.
- Confirm Restaurant creation and membership behaviour.
- Confirm Restaurant preferences save and persist.
- Confirm import → review → save works.
- Confirm duplicate import handling is safe.
- Confirm saved recipes display attribution correctly.
- Confirm Menu planning works.
- Confirm Pantry generation works from planned meals.
- Confirm Pantry output is useful enough for a real shop.
- Confirm Cook Mode works on mobile-sized screens.
- Confirm mark-cooked behaviour works.
- Confirm second-user cross-Restaurant isolation.
- Log, fix or explicitly park all UAT findings.

## Must have

- Founder can complete Import → Save → Plan → Shop → Cook in the live app.
- All launch blockers are either fixed or clearly documented.
- Duplicate recipe handling prevents accidental clutter.
- Pantry is usable enough for a real shopping trip.
- No known cross-Restaurant data leaks.
- UAT report is updated.

## Nice to have

- Minor copy improvements from founder testing.
- Minor empty-state improvements.
- Small layout fixes where they remove confusion.

## Do not include

- New feature areas.
- Visual redesign.
- AI recipe rewriting.
- Public beta setup.
- Grocery comparison.
- Full pantry inventory.
- Social mechanics.

## Acceptance criteria

- Founder has completed the live UAT checklist.
- Founder can import a recipe, save it, plan it, generate a shopping list and cook from it.
- Duplicate URL import protection has been tested.
- Pantry/Shopping is founder-approved or remaining issues are explicitly logged as blockers.
- Second-user Restaurant isolation has been tested.
- `pnpm lint`, `pnpm typecheck`, `pnpm build` and `git diff --check` pass after any changes.

## Edge cases

- Existing messy generated shopping items should not break Pantry display.
- Failed imports should not trap users in dead ends.
- Duplicate recipes that already exist should remain visible but should not multiply accidentally.
- Missing recipe fields should show calm fallback copy.
- A second user must not be able to view or mutate another Restaurant's data.

## Final report required

Codex must report:

1. What founder UAT flows were tested.
2. Bugs found.
3. Bugs fixed.
4. Bugs deliberately parked.
5. Files changed.
6. Commands run and results.
7. Manual retests still required.
8. Whether M15 is founder-UAT acceptable.
