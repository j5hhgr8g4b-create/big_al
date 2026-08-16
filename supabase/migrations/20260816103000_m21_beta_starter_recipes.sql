begin;

-- The beta starter pack is deliberately a small, reviewed snapshot.  Keeping it
-- in the database migration means onboarding does not depend on five external
-- requests succeeding at signup time.
create or replace function public.seed_beta_starter_recipes(target_restaurant_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  starter jsonb;
  existing_recipe_id uuid;
begin
  if not public.is_restaurant_member(target_restaurant_id) then
    raise exception 'Restaurant membership required';
  end if;

  if not exists (
    select 1
    from public.cookbooks
    where restaurant_id = target_restaurant_id
  ) then
    raise exception 'Restaurant Cookbook not found';
  end if;

  if not exists (
    select 1
    from public.chefs
    where profile_id = auth.uid()
  ) then
    raise exception 'Chef profile not found';
  end if;

  for starter in
    select value
    from jsonb_array_elements(
      jsonb_build_array(
        jsonb_build_object(
          'title', 'Fried Sausages',
          'source_url', 'https://www.bbcgoodfood.com/howto/guide/how-cook-sausages',
          'creator_source', 'Good Food team / Good Food',
          'source_site', 'Good Food',
          'prep_minutes', 0,
          'cook_minutes', 20,
          'servings', 2,
          'difficulty', 'easy',
          'ingredients', jsonb_build_array(
            jsonb_build_object('name', 'pork sausages', 'quantity', 4, 'unit', 'each', 'preparation', '')
          ),
          'steps', jsonb_build_array(
            jsonb_build_object('instruction', 'Heat a non-stick pan over a medium heat, then add the sausages.'),
            jsonb_build_object('instruction', 'Cook for 15–20 minutes, moving the sausages around the pan and turning them regularly so they cook evenly.'),
            jsonb_build_object('instruction', 'Serve when the outside is deep golden brown, the inside is pale with no pink meat, and the juices run clear.')
          )
        ),
        jsonb_build_object(
          'title', 'Jerk Chicken',
          'source_url', 'https://www.bbcgoodfood.com/recipes/jerk-chicken/',
          'creator_source', 'Good Food team / Good Food',
          'source_site', 'Good Food',
          'prep_minutes', 15,
          'cook_minutes', 50,
          'servings', 4,
          'difficulty', 'easy',
          'ingredients', jsonb_build_array(
            jsonb_build_object('name', 'jerk seasoning', 'quantity', 2, 'unit', 'tbsp', 'preparation', ''),
            jsonb_build_object('name', 'coconut cream', 'quantity', 4, 'unit', 'tbsp', 'preparation', ''),
            jsonb_build_object('name', 'green chilli', 'quantity', 1, 'unit', 'each', 'preparation', 'deseeded and chopped'),
            jsonb_build_object('name', 'spring onions', 'quantity', 2, 'unit', 'each', 'preparation', 'finely chopped'),
            jsonb_build_object('name', 'thyme sprigs', 'quantity', 8, 'unit', 'each', 'preparation', 'leaves picked'),
            jsonb_build_object('name', 'garlic cloves', 'quantity', 2, 'unit', 'each', 'preparation', 'roughly chopped'),
            jsonb_build_object('name', 'ginger', 'quantity', 1, 'unit', 'tbsp', 'preparation', 'grated'),
            jsonb_build_object('name', 'lime', 'quantity', 1, 'unit', 'each', 'preparation', 'zested and juiced'),
            jsonb_build_object('name', 'chicken thighs', 'quantity', 8, 'unit', 'each', 'preparation', 'skin on and bone in'),
            jsonb_build_object('name', 'rice and peas', 'quantity', 1, 'unit', 'serving', 'preparation', 'to serve')
          ),
          'steps', jsonb_build_array(
            jsonb_build_object('instruction', 'Heat the oven to 200C/180C fan/gas 6. Blend the jerk seasoning, coconut cream, chilli, spring onions, thyme, garlic and ginger, then stir in the lime zest and juice.'),
            jsonb_build_object('instruction', 'Slash the chicken thighs down to the bone a couple of times, then spread over the jerk paste.'),
            jsonb_build_object('instruction', 'Roast for 45–50 minutes until golden brown and cooked through. Sprinkle over more thyme and serve with rice and peas.')
          )
        ),
        jsonb_build_object(
          'title', 'Creamy Garlic Pasta',
          'source_url', 'https://www.bbcgoodfood.com/recipes/creamy-garlic-pasta',
          'creator_source', 'Helena Busiakiewicz / Good Food',
          'source_site', 'Good Food',
          'prep_minutes', 5,
          'cook_minutes', 20,
          'servings', 4,
          'difficulty', 'easy',
          'ingredients', jsonb_build_array(
            jsonb_build_object('name', 'tagliatelle', 'quantity', 300, 'unit', 'g', 'preparation', ''),
            jsonb_build_object('name', 'salted butter', 'quantity', 20, 'unit', 'g', 'preparation', ''),
            jsonb_build_object('name', 'garlic cloves', 'quantity', 6, 'unit', 'each', 'preparation', 'finely chopped'),
            jsonb_build_object('name', 'plain flour', 'quantity', 2, 'unit', 'tbsp', 'preparation', ''),
            jsonb_build_object('name', 'chicken stock', 'quantity', 150, 'unit', 'ml', 'preparation', ''),
            jsonb_build_object('name', 'double cream', 'quantity', 200, 'unit', 'ml', 'preparation', ''),
            jsonb_build_object('name', 'parmesan', 'quantity', 85, 'unit', 'g', 'preparation', 'grated'),
            jsonb_build_object('name', 'flat-leaf parsley', 'quantity', 20, 'unit', 'g', 'preparation', 'roughly chopped')
          ),
          'steps', jsonb_build_array(
            jsonb_build_object('instruction', 'Cook the pasta following the pack instructions. Meanwhile, melt the butter in a large frying pan, add the garlic and cook for 4–5 minutes until light golden and fragrant.'),
            jsonb_build_object('instruction', 'Stir in the flour, then whisk in the chicken stock until smooth. Add the cream and most of the parmesan, then stir until combined.'),
            jsonb_build_object('instruction', 'Transfer the pasta into the sauce with a splash of cooking water. Mix thoroughly, adding more water if needed.'),
            jsonb_build_object('instruction', 'Divide between four bowls and top with parsley and the remaining parmesan.')
          )
        ),
        jsonb_build_object(
          'title', 'Roast Chicken',
          'source_url', 'https://www.bbcgoodfood.com/recipes/roast-chicken',
          'creator_source', 'Good Food team / Good Food',
          'source_site', 'Good Food',
          'prep_minutes', 15,
          'cook_minutes', 90,
          'servings', 4,
          'difficulty', 'easy',
          'ingredients', jsonb_build_array(
            jsonb_build_object('name', 'unwaxed lemons', 'quantity', 2, 'unit', 'each', 'preparation', ''),
            jsonb_build_object('name', 'organic or free-range chicken', 'quantity', 1, 'unit', 'each', 'preparation', 'about 1.8kg'),
            jsonb_build_object('name', 'bay leaves', 'quantity', 6, 'unit', 'each', 'preparation', ''),
            jsonb_build_object('name', 'rosemary', 'quantity', 1, 'unit', 'bunch', 'preparation', 'broken into sprigs'),
            jsonb_build_object('name', 'whole garlic', 'quantity', 2, 'unit', 'heads', 'preparation', 'cut across the middle'),
            jsonb_build_object('name', 'potatoes', 'quantity', 1.5, 'unit', 'kg', 'preparation', 'peeled and quartered'),
            jsonb_build_object('name', 'sunflower or vegetable oil', 'quantity', 2, 'unit', 'tbsp', 'preparation', ''),
            jsonb_build_object('name', 'butter', 'quantity', 50, 'unit', 'g', 'preparation', 'very soft')
          ),
          'steps', jsonb_build_array(
            jsonb_build_object('instruction', 'Heat the oven to 190C/fan 170C/gas 5. Put half a lemon, a bay leaf, rosemary and half a garlic head inside the chicken cavity.'),
            jsonb_build_object('instruction', 'Toss the potatoes and remaining garlic with the oil in a roasting tin. Sit the chicken in the middle, brush with butter and season.'),
            jsonb_build_object('instruction', 'Roast for 1 hour 10 minutes, brushing twice with more butter, until the juices run clear. Remove the chicken, cover and rest.'),
            jsonb_build_object('instruction', 'Turn the oven up to 220C/fan 200C/gas 7. Toss the potatoes with the herbs and lemon wedges, then roast for 15–20 minutes until crisp.')
          )
        ),
        jsonb_build_object(
          'title', 'Scrambled Eggs',
          'source_url', 'https://www.bbcgoodfood.com/howto/guide/how-make-scrambled-eggs',
          'creator_source', 'Good Food team / Good Food',
          'source_site', 'Good Food',
          'prep_minutes', 5,
          'cook_minutes', 5,
          'servings', 1,
          'difficulty', 'easy',
          'ingredients', jsonb_build_array(
            jsonb_build_object('name', 'large eggs', 'quantity', 2, 'unit', 'each', 'preparation', ''),
            jsonb_build_object('name', 'single cream or full-cream milk', 'quantity', 6, 'unit', 'tbsp', 'preparation', ''),
            jsonb_build_object('name', 'butter', 'quantity', 1, 'unit', 'knob', 'preparation', ''),
            jsonb_build_object('name', 'salt', 'quantity', 1, 'unit', 'pinch', 'preparation', '')
          ),
          'steps', jsonb_build_array(
            jsonb_build_object('instruction', 'Crack the eggs into a bowl, add the cream and a pinch of salt, then whisk until smooth.'),
            jsonb_build_object('instruction', 'Heat a pan over a low to medium heat, add the butter and wait for it to melt without browning.'),
            jsonb_build_object('instruction', 'Pour in the egg mixture. After 20 seconds, gently lift and fold it from the sides and bottom until softly set and runny in places.'),
            jsonb_build_object('instruction', 'Remove from the heat and let the eggs finish cooking in the pan, then stir and serve immediately.')
          )
        )
      )
    ) as recipe(value)
  loop
    select recipes.id
    into existing_recipe_id
    from public.recipes
    inner join public.cookbooks on cookbooks.id = recipes.cookbook_id
    where cookbooks.restaurant_id = target_restaurant_id
      and recipes.source_url = starter ->> 'source_url'
    limit 1;

    if existing_recipe_id is null then
      perform public.save_recipe(
        null,
        target_restaurant_id,
        starter ->> 'title',
        null,
        null,
        starter ->> 'source_url',
        starter ->> 'creator_source',
        starter ->> 'source_site',
        (starter ->> 'prep_minutes')::integer,
        (starter ->> 'cook_minutes')::integer,
        (starter ->> 'servings')::numeric,
        starter ->> 'difficulty',
        starter -> 'ingredients',
        starter -> 'steps'
      );
    end if;
  end loop;
end;
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

  perform public.seed_beta_starter_recipes(created_restaurant.id);
  return created_restaurant;
end;
$$;

revoke all on function public.seed_beta_starter_recipes(uuid) from public;
grant execute on function public.seed_beta_starter_recipes(uuid) to authenticated;

commit;
