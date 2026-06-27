# Milestone 9 — MVP Hardening and Design Alignment Codex Prompt

Begin Milestone 9 — MVP Hardening and Design Alignment.

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
- docs/milestones/MILESTONE_8.md
- docs/milestones/MILESTONE_9.md
- docs/product/APP_SCREENS.md
- docs/product/PRODUCT_SPEC.md
- docs/product/DATABASE_SCHEMA.md
- GitHub issue #8 — M9 MVP hardening and design alignment

## Current state

The feature spine exists through M8:

Kitchen → Cookbook → Recipe Detail → Menu → Pantry → Cook Mode → Specials / Basic Big Al

M8 Basic Big Al works but feels mostly like search. Future expansion beyond search is tracked separately and should not be solved in M9.

## M9 objective

Bring the working MVP closer to the agreed Big Al mockups while preserving all existing functionality.

M9 is a hardening and design alignment pass, not a new-feature milestone.

## Target design direction

The agreed mockups show a warm, practical, food-led cookbook experience:

- cream/paper background
- deep plum navigation and primary actions
- warm green accents
- rounded cards
- large food imagery as the hero
- friendly handwritten-style headings where practical
- illustrated Big Al / Sausage Approved character moments where practical
- calm, practical copy

## Must have

- Audit current screens against the mockup direction.
- Identify the biggest design gaps by screen.
- Introduce or refine shared design tokens for colours, spacing, cards, buttons, typography and bottom navigation.
- Improve high-traffic MVP screens first:
  - Kitchen
  - Cookbook
  - Recipe Detail
  - Menu
  - Pantry
  - Cook Mode
  - Specials / Basic Big Al
- Preserve all current functionality.
- Keep food as the hero.
- Keep screens readable and accessible.
- Keep the app mobile-first and kitchen-friendly.

## Nice to have

- Warm Big Al empty states.
- Lightweight Sausage Approved badges where already practical.
- More consistent card styling and section headers.
- Improved bottom navigation styling.

## Do not build

- New product features.
- Paid AI.
- Generic chatbot behaviour.
- Internet search.
- Grocery price comparison.
- Full pantry inventory.
- Calorie tracking.
- Followers, likes, public feeds, view counts or influencer mechanics.
- A full redesign that breaks working flows.
- M8 future expansion beyond search.

## Implementation guidance

Start with shared styling primitives and tokens, then apply them to the app spine.

Avoid one-off styling per page where a reusable pattern is better.

Do not chase pixel-perfect mockup reproduction. Aim for recognisable brand alignment and consistency.

Food should remain the hero. Visual decoration should support the recipe, not compete with it.

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
- docs/milestones/MILESTONE_9.md
- docs/product/APP_SCREENS.md if needed
- docs/product/PRODUCT_SPEC.md if needed

## Before claiming completion, provide

- git branch
- git status --short
- exact changed files
- migration filename if any
- command results
- manual test checklist

Manual test checklist should include:

- Kitchen loads and looks closer to Big Al direction.
- Cookbook loads and remains usable.
- Recipe Detail loads and still links to Cook Mode/Menu/Pantry where applicable.
- Menu works.
- Pantry works.
- Cook Mode remains readable and functional.
- Specials / Basic Big Al still works.
- Bottom navigation still works.
- No new paid AI, social, calorie, price comparison or full pantry inventory features were added.

Do not commit.
Do not move beyond M9 without explicit approval.