# M11 — Automatic URL Recipe Import

## Status

Draft for Codex implementation.

## Purpose

Make recipe importing feel slick.

A user should be able to paste a recipe URL and have Big Al automatically extract the useful recipe information, then let the user review and submit it.

The user should not have to spend time formatting text, copying ingredients line by line, or completing admin-heavy forms.

## Product goal

A user pastes a recipe URL. Big Al fetches the page, extracts the recipe, pre-fills a review screen, and lets the user save a clean Recipe into their Restaurant’s Cookbook.

## User story

As a Restaurant member, I want to paste a recipe link and have Big Al fill in the title, description, ingredients and method automatically, so I can quickly review and save the recipe without doing boring formatting work.

## Product principle

M11 should feel like:

**Paste link → Big Al fills it in → quick review → save**

It should not feel like:

**Paste link → manually copy everything → format ingredients → format method → complete admin fields**

## Why this matters

Big Al’s mission is:

**Make cooking easy and enjoyable.**

Recipe import is one of the most important moments in the product. If this feels slow or admin-heavy, Big Al fails its core promise.

## Scope

### In scope

- Paste recipe URL.
- Fetch recipe page server-side.
- Extract structured recipe data automatically.
- Pre-fill review page.
- User can edit extracted fields.
- User submits reviewed recipe.
- Save Recipe into the current Restaurant’s Cookbook.
- Preserve original source URL.
- Preserve creator/source attribution where available.
- Graceful fallback when extraction fails.
- Visual alignment with M10 Design Baseline.

### Out of scope

- Full AI recipe extraction.
- AI rewriting.
- AI source research.
- Plagiarism checks.
- Social media import.
- OCR.
- Browser extension.
- Grocery list generation.
- Nutrition extraction.
- Public/community publishing.
- Recipe adaptation/conversion.

## Required user experience

### Happy path

1. User opens Cookbook.
2. User taps Import recipe.
3. User sees a simple import screen.
4. User pastes recipe URL.
5. User taps **Fetch recipe** or **Review recipe**.
6. Big Al fetches the page.
7. Big Al extracts recipe information.
8. User lands on review screen with fields already filled.
9. User quickly checks the recipe.
10. User edits anything that looks wrong.
11. User taps **Save to Cookbook**.
12. Big Al creates the Recipe.
13. User lands on the saved Recipe detail page.

## Import page

### UX goal

The import page should be extremely simple.

The user should feel they only need to paste a link.

### Required fields

- Recipe URL input.

### Optional fallback field

- Pasted recipe text textarea.

This should be secondary, not the main experience.

### Suggested page title

**Import a recipe**

### Suggested intro copy

**Paste a recipe link. Big Al will try to pull out the title, ingredients and method so you only have to check it.**

### Suggested helper copy

**Works best with normal recipe pages. If Big Al cannot read the page, you can still paste the recipe text manually.**

### Primary button

**Fetch recipe**

Alternative acceptable button:

**Review recipe**

### Empty validation

If user submits with no URL and no pasted text:

**Paste a recipe link first.**

### Invalid URL validation

**That link does not look quite right. Check it and try again.**

## Extraction behaviour

### Primary extraction method

Use structured recipe data first.

Many recipe sites include Schema.org Recipe data in JSON-LD.

Big Al should attempt to extract recipe data from:

- `script[type="application/ld+json"]`
- Schema.org `Recipe`
- JSON-LD graphs containing `@type: "Recipe"`

### Extract these fields where available

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

### JSON-LD fields to inspect

Common fields:

```text
name
description
recipeIngredient
recipeInstructions
author
image
prepTime
cookTime
totalTime
recipeYield
yield
```

### Instruction parsing

`recipeInstructions` may appear as:

- plain strings
- array of strings
- array of HowToStep objects
- HowToSection objects containing itemListElement
- nested arrays/objects

Codex should normalise instructions into an ordered list of plain text method steps.

### Ingredient parsing

