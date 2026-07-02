begin;

revoke execute on function public.generate_shopping_list_from_meal_events(uuid, date, date) from anon;

grant execute on function public.generate_shopping_list_from_meal_events(uuid, date, date) to authenticated;

commit;
