# Codex Prompt — Big Al Visual System Implementation

You are working on Big Al.

Repository:
j5hhgr8g4b-create/big_al

Working directory:
/workspaces/big_al

Branch:
clean-milestone-4-sync

Milestone:
M10 — Visual System Implementation

IMPORTANT:
Do not commit anything.
Do not push anything.
Do not mark M10 complete.
Do not update GitHub or Notion.
Do not add feature logic.
Do not change database, auth, Supabase, migrations, or API behaviour.

## Context

Previous M10 attempts failed because the app visually drifted away from the approved mockups.

The approved design target is now provided as a static HTML reference:

`docs/design/01-approved-kitchen-reference.html`

The implementation handoff is provided here:

`docs/design/02-visual-system-handoff.md`

Your job is to implement this visual system across the existing app screens.

Do not creatively reinterpret the design.
Do not invent a new style.
Use the approved reference and handoff as the source of truth.

## Step 1 — Sync and reset rejected work

Run:

```bash
git pull
git status --short
git log --oneline -3
```

The repo now contains the approved design reference and visual handoff under:

```text
docs/design/01-approved-kitchen-reference.html
docs/design/02-visual-system-handoff.md
docs/design/03-codex-implementation-prompt.md
```

If there are uncommitted M10 experiment changes in the working tree, revert them before starting.

Do not revert or delete the `docs/design/` files.

After cleanup, confirm:

```bash
git status --short
```

Do not commit.

## Step 2 — Read the approved design files

Read these files fully before editing app code:

```bash
cat docs/design/02-visual-system-handoff.md
```

Open or inspect:

```text
docs/design/01-approved-kitchen-reference.html
```

This HTML reference is the approved Kitchen visual target.

## Step 3 — Inspect current app structure

Inspect the existing files before editing:

- `src/app/(app)/layout.tsx`
- `src/app/(app)/page.tsx`
- `src/components/bottom-nav.tsx`
- `src/components/submit-button.tsx`
- current app screens under `src/app/(app)/`
- current shared components under `src/components/`
- `src/app/globals.css`

Identify where global layout, page width, bottom nav and shared visual styles currently live.

## Step 4 — Implement global visual foundation

Add the visual tokens from `docs/design/02-visual-system-handoff.md` into `globals.css`.

Required:
- Fresh Herb base palette
- Tomato Red accent
- aubergine purple primary
- cream-paper app background
- handwritten accent font variable
- system UI font variable
- card shadows
- rounded card radii

The app must behave like a mobile app:
- max-width around 430px
- centered on desktop
- full-width on mobile
- bottom nav constrained to app frame
- page content constrained to app frame
- no full-width desktop hero banners

This containment is critical.

## Step 5 — Implement shared components

Update shared visual components where appropriate.

Bottom nav:
- fixed bottom nav
- light cream baseline
- full labels: Kitchen, Cookbook, Specials, Menu, Pantry
- selected tab must use aubergine purple background
- selected text/icon must be cream and readable
- inactive labels should be warm muted text
- labels should feel in-theme with the handwritten direction while staying readable

Buttons:
- primary buttons should be clear, rounded, mobile-optimised
- secondary buttons should be quieter but still button-shaped
- avoid plain-text primary actions

Cards:
- cream surface
- warm borders
- rounded corners
- soft shadows
- tactile mobile feel

Do not make every component handwritten.
Use handwritten styling only for screen titles, short labels and Big Al personality moments.

## Step 6 — Apply across app screens

Apply the approved visual system across all existing app screens without changing feature logic.

Screens to update visually:
- Kitchen
- Cookbook
- Specials
- Menu
- Pantry
- Recipe Detail
- Recipe Books if present
- Cook Mode
- Import / Structure Recipe screens if present
- Settings/account screens if present

Important:
This is a visual pass only.
Preserve existing routes, forms, server actions and data fetching.

## Screen-specific guidance

Kitchen:
Match `docs/design/01-approved-kitchen-reference.html` as closely as possible.

Must include:
- handwritten “Kitchen” screen title
- Wallaces Bistro-style Restaurant badge where Restaurant name is available, fallback acceptable
- centred intro copy card
- Next Dinner hero card
- “Tonight?” single-line hero title or equivalent if data exists
- Import Recipe as clear primary action
- Browse cookbook as secondary action
- purple selected bottom nav

Cookbook:
- card-led, tactile
- search/filter controls should be cream rounded controls
- recipe cards/rows should use warm surfaces and rounded food thumbnails if available

Specials:
- discovery/tasting-board feel
- avoid generic AI/search page
- use cards, badges, warm section labels

Menu:
- weekly planning cards
- no spreadsheet/admin feel
- days should feel like meal cards

Pantry:
- shopping companion, not inventory system
- grouped list sections
- simple check rows
- clear progress where already available

Recipe Detail:
- food/image hero if available
- clear title hierarchy
- readable ingredients/method
- tactile action buttons
- Big Al note/tip treatment where appropriate

Cook Mode:
- can remain darker and more focused
- improve typography/readability
- large step text
- minimal distractions

## Do not do

Do not:
- add AI features
- add paid subscriptions
- add internet search
- add grocery price comparison
- add calorie tracking
- add social mechanics
- add followers, likes, views
- alter database schema
- alter Supabase
- alter auth
- add migrations
- change business logic
- create unrelated docs
- claim milestone complete

## Validation

Run:

```bash
pnpm lint
pnpm typecheck
pnpm build
```

If scripts differ, inspect `package.json` and run equivalent checks.

## Required final report

Report back with:

1. Whether rejected work was reverted first.
2. `git status --short` after cleanup.
3. Files changed.
4. Screens updated.
5. Summary of global visual tokens added.
6. Summary of bottom nav changes.
7. Summary of Kitchen match to approved reference.
8. Validation results.
9. Confirmation no commit was made.
10. Screenshots requested:
   - Kitchen full screen
   - Cookbook top
   - Specials top
   - Menu top
   - Pantry top
   - Recipe Detail top
   - Cook Mode if available
   - Bottom nav close-up

Final reminder:
Do not commit.
Do not push.
Do not mark complete.
Do not update GitHub or Notion.
