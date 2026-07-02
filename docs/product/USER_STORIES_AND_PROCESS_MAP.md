# User Stories & Process Map — Full Build

## Purpose

This document explains how users are meant to move through Big Al across the full product vision.

It is intentionally broader than the current MVP. Use it to understand the intended user journeys, then refine milestone-by-milestone as the product is tested.

## Product mission

Make cooking easy and enjoyable.

Every journey should help a Restaurant move more easily through:

```text
Discover → Save → Organise → Plan → Shop → Cook → Improve → Return
```

## Core product language

- Big Al is a living cookbook.
- A Restaurant is the shared cooking space.
- Recipes belong to Chefs.
- Users save recipes into their Restaurant.
- Adaptations preserve the original recipe and attribution.
- Community rewards cooking behaviour, not popularity.

## Primary navigation model

| Area | User meaning | Product role |
| --- | --- | --- |
| Kitchen | What matters now | Home, prompts, next meal, helpful reminders |
| Cookbook | What we know how to cook | Saved recipes, books, search, attribution |
| Specials | What we might cook next | Discovery without influencer mechanics |
| Menu | What we plan to eat | Weekly planning, meal scheduling |
| Pantry | What we need to buy | Shopping support, not full inventory |

## Key user types

### Restaurant Owner

Usually the person who creates the Restaurant and manages the shared cooking space.

Needs:

- create and manage the Restaurant
- save and organise recipes
- invite or manage members eventually
- plan meals
- keep the Cookbook useful

### Restaurant Member

Someone who cooks, plans or eats from the shared Restaurant.

Needs:

- find recipes
- suggest meals
- help plan the Menu
- use Pantry and Cook Mode
- avoid admin

### Chef / Recipe Creator

The original source or creator of a recipe.

Needs:

- attribution preserved
- original recipe not overwritten by adaptations
- community improvements to remain connected to the original

### Founder / Admin

Used during early UAT, private beta and product validation.

Needs:

- understand bugs and blockers
- validate the core loop
- preserve scope discipline
- decide when to expand beta or launch

## Full-build user journeys

# Journey 1 — First-time Restaurant setup

## User goal

I want to set up my Restaurant so my recipes, meal plans and shopping support live in one place.

## Primary user story

As a new user, I want to create or join a Restaurant, so that my cooking activity is organised around the people I cook with.

## Intended flow

1. User lands on Big Al.
2. User signs up or signs in.
3. User creates a Restaurant or joins an existing one.
4. User sees Kitchen as the practical starting point.
5. User is guided toward the first useful action: save a recipe or plan a meal.

## Must have

- clear explanation of Restaurant
- simple sign-up/sign-in
- one obvious next action
- no social or admin-heavy setup

## Nice to have

- friendly Restaurant naming prompt
- starter preferences
- small welcome card

## Future phase

- invitations
- member roles
- shared preferences
- onboarding tasks

## Acceptance criteria

- User understands that a Restaurant is their shared cooking space.
- User reaches Kitchen after setup.
- User knows what to do next.

## Edge cases

- user already belongs to a Restaurant
- user has no Restaurant
- invitation expired
- duplicate Restaurant name
- user leaves before setup complete

# Journey 2 — Save a recipe manually

## User goal

I want to save a recipe so I can find it and cook it later.

## Primary user story

As a Restaurant member, I want to add a recipe to my Cookbook, so that it becomes part of my living cookbook.

## Intended flow

1. User opens Cookbook.
2. User chooses Add Recipe.
3. User enters title, ingredients, method, source and optional notes.
4. User saves the recipe.
5. Recipe appears in the Restaurant Cookbook.
6. User can open, edit, plan or cook it.

## Must have

- title
- ingredients
- method
- save action
- Restaurant-scoped storage

## Nice to have

- prep/cook time
- servings
- recipe book assignment
- attribution/source fields

## Future phase

- image upload
- voice dictation
- structured ingredient parsing
- recipe quality prompts

## Acceptance criteria

- User can save a usable recipe without needing technical knowledge.
- Saved recipe is easy to find again.
- Missing optional fields do not block saving.