`recipeIngredient` is usually an array of strings.

Codex should preserve ingredient strings without over-processing them.

Do not force users to split quantities, units and item names in M11.

### Author parsing

`author` may be:

- string
- object with `name`
- array of objects

Extract the best readable creator/source name.

If author is unavailable, use the website/domain as fallback source label where practical.

## Fallback behaviour

If automatic extraction fails:

- do not crash
- preserve the source URL
- show the review page with empty editable fields
- explain what happened clearly
- allow user to paste recipe text manually

Suggested copy:

**Big Al could not read this one automatically. The link is saved, and you can still add the recipe details below.**

This should feel like a graceful fallback, not a failure screen.

## Review page

### UX goal

The review page should feel like a quick check, not a blank admin form.

The majority of fields should already be filled when extraction succeeds.

### Page title

**Review recipe**

### Suggested intro copy

**Big Al has filled in what it found. Give it a quick check before saving it to your Cookbook.**

### Required sections

1. Source summary
2. Extracted recipe fields
3. Save action

## Source summary section

Show a compact source card.

Must show:

- source URL
- source site/domain
- creator/source name if found
- extraction status

Suggested statuses:

- **Recipe found**
- **Needs a quick check**
- **Could not read automatically**

Include link/button:

**Open source**

## Review form fields

Fields should be pre-filled from extraction where possible.

### Required before saving

- title
- at least one ingredient
- at least one method step

### Editable fields

- title
- description/summary
- creator/source
- ingredients
- method
- servings
- prep time
- cook time
- source URL

### Field design principle

Do not make the user do structured data entry for every ingredient or step.

For M11, ingredients and method can be editable multi-line textareas if the existing recipe save flow can convert lines into arrays/steps.

Preferred behaviour:

- ingredients textarea shows one ingredient per line
- method textarea shows one step per line
- on save, split non-empty lines into the structure expected by the Recipe model

## Ingredients UX

Label:

**Ingredients**

Helper:

**Big Al has kept these as found. Edit any odd bits before saving.**

Textarea should be pre-filled with one ingredient per line.

## Method UX

Label:

**Method**

Helper:

**One step per line. Big Al will keep the order.**

Textarea should be pre-filled with one method step per line.

## Save behaviour

When user taps **Save to Cookbook**:

- validate required fields
- create Recipe in current Restaurant
- preserve source URL
- preserve creator/source name
- save title
- save description
- save ingredients
- save method steps
- save times/servings if supported
- redirect to Recipe detail page

If existing schema has a Recipe Import status, mark import as reviewed/converted.

If not, do not add unnecessary schema unless needed.

## Duplicate URL warning

If practical with existing data:

- check whether a recipe/import already exists with the same source URL for this Restaurant
- show non-blocking warning

Suggested copy:

**This link may already be in your Cookbook. Check before saving another copy.**

Do not block saving.

Do not build fuzzy matching in M11.

## Error handling

### Fetch failure

If the URL cannot be fetched:

**Big Al could not reach that page. Check the link or paste the recipe text instead.**

### No structured recipe found

**Big Al could not find a structured recipe on this page. You can still add the details manually.**

### Save validation: no title

**Give the recipe a name before saving it.**

### Save validation: no ingredients

**Add at least one ingredient before saving.**

### Save validation: no method

**Add at least one method step before saving.**

### Save failure

**Big Al could not save this recipe. Nothing has been lost — check the fields and try again.**

## Technical guidance

### Extraction strategy

Implement a practical server-side extractor.

Suggested approach:

1. Validate URL.
2. Fetch page HTML server-side.
3. Parse HTML.
4. Find JSON-LD script tags.
5. Parse JSON safely.
6. Find Recipe object.
7. Normalise fields.
8. Save extracted result into Recipe Import parser output or equivalent existing field.
9. Redirect to review screen.
10. Pre-fill review form from extracted output.

### Do not use AI in M11

M11 should work without AI cost or model dependency.

AI cleanup can come later.

