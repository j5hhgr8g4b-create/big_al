begin;

create table if not exists public.shopping_lists (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants (id) on delete cascade,
  title text not null default 'Weekly shopping' check (char_length(btrim(title)) between 1 and 120),
  source_start_date date,
  source_end_date date,
  generated_at timestamptz,
  created_by_profile_id uuid not null references public.profiles (id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  archived_at timestamptz
);

create table if not exists public.shopping_items (
  id uuid primary key default gen_random_uuid(),
  shopping_list_id uuid not null references public.shopping_lists (id) on delete cascade,
  restaurant_id uuid not null references public.restaurants (id) on delete cascade,
  ingredient_id uuid references public.ingredients (id) on delete set null,
  name text not null check (char_length(btrim(name)) between 1 and 120),
  normalized_name text not null check (char_length(normalized_name) between 1 and 120),
  quantity numeric(12, 3) check (quantity is null or quantity > 0),
  unit text check (unit is null or char_length(btrim(unit)) between 1 and 40),
  notes text check (notes is null or char_length(btrim(notes)) between 1 and 500),
  source text not null default 'manual' check (source in ('generated', 'manual')),
  is_purchased boolean not null default false,
  position integer not null check (position > 0),
  created_by_profile_id uuid not null references public.profiles (id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists shopping_lists_one_active_per_restaurant_idx
  on public.shopping_lists (restaurant_id)
  where archived_at is null;

create index if not exists shopping_items_list_position_idx
  on public.shopping_items (shopping_list_id, is_purchased, position, created_at);

create index if not exists shopping_items_restaurant_idx
  on public.shopping_items (restaurant_id);

drop trigger if exists shopping_lists_set_updated_at on public.shopping_lists;
create trigger shopping_lists_set_updated_at
before update on public.shopping_lists
for each row execute function public.set_updated_at();

drop trigger if exists shopping_items_set_updated_at on public.shopping_items;
create trigger shopping_items_set_updated_at
before update on public.shopping_items
for each row execute function public.set_updated_at();

create or replace function public.can_access_shopping_list(target_shopping_list_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.shopping_lists
    where id = target_shopping_list_id
      and archived_at is null
      and public.is_restaurant_member(restaurant_id)
  );
$$;

create or replace function public.can_access_shopping_item(target_shopping_item_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.shopping_items
    where id = target_shopping_item_id
      and public.is_restaurant_member(restaurant_id)
  );
$$;

create or replace function public.ensure_active_shopping_list(target_restaurant_id uuid)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_profile_id uuid := auth.uid();
  selected_shopping_list_id uuid;
begin
  if current_profile_id is null then
    raise exception 'Authentication required';
  end if;

  if not public.is_restaurant_member(target_restaurant_id) then
    raise exception 'Restaurant membership required';
  end if;

  select id
  into selected_shopping_list_id
  from public.shopping_lists
  where restaurant_id = target_restaurant_id
    and archived_at is null
  limit 1;

  if selected_shopping_list_id is null then
    insert into public.shopping_lists (restaurant_id, created_by_profile_id)
    values (target_restaurant_id, current_profile_id)
    returning id into selected_shopping_list_id;
  end if;

  return selected_shopping_list_id;
end;
$$;

create or replace function public.generate_shopping_list_from_meal_events(
  target_restaurant_id uuid,
  target_start_date date,
  target_end_date date
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_profile_id uuid := auth.uid();
  selected_shopping_list_id uuid;
  starting_position integer;
begin
  if current_profile_id is null then
    raise exception 'Authentication required';
  end if;

  if not public.is_restaurant_member(target_restaurant_id) then
    raise exception 'Restaurant membership required';
  end if;

  if target_start_date is null or target_end_date is null or target_start_date > target_end_date then
    raise exception 'Choose a valid shopping date range';
  end if;

  selected_shopping_list_id := public.ensure_active_shopping_list(target_restaurant_id);

  delete from public.shopping_items
  where shopping_list_id = selected_shopping_list_id
    and source = 'generated';

  select coalesce(max(position), 0)
  into starting_position
  from public.shopping_items
  where shopping_list_id = selected_shopping_list_id;

  with planned_ingredients as (
    select
      recipe_ingredients.ingredient_id,
      ingredients.name,
      ingredients.normalized_name,
      nullif(btrim(recipe_ingredients.unit), '') as unit,
      recipe_ingredients.quantity,
      case
        when meal_events.people_eating is not null
          and meal_events.servings_estimate is not null
          and meal_events.servings_estimate > 0
        then meal_events.people_eating::numeric / meal_events.servings_estimate
        else 1
      end as scale_factor
    from public.meal_events
    inner join public.recipes on recipes.id = meal_events.recipe_id
    inner join public.recipe_ingredients on recipe_ingredients.recipe_id = recipes.id
    inner join public.ingredients on ingredients.id = recipe_ingredients.ingredient_id
    where meal_events.restaurant_id = target_restaurant_id
      and meal_events.archived_at is null
      and recipes.archived_at is null
      and meal_events.planned_for between target_start_date and target_end_date
  ),
  consolidated as (
    select
      (array_agg(ingredient_id order by name))[1] as ingredient_id,
      max(name) as name,
      normalized_name,
      unit,
      case
        when bool_and(quantity is not null) then sum(quantity * scale_factor)
        else null
      end as quantity,
      count(*) as source_count
    from planned_ingredients
    group by normalized_name, unit
  ),
  numbered as (
    select
      consolidated.*,
      row_number() over (order by normalized_name, unit nulls first) as item_position
    from consolidated
  )
  insert into public.shopping_items (
    shopping_list_id,
    restaurant_id,
    ingredient_id,
    name,
    normalized_name,
    quantity,
    unit,
    notes,
    source,
    position,
    created_by_profile_id
  )
  select
    selected_shopping_list_id,
    target_restaurant_id,
    ingredient_id,
    name,
    normalized_name,
    quantity,
    unit,
    case
      when source_count = 1 then 'From 1 planned meal'
      else 'From ' || source_count::text || ' planned meals'
    end,
    'generated',
    starting_position + item_position,
    current_profile_id
  from numbered;

  update public.shopping_lists
  set source_start_date = target_start_date,
      source_end_date = target_end_date,
      generated_at = now()
  where id = selected_shopping_list_id;

  return selected_shopping_list_id;
end;
$$;

create or replace function public.add_manual_shopping_item(
  target_restaurant_id uuid,
  item_name text,
  item_quantity numeric,
  item_unit text,
  item_notes text
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_profile_id uuid := auth.uid();
  selected_shopping_list_id uuid;
  next_position integer;
  saved_item_id uuid;
  normalized_item_name text;
begin
  if current_profile_id is null then
    raise exception 'Authentication required';
  end if;

  if not public.is_restaurant_member(target_restaurant_id) then
    raise exception 'Restaurant membership required';
  end if;

  if item_name is null or char_length(btrim(item_name)) not between 1 and 120 then
    raise exception 'Shopping item name must be between 1 and 120 characters';
  end if;

  if item_quantity is not null and item_quantity <= 0 then
    raise exception 'Shopping item quantity must be positive';
  end if;

  if item_unit is not null and char_length(btrim(item_unit)) > 40 then
    raise exception 'Shopping item unit is too long';
  end if;

  if item_notes is not null and char_length(btrim(item_notes)) > 500 then
    raise exception 'Shopping item note is too long';
  end if;

  selected_shopping_list_id := public.ensure_active_shopping_list(target_restaurant_id);
  normalized_item_name := lower(regexp_replace(btrim(item_name), '\s+', ' ', 'g'));

  select coalesce(max(position), 0) + 1
  into next_position
  from public.shopping_items
  where shopping_list_id = selected_shopping_list_id;

  insert into public.shopping_items (
    shopping_list_id,
    restaurant_id,
    name,
    normalized_name,
    quantity,
    unit,
    notes,
    source,
    position,
    created_by_profile_id
  ) values (
    selected_shopping_list_id,
    target_restaurant_id,
    btrim(item_name),
    normalized_item_name,
    item_quantity,
    nullif(btrim(item_unit), ''),
    nullif(btrim(item_notes), ''),
    'manual',
    next_position,
    current_profile_id
  )
  returning id into saved_item_id;

  return saved_item_id;
end;
$$;

create or replace function public.set_shopping_item_purchased(
  target_shopping_item_id uuid,
  target_is_purchased boolean
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not public.can_access_shopping_item(target_shopping_item_id) then
    raise exception 'Shopping item access required';
  end if;

  update public.shopping_items
  set is_purchased = coalesce(target_is_purchased, false)
  where id = target_shopping_item_id;
end;
$$;

alter table public.shopping_lists enable row level security;
alter table public.shopping_items enable row level security;

drop policy if exists "Shopping lists are visible to Restaurant members" on public.shopping_lists;
create policy "Shopping lists are visible to Restaurant members"
on public.shopping_lists for select
to authenticated
using (public.is_restaurant_member(restaurant_id));

drop policy if exists "Shopping items are visible to Restaurant members" on public.shopping_items;
create policy "Shopping items are visible to Restaurant members"
on public.shopping_items for select
to authenticated
using (public.is_restaurant_member(restaurant_id));

revoke all on table public.shopping_lists from anon, authenticated;
revoke all on table public.shopping_items from anon, authenticated;
grant select on table public.shopping_lists to authenticated;
grant select on table public.shopping_items to authenticated;

revoke all on function public.can_access_shopping_list(uuid) from public;
revoke all on function public.can_access_shopping_item(uuid) from public;
revoke all on function public.ensure_active_shopping_list(uuid) from public;
revoke all on function public.generate_shopping_list_from_meal_events(uuid, date, date) from public;
revoke all on function public.add_manual_shopping_item(uuid, text, numeric, text, text) from public;
revoke all on function public.set_shopping_item_purchased(uuid, boolean) from public;

grant execute on function public.can_access_shopping_list(uuid) to authenticated;
grant execute on function public.can_access_shopping_item(uuid) to authenticated;
grant execute on function public.ensure_active_shopping_list(uuid) to authenticated;
grant execute on function public.generate_shopping_list_from_meal_events(uuid, date, date) to authenticated;
grant execute on function public.add_manual_shopping_item(uuid, text, numeric, text, text) to authenticated;
grant execute on function public.set_shopping_item_purchased(uuid, boolean) to authenticated;

commit;