## Edge cases

- ingredients missing
- method missing
- duplicate title
- user navigates away mid-entry
- save fails

# Journey 3 — Import a recipe from a URL

## User goal

I want to paste a recipe link and let Big Al pull out the useful cooking details.

## Primary user story

As a Restaurant member, I want to import a recipe from a URL, so that I do not have to manually copy recipe text.

## Intended flow

1. User opens Cookbook or Kitchen prompt.
2. User chooses Import Recipe.
3. User pastes a recipe URL.
4. Big Al attempts extraction.
5. User lands in review.
6. User checks title, ingredients, method, source and attribution.
7. User saves the recipe.
8. Recipe appears in the Cookbook with source preserved.

## Must have

- URL validation
- extraction attempt
- review before save
- source URL preserved
- creator/source attribution visible
- duplicate warning for exact source URL

## Nice to have

- partial extraction state
- fallback review state
- source site naming
- confidence copy

## Future phase

- AI cleanup
- web attribution search
- richer duplicate matching
- screenshot/social import
- licensing support

## Acceptance criteria

- User can import a normal recipe URL.
- User can review before saving.
- Accidental duplicate imports are prevented.
- Weak imports fail gracefully.

## Edge cases

- blocked website
- no recipe schema
- partial ingredients
- no method
- same URL already saved
- same recipe from different URL
- source creator unknown

# Journey 4 — Organise recipes in Cookbook

## User goal

I want my saved recipes to stay findable and useful.

## Primary user story

As a Restaurant member, I want to browse, search and organise saved recipes, so that the Cookbook becomes more useful over time.

## Intended flow

1. User opens Cookbook.
2. User browses saved recipes or searches.
3. User opens a recipe.
4. User can add it to a Recipe Book, edit it, plan it or cook it.
5. User can archive recipes that are no longer useful.

## Must have

- recipe list
- search
- recipe detail
- edit/archive
- recipe books

## Nice to have

- filters
- recently cooked
- cook-again signals
- empty state prompts

## Future phase

- smart collections
- preference-aware sorting
- seasonal collections
- imported/source collections

## Acceptance criteria

- User can find a saved recipe quickly.
- Recipe detail is readable.
- Organisation helps without creating admin.

## Edge cases

- no saved recipes
- many saved recipes
- duplicate recipes
- archived recipe
- missing attribution

# Journey 5 — Discover recipes in Specials

## User goal

I want ideas for what to cook without scrolling through influencer content.

## Primary user story

As a Restaurant member, I want to discover useful recipes based on cooking behaviour, so that I can decide what to cook next.

## Intended flow

1. User opens Specials.
2. User sees recipe-centric discovery sections.
3. User opens a recipe or suggestion.
4. User saves, plans or cooks it.

## Specials sections

- Tasting Platter
- Hidden Gems
- Most Planned This Week
- New Adaptations
- Big Al Recommends
- Sausage Approved

## Must have

- discovery remains recipe-centric
- no followers, likes or view counts
- recipes can be saved/planned

## Nice to have

- behaviour-based recommendations
- seasonal picks
- Restaurant-aware prompts

## Future phase

- community recipe improvements
- adaptation discovery
- restaurants using signals
- cook-again rate

## Acceptance criteria

- User finds recipes without social pressure.
- Discovery supports cooking decisions.
- Popularity mechanics do not dominate.

## Edge cases

- no enough data
- recipe already saved
- unsuitable preference match
- community content needs moderation

# Journey 6 — Plan meals in Menu

## User goal

I want to decide what we are eating this week.

## Primary user story

As a Restaurant member, I want to add saved recipes to a Menu, so that meals are planned before shopping and cooking.

## Intended flow

1. User opens Menu.
2. User selects a day/date.
3. User adds a recipe from the Cookbook.
4. User adjusts meal details if needed.
5. Menu shows planned meals clearly.
6. Planned meals feed Pantry and Kitchen.

## Must have

- add recipe to date
- view weekly plan
- edit/remove planned meals
- meal date preserved

