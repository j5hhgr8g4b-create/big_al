begin;

create or replace function public.discard_import(target_import_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  selected_import public.imports;
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
    raise exception 'Only pending Imports can be discarded';
  end if;

  update public.imports
  set archived_at = now()
  where id = selected_import.id;
end;
$$;

revoke all on function public.discard_import(uuid) from public;
grant execute on function public.discard_import(uuid) to authenticated;

commit;
