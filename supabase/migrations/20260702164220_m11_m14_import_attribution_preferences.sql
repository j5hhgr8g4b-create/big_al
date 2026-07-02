begin;

alter table public.recipes
  add column if not exists creator_source text,
  add column if not exists source_site text;

create index if not exists recipes_source_url_active_idx
  on public.recipes (source_url)
  where archived_at is null and source_url is not null;

create table if not exists public.restaurant_cooking_preferences (
  restaurant_id uuid primary key references public.restaurants (id) on delete cascade,
  unit_preference text not null default 'mixed'
    check (unit_preference in ('metric', 'us', 'mixed')),
  oven_type text not null default 'not_set'
    check (oven_type in ('not_set', 'conventional', 'fan', 'gas', 'other')),
  hob_type text not null default 'not_set'
    check (hob_type in ('not_set', 'gas', 'electric', 'induction', 'other')),
  equipment_limits text[] not null default '{}'::text[],
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists restaurant_cooking_preferences_set_updated_at on public.restaurant_cooking_preferences;
create trigger restaurant_cooking_preferences_set_updated_at
before update on public.restaurant_cooking_preferences
for each row execute function public.set_updated_at();

create or replace function public.save_recipe(
  target_recipe_id uuid,
  target_restaurant_id uuid,
  recipe_title text,
  recipe_description text,
  recipe_image_url text,
  recipe_source_url text,
  recipe_creator_source text,
  recipe_source_site text,
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
  saved_recipe_id uuid;
begin
  saved_recipe_id := public.save_recipe(
    target_recipe_id,
    target_restaurant_id,
    recipe_title,
    recipe_description,
    recipe_image_url,
    recipe_source_url,
    recipe_prep_minutes,
    recipe_cook_minutes,
    recipe_servings,
    recipe_difficulty,
    ingredients_payload,
    steps_payload
  );

  update public.recipes
  set creator_source = nullif(btrim(recipe_creator_source), ''),
      source_site = nullif(btrim(recipe_source_site), '')
  where id = saved_recipe_id;

  return saved_recipe_id;
end;
$$;

create or replace function public.convert_import_to_recipe(
  target_import_id uuid,
  target_recipe_id uuid,
  recipe_title text,
  recipe_description text,
  recipe_image_url text,
  recipe_source_url text,
  recipe_creator_source text,
  recipe_source_site text,
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
  selected_import public.imports;
  saved_recipe_id uuid;
begin
  select *
  into selected_import
  from public.imports
  where id = target_import_id;

  if not found or selected_import.archived_at is not null then
    raise exception 'Import not found';
  end if;

  if not public.is_restaurant_member(selected_import.restaurant_id) then
    raise exception 'Import access required';
  end if;

  if selected_import.status <> 'needs_review' then
    raise exception 'Import has already been converted';
  end if;

  saved_recipe_id := public.save_recipe(
    target_recipe_id,
    selected_import.restaurant_id,
    recipe_title,
    recipe_description,
    recipe_image_url,
    coalesce(nullif(btrim(recipe_source_url), ''), selected_import.source_url),
    recipe_creator_source,
    recipe_source_site,
    recipe_prep_minutes,
    recipe_cook_minutes,
    recipe_servings,
    recipe_difficulty,
    ingredients_payload,
    steps_payload
  );

  update public.imports
  set status = 'converted',
      recipe_id = saved_recipe_id,
      converted_at = now()
  where id = selected_import.id;

  return saved_recipe_id;
end;
$$;

create or replace function public.save_restaurant_cooking_preferences(
  target_restaurant_id uuid,
  target_unit_preference text,
  target_oven_type text,
  target_hob_type text,
  target_equipment_limits text[]
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  cleaned_equipment_limits text[] := coalesce(target_equipment_limits, '{}'::text[]);
begin
  if auth.uid() is null then
    raise exception 'Authentication required';
  end if;

  if not public.is_restaurant_member(target_restaurant_id) then
    raise exception 'Restaurant membership required';
  end if;

  if target_unit_preference not in ('metric', 'us', 'mixed') then
    raise exception 'Invalid unit preference';
  end if;

  if target_oven_type not in ('not_set', 'conventional', 'fan', 'gas', 'other') then
    raise exception 'Invalid oven type';
  end if;

  if target_hob_type not in ('not_set', 'gas', 'electric', 'induction', 'other') then
    raise exception 'Invalid hob type';
  end if;

  if exists (
    select 1
    from unnest(cleaned_equipment_limits) as equipment_limit(value)
    where equipment_limit.value not in (
      'no_blender',
      'no_food_processor',
      'no_stand_mixer',
      'no_microwave',
      'no_air_fryer',
      'small_oven',
      'limited_pans'
    )
  ) then
    raise exception 'Invalid equipment limit';
  end if;

  insert into public.restaurant_cooking_preferences (
    restaurant_id,
    unit_preference,
    oven_type,
    hob_type,
    equipment_limits
  ) values (
    target_restaurant_id,
    target_unit_preference,
    target_oven_type,
    target_hob_type,
    cleaned_equipment_limits
  )
  on conflict (restaurant_id)
  do update set
    unit_preference = excluded.unit_preference,
    oven_type = excluded.oven_type,
    hob_type = excluded.hob_type,
    equipment_limits = excluded.equipment_limits;

  return target_restaurant_id;
end;
$$;

alter table public.restaurant_cooking_preferences enable row level security;

drop policy if exists "Restaurant cooking preferences are visible to members"
on public.restaurant_cooking_preferences;
create policy "Restaurant cooking preferences are visible to members"
on public.restaurant_cooking_preferences for select
to authenticated
using (public.is_restaurant_member(restaurant_id));

revoke all on table public.restaurant_cooking_preferences from anon, authenticated;
grant select on table public.restaurant_cooking_preferences to authenticated;

revoke all on function public.save_recipe(
  uuid, uuid, text, text, text, text, text, text, integer, integer, numeric, text, jsonb, jsonb
) from public;
revoke all on function public.convert_import_to_recipe(
  uuid, uuid, text, text, text, text, text, text, integer, integer, numeric, text, jsonb, jsonb
) from public;
revoke all on function public.save_restaurant_cooking_preferences(uuid, text, text, text, text[]) from public;

grant execute on function public.save_recipe(
  uuid, uuid, text, text, text, text, text, text, integer, integer, numeric, text, jsonb, jsonb
) to authenticated;
grant execute on function public.convert_import_to_recipe(
  uuid, uuid, text, text, text, text, text, text, integer, integer, numeric, text, jsonb, jsonb
) to authenticated;
grant execute on function public.save_restaurant_cooking_preferences(uuid, text, text, text, text[]) to authenticated;

commit;
