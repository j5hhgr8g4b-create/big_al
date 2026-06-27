begin;

create table if not exists public.meal_events (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants (id) on delete cascade,
  recipe_id uuid not null references public.recipes (id) on delete restrict,
  planned_for date not null,
  meal_type text check (
    meal_type is null or meal_type in ('breakfast', 'lunch', 'dinner', 'snack', 'other')
  ),
  people_eating integer check (people_eating is null or people_eating > 0),
  servings_estimate numeric(8, 2) check (servings_estimate is null or servings_estimate > 0),
  notes text check (notes is null or char_length(btrim(notes)) between 1 and 1000),
  created_by_profile_id uuid not null references public.profiles (id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  archived_at timestamptz
);

create index if not exists meal_events_restaurant_planned_active_idx
  on public.meal_events (restaurant_id, planned_for)
  where archived_at is null;

create index if not exists meal_events_recipe_id_idx
  on public.meal_events (recipe_id);

drop trigger if exists meal_events_set_updated_at on public.meal_events;
create trigger meal_events_set_updated_at
before update on public.meal_events
for each row execute function public.set_updated_at();

create or replace function public.can_access_meal_event(target_meal_event_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.meal_events
    where id = target_meal_event_id
      and public.is_restaurant_member(restaurant_id)
  );
$$;

create or replace function public.save_meal_event(
  target_meal_event_id uuid,
  target_restaurant_id uuid,
  target_recipe_id uuid,
  target_planned_for date,
  target_meal_type text,
  target_people_eating integer,
  target_notes text
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_profile_id uuid := auth.uid();
  saved_meal_event_id uuid := coalesce(target_meal_event_id, gen_random_uuid());
  recipe_restaurant_id uuid;
  recipe_servings numeric;
  existing_restaurant_id uuid;
begin
  if current_profile_id is null then
    raise exception 'Authentication required';
  end if;

  if not public.is_restaurant_member(target_restaurant_id) then
    raise exception 'Restaurant membership required';
  end if;

  if target_planned_for is null then
    raise exception 'Planned date is required';
  end if;

  if target_people_eating is null or target_people_eating <= 0 then
    raise exception 'People eating must be greater than zero';
  end if;

  if target_meal_type is not null
    and target_meal_type not in ('breakfast', 'lunch', 'dinner', 'snack', 'other') then
    raise exception 'Invalid meal type';
  end if;

  if target_notes is not null and char_length(btrim(target_notes)) > 1000 then
    raise exception 'Meal note is too long';
  end if;

  select cookbooks.restaurant_id, recipes.servings
  into recipe_restaurant_id, recipe_servings
  from public.recipes
  inner join public.cookbooks on cookbooks.id = recipes.cookbook_id
  where recipes.id = target_recipe_id
    and recipes.archived_at is null;

  if recipe_restaurant_id is null then
    raise exception 'Recipe not found';
  end if;

  if recipe_restaurant_id <> target_restaurant_id then
    raise exception 'Recipe belongs to another Restaurant';
  end if;

  select restaurant_id
  into existing_restaurant_id
  from public.meal_events
  where id = saved_meal_event_id;

  if found then
    if existing_restaurant_id <> target_restaurant_id then
      raise exception 'Meal event belongs to another Restaurant';
    end if;

    if exists (
      select 1 from public.meal_events
      where id = saved_meal_event_id and archived_at is not null
    ) then
      raise exception 'Archived meal events cannot be edited';
    end if;

    update public.meal_events
    set recipe_id = target_recipe_id,
        planned_for = target_planned_for,
        meal_type = target_meal_type,
        people_eating = target_people_eating,
        servings_estimate = recipe_servings,
        notes = nullif(btrim(target_notes), '')
    where id = saved_meal_event_id;
  else
    insert into public.meal_events (
      id,
      restaurant_id,
      recipe_id,
      planned_for,
      meal_type,
      people_eating,
      servings_estimate,
      notes,
      created_by_profile_id
    ) values (
      saved_meal_event_id,
      target_restaurant_id,
      target_recipe_id,
      target_planned_for,
      target_meal_type,
      target_people_eating,
      recipe_servings,
      nullif(btrim(target_notes), ''),
      current_profile_id
    );
  end if;

  return saved_meal_event_id;
end;
$$;

create or replace function public.archive_meal_event(target_meal_event_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not public.can_access_meal_event(target_meal_event_id) then
    raise exception 'Meal event access required';
  end if;

  update public.meal_events
  set archived_at = coalesce(archived_at, now())
  where id = target_meal_event_id;
end;
$$;

alter table public.meal_events enable row level security;

drop policy if exists "Meal events are visible to Restaurant members" on public.meal_events;
create policy "Meal events are visible to Restaurant members"
on public.meal_events for select
to authenticated
using (public.is_restaurant_member(restaurant_id));

revoke all on table public.meal_events from anon, authenticated;
grant select on table public.meal_events to authenticated;

revoke all on function public.can_access_meal_event(uuid) from public;
revoke all on function public.save_meal_event(uuid, uuid, uuid, date, text, integer, text) from public;
revoke all on function public.archive_meal_event(uuid) from public;

grant execute on function public.can_access_meal_event(uuid) to authenticated;
grant execute on function public.save_meal_event(uuid, uuid, uuid, date, text, integer, text) to authenticated;
grant execute on function public.archive_meal_event(uuid) to authenticated;

commit;
