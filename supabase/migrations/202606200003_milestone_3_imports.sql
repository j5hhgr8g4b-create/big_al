begin;

create table if not exists public.imports (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants (id) on delete cascade,
  created_by uuid not null references public.profiles (id) on delete restrict,
  source_type text not null check (source_type in ('url', 'text')),
  source_url text check (source_url is null or char_length(btrim(source_url)) between 1 and 2000),
  raw_text text check (raw_text is null or char_length(btrim(raw_text)) between 1 and 100000),
  status text not null default 'needs_review' check (status in ('needs_review', 'converted')),
  parser_name text not null default 'manual-placeholder-v1',
  parser_output jsonb not null default '{}'::jsonb,
  recipe_id uuid unique references public.recipes (id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  converted_at timestamptz,
  archived_at timestamptz,
  check (source_url is not null or raw_text is not null),
  check (
    (status = 'needs_review' and recipe_id is null and converted_at is null)
    or (status = 'converted' and recipe_id is not null and converted_at is not null)
  )
);

create index if not exists imports_restaurant_status_created_idx
  on public.imports (restaurant_id, status, created_at desc)
  where archived_at is null;

drop trigger if exists imports_set_updated_at on public.imports;
create trigger imports_set_updated_at
before update on public.imports
for each row execute function public.set_updated_at();

create or replace function public.can_access_import(target_import_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.imports
    where id = target_import_id
      and public.is_restaurant_member(restaurant_id)
  );
$$;

create or replace function public.create_import(
  target_import_id uuid,
  target_restaurant_id uuid,
  import_source_url text,
  import_raw_text text
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_profile_id uuid := auth.uid();
  saved_import_id uuid := coalesce(target_import_id, gen_random_uuid());
  cleaned_url text := nullif(btrim(import_source_url), '');
  cleaned_text text := nullif(btrim(import_raw_text), '');
begin
  if current_profile_id is null then
    raise exception 'Authentication required';
  end if;

  if not public.is_restaurant_member(target_restaurant_id) then
    raise exception 'Restaurant membership required';
  end if;

  if cleaned_url is null and cleaned_text is null then
    raise exception 'A source URL or pasted text is required';
  end if;

  if cleaned_url is not null and char_length(cleaned_url) > 2000 then
    raise exception 'Source URL is too long';
  end if;

  if cleaned_text is not null and char_length(cleaned_text) > 100000 then
    raise exception 'Pasted text is too long';
  end if;

  insert into public.imports (
    id,
    restaurant_id,
    created_by,
    source_type,
    source_url,
    raw_text,
    status,
    parser_name,
    parser_output
  ) values (
    saved_import_id,
    target_restaurant_id,
    current_profile_id,
    case when cleaned_url is not null then 'url' else 'text' end,
    cleaned_url,
    cleaned_text,
    'needs_review',
    'manual-placeholder-v1',
    jsonb_build_object(
      'status', 'placeholder',
      'message', 'Automatic parsing is not enabled. Review and structure this Import manually.'
    )
  );

  return saved_import_id;
end;
$$;

create or replace function public.convert_import_to_recipe(
  target_import_id uuid,
  target_recipe_id uuid,
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

alter table public.imports enable row level security;

drop policy if exists "Imports are visible to Restaurant members" on public.imports;
create policy "Imports are visible to Restaurant members"
on public.imports for select
to authenticated
using (public.is_restaurant_member(restaurant_id));

revoke all on table public.imports from anon, authenticated;
grant select on table public.imports to authenticated;

revoke all on function public.can_access_import(uuid) from public;
revoke all on function public.create_import(uuid, uuid, text, text) from public;
revoke all on function public.convert_import_to_recipe(
  uuid, uuid, text, text, text, text, integer, integer, numeric, text, jsonb, jsonb
) from public;

grant execute on function public.can_access_import(uuid) to authenticated;
grant execute on function public.create_import(uuid, uuid, text, text) to authenticated;
grant execute on function public.convert_import_to_recipe(
  uuid, uuid, text, text, text, text, integer, integer, numeric, text, jsonb, jsonb
) to authenticated;

commit;
