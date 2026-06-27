# Milestone 8 — Basic Big Al

Status: Complete

Implemented: 2026-06-27

Completed: 2026-06-27

## Objective

Introduce a basic Big Al helper layer that can answer simple, contextual questions from the Restaurant's stored recipe data without turning the product into a generic AI app.

Big Al should feel like a trusted cookbook that quietly got smarter.

## Cost Constraint

This MVP version must not require any paid AI subscription, paid API key, paid usage plan, billing setup, or paid model access.

The preferred M8 implementation is deterministic and app-data based.

If an AI provider is proposed, it must be free to run in the current MVP setup and must degrade gracefully when unavailable. Paid AI integrations can be considered later as a future upgrade.

## Must Have

- A simple Big Al entry point from the existing app experience.
- Restaurant-scoped access to stored Recipe data.
- Basic contextual help using existing Recipes, Ingredients, Menu, Shopping and Cook history where practical.
- Simple answers from stored data, such as finding recipes, suggesting what to cook from saved Recipes, or explaining recipe context.
- Clear empty states when Big Al does not have enough stored data to answer well.
- Guardrails that keep Big Al practical, warm and cooking-focused.
- No paid AI dependency for the MVP version.

## Nice to Have

- Helpful prompts such as “What can I cook this week?” or “Show me recipes I have cooked before.”
- Simple recommendation explanations based on saved/cooked/planned Recipes.

## Do Not Build

- Generic chatbot behaviour.
- Open-ended internet search.
- Paid AI model or paid API dependency.
- Subscription-gated AI feature.
- Grocery price comparison.
- Calorie tracking.
- Full pantry inventory management.
- Influencer, follower, likes, views or public-feed mechanics.
- Complex AI meal generation outside the approved M8 scope.

## Validation

M8 is successful if Big Al gives useful, grounded cooking help from the Restaurant’s own data without adding friction, pretending to know things it does not know, or requiring a paid AI service.

## Delivered

- Basic Big Al entry point in Specials.
- Suggested prompt buttons for saved Recipes, suggestions, planned Recipes, recently cooked Recipes, and cook-again Recipes.
- Deterministic search over stored Recipe titles, descriptions, Ingredients and Recipe Steps.
- Simple recommendation explanations based on planned, cooked, cook-again and quick Recipe signals.
- Restaurant-scoped reads through existing Supabase RLS-protected data.
- Honest empty states when there is not enough stored data.
- Clear copy that Big Al does not use internet search or paid AI in M8.

## Local Verification

- `pnpm lint` passed.
- `pnpm tsc --noEmit` passed.
- `pnpm exec next build --webpack` passed.

## Live Verification

- Not performed in this local pass.

## Regression Checklist

- Open Specials as an existing user.
- Confirm Big Al entry point is visible and understandable.
- Search for a saved Recipe title or Ingredient.
- Ask what to cook from stored data.
- Confirm planned Recipes appear when Menu data exists.
- Confirm recently cooked Recipes appear when `recipe_cooks` data exists.
- Confirm cook-again Recipes appear when `cook_again` feedback exists.
- Confirm responses are grounded in the current Restaurant only.
- Confirm empty state when there is not enough data.
- Confirm no internet, generic AI or unsupported external claims appear.
- Confirm no paid AI setup is required.

## Watch Items

- Keep the experience scoped and practical.
- Prefer a small set of reliable helper actions over a freeform assistant that can drift.
- Do not let Big Al become a generic AI product.
- Do not introduce paid AI infrastructure during M8.

## Deferred

- Paid or provider-backed AI.
- Advanced AI meal planning.
- Ingredient substitution intelligence.
- Unit conversion.
- Internet search.
- Social or public discovery mechanics.
