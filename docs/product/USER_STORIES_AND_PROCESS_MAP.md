# User Stories & Process Map — Full Build

## Purpose

This document explains how users are meant to move through Big Al across the full product vision.

It is intentionally broader than the current MVP, but it is not permission to build everything now. Use it to understand the intended journeys, then refine each journey through evidence, UAT and milestone scope.

## Product mission

Make cooking easy and enjoyable.

Every journey should help a Restaurant move more easily through:

```text
Discover → Save → Organise → Plan → Shop → Cook → Improve → Return
```

## Current active loop

Until founder UAT and private beta prove otherwise, the active loop is:

```text
Import → Save → Plan → Shop → Cook
```

All current work should protect and improve that loop.

## Build permission levels

Every journey has a build permission label.

| Permission | Meaning |
| --- | --- |
| Active now | Can be tested/fixed during the current milestone |
| Phase 3 hardening | Can be improved only where it strengthens UAT/beta readiness |
| Future phase | Documented for direction, not buildable now |
| Parked / do not build | Explicitly not buildable without a founder decision |

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

## Journey control framework

Each journey should be assessed with the same control questions:

1. What is the entry condition?
2. What is the expected output?
3. What defects would make the journey fail?
4. What is critical to quality?
5. How do we detect failure?
6. What evidence proves the journey is working?
7. Is this journey buildable now, or future only?

## Cross-journey CTQs

These Critical to Quality measures apply across the product.

| CTQ | Definition | Target for founder UAT / beta |
| --- | --- | --- |
| Core loop completion | User can complete Import → Save → Plan → Shop → Cook | Founder can complete live without intervention |
| Next-action clarity | User knows what to do next | No core screen leaves user stranded |
| Attribution integrity | Source/creator preserved | No imported recipe loses source URL if provided |
| Restaurant data safety | Data scoped to the correct Restaurant | No known cross-Restaurant access or mutation |
| Manual correction burden | User does not have to rewrite app output | Pantry/Shopping requires minimal correction in UAT |
| Duplicate prevention | App prevents accidental clutter | Exact duplicate URL save requires deliberate override |
| Cooking usefulness | App helps the user cook successfully | User can cook from Big Al without returning to original source |

## Global defect definitions

A journey is defective if any of the following happen:

- user cannot complete the intended action
- user reaches a dead end without recovery guidance
- user data is shown to the wrong Restaurant
- recipe attribution is lost
- duplicate recipes are created accidentally
- generated shopping support is harder to use than the original recipe
- Cook Mode cannot be used without the original source
- the app creates admin that does not make cooking easier
- the journey pushes Big Al toward social media, calorie tracking, grocery comparison or generic AI behaviour

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

Used during UAT, private beta and product validation.

Needs:

- understand bugs and blockers
- validate the core loop
- preserve scope discipline
- decide when to expand beta or launch

# Journey 1 — First-time Restaurant setup

## Build permission

Phase 3 hardening.

## User goal

I want to set up my Restaurant so my recipes, meal plans and shopping support live in one place.

## User story

As a new user, I want to create or join a Restaurant, so that my cooking activity is organised around the people I cook with.

## SIPOC

| Supplier | Input | Process | Output | Customer |
| --- | --- | --- | --- | --- |
| New user / invited member | Email, auth state, optional invite | Sign up → create/join Restaurant → land in Kitchen | Active Restaurant context | Restaurant Owner / Member |

## Entry condition

User is signed out or has no active Restaurant context.

## Exit condition

User reaches Kitchen with an active Restaurant and a clear next action.

## Happy path

1. User lands on Big Al.
2. User signs up or signs in.
3. User creates or joins a Restaurant.
4. User lands in Kitchen.
5. User sees one practical next action: import/save a recipe or plan a meal.

## Must have

- clear explanation of Restaurant
- simple sign-up/sign-in
- active Restaurant context
- obvious next action
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

## Defects

- user does not understand what a Restaurant is
- user cannot reach Kitchen
- no active Restaurant is created
- user sees too many competing actions
- user is pushed into social/admin setup before cooking value

