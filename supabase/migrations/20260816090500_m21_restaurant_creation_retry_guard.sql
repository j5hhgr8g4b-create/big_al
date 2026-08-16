begin;

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

  -- Serialize retries for one user before checking membership and inserting.
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

  return created_restaurant;
end;
$$;

commit;
