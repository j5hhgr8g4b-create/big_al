begin;

create or replace function public.create_import(
  target_import_id uuid,
  target_restaurant_id uuid,
  import_source_url text,
  import_raw_text text,
  import_parser_name text,
  import_parser_output jsonb
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
  cleaned_parser_name text := coalesce(nullif(btrim(import_parser_name), ''), 'manual-placeholder-v1');
  cleaned_parser_output jsonb := coalesce(import_parser_output, '{}'::jsonb);
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
    cleaned_parser_name,
    cleaned_parser_output
  );

  return saved_import_id;
end;
$$;

revoke all on function public.create_import(uuid, uuid, text, text, text, jsonb) from public;
grant execute on function public.create_import(uuid, uuid, text, text, text, jsonb) to authenticated;

commit;