## CTQs

- New user reaches Kitchen after setup.
- Restaurant context is created or selected.
- Kitchen shows one obvious next action.
- User can explain Restaurant as their shared cooking space.

## Controls / detection

- Founder UAT sign-up test.
- Empty-account test.
- Existing-account test.
- Copy review for Restaurant explanation.

## Acceptance criteria

- User understands that a Restaurant is their shared cooking space.
- User reaches Kitchen after setup.
- User knows what to do next.
- Missing optional setup does not block cooking value.

## Edge cases

- user already belongs to a Restaurant
- user has no Restaurant
- invitation expired
- duplicate Restaurant name
- user leaves before setup complete

## Evidence required

- Founder UAT checklist row marked Pass.
- Screenshot or note showing first Kitchen next action.

# Journey 2 — Save a recipe manually

## Build permission

Phase 3 hardening.

## User goal

I want to save a recipe so I can find it and cook it later.

## User story

As a Restaurant member, I want to add a recipe to my Cookbook, so that it becomes part of my living cookbook.

## SIPOC

| Supplier | Input | Process | Output | Customer |
| --- | --- | --- | --- | --- |
| Restaurant member | Recipe title, ingredients, method, optional source | Add recipe → validate → save | Saved Restaurant recipe | Restaurant members |

## Entry condition

User has an active Restaurant and opens Add Recipe.

## Exit condition

A saved recipe exists in the Restaurant Cookbook and can be opened.

## Happy path

1. User opens Cookbook.
2. User chooses Add Recipe.
3. User enters title, ingredients, method, source and optional notes.
4. User saves the recipe.
5. Recipe appears in the Restaurant Cookbook.
6. User can open, edit, plan or cook it.

## Must have

- title
- ingredients or method sufficient to make recipe useful
- save action
- Restaurant-scoped storage
- readable saved recipe detail

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

## Defects

- recipe does not save
- saved recipe cannot be found
- saved recipe opens with unreadable ingredients or method
- save failure gives no recovery path
- recipe saves to wrong Restaurant

## CTQs

- Save success for valid manual recipe.
- Saved recipe visible in Cookbook.
- Recipe opens from list.
- User can plan or cook the saved recipe.

## Controls / detection

- Manual UAT save test.
- Missing-field test.
- Save failure fallback review.
- Restaurant-scoping test.

## Acceptance criteria

- User can save a usable recipe without technical knowledge.
- Saved recipe is easy to find again.
- Missing optional fields do not block saving.
- Save failures are understandable.

## Edge cases

- ingredients missing
- method missing
- duplicate title
- user navigates away mid-entry
- save fails

## Evidence required

- UAT note with saved recipe title.
- Confirmation saved recipe opens and can be planned/cooked.

# Journey 3 — Import a recipe from a URL

## Build permission

Active now / Phase 3 hardening.

## User goal

I want to paste a recipe link and let Big Al pull out the useful cooking details.

## User story

As a Restaurant member, I want to import a recipe from a URL, so that I do not have to manually copy recipe text.

## SIPOC

| Supplier | Input | Process | Output | Customer |
| --- | --- | --- | --- | --- |
| External recipe website | Recipe URL, metadata, recipe schema | Validate URL → extract → review → duplicate check → save | Saved attributed recipe | Restaurant members / original Chef |

## Entry condition

User has a recipe URL and active Restaurant context.

## Exit condition

Recipe is either saved with source/attribution or safely held in review/fallback state.

## Happy path

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
- exact duplicate URL warning
- deliberate duplicate override if needed

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

## Defects

- source URL is lost
- attribution is hidden or missing
- exact duplicate saves accidentally
- weak import fails silently
- user cannot discard or recover from a bad import
- imported recipe cannot be cooked from

## CTQs

- Exact duplicate URLs trigger a strong warning.
- Save requires deliberate action when duplicate is detected.
- Source URL is preserved on saved recipe.
- Review state appears before save.
- Weak imports are recoverable.

## Controls / detection

