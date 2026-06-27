# Milestone 8 AI Cost Guardrail

## Decision

M8 must be free to run in the current MVP setup.

Do not add a paid AI model, paid API key, paid subscription requirement, billing setup, or usage-based provider dependency.

## Preferred approach

Build Basic Big Al using deterministic app-data logic first:

- saved Recipes
- planned Recipes
- recently cooked Recipes
- cook-again feedback
- Recipe Ingredients and Steps

## Provider rule

If any AI provider is proposed during M8, Codex must explain before implementation:

- why deterministic app-data logic is not enough
- whether the provider is free for this MVP build
- what happens when the provider is unavailable or rate limited

If free use cannot be guaranteed, do not add the provider.

## Future

Paid AI subscriptions or upgraded AI provider usage can be considered after the MVP loop is proven.