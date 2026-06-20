# Big Al — Database Schema v1

Use Supabase/PostgreSQL. Use UUID primary keys.

## Tables

- profiles
- chefs
- restaurants
- restaurant_members
- cookbooks
- imports
- recipes
- ingredients
- ingredient_variants
- recipe_ingredients
- recipe_steps
- recipe_books
- recipe_book_recipes
- meal_events
- shopping_lists
- shopping_items

## Key Rules

- Every user gets one Chef profile.
- Every Restaurant has exactly one Cookbook.
- Everything enters as an Import before becoming a Recipe.
- Adaptations are independent recipes.
- Archive instead of hard delete.
- Ingredients are structured.
- Recipe Books organise recipes but do not own recipes.
- One active Shopping List per Restaurant in MVP.
- Enable RLS. Users can access Restaurant data only if they are members.

## Milestone 1 Tables

### profiles

One row per Supabase Auth user. Stores display name, optional avatar URL, and timestamps.

### chefs

One Chef per Profile. Uses its own UUID so recipes can reference a stable Chef identity in later milestones.

### restaurants

Stores name, creating Profile, timestamps, and optional archive time. Restaurants are archived rather than hard deleted.

### restaurant_members

Links Profiles to Restaurants with an `owner` or `member` role. The Restaurant and Profile IDs form the primary key.

## Milestone 1 Automation and Access

- An Auth user trigger creates the matching Profile and Chef.
- Existing Auth users are backfilled when the migration is applied.
- An authenticated database function creates a Restaurant and its owner membership in one transaction.
- Profiles and Chefs are visible and editable only by their owner.
- Restaurants are visible to members and editable by owners.
- Restaurant memberships are visible to members of that Restaurant.
- Direct table inserts and hard deletes are not granted to app users.

## Milestone 2 Tables

### cookbooks

Exactly one Cookbook per Restaurant. Existing Restaurants are backfilled and future Restaurants receive one through a database trigger.

### recipes

Belongs to a Cookbook and records its creating Chef, title, description, image/source links, preparation and cooking times, servings, difficulty, timestamps, and optional archive time.

### ingredients

Restaurant-scoped ingredient names with a normalized value used to reuse equivalent names within that Restaurant.

### recipe_ingredients

Ordered structured links between Recipes and Ingredients with optional numeric quantity, unit, and preparation text.

### recipe_steps

Ordered recipe instructions. Cook Mode behavior remains a later milestone.

## Milestone 2 Automation and Access

- One authenticated database function creates or edits a complete Recipe and its ordered ingredients and steps in one transaction.
- Ingredient names are normalized and reused within the Restaurant.
- A separate authenticated function archives Recipes; app users receive no hard-delete permission.
- Cookbook and Recipe data is readable only by Restaurant members through RLS.
- Recipe creator names are visible to members who share a Restaurant.
- Manual recipe creation is supported now; Import-backed recipe creation is introduced in Milestone 3.

## Milestone 3 Table

### imports

Restaurant-scoped capture records for a source URL, pasted recipe text, or both. Each Import records its creator, source type, parser metadata, review/conversion status, optional resulting Recipe, timestamps, and optional archive time.

## Milestone 3 Automation and Access

- New Recipe creation now starts with an Import.
- The placeholder parser records an explicit manual-review message and does not fetch, scrape, or invent content.
- Needs Review Imports remain separate from the Cookbook until a member structures and converts them.
- Conversion calls the existing atomic Recipe save inside the same database transaction, then links the Import to the Recipe.
- Imports are readable only by members of their Restaurant through RLS.
- App users receive no direct Import table write or delete privileges.

## Milestone 4 Tables

### recipe_books

Restaurant-scoped organizing collections with title, description, optional cover image, creator, timestamps, and optional archive time.

### recipe_book_recipes

Many-to-many links between Recipe Books and Recipes. Recipe Books organize Recipes but never own them.

## Milestone 4 Automation and Access

- Authenticated functions create, edit, and archive Recipe Books.
- One atomic membership function replaces the complete selected Book set for a Recipe.
- The membership function rejects Books from another Restaurant and archived Books.
- Search matches literal case-insensitive text within active Recipe titles and Ingredient names.
- Search is restricted to the requesting member's Restaurant.
- Recipe Books and membership links are readable only by Restaurant members through RLS.
- App users receive no direct Book table writes or hard-delete privileges.