- Test same URL twice.
- Test blocked/weak page.
- Test source URL display on saved recipe.
- Test discard/recovery path.

## Acceptance criteria

- User can import a normal recipe URL.
- User can review before saving.
- Accidental duplicate imports are prevented.
- Weak imports fail gracefully.
- Saved recipe preserves attribution.

## Edge cases

- blocked website
- no recipe schema
- partial ingredients
- no method
- same URL already saved
- same recipe from different URL
- source creator unknown

## Evidence required

- UAT result for normal import.
- UAT result for exact duplicate URL.
- Saved recipe screenshot/note showing source and attribution.

# Journey 4 — Organise recipes in Cookbook

## Build permission

Phase 3 hardening.

## User goal

I want my saved recipes to stay findable and useful.

## User story

As a Restaurant member, I want to browse, search and organise saved recipes, so that the Cookbook becomes more useful over time.

## SIPOC

| Supplier | Input | Process | Output | Customer |
| --- | --- | --- | --- | --- |
| Saved recipes / user actions | Recipe data, books, search terms | Browse → search → open → organise | Findable Cookbook | Restaurant members |

## Entry condition

Restaurant has saved recipes or an empty Cookbook state.

## Exit condition

User finds, opens, organises or acts on a recipe.

## Happy path

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

## Defects

- saved recipe cannot be found
- search returns confusing/no results for obvious terms
- recipe detail is unreadable
- organisation creates admin burden
- archived recipes appear as active unintentionally

## CTQs

- Saved recipe appears in Cookbook.
- Search finds recipe by title keyword.
- Recipe detail supports plan/cook actions.
- Empty state guides user to save/import.

## Controls / detection

- Search smoke test.
- Empty Cookbook test.
- Archive/edit test.
- Recipe Book assignment test.

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

## Evidence required

- Founder UAT recipe search result.
- Confirmation saved recipe can be opened from Cookbook.

# Journey 5 — Discover recipes in Specials

## Build permission

Future phase, except existing MVP sections may be maintained.

## User goal

I want ideas for what to cook without scrolling through influencer content.

## User story

As a Restaurant member, I want to discover useful recipes based on cooking behaviour, so that I can decide what to cook next.

## SIPOC

| Supplier | Input | Process | Output | Customer |
| --- | --- | --- | --- | --- |
| Restaurant data / community recipe data | Saved, planned, cooked and adapted recipe signals | Rank recipe-centric suggestions → show Specials | Useful cooking ideas | Restaurant members |

## Entry condition

User opens Specials looking for inspiration.

## Exit condition

User opens, saves, plans or cooks a recipe.

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

## Defects

- Specials feels like social media
- influencer mechanics appear
- suggestions cannot be acted on
- user sees irrelevant or empty sections without explanation

## CTQs

- No follower/following/likes/view-count mechanics.
- Every surfaced item leads to recipe action.
- User can save/plan/cook from discovery.

## Controls / detection

- Scope review before build.
- UI copy review.
- Community mechanics audit.

## Acceptance criteria

- User finds recipes without social pressure.
- Discovery supports cooking decisions.
- Popularity mechanics do not dominate.

## Edge cases

- not enough data
- recipe already saved
- unsuitable preference match
- community content needs moderation

## Evidence required

- Future beta/testing evidence that Specials helps users choose meals.

# Journey 6 — Plan meals in Menu

## Build permission

Active now / Phase 3 hardening.

## User goal

I want to decide what we are eating this week.

## User story

As a Restaurant member, I want to add saved recipes to a Menu, so that meals are planned before shopping and cooking.

## SIPOC

| Supplier | Input | Process | Output | Customer |
| --- | --- | --- | --- | --- |
| Cookbook / Restaurant member | Saved recipe, date, meal details | Select date → add recipe → adjust details | Planned meal event | Restaurant members / Pantry |

## Entry condition

User has at least one saved recipe or can add/import one.

## Exit condition

Menu contains planned meal events that Pantry can use.

## Happy path

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
- planned meals feed Pantry

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

