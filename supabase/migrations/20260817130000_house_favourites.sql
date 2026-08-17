begin;

create table if not exists public.house_favourites (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants (id) on delete cascade,
  recipe_id uuid not null references public.recipes (id) on delete cascade,
  marked_by_profile_id uuid not null references public.profiles (id) on delete restrict,
  created_at timestamptz not null default now(),
  unique (restaurant_id, recipe_id)
);

create index if not exists house_favourites_recipe_id_idx
  on public.house_favourites (recipe_id);

create or replace function public.recipe_belongs_to_restaurant(
  target_recipe_id uuid,
  target_restaurant_id uuid
)
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
      and cookbooks.restaurant_id = target_restaurant_id
      and recipes.archived_at is null
  );
$$;

create or replace function public.toggle_house_favourite(
  target_recipe_id uuid,
  target_restaurant_id uuid,
  should_mark boolean
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_profile_id uuid := auth.uid();
begin
  if current_profile_id is null then
    raise exception 'Authentication required';
  end if;

  if not public.is_restaurant_member(target_restaurant_id) then
    raise exception 'Restaurant membership required';
  end if;

  if not public.recipe_belongs_to_restaurant(target_recipe_id, target_restaurant_id) then
    raise exception 'Recipe does not belong to this Restaurant';
  end if;

  if should_mark then
    insert into public.house_favourites (restaurant_id, recipe_id, marked_by_profile_id)
    values (target_restaurant_id, target_recipe_id, current_profile_id)
    on conflict (restaurant_id, recipe_id)
    do update set marked_by_profile_id = excluded.marked_by_profile_id;
  else
    delete from public.house_favourites
    where restaurant_id = target_restaurant_id
      and recipe_id = target_recipe_id;
  end if;

  return should_mark;
end;
$$;

alter table public.house_favourites enable row level security;

drop policy if exists "House Favourites are visible to Restaurant members" on public.house_favourites;
create policy "House Favourites are visible to Restaurant members"
on public.house_favourites for select
to authenticated
using (
  public.is_restaurant_member(restaurant_id)
  and public.recipe_belongs_to_restaurant(recipe_id, restaurant_id)
);

drop policy if exists "House Favourites can be marked by Restaurant members" on public.house_favourites;
create policy "House Favourites can be marked by Restaurant members"
on public.house_favourites for insert
to authenticated
with check (
  public.is_restaurant_member(restaurant_id)
  and marked_by_profile_id = (select auth.uid())
  and public.recipe_belongs_to_restaurant(recipe_id, restaurant_id)
);

drop policy if exists "House Favourites can be removed by Restaurant members" on public.house_favourites;
create policy "House Favourites can be removed by Restaurant members"
on public.house_favourites for delete
to authenticated
using (
  public.is_restaurant_member(restaurant_id)
  and public.recipe_belongs_to_restaurant(recipe_id, restaurant_id)
);

revoke all on table public.house_favourites from anon, authenticated;
grant select, insert, delete on table public.house_favourites to authenticated;

revoke all on function public.recipe_belongs_to_restaurant(uuid, uuid) from public;
revoke all on function public.toggle_house_favourite(uuid, uuid, boolean) from public;
grant execute on function public.recipe_belongs_to_restaurant(uuid, uuid) to authenticated;
grant execute on function public.toggle_house_favourite(uuid, uuid, boolean) to authenticated;

commit;
