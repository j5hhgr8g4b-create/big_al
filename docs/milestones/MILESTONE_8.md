# Milestone 8 — Basic Big Al

Status: Not started

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

## Watch Items

- Keep the experience scoped and practical.
- Prefer a small set of reliable helper actions over a freeform assistant that can drift.
- Do not let Big Al become a generic AI product.
- Do not introduce paid AI infrastructure during M8.