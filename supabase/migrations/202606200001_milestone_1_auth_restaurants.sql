begin;

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null check (char_length(btrim(display_name)) between 1 and 80),
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.chefs (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null unique references public.profiles (id) on delete cascade,
  display_name text not null check (char_length(btrim(display_name)) between 1 and 80),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.restaurants (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(btrim(name)) between 1 and 100),
  created_by uuid not null references public.profiles (id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  archived_at timestamptz
);

create table if not exists public.restaurant_members (
  restaurant_id uuid not null references public.restaurants (id) on delete cascade,
  profile_id uuid not null references public.profiles (id) on delete cascade,
  role text not null check (role in ('owner', 'member')),
  created_at timestamptz not null default now(),
  primary key (restaurant_id, profile_id)
);

create index if not exists restaurant_members_profile_id_idx
  on public.restaurant_members (profile_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists chefs_set_updated_at on public.chefs;
create trigger chefs_set_updated_at
before update on public.chefs
for each row execute function public.set_updated_at();

drop trigger if exists restaurants_set_updated_at on public.restaurants;
create trigger restaurants_set_updated_at
before update on public.restaurants
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  new_display_name text;
begin
  new_display_name := left(
    coalesce(nullif(btrim(new.raw_user_meta_data ->> 'display_name'), ''), 'Chef'),
    80
  );

  insert into public.profiles (id, display_name)
  values (new.id, new_display_name);

  insert into public.chefs (profile_id, display_name)
  values (new.id, new_display_name);

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

insert into public.profiles (id, display_name)
select
  users.id,
  left(
    coalesce(nullif(btrim(users.raw_user_meta_data ->> 'display_name'), ''), 'Chef'),
    80
  )
from auth.users as users
on conflict (id) do nothing;

insert into public.chefs (profile_id, display_name)
select profiles.id, profiles.display_name
from public.profiles as profiles
where not exists (
  select 1
  from public.chefs
  where chefs.profile_id = profiles.id
);

create or replace function public.is_restaurant_member(target_restaurant_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.restaurant_members
    where restaurant_id = target_restaurant_id
      and profile_id = (select auth.uid())
  );
$$;

create or replace function public.is_restaurant_owner(target_restaurant_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.restaurant_members
    where restaurant_id = target_restaurant_id
      and profile_id = (select auth.uid())
      and role = 'owner'
  );
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

  insert into public.restaurants (name, created_by)
  values (cleaned_name, current_profile_id)
  returning * into created_restaurant;

  insert into public.restaurant_members (restaurant_id, profile_id, role)
  values (created_restaurant.id, current_profile_id, 'owner');

  return created_restaurant;
end;
$$;

alter table public.profiles enable row level security;
alter table public.chefs enable row level security;
alter table public.restaurants enable row level security;
alter table public.restaurant_members enable row level security;

drop policy if exists "Profiles are visible to their owner" on public.profiles;
create policy "Profiles are visible to their owner"
on public.profiles for select
to authenticated
using (id = (select auth.uid()));

drop policy if exists "Profiles are editable by their owner" on public.profiles;
create policy "Profiles are editable by their owner"
on public.profiles for update
to authenticated
using (id = (select auth.uid()))
with check (id = (select auth.uid()));

drop policy if exists "Chefs are visible to their owner" on public.chefs;
create policy "Chefs are visible to their owner"
on public.chefs for select
to authenticated
using (profile_id = (select auth.uid()));

drop policy if exists "Chefs are editable by their owner" on public.chefs;
create policy "Chefs are editable by their owner"
on public.chefs for update
to authenticated
using (profile_id = (select auth.uid()))
with check (profile_id = (select auth.uid()));

drop policy if exists "Restaurants are visible to members" on public.restaurants;
create policy "Restaurants are visible to members"
on public.restaurants for select
to authenticated
using (public.is_restaurant_member(id));

drop policy if exists "Restaurants are editable by owners" on public.restaurants;
create policy "Restaurants are editable by owners"
on public.restaurants for update
to authenticated
using (public.is_restaurant_owner(id))
with check (public.is_restaurant_owner(id));

drop policy if exists "Restaurant memberships are visible to members" on public.restaurant_members;
create policy "Restaurant memberships are visible to members"
on public.restaurant_members for select
to authenticated
using (public.is_restaurant_member(restaurant_id));

revoke all on table public.profiles from anon, authenticated;
revoke all on table public.chefs from anon, authenticated;
revoke all on table public.restaurants from anon, authenticated;
revoke all on table public.restaurant_members from anon, authenticated;

grant select on table public.profiles to authenticated;
grant update (display_name, avatar_url) on table public.profiles to authenticated;
grant select on table public.chefs to authenticated;
grant update (display_name) on table public.chefs to authenticated;
grant select on table public.restaurants to authenticated;
grant update (name, archived_at) on table public.restaurants to authenticated;
grant select on table public.restaurant_members to authenticated;

revoke all on function public.is_restaurant_member(uuid) from public;
revoke all on function public.is_restaurant_owner(uuid) from public;
revoke all on function public.create_restaurant(text) from public;
revoke all on function public.handle_new_user() from public;
revoke all on function public.set_updated_at() from public;

grant execute on function public.is_restaurant_member(uuid) to authenticated;
grant execute on function public.is_restaurant_owner(uuid) to authenticated;
grant execute on function public.create_restaurant(text) to authenticated;

commit;
