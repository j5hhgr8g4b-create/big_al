begin;

create table if not exists public.recipe_books (
  id uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants (id) on delete cascade,
  created_by uuid not null references public.profiles (id) on delete restrict,
  title text not null check (char_length(btrim(title)) between 1 and 120),
  description text check (description is null or char_length(btrim(description)) between 1 and 1000),
  cover_image_url text check (
    cover_image_url is null or char_length(btrim(cover_image_url)) between 1 and 2000
  ),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  archived_at timestamptz
);

create table if not exists public.recipe_book_recipes (
  recipe_book_id uuid not null references public.recipe_books (id) on delete cascade,
  recipe_id uuid not null references public.recipes (id) on delete cascade,
  added_by uuid not null references public.profiles (id) on delete restrict,
  created_at timestamptz not null default now(),
  primary key (recipe_book_id, recipe_id)
);

create index if not exists recipe_books_restaurant_active_idx
  on public.recipe_books (restaurant_id, created_at desc)
  where archived_at is null;

create index if not exists recipe_book_recipes_recipe_id_idx
  on public.recipe_book_recipes (recipe_id);

drop trigger if exists recipe_books_set_updated_at on public.recipe_books;
create trigger recipe_books_set_updated_at
before update on public.recipe_books
for each row execute function public.set_updated_at();

create or replace function public.can_access_recipe_book(target_recipe_book_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.recipe_books
    where id = target_recipe_book_id
      and public.is_restaurant_member(restaurant_id)
  );
$$;