## Defects

- meal saves to wrong date
- planned meal does not feed Pantry
- user cannot remove or edit planned meal
- Menu feels like admin rather than useful planning

## CTQs

- Planned meal date is correct.
- Planned recipe appears in Menu.
- Pantry can generate from planned meal.
- User can edit/remove the plan.

## Controls / detection

- Add/remove meal UAT.
- Date display check.
- Pantry generation from planned meal.

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

## Evidence required

- UAT result showing a planned meal feeds Pantry.

# Journey 7 — Generate shopping support in Pantry

## Build permission

Active now / Phase 3 hardening.

## User goal

I want a practical list of what to buy for the meals we planned.

## User story

As a Restaurant member, I want Pantry to turn planned meals into a shopping list, so that I can shop without manually rewriting recipe ingredients.

## SIPOC

| Supplier | Input | Process | Output | Customer |
| --- | --- | --- | --- | --- |
| Menu / recipe ingredients | Planned meals, ingredient lines, dates, servings | Generate → clean → group → categorise → display | Practical shopping list | Restaurant shopper |

## Entry condition

Restaurant has at least one planned meal with ingredients.

## Exit condition

User has a readable shopping list with grouped items, categories, meal/date context and checkable rows.

## Happy path

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

## Defects

- duplicate ingredient cards for obvious same item
- raw prep notes shown as item names
- water/generic salt/pepper shown unnecessarily
- spices shown only as teaspoon/tablespoon amounts
- no meal/date context
- checked state breaks grouped items
- category placement creates shopping confusion
- generated list is harder to use than original recipe

## CTQs

- Zero obvious duplicate garlic/onion-style cards in founder test list.
- Water and generic salt/pepper excluded unless specifically required.
- Spices displayed as buyable item names with recipe amount secondary.
- Meal/date context visible for generated items.
- Grouped checkbox behaviour works.
- Founder can use the list without rewriting it.

## Controls / detection

- Pantry UAT checklist.
- Test list with garlic variants, spices, water, salt, pepper and fresh items.
- Screenshot review before/after regeneration.
- Existing generated rows display test.

## Acceptance criteria

- User can shop from the list without constantly translating recipe text.
- Garlic/onion-style duplicates are not messy.
- Spices appear as buyable items.
- Fresh later-week items are easy to spot.
- Manual and generated items remain checkable.

## Edge cases

- water/salt/pepper
- spices measured in teaspoons
- duplicate garlic formats
- same ingredient with incompatible units
- manual items mixed with generated items
- generated items refreshed

## Evidence required

- Founder UAT screenshot/note showing generated list.
- Pantry rows in Founder UAT Closeout Checklist marked Pass or blocker logged.

# Journey 8 — Cook a recipe in Cook Mode

## Build permission

Active now / Phase 3 hardening.

## User goal

I want to cook from Big Al without fighting the screen.

## User story

As a Restaurant member, I want Cook Mode to show ingredients and steps clearly, so that I can cook successfully.

## SIPOC

| Supplier | Input | Process | Output | Customer |
| --- | --- | --- | --- | --- |
| Saved recipe | Ingredients, method, metadata | Open Cook Mode → follow steps → mark cooked | Cooked recipe signal | Cook / Restaurant |

## Entry condition

User opens Cook Mode from a saved recipe.

## Exit condition

User can cook the recipe and mark it cooked, or understands why the recipe lacks enough detail.

## Happy path

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

## Defects

- Cook Mode unreadable on phone
- user loses access to ingredients while cooking
- mark-cooked fails without explanation
- recipe cannot be cooked without original source
- missing steps create broken page

## CTQs

- User can read steps on mobile-sized viewport.
- Ingredients remain accessible.
- Mark-cooked succeeds or fails gracefully.
- Missing ingredients/method show calm fallback.

## Controls / detection

- Mobile viewport smoke test.
- Imported recipe Cook Mode test.
- No-method recipe test.
- Mark-cooked test.

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

## Evidence required

- Founder UAT Cook Mode test marked Pass or blocker logged.

