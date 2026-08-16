begin;

-- Keep image enrichment in the same database transaction as seeding. The URLs
-- are vetted source-page image snapshots, so Restaurant creation never scrapes
-- Good Food at request time.
create or replace function public.backfill_beta_starter_recipe_images(target_restaurant_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  starter jsonb;
  selected_recipe_id uuid;
  selected_title text;
  selected_description text;
  selected_source_url text;
  selected_creator_source text;
  selected_source_site text;
  selected_prep_minutes integer;
  selected_cook_minutes integer;
  selected_servings numeric;
  selected_difficulty text;
  selected_ingredients jsonb;
  selected_steps jsonb;
begin
  if not public.is_restaurant_member(target_restaurant_id) then
    raise exception 'Restaurant membership required';
  end if;

  for starter in
    select value
    from jsonb_array_elements(
      jsonb_build_array(
        jsonb_build_object(
          'source_url', 'https://www.bbcgoodfood.com/howto/guide/how-cook-sausages',
          'image_url', 'https://images.immediate.co.uk/production/volatile/sites/30/2020/08/gfo0118-sausage_butterbean-f719eb4.jpg?resize=700%2C366'
        ),
        jsonb_build_object(
          'source_url', 'https://www.bbcgoodfood.com/recipes/jerk-chicken/',
          'image_url', 'https://images.immediate.co.uk/production/volatile/sites/30/2020/08/jerk-chicken-f51736a.jpg?resize=440%2C230'
        ),
        jsonb_build_object(
          'source_url', 'https://www.bbcgoodfood.com/recipes/creamy-garlic-pasta',
          'image_url', 'https://images.immediate.co.uk/production/volatile/sites/30/2024/01/Creamy-garlic-pasta-d8623e7.jpg?resize=1200%2C630'
        ),
        jsonb_build_object(
          'source_url', 'https://www.bbcgoodfood.com/recipes/roast-chicken',
          'image_url', 'https://images.immediate.co.uk/production/volatile/sites/30/2020/08/recipe-image-legacy-id-5219_11-070c47c.jpg?resize=440%2C230'
        ),
        jsonb_build_object(
          'source_url', 'https://www.bbcgoodfood.com/howto/guide/how-make-scrambled-eggs',
          'image_url', 'https://images.immediate.co.uk/production/volatile/sites/30/2020/08/main-scrambled-egg-feta-hash-1a521b3.jpg?resize=700%2C366'
        )
      )
    ) as recipe(value)
  loop
    select
      recipes.id,
      recipes.title,
      recipes.description,
      recipes.source_url,
      recipes.creator_source,
      recipes.source_site,
      recipes.prep_minutes,
      recipes.cook_minutes,
      recipes.servings,
      recipes.difficulty,
      coalesce(
        (
          select jsonb_agg(
            jsonb_build_object(
              'name', ingredients.name,
              'preparation', coalesce(recipe_ingredients.preparation, ''),
              'quantity', recipe_ingredients.quantity,
              'unit', coalesce(recipe_ingredients.unit, '')
            )
            order by recipe_ingredients.position
          )
          from public.recipe_ingredients
          inner join public.ingredients on ingredients.id = recipe_ingredients.ingredient_id
          where recipe_ingredients.recipe_id = recipes.id
        ),
        '[]'::jsonb
      ),
      coalesce(
        (
          select jsonb_agg(
            jsonb_build_object('instruction', recipe_steps.instruction)
            order by recipe_steps.position
          )
          from public.recipe_steps
          where recipe_steps.recipe_id = recipes.id
        ),
        '[]'::jsonb
      )
    into
      selected_recipe_id,
      selected_title,
      selected_description,
      selected_source_url,
      selected_creator_source,
      selected_source_site,
      selected_prep_minutes,
      selected_cook_minutes,
      selected_servings,
      selected_difficulty,
      selected_ingredients,
      selected_steps
    from public.recipes
    inner join public.cookbooks on cookbooks.id = recipes.cookbook_id
    where cookbooks.restaurant_id = target_restaurant_id
      and recipes.source_url = starter ->> 'source_url'
      and recipes.archived_at is null
      and recipes.image_url is null;

    if selected_recipe_id is not null then
      perform public.save_recipe(
        selected_recipe_id,
        target_restaurant_id,
        selected_title,
        selected_description,
        starter ->> 'image_url',
        selected_source_url,
        selected_creator_source,
        selected_source_site,
        selected_prep_minutes,
        selected_cook_minutes,
        selected_servings,
        selected_difficulty,
        selected_ingredients,
        selected_steps
      );
    end if;

    selected_recipe_id := null;
  end loop;
end;
$$;

create or replace function public.create_restaurant(restaurant_name text)
returns public.restaurants
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_profile_id uuid := auth.uid();
  cleaned_name text := btrim(restaurant_name);
  created_restaurant public.restaurants;
begin
  if current_profile_id is null then
    raise exception 'Authentication required';
  end if;

  if cleaned_name is null or char_length(cleaned_name) not between 1 and 100 then
    raise exception 'Restaurant name must be between 1 and 100 characters';
  end if;

  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended(current_profile_id::text, 0)
  );

  if exists (
    select 1
    from public.restaurant_members
    where profile_id = current_profile_id
  ) then
    raise exception 'Restaurant already exists';
  end if;

  insert into public.restaurants (name, created_by)
  values (cleaned_name, current_profile_id)
  returning * into created_restaurant;

  insert into public.restaurant_members (restaurant_id, profile_id, role)
  values (created_restaurant.id, current_profile_id, 'owner');

  perform public.seed_beta_starter_recipes(created_restaurant.id);
  perform public.backfill_beta_starter_recipe_images(created_restaurant.id);
  return created_restaurant;
end;
$$;

revoke all on function public.backfill_beta_starter_recipe_images(uuid) from public;

commit;
