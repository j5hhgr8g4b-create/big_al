# Milestone 8 Validation Checklist

## Smoke test

- Open app as existing user.
- Confirm Big Al entry point is visible and understandable.
- Ask or find saved Recipes.
- Ask for something to cook from stored Recipes.
- Confirm response is grounded in saved, planned or cooked data.
- Confirm empty state when there is not enough data.
- Confirm no cross-Restaurant data leakage.
- Confirm no unsupported internet or generic AI claims.
- Confirm M8 does not need any paid AI subscription, paid API key, billing setup, paid model access, or paid usage plan.
- Confirm M8 still works, or degrades clearly, without an external AI provider.

## Good M8 answer

A good M8 answer is:

- short
- practical
- grounded
- kitchen-friendly
- honest about missing data
- free to produce in the MVP setup

## Bad M8 answer

A bad M8 answer is:

- generic
- long-winded
- pretending to know external facts
- generating a meal plan without enough data
- requiring paid AI access during MVP
- recommending features outside Big Al's current scope
- sounding like a corporate chatbot

## Regression checks

- `pnpm lint`
- `pnpm tsc --noEmit`
- `pnpm exec next build --webpack`

## Product question

Does Basic Big Al make the cookbook easier to use, or does it add another thing to manage?

If it adds admin, simplify it.