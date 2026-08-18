begin;

drop policy if exists "House Favourites can be removed by Restaurant members"
on public.house_favourites;

create policy "House Favourites can be removed by Restaurant members"
on public.house_favourites for delete
to authenticated
using (
  public.is_restaurant_member(restaurant_id)
  and public.recipe_belongs_to_restaurant(recipe_id, restaurant_id)
);

revoke all on function public.recipe_belongs_to_restaurant(uuid, uuid)
from anon, public;
revoke all on function public.toggle_house_favourite(uuid, uuid, boolean)
from anon, public;

grant execute on function public.recipe_belongs_to_restaurant(uuid, uuid)
to authenticated;
grant execute on function public.toggle_house_favourite(uuid, uuid, boolean)
to authenticated;

commit;