# Journey 9 — Adapt a recipe

## Build permission

Future phase.

## User goal

I want to make a version of a recipe that fits my Restaurant without losing the original.

## User story

As a Restaurant member, I want to adapt a recipe, so that I can preserve the original while saving my own changes.

## SIPOC

| Supplier | Input | Process | Output | Customer |
| --- | --- | --- | --- | --- |
| Original recipe / user changes | Recipe, edits, notes | Create linked copy → edit → save adaptation | Attributed adaptation | Restaurant members / original Chef |

## Entry condition

User opens a saved recipe and chooses to adapt it.

## Exit condition

A linked adaptation exists while the original remains unchanged.

## Happy path

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

## Defects

- original recipe overwritten
- attribution lost
- adaptation cannot be traced back
- duplicate adaptations create clutter
- adaptation appears as original creator content

## CTQs

- Original remains unchanged.
- Adaptation has parent/source relationship.
- Attribution remains visible.
- Adaptation can be planned and cooked.

## Controls / detection

- Future adaptation UAT.
- Data model review before build.
- Attribution review.

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

## Evidence required

- Future phase adaptation test evidence.

# Journey 10 — Set Restaurant preferences

## Build permission

Phase 3 hardening for persistence and display only. Future phase for automatic adaptation.

## User goal

I want Big Al to understand how my Restaurant cooks.

## User story

As a Restaurant member, I want to set cooking preferences, so that Big Al can make recipes easier to follow in my kitchen.

## SIPOC

| Supplier | Input | Process | Output | Customer |
| --- | --- | --- | --- | --- |
| Restaurant member | Unit, oven, hob, equipment preferences | Edit preferences → save → apply as guidance | Restaurant cooking preferences | Restaurant members |

## Entry condition

User opens Restaurant preferences.

## Exit condition

Preferences save, persist and can be used for guidance.

## Preference examples

- metric/imperial preference
- grams over pounds
- fan-assisted oven
- air fryer preference
- induction hob
- number of hobs
- equipment limits

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

## Defects

- preferences do not persist
- preferences leak across Restaurants
- guidance implies unsafe automatic conversion
- preferences create admin without cooking value

## CTQs

- Preferences save successfully.
- Preferences persist after refresh.
- Preferences are scoped to the correct Restaurant.
- Guidance is clearly advisory where automatic conversion is not implemented.

## Controls / detection

- Save/refresh UAT.
- RLS test.
- Copy review for guidance language.

## Acceptance criteria

- User can save preferences.
- Preferences are visible or reflected where useful.
- Big Al does not overcomplicate cooking.

## Edge cases

- no preferences set
- conflicting preferences
- member changes preferences
- recipe cannot safely adapt

## Evidence required

- Founder UAT preference persistence test.

# Journey 11 — Use Big Al helper behaviour

## Build permission

Future phase, except existing deterministic helper behaviour may be maintained.

## User goal

I want Big Al to help me decide what to cook without becoming a generic chatbot.

## User story

As a Restaurant member, I want Big Al to suggest useful recipe actions based on my Restaurant, so that I can cook more easily.

## SIPOC

| Supplier | Input | Process | Output | Customer |
| --- | --- | --- | --- | --- |
| Restaurant data | Saved, planned, cooked and preference signals | Read signals → generate grounded suggestions | Recipe action prompts | Restaurant members |

## Entry condition

User opens Kitchen, Specials or Big Al helper area.

## Exit condition

User takes a recipe-centric action: open, save, plan or cook.

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

## Defects

- helper behaves like generic chatbot
- suggestions are not grounded in Restaurant data
- user gets non-cooking answers
- paid AI dependency added without approval
- unsafe food advice appears

## CTQs

- Suggestions are recipe/action oriented.
- Helper uses Restaurant data where possible.
- No generic AI homepage/chatbot positioning.
- User can act on the suggestion.

## Controls / detection

- Product scope review.
- Prompt/content review.
- Safety copy review.
- Future beta feedback.

## Acceptance criteria

