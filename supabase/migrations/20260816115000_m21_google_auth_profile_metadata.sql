begin;

-- Google supplies full_name/name rather than Big Al's display_name key. Keep
-- the existing profile/Chef trigger model, but use the provider metadata when
-- it is available so social users enter the same normal profile flow.
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
    coalesce(
      nullif(btrim(new.raw_user_meta_data ->> 'display_name'), ''),
      nullif(btrim(new.raw_user_meta_data ->> 'full_name'), ''),
      nullif(btrim(new.raw_user_meta_data ->> 'name'), ''),
      nullif(btrim(split_part(coalesce(new.email, ''), '@', 1)), ''),
      'Chef'
    ),
    80
  );

  insert into public.profiles (id, display_name)
  values (new.id, new_display_name);

  insert into public.chefs (profile_id, display_name)
  values (new.id, new_display_name);

  return new;
end;
$$;

revoke all on function public.handle_new_user() from public;

commit;