## Nice to have

- servings/people eating
- meal type
- leftovers note
- planning prompts

## Future phase

- drag/drop week planning
- preference-aware suggestions
- repeat meal patterns
- avoid recently cooked prompts

## Acceptance criteria

- User can plan a real week of meals.
- Planned meals are easy to understand.
- Menu drives shopping support.

## Edge cases

- empty Menu
- same recipe multiple days
- meal moved to another date
- people eating changes
- archived recipe on Menu

# Journey 7 — Generate shopping support in Pantry

## User goal

I want a practical list of what to buy for the meals we planned.

## Primary user story

As a Restaurant member, I want Pantry to turn planned meals into a shopping list, so that I can shop without manually rewriting recipe ingredients.

## Intended flow

1. User plans meals in Menu.
2. User opens Pantry.
3. User generates or refreshes shopping support.
4. Big Al groups and cleans ingredients where safe.
5. User sees what to buy, what meal it is for and when it is needed.
6. User checks off items while shopping.

## Must have

- generated shopping list from planned meals
- obvious basics excluded where appropriate
- ingredient cleanup
- useful categories
- meal/date context
- checked/unchecked state

## Nice to have

- buy-closer guidance for fresh items
- UK-friendly naming
- shop-now vs buy-later grouping

## Future phase

- pantry stock awareness
- pack-size support
- barcode scanning
- retailer integrations
- price comparison only if explicitly approved much later

## Acceptance criteria

- User can shop from the list without constantly translating recipe text.
- Garlic/onion-style duplicates are not messy.
- Spices appear as buyable items.
- Fresh later-week items are easy to spot.

## Edge cases

- water/salt/pepper
- spices measured in teaspoons
- duplicate garlic formats
- same ingredient with incompatible units
- manual items mixed with generated items
- generated items refreshed

# Journey 8 — Cook a recipe in Cook Mode

## User goal

I want to cook from Big Al without fighting the screen.

## Primary user story

As a Restaurant member, I want Cook Mode to show ingredients and steps clearly, so that I can cook successfully.

## Intended flow

1. User opens a saved recipe.
2. User starts Cook Mode.
3. User reads ingredients and steps clearly.
4. User moves through the method.
5. User marks the recipe cooked.
6. Big Al updates cooking history/signals.

## Must have

- readable ingredients
- readable method
- mobile-friendly layout
- mark-cooked action
- calm fallback states

## Nice to have

- step progress memory
- next-time notes
- keep-screen-awake guidance

## Future phase

- timers
- voice control
- guided cooking assistant
- equipment-aware adaptations

## Acceptance criteria

- User can cook one full recipe without returning to the original source.
- Cook Mode is readable from a kitchen distance.
- Mark-cooked creates useful future signals.

## Edge cases

- no method steps
- no ingredients
- very long steps
- imported plain-text ingredients
- mark-cooked fails
- user exits mid-cook

# Journey 9 — Adapt a recipe

## User goal

I want to make a version of a recipe that fits my Restaurant without losing the original.

## Primary user story

As a Restaurant member, I want to adapt a recipe, so that I can preserve the original while saving my own changes.

## Intended flow

1. User opens a saved recipe.
2. User chooses Adapt.
3. Big Al creates a linked adaptation.
4. User edits ingredients/method/notes.
5. Original recipe attribution remains intact.
6. Adaptation appears in the Restaurant Cookbook.

## Must have

- original recipe remains unchanged
- adaptation is linked to source recipe
- attribution preserved
- adaptation can be cooked/planned

## Nice to have

- adaptation notes
- changed-fields summary
- community improvement prompts

## Future phase

- public/community adaptations
- New Adaptations discovery
- cook-again comparison
- adaptation quality signals

## Acceptance criteria

- User can make changes without overwriting the original.
- Attribution remains visible.
- Adaptation behaves like a recipe in the Restaurant.

## Edge cases

- adaptation of adaptation
- original archived
- source missing
- conflicting edits
- duplicate adaptation

# Journey 10 — Set Restaurant preferences

## User goal

