# Milestone 9 — MVP Hardening and Design Alignment

Status: Not started

## Objective

Bring the working MVP closer to the agreed Big Al experience while protecting the completed feature spine.

M9 should improve stability, usability, visual consistency and alignment with the agreed mockups. This is not a new-feature milestone.

## Founder concern

The current app does not look enough like the agreed mockups.

The target direction is warm, practical, food-led and cookbook-like:

- cream/paper background
- deep plum navigation and primary actions
- warm green accents
- rounded cards
- large food imagery as the hero
- friendly handwritten-style headings where practical
- illustrated Big Al / Sausage Approved character moments where practical
- calm, practical copy

## Must Have

- Audit the current app against the agreed mockup direction.
- Identify the biggest design gaps by screen.
- Improve shared design tokens for colours, spacing, cards, buttons, typography and bottom navigation.
- Apply the design pass to the highest traffic MVP screens first:
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
- Run lint, typecheck and webpack build.

## Nice to Have

- Warm Big Al empty states.
- Lightweight Sausage Approved badges where already practical.
- Better consistency across cards and section headers.
- Improved mobile cooking usability.

## Do Not Build

- New product features.
- Paid AI.
- Generic chatbot behaviour.
- Internet search.
- Grocery price comparison.
- Full pantry inventory.
- Calorie tracking.
- Followers, likes, public feeds, view counts or influencer mechanics.
- A full redesign that breaks working flows.

## Validation

M9 is successful if the product still works but feels more recognisably Big Al: warm, practical, food-led, simple and closer to the agreed mockups.

## Completion Checks

- `pnpm lint`
- `pnpm tsc --noEmit`
- `pnpm exec next build --webpack`
- Manual smoke test: Kitchen → Cookbook → Recipe Detail → Menu → Pantry → Cook Mode → Specials / Basic Big Al

## Watch Items

- Do not over-polish minor screens before the main app spine feels right.
- Avoid visual flourishes that hurt readability.
- Keep the UI calm enough to cook from.
- Make design systematic rather than one-off per page.