### Do not scrape aggressively

This is MVP extraction from a user-provided URL.

Do not crawl other pages.

Do not perform web search.

Do not bypass paywalls.

Do not add complex anti-bot workarounds.

### Data storage

Use existing database fields where possible.

Likely approach:

- Recipe Import stores:
  - source URL
  - raw text if provided
  - parser output JSON
  - status if supported
- Review page reads parser output
- Save action creates Recipe

Do not change database schema unless the existing model cannot preserve required information.

If schema change is required, Codex must report it before implementation.

## Parser output shape

Use a simple internal shape like:

```ts
type ExtractedRecipe = {
  title?: string;
  description?: string;
  ingredients: string[];
  method: string[];
  creator?: string;
  sourceUrl: string;
  sourceSite?: string;
  imageUrl?: string;
  servings?: string;
  prepTime?: string;
  cookTime?: string;
  totalTime?: string;
  extractionStatus: "success" | "partial" | "failed";
  extractionNotes?: string[];
};
```

This does not have to be the exact production type if the project already has one, but the implementation should preserve these concepts.

## Visual requirements

Use the M10 Design Baseline.

Use existing shared classes where practical:

- `screen-title`
- `section-kicker`
- `visual-card`
- `note-card`
- `input-control`
- `btn-primary`
- `btn-secondary`
- `warm-pill`

The flow should feel:

- quick
- calm
- trustworthy
- low-admin
- warm
- practical

Avoid:

- dense admin forms
- blank manual-entry screens after successful extraction
- generic SaaS styling
- too many required metadata fields
- AI-heavy wording
- technical parser language in the UI

## Accessibility requirements

- all inputs have labels
- errors are readable
- buttons have clear names
- source link opens safely
- text contrast follows Design Baseline
- active chips/buttons must not use dark text on aubergine
- mobile layout must not be hidden behind bottom nav

## Likely files to inspect

Codex must inspect before editing:

```text
src/app/(app)/cookbook/imports/new/page.tsx
src/app/(app)/cookbook/imports/[importId]/review/page.tsx
src/app/(app)/cookbook/page.tsx
src/app/(app)/cookbook/recipes/[recipeId]/page.tsx
src/components/recipe-form.tsx
src/components/submit-button.tsx
src/app/globals.css
```

Also inspect:

```text
src/lib
src/app/actions
src/**/*.ts
supabase schema/types
package.json
```

Only change the files needed.

## Acceptance criteria

### Import

- User can paste a valid recipe URL.
- App fetches the URL server-side.
- App attempts JSON-LD Recipe extraction.
- App creates or updates a Recipe Import record.
- User is taken to review page.
- If extraction succeeds, title is pre-filled.
- If extraction succeeds, ingredients are pre-filled.
- If extraction succeeds, method is pre-filled.
- Source URL is preserved.
- Creator/source is pre-filled if available.
- If extraction fails, user still reaches a useful review/manual fallback screen.

### Review

- User can review extracted fields.
- User can edit title.
- User can edit description.
- User can edit creator/source.
- User can edit ingredients as lines.
- User can edit method as lines.
- User can save reviewed recipe.
- Saved Recipe belongs to current Restaurant.
- Saved Recipe preserves source URL.
- Saved Recipe preserves creator/source where provided.
- User is redirected to Recipe detail page.

### Validation

- Empty URL import is blocked unless pasted text fallback is present.
- Invalid URL shows friendly error.
- Save without title is blocked.
- Save without ingredients is blocked.
- Save without method is blocked.
- Failed fetch does not crash.
- Failed extraction does not crash.
- Lint passes.
- Typecheck passes.
- Build passes.

## Definition of done

M11 is done when a user can paste a normal recipe URL, Big Al automatically extracts the main recipe details, the user can quickly review and edit them, and saving creates a usable Recipe with source attribution preserved.

Validation must pass:

```bash
pnpm lint
pnpm typecheck
pnpm build
```

No commit should be made until founder review of the running flow.
