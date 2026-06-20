# Big Al — Database Schema v1

Use Supabase/PostgreSQL. Use UUID primary keys. Add created_at and updated_at timestamps to core tables.

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

## Minimum Fields
Codex should implement fields from PRODUCT_SPEC.md and expand only when needed for the current milestone.
