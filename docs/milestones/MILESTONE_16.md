# Milestone 16 — Core Reliability & Error Handling

## Status

Planned for Phase 3.

## Goal

Make the existing app harder to break and easier to recover from before inviting beta testers.

## Why this matters

Private beta users should not get stranded. If an import fails, a save fails, auth expires or a list is empty, Big Al should explain what happened and offer a useful next step.

This milestone strengthens the current MVP. It must not introduce new product areas.

## Scope

- Audit existing error, loading and empty states.
- Improve auth-related error handling.
- Improve recipe save failure messages.
- Improve import failure and fallback states.
- Improve Menu and Pantry empty states.
- Improve Cook Mode missing-field states.
- Remove dead ends where users cannot recover.
- Add calm, practical Big Al copy where useful.
- Ensure errors do not expose sensitive technical details.

## Must have

- Users understand what went wrong when a core action fails.
- Users have a clear recovery path.
- Empty states point to the next useful action.
- Loading states do not look broken.
- No major flow ends in a blank or confusing screen.
- Existing core loop remains unchanged.

## Nice to have

- Small friendly helper copy.
- Consistent error style across screens.
- A simple beta feedback prompt where appropriate.

## Do not include

- New features.
- Redesigning all screens.
- Full telemetry/analytics system.
- Complex feedback database.
- Paid monitoring tools unless explicitly approved.
- AI-generated support responses.

## Acceptance criteria

- Import errors are understandable.
- Save failures are understandable.
- Empty Cookbook, Menu, Pantry and Cook Mode states are useful.
- Auth/session issues guide the user back to sign-in.
- No core screen appears broken when data is missing.
- `pnpm lint`, `pnpm typecheck`, `pnpm build` and `git diff --check` pass.

## Edge cases

- Expired session during save.
- Recipe with no ingredients.
- Recipe with no method steps.
- Empty Menu.
- Empty Pantry.
- Import URL blocked or inaccessible.
- Slow loading state.
- User without a Restaurant.

## Final report required

Codex must report:

1. Screens audited.
2. Reliability issues found.
3. Error/empty states improved.
4. Files changed.
5. Commands run and results.
6. Any remaining confusing states.
7. Manual retests required.