I want Big Al to understand how my Restaurant cooks.

## Primary user story

As a Restaurant member, I want to set cooking preferences, so that Big Al can make recipes easier to follow in my kitchen.

## Intended flow

1. User opens Restaurant preferences.
2. User sets practical cooking preferences.
3. Preferences are saved to the Restaurant.
4. Recipes and Cook Mode can show helpful guidance.

## Preference examples

- metric/imperial preference
- grams over pounds
- fan-assisted oven
- air fryer preference
- induction hob
- number of hobs
- equipment limits
- dietary preferences if explicitly added later

## Must have

- preferences are Restaurant-scoped
- preferences save and persist
- guidance is helpful but not intrusive

## Nice to have

- lightweight recipe guidance
- unit preference display
- equipment notes

## Future phase

- automatic unit conversion
- oven/air-fryer adjustment
- equipment-aware recipe adaptation
- preference-aware recommendations

## Acceptance criteria

- User can save preferences.
- Preferences are visible or reflected where useful.
- Big Al does not overcomplicate cooking.

## Edge cases

- no preferences set
- conflicting preferences
- member changes preferences
- recipe cannot safely adapt

# Journey 11 — Use Big Al helper behaviour

## User goal

I want Big Al to help me decide what to cook without becoming a generic chatbot.

## Primary user story

As a Restaurant member, I want Big Al to suggest useful recipe actions based on my Restaurant, so that I can cook more easily.

## Intended flow

1. User opens Kitchen or Specials.
2. Big Al surfaces helpful cards or suggestions.
3. User can open, save, plan or cook a recipe.
4. Suggestions are grounded in Restaurant data and product rules.

## Must have

- grounded in saved/planned/cooked recipe data
- recipe-centric actions
- no generic chatbot positioning
- no paid AI unless explicitly approved

## Nice to have

- helpful cards
- cook-again prompts
- planned meal reminders
- hidden gem prompts

## Future phase

- carefully scoped AI assistant
- preference-aware meal suggestions
- cooking confidence prompts

## Acceptance criteria

- Big Al helps the user choose a cooking action.
- It does not feel like search only.
- It does not become generic AI chat.

## Edge cases

- little/no data
- irrelevant suggestions
- unsafe food advice
- user asks non-cooking question

# Journey 12 — Private beta tester journey

## User goal

I want to try Big Al and understand what feedback is useful.

## Primary user story

As a private beta tester, I want clear tasks and expectations, so that I can test Big Al without founder explanation.

## Intended flow

1. Tester receives invitation and simple instructions.
2. Tester creates/joins a Restaurant.
3. Tester imports or saves a recipe.
4. Tester plans a meal.
5. Tester generates Pantry support.
6. Tester cooks or reviews Cook Mode.
7. Tester submits feedback.

## Must have

- clear beta status
- clear task list
- feedback route
- known limitations
- blocker triage

## Nice to have

- short welcome copy
- tester survey
- feedback categories

## Future phase

- structured beta programme
- tester cohorts
- product analytics

## Acceptance criteria

- Tester can attempt the core loop without founder explanation.
- Feedback is captured in a structured way.
- Bugs and confusion points are separated.

## Edge cases

- tester gets stuck at sign-up
- tester misunderstands Restaurant
- tester expects social features
- tester asks for grocery pricing
- tester abandons before Cook Mode

# Cross-journey acceptance principles

Every journey should satisfy these principles:

- Food is the hero.
- The next action is obvious.
- The user is not forced into admin.
- The product preserves attribution.
- Restaurant data is scoped and safe.
- The app avoids influencer/social mechanics.
- Cooking is easier after using Big Al.

# MVP vs future guidance

When refining this document:

- Mark MVP journeys that must work now.
- Mark Phase 3 hardening journeys that need validation.
- Mark future phase journeys that should not be built yet.
- Do not treat this full-build map as permission to build everything.

# Current active journey for Phase 3

The active journey is:

```text
Import → Save → Plan → Shop → Cook
```

Until this loop is founder-approved and beta-ready, do not prioritise broader future journeys.
