begin;

revoke execute on function public.save_recipe(
  uuid,
  uuid,
  text,
  text,
  text,
  text,
  text,
  text,
  integer,
  integer,
  numeric,
  text,
  jsonb,
  jsonb
) from anon;

revoke execute on function public.convert_import_to_recipe(
  uuid,
  uuid,
  text,
  text,
  text,
  text,
  text,
  text,
  integer,
  integer,
  numeric,
  text,
  jsonb,
  jsonb
) from anon;

revoke execute on function public.save_restaurant_cooking_preferences(
  uuid,
  text,
  text,
  text,
  text[]
) from anon;

commit;