- Big Al helps the user choose a cooking action.
- It does not feel like search only.
- It does not become generic AI chat.

## Edge cases

- little/no data
- irrelevant suggestions
- unsafe food advice
- user asks non-cooking question

## Evidence required

- Future beta evidence that helper behaviour improves cooking decisions.

# Journey 12 — Private beta tester journey

## Build permission

Phase 3, but only after M20 Beta Readiness Review gives a go decision.

## User goal

I want to try Big Al and understand what feedback is useful.

## User story

As a private beta tester, I want clear tasks and expectations, so that I can test Big Al without founder explanation.

## SIPOC

| Supplier | Input | Process | Output | Customer |
| --- | --- | --- | --- | --- |
| Founder / invited tester | Invitation, task list, beta app access | Join → attempt core loop → submit feedback | Beta evidence | Founder / product team |

## Entry condition

M20 gives a go decision for private beta.

## Exit condition

Tester feedback is captured and sorted into bugs, confusion, blockers and parked requests.

## Happy path

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

## Defects

- tester cannot start without founder explanation
- feedback is lost in chat/messages
- bugs and feature requests are mixed together
- tester expects social/grocery/calorie features
- beta starts before blockers are resolved

## CTQs

- Tester can attempt the core loop.
- Feedback route is clear.
- Bugs are separated from confusion and future requests.
- Tester understands beta limitations.

## Controls / detection

- M20 readiness gate.
- Beta task checklist.
- Feedback log review.
- Launch Blocker Register sync.

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

## Evidence required

- M21 beta report.
- Tester activity notes.
- Feedback logged and categorised.

# Lightweight FMEA — current highest-risk areas

| Journey | Potential failure | Effect on user | Severity | Likely cause | Detection method | Prevention/control |
| --- | --- | --- | --- | --- | --- | --- |
| Import | Exact duplicate saves accidentally | Cookbook clutter, trust loss | High | Weak duplicate guard | Duplicate URL UAT | Strong warning and deliberate override |
| Import | Source attribution lost | Creator trust loss | High | Missing mapping/display | Saved recipe review | Preserve source URL and creator/source fields |
| Pantry | Garlic appears as multiple items | Shopping list feels dumb | High | Ingredient normalisation gaps | Pantry UAT screenshot | Canonical ingredient grouping and display cleanup |
| Pantry | Water/salt/pepper shown unnecessarily | User rewrites list | Medium | Basic exclusions weak | Test ingredient set | Exclusion rules and UAT examples |
| Pantry | Grouped checkbox fails | User cannot shop reliably | High | UI grouping not tied to row updates | Checkbox UAT | Grouped toggle action or defensive UI handling |
| Menu | Planned date does not feed Pantry | Shopping context wrong | High | Handoff bug | Plan → Pantry test | Date-preserving meal event flow |
| Cook Mode | User needs original source | Cook Mode fails purpose | High | Missing/poor imported method display | Cook one recipe test | Readability and fallback checks |
| Restaurant | Cross-Restaurant data leak | Privacy/security failure | Critical | RLS bug | Second-user test | RLS policies and manual validation |
| Preferences | Guidance implies unsupported conversion | User may cook incorrectly | Medium | Overclaiming copy | Copy review | Advisory wording until conversion is built |
| Specials/Big Al | Turns into social/generic AI | Product drift | High | Scope creep | Scope review | Do-not-build guardrails |

# Measurement plan for Phase 3 and beta

Do not overbuild analytics yet. Use simple evidence.

## Founder UAT measures

- Can founder complete Import → Save → Plan → Shop → Cook?
- Which step needed manual correction?
- Which step created confusion?
- Which step created a blocker?
- Did Pantry require rewriting?
- Did Cook Mode replace the original source?
- Did duplicate protection work?
- Did second-user isolation hold?

## Private beta measures

- Number of invited testers.
- Number of active testers.
- Number who completed each core task.
- Bugs found.
- Confusion points found.
- Feature requests parked.
- Repeat-use signals.
- Whether testers needed founder explanation.

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
