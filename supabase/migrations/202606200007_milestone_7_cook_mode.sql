begin;

create table if not exists public.recipe_cooks (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants (id) on delete cascade,
  recipe_id uuid not null references public.recipes (id) on delete restrict,
  cooked_by_profile_id uuid not null references public.profiles (id) on delete restrict,
  cooked_at timestamptz not null default now(),
  cook_again boolean,
  created_at timestamptz not null default now()
);

create index if not exists recipe_cooks_restaurant_cooked_at_idx
  on public.recipe_cooks (restaurant_id, cooked_at desc);

create index if not exists recipe_cooks_recipe_cooked_at_idx
  on public.recipe_cooks (recipe_id, cooked_at desc);

create index if not exists recipe_cooks_cooked_by_profile_idx
  on public.recipe_cooks (cooked_by_profile_id, cooked_at desc);

create or replace function public.record_recipe_cooked(target_recipe_id uuid)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_profile_id uuid := auth.uid();
  selected_restaurant_id uuid;
  saved_recipe_cook_id uuid;
begin
  if current_profile_id is null then
    raise exception 'Authentication required';
  end if;

  select cookbooks.restaurant_id
  into selected_restaurant_id
  from public.recipes
  inner join public.cookbooks on cookbooks.id = recipes.cookbook_id
  where recipes.id = target_recipe_id
    and recipes.archived_at is null;

  if selected_restaurant_id is null then
    raise exception 'Recipe not found';
  end if;

  if not public.is_restaurant_member(selected_restaurant_id) then
    raise exception 'Restaurant membership required';
  end if;

  insert into public.recipe_cooks (
    restaurant_id,
    recipe_id,
    cooked_by_profile_id
  ) values (
    selected_restaurant_id,
    target_recipe_id,
    current_profile_id
  )
  returning id into saved_recipe_cook_id;

  return saved_recipe_cook_id;
end;
$$;

create or replace function public.set_recipe_cook_again(
  target_recipe_cook_id uuid,
  target_cook_again boolean
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_profile_id uuid := auth.uid();
  selected_restaurant_id uuid;
  selected_profile_id uuid;
begin
  if current_profile_id is null then
    raise exception 'Authentication required';
  end if;

  select restaurant_id, cooked_by_profile_id
  into selected_restaurant_id, selected_profile_id
  from public.recipe_cooks
  where id = target_recipe_cook_id;

  if selected_restaurant_id is null then
    raise exception 'Recipe cook record not found';
  end if;

  if selected_profile_id <> current_profile_id then
    raise exception 'Only the cook can answer cook-again feedback';
  end if;

  if not public.is_restaurant_member(selected_restaurant_id) then
    raise exception 'Restaurant membership required';
  end if;

  update public.recipe_cooks
  set cook_again = target_cook_again
  where id = target_recipe_cook_id;
end;
$$;

alter table public.recipe_cooks enable row level security;

drop policy if exists "Recipe cooks are visible to Restaurant members" on public.recipe_cooks;
create policy "Recipe cooks are visible to Restaurant members"
on public.recipe_cooks for select
to authenticated
using (public.is_restaurant_member(restaurant_id));

revoke all on table public.recipe_cooks from anon, authenticated;
grant select on table public.recipe_cooks to authenticated;

revoke all on function public.record_recipe_cooked(uuid) from public;
revoke all on function public.set_recipe_cook_again(uuid, boolean) from public;

grant execute on function public.record_recipe_cooked(uuid) to authenticated;
grant execute on function public.set_recipe_cook_again(uuid, boolean) to authenticated;

commit;