create or replace function public.save_recipe_book(
  target_recipe_book_id uuid,
  target_restaurant_id uuid,
  book_title text,
  book_description text,
  book_cover_image_url text
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_profile_id uuid := auth.uid();
  saved_recipe_book_id uuid := coalesce(target_recipe_book_id, gen_random_uuid());
  existing_restaurant_id uuid;
begin
  if current_profile_id is null then
    raise exception 'Authentication required';
  end if;

  if not public.is_restaurant_member(target_restaurant_id) then
    raise exception 'Restaurant membership required';
  end if;

  if book_title is null or char_length(btrim(book_title)) not between 1 and 120 then
    raise exception 'Recipe Book title must be between 1 and 120 characters';
  end if;

  if book_description is not null and char_length(btrim(book_description)) > 1000 then
    raise exception 'Recipe Book description is too long';
  end if;

  if book_cover_image_url is not null and char_length(btrim(book_cover_image_url)) > 2000 then
    raise exception 'Recipe Book cover URL is too long';
  end if;

  select restaurant_id
  into existing_restaurant_id
  from public.recipe_books
  where id = saved_recipe_book_id;

  if found then
    if existing_restaurant_id <> target_restaurant_id then
      raise exception 'Recipe Book belongs to another Restaurant';
    end if;

    if exists (
      select 1 from public.recipe_books
      where id = saved_recipe_book_id and archived_at is not null
    ) then
      raise exception 'Archived Recipe Books cannot be edited';
    end if;

    update public.recipe_books
    set title = btrim(book_title),
        description = nullif(btrim(book_description), ''),
        cover_image_url = nullif(btrim(book_cover_image_url), '')
    where id = saved_recipe_book_id;
  else
    insert into public.recipe_books (
      id,
      restaurant_id,
      created_by,
      title,
      description,
      cover_image_url
    ) values (
      saved_recipe_book_id,
      target_restaurant_id,
      current_profile_id,
      btrim(book_title),
      nullif(btrim(book_description), ''),
      nullif(btrim(book_cover_image_url), '')
    );
  end if;

  return saved_recipe_book_id;
end;
$$;

create or replace function public.archive_recipe_book(target_recipe_book_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not public.can_access_recipe_book(target_recipe_book_id) then
    raise exception 'Recipe Book access required';
  end if;

  update public.recipe_books
  set archived_at = coalesce(archived_at, now())
  where id = target_recipe_book_id;
end;
$$;

create or replace function public.set_recipe_books(
  target_recipe_id uuid,
  selected_recipe_book_ids uuid[]
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_profile_id uuid := auth.uid();
  recipe_restaurant_id uuid;
  selected_ids uuid[] := coalesce(selected_recipe_book_ids, '{}'::uuid[]);
begin
  if current_profile_id is null then
    raise exception 'Authentication required';
  end if;

  select cookbooks.restaurant_id
  into recipe_restaurant_id
  from public.recipes
  inner join public.cookbooks on cookbooks.id = recipes.cookbook_id
  where recipes.id = target_recipe_id
    and recipes.archived_at is null;

  if recipe_restaurant_id is null or not public.is_restaurant_member(recipe_restaurant_id) then
    raise exception 'Recipe access required';
  end if;

  if exists (
    select 1
    from unnest(selected_ids) as selected(selected_id)
    left join public.recipe_books on recipe_books.id = selected.selected_id
    where recipe_books.id is null
      or recipe_books.restaurant_id <> recipe_restaurant_id
      or recipe_books.archived_at is not null
  ) then
    raise exception 'Every Recipe Book must belong to the Recipe Restaurant';
  end if;

  delete from public.recipe_book_recipes
  where recipe_id = target_recipe_id;

  insert into public.recipe_book_recipes (recipe_book_id, recipe_id, added_by)
  select distinct selected.selected_id, target_recipe_id, current_profile_id
  from unnest(selected_ids) as selected(selected_id);
end;
$$;

create or replace function public.search_recipes(
  target_restaurant_id uuid,
  search_query text
)
returns table (
  id uuid,
  title text,
  description text,
  prep_minutes integer,
  cook_minutes integer,
  servings numeric,
  difficulty text,
  created_at timestamptz
)
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  cleaned_query text := lower(btrim(search_query));
begin
  if not public.is_restaurant_member(target_restaurant_id) then
    raise exception 'Restaurant membership required';
  end if;

  if cleaned_query is null or cleaned_query = '' then
    return;
  end if;

  return query
  select
    recipes.id,
    recipes.title,
    recipes.description,
    recipes.prep_minutes,
    recipes.cook_minutes,
    recipes.servings,
    recipes.difficulty,
    recipes.created_at
  from public.recipes
  inner join public.cookbooks on cookbooks.id = recipes.cookbook_id
  where cookbooks.restaurant_id = target_restaurant_id
    and recipes.archived_at is null
    and (
      position(cleaned_query in lower(recipes.title)) > 0
      or exists (
        select 1
        from public.recipe_ingredients
        inner join public.ingredients on ingredients.id = recipe_ingredients.ingredient_id
        where recipe_ingredients.recipe_id = recipes.id
          and position(cleaned_query in lower(ingredients.name)) > 0
      )
    )
  order by recipes.created_at desc;
end;
$$;

alter table public.recipe_books enable row level security;
alter table public.recipe_book_recipes enable row level security;

drop policy if exists "Recipe Books are visible to Restaurant members" on public.recipe_books;
create policy "Recipe Books are visible to Restaurant members"
on public.recipe_books for select
to authenticated
using (public.is_restaurant_member(restaurant_id));

drop policy if exists "Recipe Book memberships are visible to Restaurant members"
on public.recipe_book_recipes;
create policy "Recipe Book memberships are visible to Restaurant members"
on public.recipe_book_recipes for select
to authenticated
using (
  public.can_access_recipe_book(recipe_book_id)
  and public.can_access_recipe(recipe_id)
);

revoke all on table public.recipe_books from anon, authenticated;
revoke all on table public.recipe_book_recipes from anon, authenticated;
grant select on table public.recipe_books to authenticated;
grant select on table public.recipe_book_recipes to authenticated;

revoke all on function public.can_access_recipe_book(uuid) from public;
revoke all on function public.save_recipe_book(uuid, uuid, text, text, text) from public;
revoke all on function public.archive_recipe_book(uuid) from public;
revoke all on function public.set_recipe_books(uuid, uuid[]) from public;
revoke all on function public.search_recipes(uuid, text) from public;

grant execute on function public.can_access_recipe_book(uuid) to authenticated;
grant execute on function public.save_recipe_book(uuid, uuid, text, text, text) to authenticated;
grant execute on function public.archive_recipe_book(uuid) to authenticated;
grant execute on function public.set_recipe_books(uuid, uuid[]) to authenticated;
grant execute on function public.search_recipes(uuid, text) to authenticated;

commit;
