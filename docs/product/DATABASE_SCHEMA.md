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
