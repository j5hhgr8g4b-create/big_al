begin;

create or replace function public.generate_shopping_list_from_meal_events(
  target_restaurant_id uuid,
  target_start_date date,
  target_end_date date
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_profile_id uuid := auth.uid();
  selected_shopping_list_id uuid;
  starting_position integer;
begin
  if current_profile_id is null then
    raise exception 'Authentication required';
  end if;

  if not public.is_restaurant_member(target_restaurant_id) then
    raise exception 'Restaurant membership required';
  end if;

  if target_start_date is null or target_end_date is null or target_start_date > target_end_date then
    raise exception 'Choose a valid shopping date range';
  end if;

  selected_shopping_list_id := public.ensure_active_shopping_list(target_restaurant_id);

  delete from public.shopping_items
  where shopping_list_id = selected_shopping_list_id
    and source = 'generated';

  select coalesce(max(position), 0)
  into starting_position
  from public.shopping_items
  where shopping_list_id = selected_shopping_list_id;

  with planned_ingredients as (
    select
      meal_events.id as meal_event_id,
      meal_events.planned_for,
      recipes.title as recipe_title,
      recipe_ingredients.ingredient_id,
      ingredients.name,
      nullif(btrim(recipe_ingredients.unit), '') as saved_unit,
      recipe_ingredients.quantity,
      case
        when meal_events.people_eating is not null
          and meal_events.servings_estimate is not null
          and meal_events.servings_estimate > 0
        then meal_events.people_eating::numeric / meal_events.servings_estimate
        else 1
      end as scale_factor
    from public.meal_events
    inner join public.recipes on recipes.id = meal_events.recipe_id
    inner join public.recipe_ingredients on recipe_ingredients.recipe_id = recipes.id
    inner join public.ingredients on ingredients.id = recipe_ingredients.ingredient_id
    where meal_events.restaurant_id = target_restaurant_id
      and meal_events.archived_at is null
      and recipes.archived_at is null
      and meal_events.planned_for between target_start_date and target_end_date
  ),
  parsed as (
    select
      planned_ingredients.*,
      lower(regexp_replace(btrim(name), '\s+', ' ', 'g')) as raw_lower,
      regexp_match(name, '^\s*(\d+)\s*/\s*(\d+)') as fraction_parts,
      regexp_match(name, '^\s*(\d+(\.\d+)?)') as number_parts,
      regexp_match(lower(name), '(^|\s)(tsp|teaspoons?|tbsp|tablespoons?|g|kg|ml|l|oz|lbs?|cups?|pinches?|cloves?|large|medium|small)(\s|$)') as unit_parts
    from planned_ingredients
  ),
  cleaned as (
    select
      parsed.*,
      coalesce(saved_unit, (unit_parts)[2]) as parsed_unit,
      case
        when quantity is not null then quantity * scale_factor
        when fraction_parts is not null and (fraction_parts)[2]::numeric <> 0 then
          ((fraction_parts)[1]::numeric / (fraction_parts)[2]::numeric) * scale_factor
        when number_parts is not null then (number_parts)[1]::numeric * scale_factor
        else null
      end as parsed_quantity,
      nullif(
        btrim(
          regexp_replace(
            name,
            '^\s*(\d+\s+\d+/\d+|\d+/\d+|\d+(\.\d+)?)\s*(tsp|teaspoons?|tbsp|tablespoons?|g|kg|ml|l|oz|lbs?|cups?|pinches?|cloves?|large|medium|small)?\s+',
            '',
            'i'
          )
        ),
        ''
      ) as cleaned_name
    from parsed
  ),
  tidied as (
    select
      cleaned.*,
      nullif(
        btrim(
          regexp_replace(
            regexp_replace(
              regexp_replace(
                regexp_replace(
                  regexp_replace(
                    coalesce(cleaned_name, name),
                    '\s*\([^)]*\)',
                    '',
                    'g'
                  ),
                  '\s*,\s*(peeled|finely chopped|chopped|diced|sliced|minced|grated|crushed|melted|softened|room temperature|optional|to taste|note\s*\d+|tomato paste in us).*$',
                  '',
                  'i'
                ),
                '^(peeled|finely chopped|chopped|diced|sliced|minced|grated|crushed)\s+',
                '',
                'i'
              ),
              '\s*,\s*$',
              '',
              'g'
            ),
            '\s+',
            ' ',
            'g'
          )
        ),
        ''
      ) as display_name
    from cleaned
  ),
  classified as (
    select
      tidied.*,
      lower(regexp_replace(btrim(coalesce(display_name, cleaned_name, name)), '\s+', ' ', 'g')) as cleaned_lower,
      case
        when lower(regexp_replace(btrim(coalesce(display_name, cleaned_name, name)), '\s+', ' ', 'g')) in (
          'water',
          'hot water',
          'boiling water',
          'cold water',
          'ice',
          'ice cubes',
          'salt',
          'pepper',
          'black pepper',
          'ground black pepper',
          'salt and pepper',
          'salt & pepper'
        )
          or lower(regexp_replace(btrim(coalesce(display_name, cleaned_name, name)), '\s+', ' ', 'g')) ~ '^salt( and | & )(freshly ground )?(black )?pepper$'
          or lower(regexp_replace(btrim(coalesce(display_name, cleaned_name, name)), '\s+', ' ', 'g')) ~ '^(freshly ground )?(black )?pepper$'
        then true
        else false
      end as is_excluded,
      case
        when lower(coalesce(display_name, cleaned_name, name)) ~ '^(minced |crushed )?garlic$|^garlic cloves?$|^cloves? garlic$' then false
        when lower(coalesce(display_name, cleaned_name, name)) ~ '(turmeric|cinnamon|cardamom|cumin|paprika|cayenne|chilli powder|chilli flakes|oregano|basil|thyme|rosemary|mixed herbs|curry powder|garam masala|coriander powder|ground coriander|garlic powder|onion powder|five spice|nutmeg|cloves|allspice|bay leaves)' then true
        else false
      end as is_spice,
      case
        when lower(coalesce(display_name, cleaned_name, name)) ~ '(^| )(black garlic|garlic powder|garlic granules|garlic paste)( |$)' then initcap(coalesce(display_name, cleaned_name, name))
        when lower(coalesce(display_name, cleaned_name, name)) ~ '^(minced |crushed )?garlic$|^garlic cloves?$|^cloves? garlic$' then 'Garlic'
        when lower(coalesce(display_name, cleaned_name, name)) ~ '^onions?$' then 'Onion'
        when lower(coalesce(display_name, cleaned_name, name)) ~ 'tomato pur(e|é)e|tomato paste' then 'Tomato purée'
        when lower(coalesce(display_name, cleaned_name, name)) ~ 'garam masala' then 'Garam masala'
        when lower(coalesce(display_name, cleaned_name, name)) ~ 'curry powder' then 'Curry powder'
        when lower(coalesce(display_name, cleaned_name, name)) ~ 'chilli powder' then 'Chilli powder'
        when lower(coalesce(display_name, cleaned_name, name)) ~ 'chilli flakes' then 'Chilli flakes'
        when lower(coalesce(display_name, cleaned_name, name)) ~ 'coriander powder|ground coriander' then 'Ground coriander'
        when lower(coalesce(display_name, cleaned_name, name)) ~ 'garlic powder' then 'Garlic powder'
        when lower(coalesce(display_name, cleaned_name, name)) ~ 'onion powder' then 'Onion powder'
        when lower(coalesce(display_name, cleaned_name, name)) ~ 'five spice' then 'Five spice'
        when lower(coalesce(display_name, cleaned_name, name)) ~ 'mixed herbs' then 'Mixed herbs'
        when lower(coalesce(display_name, cleaned_name, name)) ~ 'bay leaves' then 'Bay leaves'
        when lower(coalesce(display_name, cleaned_name, name)) ~ 'cayenne' then 'Cayenne pepper'
        when lower(coalesce(display_name, cleaned_name, name)) ~ 'turmeric' then
          case when lower(coalesce(display_name, cleaned_name, name)) ~ 'ground' then 'Ground turmeric' else 'Turmeric' end
        when lower(coalesce(display_name, cleaned_name, name)) ~ 'cinnamon' then
          case when lower(coalesce(display_name, cleaned_name, name)) ~ 'ground' then 'Ground cinnamon' else 'Cinnamon' end
        when lower(coalesce(display_name, cleaned_name, name)) ~ 'cardamom' then
          case when lower(coalesce(display_name, cleaned_name, name)) ~ 'ground|powder' then 'Ground cardamom' else 'Cardamom' end
        when lower(coalesce(display_name, cleaned_name, name)) ~ 'cumin' then
          case when lower(coalesce(display_name, cleaned_name, name)) ~ 'ground' then 'Ground cumin' else 'Cumin' end
        when lower(coalesce(display_name, cleaned_name, name)) ~ 'paprika' then 'Paprika'
        when lower(coalesce(display_name, cleaned_name, name)) ~ 'oregano' then 'Oregano'
        when lower(coalesce(display_name, cleaned_name, name)) ~ 'basil' then
          case when lower(coalesce(display_name, cleaned_name, name)) ~ 'fresh' then 'Fresh basil' else 'Basil' end
        when lower(coalesce(display_name, cleaned_name, name)) ~ 'thyme' then
          case when lower(coalesce(display_name, cleaned_name, name)) ~ 'fresh' then 'Fresh thyme' else 'Thyme' end
        when lower(coalesce(display_name, cleaned_name, name)) ~ 'rosemary' then
          case when lower(coalesce(display_name, cleaned_name, name)) ~ 'fresh' then 'Fresh rosemary' else 'Rosemary' end
        when lower(coalesce(display_name, cleaned_name, name)) ~ 'nutmeg' then 'Nutmeg'
        when lower(coalesce(display_name, cleaned_name, name)) ~ 'cloves' then 'Cloves'
        when lower(coalesce(display_name, cleaned_name, name)) ~ 'allspice' then 'Allspice'
        else initcap(coalesce(display_name, cleaned_name, name))
      end as shopping_name,
      case
        when lower(coalesce(display_name, cleaned_name, name)) ~ '(fresh herbs|fresh coriander|fresh parsley|fresh basil|fresh mint|fresh dill|salad leaves|lettuce|rocket|spinach|berries|fish|salmon|cod|haddock|fresh meat|chicken|lamb|beef|pork|cream|soft cheese|fresh mozzarella)' then true
        else false
      end as is_short_life
    from tidied
  ),
  shoppable as (
    select
      *,
      lower(
        case
          when lower(shopping_name) ~ 's$' and lower(shopping_name) !~ 'ss$' then regexp_replace(lower(shopping_name), 's$', '')
          else lower(shopping_name)
        end
      ) as normalized_shopping_name,
      case
        when is_spice then null
        when shopping_name = 'Garlic' and (parsed_unit in ('clove', 'cloves', 'each') or cleaned_lower ~ '(^| )cloves?( |$)') then 'cloves'
        else parsed_unit
      end as shopping_unit,
      case when is_spice then null else parsed_quantity end as shopping_quantity,
      case
        when parsed_quantity is not null and parsed_unit is not null then
          trim(to_char(parsed_quantity, 'FM999999990.##') || ' ' || parsed_unit)
        when parsed_quantity is not null then to_char(parsed_quantity, 'FM999999990.##')
        else null
      end as recipe_amount_text
    from classified
    where not is_excluded
  ),
  consolidated as (
    select
      (array_agg(ingredient_id order by shopping_name))[1] as ingredient_id,
      (array_agg(shopping_name order by length(shopping_name) desc, shopping_name))[1] as name,
      normalized_shopping_name,
      case
        when count(distinct coalesce(shopping_unit, '__none__')) = 1 then max(shopping_unit)
        else null
      end as unit,
      case
        when bool_and(shopping_quantity is not null)
          and count(distinct coalesce(shopping_unit, '__none__')) = 1
        then sum(shopping_quantity)
        else null
      end as quantity,
      bool_or(is_spice) as is_spice,
      bool_or(is_short_life) as is_short_life,
      min(planned_for) as first_needed_on,
      count(distinct meal_event_id) as meal_count,
      (array_agg(to_char(planned_for, 'Dy') || ' · ' || recipe_title order by planned_for, recipe_title))[1] as first_meal_label,
      string_agg(to_char(planned_for, 'Dy'), ', ' order by planned_for) as date_labels,
      string_agg(distinct recipe_amount_text, ', ') filter (where recipe_amount_text is not null) as recipe_amounts
    from shoppable
    group by normalized_shopping_name
  ),
  numbered as (
    select
      consolidated.*,
      row_number() over (order by first_needed_on, normalized_shopping_name, unit nulls first) as item_position
    from consolidated
  )
  insert into public.shopping_items (
    shopping_list_id,
    restaurant_id,
    ingredient_id,
    name,
    normalized_name,
    quantity,
    unit,
    notes,
    source,
    position,
    created_by_profile_id
  )
  select
    selected_shopping_list_id,
    target_restaurant_id,
    ingredient_id,
    name,
    normalized_shopping_name,
    quantity,
    unit,
    left(
      trim(both ' ' from concat_ws(
        ' · ',
        case
          when (is_spice or quantity is null) and recipe_amounts is not null then 'Recipe amount: ' || recipe_amounts
          else null
        end,
        case
          when meal_count = 1 then 'For: ' || first_meal_label
          else 'Used in ' || meal_count::text || ' planned meals · ' || date_labels
        end,
        case
          when is_short_life and first_needed_on > current_date + 2 then 'Buy closer to cooking day'
          else null
        end
      )),
      500
    ),
    'generated',
    starting_position + item_position,
    current_profile_id
  from numbered;

  update public.shopping_lists
  set source_start_date = target_start_date,
      source_end_date = target_end_date,
      generated_at = now()
  where id = selected_shopping_list_id;

  return selected_shopping_list_id;
end;
$$;

revoke all on function public.generate_shopping_list_from_meal_events(uuid, date, date) from public;
grant execute on function public.generate_shopping_list_from_meal_events(uuid, date, date) to authenticated;

commit;
