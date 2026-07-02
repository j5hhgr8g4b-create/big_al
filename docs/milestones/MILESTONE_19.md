# Milestone 19 — Cook Mode Beta Polish

## Status

Planned for Phase 3.

## Goal

Make cooking from Big Al calm, readable and forgiving enough for private beta.

## Why this matters

Cook Mode is the moment of truth. If the app is fiddly while someone has wet hands, a hot pan and dinner half-cooked, Big Al fails.

Cook Mode should feel calmer than a normal recipe website.

## Scope

- Improve Cook Mode readability on mobile-sized screens.
- Check step layout and spacing.
- Ensure ingredients are easy to reference without losing place.
- Improve mark-cooked confidence.
- Improve completion flow.
- Improve back-to-recipe behaviour.
- Improve missing-step and missing-ingredient fallback states.
- Ensure kitchen guidance is useful but not noisy.

## Must have

- Large, readable cooking steps.
- Ingredients available during cooking.
- User can mark a recipe cooked.
- Completion flow is clear.
- Missing fields do not break the page.
- Mobile layout is usable.
- Cook Mode stays simple.

## Nice to have

- Step progress memory if simple.
- Keep-screen-awake guidance if practical.
- Small next-time note capture if already easy.
- Better calm microcopy.

## Do not include

- Voice control.
- Timers.
- Smart appliance integrations.
- AI live cooking coach.
- Video cooking mode.
- Social sharing after cooking.

## Acceptance criteria

- User can cook one full saved recipe from Big Al without needing the original source.
- Cook Mode is readable on a phone-sized viewport.
- Ingredients and method are easy to move between.
- Mark-cooked works.
- Empty or incomplete recipes show calm fallbacks.
- `pnpm lint`, `pnpm typecheck`, `pnpm build` and `git diff --check` pass.

## Edge cases

- Recipe with no method steps.
- Recipe with no ingredients.
- Imported plain-text ingredients.
- Very long steps.
- Very short steps.
- User exits Cook Mode mid-flow.
- Mark-cooked action fails.

## Final report required

Codex must report:

1. Cook Mode flows tested.
2. Mobile readability changes.
3. Ingredient/method behaviour.
4. Mark-cooked behaviour.
5. Files changed.
6. Commands run and results.
7. Known limitations.
8. Manual retests required.
