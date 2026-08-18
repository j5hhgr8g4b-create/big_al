import { KitchenScreen } from "@/components/kitchen/kitchen-screen";
import { buildKitchenScreenModel } from "@/lib/kitchen/build-kitchen-screen-model";
import {
  getMenuPlanningData,
  getMenuTodayValue,
  type MenuWeek,
} from "@/lib/menu/get-menu";
import { getCurrentRestaurant } from "@/lib/restaurants/current";
import { getShoppingData } from "@/lib/shopping/get-shopping";

export default async function KitchenPage() {
  const { restaurant, supabase } = await getCurrentRestaurant();
  const today = new Date();
  let activePantryItemCount = 0;
  let weeks: readonly MenuWeek[] = [];

  if (restaurant) {
    const [menu, shopping] = await Promise.all([
      getMenuPlanningData(supabase, restaurant.id, today),
      getShoppingData(supabase, restaurant.id, today),
    ]);

    activePantryItemCount = shopping.activeItems.length;
    weeks = menu.weeks;
  }

  const model = buildKitchenScreenModel({
    activePantryItemCount,
    restaurant,
    today: getMenuTodayValue(today),
    weeks,
  });

  return (
    <KitchenScreen
      backHref="/restaurants/preferences"
      backLabel="Cooking preferences"
      model={model}
    />
  );
}
