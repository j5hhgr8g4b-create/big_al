begin;

create table if not exists public.cookbooks (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null unique references public.restaurants (id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.recipes (
  id uuid primary key default gen_random_uuid(),
  cookbook_id uuid not null references public.cookbooks (id) on delete cascade,
  creator_chef_id uuid not null references public.chefs (id) on delete restrict,
  title text not null check (char_length(btrim(title)) between 1 and 160),
  description text,
  image_url text,
  source_url text,
  prep_minutes integer check (prep_minutes is null or prep_minutes >= 0),
  cook_minutes integer check (cook_minutes is null or cook_minutes >= 0),
  servings numeric(8, 2) check (servings is null or servings > 0),
  difficulty text check (difficulty is null or difficulty in ('easy', 'medium', 'hard')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  archived_at timestamptz
);

create table if not exists public.ingredients (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants (id) on delete cascade,
  name text not null check (char_length(btrim(name)) between 1 and 120),
  normalized_name text not null check (char_length(normalized_name) between 1 and 120),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (restaurant_id, normalized_name)
);

create table if not exists public.recipe_ingredients (
  id uuid primary key default gen_random_uuid(),
  recipe_id uuid not null references public.recipes (id) on delete cascade,
  ingredient_id uuid not null references public.ingredients (id) on delete restrict,
  position integer not null check (position > 0),
  quantity numeric(10, 3) check (quantity is null or quantity > 0),
  unit text check (unit is null or char_length(btrim(unit)) between 1 and 40),
  preparation text check (preparation is null or char_length(btrim(preparation)) between 1 and 120),
  created_at timestamptz not null default now(),
  unique (recipe_id, position)
);

create table if not exists public.recipe_steps (
  id uuid primary key default gen_random_uuid(),
  recipe_id uuid not null references public.recipes (id) on delete cascade,
  position integer not null check (position > 0),
  instruction text not null check (char_length(btrim(instruction)) between 1 and 2000),
  created_at timestamptz not null default now(),
  unique (recipe_id, position)
);

create index if not exists recipes_cookbook_active_idx
  on public.recipes (cookbook_id, created_at desc)
  where archived_at is null;

create index if not exists recipe_ingredients_recipe_id_idx
  on public.recipe_ingredients (recipe_id);

create index if not exists recipe_steps_recipe_id_idx
  on public.recipe_steps (recipe_id);

drop trigger if exists recipes_set_updated_at on public.recipes;
create trigger recipes_set_updated_at
before update on public.recipes
for each row execute function public.set_updated_at();

drop trigger if exists ingredients_set_updated_at on public.ingredients;
create trigger ingredients_set_updated_at
before update on public.ingredients
for each row execute function public.set_updated_at();

create or replace function public.handle_new_restaurant()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.cookbooks (restaurant_id)
  values (new.id)
  on conflict (restaurant_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_restaurant_created on public.restaurants;
create trigger on_restaurant_created
after insert on public.restaurants
for each row execute function public.handle_new_restaurant();

insert into public.cookbooks (restaurant_id)
select restaurants.id
from public.restaurants
on conflict (restaurant_id) do nothing;

create or replace function public.shares_restaurant_with_profile(target_profile_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.restaurant_members as mine
    inner join public.restaurant_members as theirs
      on theirs.restaurant_id = mine.restaurant_id
    where mine.profile_id = (select auth.uid())
      and theirs.profile_id = target_profile_id
  );
$$;

create or replace function public.can_access_recipe(target_recipe_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.recipes
    inner join public.cookbooks on cookbooks.id = recipes.cookbook_id
    where recipes.id = target_recipe_id
      and public.is_restaurant_member(cookbooks.restaurant_id)
  );
$$;

create or replace function public.save_recipe(
  target_recipe_id uuid,
  target_restaurant_id uuid,
  recipe_title text,
  recipe_description text,
  recipe_image_url text,
  recipe_source_url text,
  recipe_prep_minutes integer,
  recipe_cook_minutes integer,
  recipe_servings numeric,
  recipe_difficulty text,
  ingredients_payload jsonb,
  steps_payload jsonb
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_profile_id uuid := auth.uid();
  selected_cookbook_id uuid;
  selected_chef_id uuid;
  existing_restaurant_id uuid;
  saved_recipe_id uuid := coalesce(target_recipe_id, gen_random_uuid());
  ingredient_item jsonb;
  ingredient_position bigint;
  ingredient_name text;
  ingredient_normalized_name text;
  selected_ingredient_id uuid;
  step_item jsonb;
  step_position bigint;
begin
  if current_profile_id is null then
    raise exception 'Authentication required';
  end if;

  if not public.is_restaurant_member(target_restaurant_id) then
    raise exception 'Restaurant membership required';
  end if;

  if recipe_title is null or char_length(btrim(recipe_title)) not between 1 and 160 then
    raise exception 'Recipe title must be between 1 and 160 characters';
  end if;

  if (recipe_prep_minutes is not null and recipe_prep_minutes < 0)
    or (recipe_cook_minutes is not null and recipe_cook_minutes < 0)
    or (recipe_servings is not null and recipe_servings <= 0) then
    raise exception 'Recipe amounts and times must be positive';
  end if;

  if recipe_difficulty is not null and recipe_difficulty not in ('easy', 'medium', 'hard') then
    raise exception 'Invalid recipe difficulty';
  end if;

  if ingredients_payload is null
    or jsonb_typeof(ingredients_payload) <> 'array'
    or jsonb_array_length(ingredients_payload) < 1 then
    raise exception 'At least one ingredient is required';
  end if;

  if steps_payload is null
    or jsonb_typeof(steps_payload) <> 'array'
    or jsonb_array_length(steps_payload) < 1 then
    raise exception 'At least one recipe step is required';
  end if;

  select cookbooks.id
  into selected_cookbook_id
  from public.cookbooks
  where restaurant_id = target_restaurant_id;

  if selected_cookbook_id is null then
    raise exception 'Restaurant Cookbook not found';
  end if;

  select chefs.id
  into selected_chef_id
  from public.chefs
  where profile_id = current_profile_id;

  if selected_chef_id is null then
    raise exception 'Chef profile not found';
  end if;

  select cookbooks.restaurant_id
  into existing_restaurant_id
  from public.recipes
  inner join public.cookbooks on cookbooks.id = recipes.cookbook_id
  where recipes.id = saved_recipe_id;

  if found then
    if existing_restaurant_id <> target_restaurant_id then
      raise exception 'Recipe belongs to another Restaurant';
    end if;

    if exists (
      select 1 from public.recipes
      where id = saved_recipe_id and archived_at is not null
    ) then
      raise exception 'Archived recipes cannot be edited';
    end if;

    update public.recipes
    set title = btrim(recipe_title),
        description = nullif(btrim(recipe_description), ''),
        image_url = nullif(btrim(recipe_image_url), ''),
        source_url = nullif(btrim(recipe_source_url), ''),
        prep_minutes = recipe_prep_minutes,
        cook_minutes = recipe_cook_minutes,
        servings = recipe_servings,
        difficulty = recipe_difficulty
    where id = saved_recipe_id;
  else
    insert into public.recipes (
      id,
      cookbook_id,
      creator_chef_id,
      title,
      description,
      image_url,
      source_url,
      prep_minutes,
      cook_minutes,
      servings,
      difficulty
    ) values (
      saved_recipe_id,
      selected_cookbook_id,
      selected_chef_id,
      btrim(recipe_title),
      nullif(btrim(recipe_description), ''),
      nullif(btrim(recipe_image_url), ''),
      nullif(btrim(recipe_source_url), ''),
      recipe_prep_minutes,
      recipe_cook_minutes,
      recipe_servings,
      recipe_difficulty
    );
  end if;

  delete from public.recipe_ingredients where recipe_id = saved_recipe_id;
  delete from public.recipe_steps where recipe_id = saved_recipe_id;

  for ingredient_item, ingredient_position in
    select item.value, item.ordinality
    from jsonb_array_elements(ingredients_payload) with ordinality as item(value, ordinality)
  loop
    ingredient_name := btrim(ingredient_item ->> 'name');
    ingredient_normalized_name := lower(regexp_replace(ingredient_name, '\s+', ' ', 'g'));

    if ingredient_name is null or char_length(ingredient_name) not between 1 and 120 then
      raise exception 'Ingredient names must be between 1 and 120 characters';
    end if;

    insert into public.ingredients (restaurant_id, name, normalized_name)
    values (target_restaurant_id, ingredient_name, ingredient_normalized_name)
    on conflict (restaurant_id, normalized_name)
    do update set name = excluded.name
    returning id into selected_ingredient_id;

    insert into public.recipe_ingredients (
      recipe_id,
      ingredient_id,
      position,
      quantity,
      unit,
      preparation
    ) values (
      saved_recipe_id,
      selected_ingredient_id,
      ingredient_position,
      nullif(ingredient_item ->> 'quantity', '')::numeric,
      nullif(btrim(ingredient_item ->> 'unit'), ''),
      nullif(btrim(ingredient_item ->> 'preparation'), '')
    );
  end loop;

  for step_item, step_position in
    select item.value, item.ordinality
    from jsonb_array_elements(steps_payload) with ordinality as item(value, ordinality)
  loop
    if step_item ->> 'instruction' is null
      or char_length(btrim(step_item ->> 'instruction')) not between 1 and 2000 then
      raise exception 'Recipe steps must be between 1 and 2000 characters';
    end if;

    insert into public.recipe_steps (recipe_id, position, instruction)
    values (saved_recipe_id, step_position, btrim(step_item ->> 'instruction'));
  end loop;

  return saved_recipe_id;
end;
$$;

create or replace function public.archive_recipe(target_recipe_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not public.can_access_recipe(target_recipe_id) then
    raise exception 'Recipe access required';
  end if;

  update public.recipes
  set archived_at = coalesce(archived_at, now())
  where id = target_recipe_id;
end;
$$;

alter table public.cookbooks enable row level security;
alter table public.recipes enable row level security;
alter table public.ingredients enable row level security;
alter table public.recipe_ingredients enable row level security;
alter table public.recipe_steps enable row level security;

drop policy if exists "Chefs are visible to their owner" on public.chefs;
drop policy if exists "Chefs are visible to Restaurant members" on public.chefs;
create policy "Chefs are visible to Restaurant members"
on public.chefs for select
to authenticated
using (
  profile_id = (select auth.uid())
  or public.shares_restaurant_with_profile(profile_id)
);

drop policy if exists "Cookbooks are visible to Restaurant members" on public.cookbooks;
create policy "Cookbooks are visible to Restaurant members"
on public.cookbooks for select
to authenticated
using (public.is_restaurant_member(restaurant_id));

drop policy if exists "Recipes are visible to Restaurant members" on public.recipes;
create policy "Recipes are visible to Restaurant members"
on public.recipes for select
to authenticated
using (public.can_access_recipe(id));

drop policy if exists "Ingredients are visible to Restaurant members" on public.ingredients;
create policy "Ingredients are visible to Restaurant members"
on public.ingredients for select
to authenticated
using (public.is_restaurant_member(restaurant_id));

drop policy if exists "Recipe ingredients are visible with their recipe" on public.recipe_ingredients;
create policy "Recipe ingredients are visible with their recipe"
on public.recipe_ingredients for select
to authenticated
using (public.can_access_recipe(recipe_id));

drop policy if exists "Recipe steps are visible with their recipe" on public.recipe_steps;
create policy "Recipe steps are visible with their recipe"
on public.recipe_steps for select
to authenticated
using (public.can_access_recipe(recipe_id));

revoke all on table public.cookbooks from anon, authenticated;
revoke all on table public.recipes from anon, authenticated;
revoke all on table public.ingredients from anon, authenticated;
revoke all on table public.recipe_ingredients from anon, authenticated;
revoke all on table public.recipe_steps from anon, authenticated;

grant select on table public.cookbooks to authenticated;
grant select on table public.recipes to authenticated;
grant select on table public.ingredients to authenticated;
grant select on table public.recipe_ingredients to authenticated;
grant select on table public.recipe_steps to authenticated;

revoke all on function public.handle_new_restaurant() from public;
revoke all on function public.shares_restaurant_with_profile(uuid) from public;
revoke all on function public.can_access_recipe(uuid) from public;
revoke all on function public.save_recipe(
  uuid, uuid, text, text, text, text, integer, integer, numeric, text, jsonb, jsonb
) from public;
revoke all on function public.archive_recipe(uuid) from public;

grant execute on function public.shares_restaurant_with_profile(uuid) to authenticated;
grant execute on function public.can_access_recipe(uuid) to authenticated;
grant execute on function public.save_recipe(
  uuid, uuid, text, text, text, text, integer, integer, numeric, text, jsonb, jsonb
) to authenticated;
grant execute on function public.archive_recipe(uuid) to authenticated;

commit;
