# Milestone 8 — Basic Big Al Codex Prompt

Begin Milestone 8 — Basic Big Al.

Work only inside `/workspaces/big_al` on branch `clean-milestone-4-sync`.

Before editing, run:

```bash
pwd
git branch --show-current
git status --short
```

Expected:

```txt
/workspaces/big_al
clean-milestone-4-sync
clean status
```

Read:

- AGENTS.md
- CODEX_RULES.md
- docs/CURRENT_STATUS.md
- docs/CHANGELOG.md
- docs/milestones/MILESTONE_7.md
- docs/milestones/MILESTONE_8.md
- docs/product/DATABASE_SCHEMA.md
- docs/product/APP_SCREENS.md
- docs/product/PRODUCT_SPEC.md
- GitHub issue for M8 Basic Big Al readiness and build

## Current verified state

- M7 Cook Mode is complete and pushed in commit `20aba3c`.
- M7 migration was applied to Supabase.
- Recipe detail links to Cook Mode.
- Cook Mode works with step navigation, Ingredients access, timer, Mark cooked and persisted cook-again feedback.
- M7 polish issue exists for Cook-again wording.

## M8 objective

Introduce a basic Big Al helper layer that answers simple, practical cooking questions using the Restaurant's stored data.

This must not become a generic chatbot. Big Al should feel like a trusted cookbook that quietly got smarter.

## Cost and AI provider constraint

This MVP version must not require any paid AI subscription, paid API key, paid usage plan, billing setup, or paid model access.

If Basic Big Al can be delivered deterministically from app data, do that first.

If an AI provider is proposed, it must be free to run in the current MVP setup and must degrade gracefully when unavailable. Do not add a paid OpenAI, Anthropic, Gemini, or other paid model dependency during M8.

Before adding any AI SDK, package, environment variable, provider integration, or model-specific code, explain:

- why deterministic app-data logic is not enough
- whether the provider/model is free for this MVP build
- what happens when the provider is unavailable or rate limited

If this cannot be guaranteed, do not install or wire an AI provider. Build the deterministic helper experience instead.

## Must have

- A simple Big Al entry point in the app.
- Restaurant-scoped reads only.
- Grounded helper responses from existing app data.
- Support a small set of reliable MVP queries/actions, such as:
  - find saved Recipes
  - suggest Recipes from saved/cooked/planned data
  - surface recently cooked Recipes
  - answer simple questions from stored Recipe details
- Clear empty states when there is not enough data.
- Warm, practical, slightly witty copy.

## Nice to have

- Suggested prompts.
- Simple recommendation explanations based on saved, cooked or planned Recipes.

## Do not build

- Generic freeform AI chatbot.
- Open-ended internet search.
- Paid AI model or paid API dependency.
- Paid subscription requirement.
- Billing-gated provider setup.
- Unscoped AI meal generation.
- Grocery price comparison.
- Full pantry inventory management.
- Calorie tracking.
- Voice control.
- Followers, likes, public feeds, view counts or influencer mechanics.

## Implementation guidance

Prefer deterministic, app-data based helper behaviour first. If an AI call is not already configured safely in the project, do not introduce a complex provider integration without clearly explaining why.

M8 should prove the interaction model and data grounding. It does not need to be clever.

## After implementation, run

```bash
pnpm lint
pnpm tsc --noEmit
pnpm exec next build --webpack
```

## Update

- docs/CURRENT_STATUS.md
- docs/CHANGELOG.md
- docs/milestones/README.md
- docs/milestones/MILESTONE_8.md
- relevant product docs if needed

## Before claiming completion, provide

- git branch
- commit SHA if committed
- git status --short
- exact changed files
- migration filename if any
- command results
- manual test checklist
- confirmation that no paid AI provider, paid API key, paid model, billing setup, or paid subscription is required

Do not move beyond M8 without explicit approval.