# M11 — Codex Implementation Prompt

You are working on Big Al.

We are starting M11: Automatic URL Recipe Import.

Before changing code, pull latest changes and inspect the current branch.

Run:

```bash
git pull
git status --short
git log --oneline -5
```

Read the M11 spec:

```bash
cat docs/milestones/11-automatic-url-recipe-import.md
```

Read the current design baseline docs:

```bash
cat docs/design/02-visual-system-handoff.md
cat docs/design/04-bottom-nav-option-5-icons.md
```

## Mission

Implement M11: user pastes a recipe URL, Big Al automatically extracts recipe details, user reviews, edits and saves.

The experience must be slick.

The user should not have to spend time formatting text or completing admin. The app should do the heavy lifting.

Core flow:

```text
Paste URL → Big Al extracts → review pre-filled recipe → save to Cookbook
```

## Important product rules

Do not build a generic manual admin form.

Do not make the user copy ingredients/method from the website manually when structured data is available.

Do not use AI for M11.

Do not add social/community features.

Do not add grocery, nutrition, image OCR, web search, browser extension, or recipe adaptation.

## Scope

In scope:

- improve import URL flow
- server-side recipe page fetch
- JSON-LD Schema.org Recipe extraction
- pre-filled review page
- editable review fields
- save reviewed recipe
- preserve source URL
- preserve creator/source where available
- graceful fallback when extraction fails
- M10 visual baseline styling

Out of scope:

- AI extraction
- AI rewrite/cleanup
- web lookup
- plagiarism checks
- social media import
- OCR
- scraping multiple pages
- paywall bypassing
- grocery parsing
- nutrition parsing

## First inspect

Inspect current files and schema before editing:

```bash
find src/app -path '*imports*' -type f -maxdepth 8 -print
find src -iname '*import*' -o -iname '*recipe*'
cat package.json
```

Then inspect relevant files, likely:

```text
src/app/(app)/cookbook/imports/new/page.tsx
src/app/(app)/cookbook/imports/[importId]/review/page.tsx
src/app/(app)/cookbook/page.tsx
src/app/(app)/cookbook/recipes/[recipeId]/page.tsx
src/components/recipe-form.tsx
src/components/submit-button.tsx
src/app/globals.css
```

Also inspect existing server actions, database helpers, Supabase types/schema and any Recipe Import model before changing behaviour.

## Extraction requirements

Implement a practical server-side extractor.

The extractor should:

1. validate URL
2. fetch HTML
3. parse HTML
4. find `script[type="application/ld+json"]`
5. parse JSON-LD safely
6. find Schema.org `Recipe` object
7. normalise fields
8. save extracted data into the existing Recipe Import parser output or equivalent
9. redirect to review page with fields pre-filled

Extract where available:

- title/name
- description
- ingredients
- method/instructions
- author/creator
- source URL
- source site/domain
- image URL
- prep time
- cook time
- total time
- servings/yield

Handle JSON-LD shapes including:

- single object
- array of objects
- `@graph`
- `@type: "Recipe"`
- `@type: ["Recipe", ...]`
- `recipeInstructions` as strings
- `recipeInstructions` as HowToStep objects
- `recipeInstructions` as HowToSection objects with `itemListElement`

Normalise ingredients and method into plain string arrays.

Do not over-process quantities/units in M11.

## Review page requirements

The review page should be mostly pre-filled after successful extraction.

It must show:

- source URL
- source site/domain
- creator/source if found
- extraction status
- open source link
- title field
- description field
- creator/source field
- ingredients textarea, one ingredient per line
- method textarea, one step per line
- servings if supported
- prep/cook/total time if supported
- save button

Use warm Big Al copy.

Suggested page title:

```text
Review recipe
```

Suggested intro:

```text
Big Al has filled in what it found. Give it a quick check before saving it to your Cookbook.
```

If extraction failed:

```text
Big Al could not read this one automatically. The link is saved, and you can still add the recipe details below.
```

## Import page requirements

The import page should make URL import the primary path.

Suggested title:

```text
Import a recipe
```

Suggested intro:

```text
Paste a recipe link. Big Al will try to pull out the title, ingredients and method so you only have to check it.
```

Primary button:

```text
Fetch recipe
```

Keep pasted recipe text as a fallback only if it already exists. It should not feel like the main path.

## Validation

Import validation:

- URL or fallback text required
- invalid URL shows friendly error
- failed fetch does not crash
- failed extraction still creates useful review/fallback state if possible

Save validation:

- title required
- at least one ingredient required
- at least one method step required

Friendly error copy only. No technical parser errors shown to user.

## Data rules

Use existing schema where possible.

Do not add migrations unless required.

If a database/schema change is required, stop and report why before making it.

Preserve:

- Restaurant ownership
- source URL
- creator/source attribution
- extracted ingredients
- extracted method order

If existing Recipe Import has parser output JSON, use it.

If existing Recipe model stores ingredients/method as arrays or related records, adapt the review textareas into that existing structure on save.

## Visual requirements

Use M10 Design Baseline.

Use existing classes where practical:

- `screen-title`
- `section-kicker`
- `visual-card`
- `note-card`
- `input-control`
- `btn-primary`
- `btn-secondary`
- `warm-pill`

The import/review flow should feel:

- fast
- calm
- practical
- trustworthy
- low-admin
- warm

Avoid:

- dense admin styling
- generic white dashboard forms
- tiny helper text
- dark text on purple buttons/chips
- making the user format lots of text manually

## Duplicate URL warning

If simple with existing data, check whether the same source URL already exists for the Restaurant.

Show non-blocking warning:

```text
This link may already be in your Cookbook. Check before saving another copy.
```

Do not build fuzzy duplicate matching.

## Safety and implementation boundaries

Do not change:

- auth behaviour
- route structure unless already required
- database schema unless explicitly necessary
- Supabase config
- migrations without reporting first
- unrelated screens
- bottom nav
- M10 design system

Do not commit.

Do not push.

## Validation

Run:

```bash
pnpm lint
pnpm typecheck
pnpm build
```

If scripts differ, inspect package.json and run the closest equivalents.

## Report back with

1. Files changed.
2. Existing schema/actions discovered.
3. Extraction approach implemented.
4. Fields extracted.
5. Fallback behaviour.
6. Save/review behaviour.
7. Whether any schema changes were needed.
8. Validation results.
9. Confirmation no commit was made.
