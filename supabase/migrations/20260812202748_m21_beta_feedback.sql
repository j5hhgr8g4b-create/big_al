create table public.beta_feedback (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants(id) on delete cascade,
  submitted_by uuid not null references public.profiles(id) on delete cascade,
  category text not null check (category in ('problem', 'confusing', 'recipe', 'expected', 'general')),
  page_path text not null check (char_length(page_path) between 1 and 300),
  feedback_text text not null check (char_length(feedback_text) between 10 and 4000),
  created_at timestamptz not null default timezone('utc', now())
);

create index beta_feedback_restaurant_created_idx
  on public.beta_feedback (restaurant_id, created_at desc);

alter table public.beta_feedback enable row level security;

create policy "Beta feedback is visible to its submitter"
on public.beta_feedback
for select
to authenticated
using (
  submitted_by = (select auth.uid())
  and public.is_restaurant_member(restaurant_id)
);

create or replace function public.submit_beta_feedback(
  target_restaurant_id uuid,
  feedback_category text,
  feedback_page_path text,
  feedback_text_value text
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  feedback_id uuid;
  current_user_id uuid := auth.uid();
  normalized_category text := lower(trim(feedback_category));
  normalized_page_path text := trim(feedback_page_path);
  normalized_feedback text := trim(feedback_text_value);
begin
  if current_user_id is null then
    raise exception 'Authentication required';
  end if;

  if not public.is_restaurant_member(target_restaurant_id) then
    raise exception 'Restaurant access denied';
  end if;

  if normalized_category not in ('problem', 'confusing', 'recipe', 'expected', 'general') then
    raise exception 'Invalid feedback category';
  end if;

  if char_length(normalized_page_path) < 1
    or char_length(normalized_page_path) > 300
    or left(normalized_page_path, 1) <> '/'
    or left(normalized_page_path, 2) = '//'
  then
    raise exception 'Invalid feedback page';
  end if;

  if char_length(normalized_feedback) < 10 or char_length(normalized_feedback) > 4000 then
    raise exception 'Invalid feedback length';
  end if;

  insert into public.beta_feedback (
    restaurant_id,
    submitted_by,
    category,
    page_path,
    feedback_text
  )
  values (
    target_restaurant_id,
    current_user_id,
    normalized_category,
    normalized_page_path,
    normalized_feedback
  )
  returning id into feedback_id;

  return feedback_id;
end;
$$;

revoke all on table public.beta_feedback from public, anon, authenticated;
revoke all on function public.submit_beta_feedback(uuid, text, text, text) from public, anon;

grant select on table public.beta_feedback to authenticated;
grant execute on function public.submit_beta_feedback(uuid, text, text, text) to authenticated;
