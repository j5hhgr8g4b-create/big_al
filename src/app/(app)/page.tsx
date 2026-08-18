/* eslint-disable @next/next/no-img-element */

import Link from "next/link";

import { getMenuPlanningData, type MenuMealEvent, type MenuPlanningRecipe } from "@/lib/menu/get-menu";
import { getCurrentRestaurant } from "@/lib/restaurants/current";
import { getShoppingData } from "@/lib/shopping/get-shopping";

function totalMinutes(recipe: MenuPlanningRecipe) {
  return (recipe.prep_minutes ?? 0) + (recipe.cook_minutes ?? 0);
}

function recipeMeta(recipe: MenuPlanningRecipe) {
  const minutes = totalMinutes(recipe);
  const details = [
    minutes ? `${minutes} min` : null,
    recipe.difficulty ? recipe.difficulty.charAt(0).toUpperCase() + recipe.difficulty.slice(1) : null,
    recipe.servings ? `Serves ${recipe.servings}` : null,
  ].filter(Boolean);

  return details.join(" • ") || "Ready when you are";
}

function weekdayIndex(dateValue: string) {
  return new Date(`${dateValue}T00:00:00Z`).getUTCDay();
}

function WeekProgress({ events }: { events: MenuMealEvent[] }) {
  const plannedDays = new Set(events.map((event) => weekdayIndex(event.planned_for)));
  const days = [
    ["M", 1],
    ["T", 2],
    ["W", 3],
    ["T", 4],
    ["F", 5],
    ["S", 6],
    ["S", 0],
  ] as const;

  return (
    <div className="kitchen-week-progress" aria-label={`${events.length} dinners planned this week`}>
      {days.map(([label, day], index) => (
        <div className="kitchen-week-day" key={`${label}-${day}`}>
          <span>{label}</span>
          <div className={plannedDays.has(day) ? "planned" : index > 4 ? "future" : "open"} />
        </div>
      ))}
    </div>
  );
}

function KitchenHero({ recipe }: { recipe: MenuPlanningRecipe | null }) {
  return (
    <section className="kitchen-dinner-card" aria-label="Next Dinner">
      <div className="kitchen-dinner-copy">
        <div>
          <span className="kitchen-label kitchen-label-on-dark">NEXT DINNER</span>
          <h2>{recipe?.title ?? "Choose your next dinner"}</h2>
          <p>{recipe ? recipeMeta(recipe) : "Your Cookbook is ready for a good idea."}</p>
        </div>
        <Link href={recipe ? `/cookbook/recipes/${recipe.id}/cook` : "/cookbook"} className="kitchen-action kitchen-action-dark">
          {recipe ? "Let's Cook" : "Browse Cookbook"}
          <span className="material-symbols-outlined" aria-hidden="true">chevron_right</span>
        </Link>
      </div>
      <div className="kitchen-dinner-image">
        {recipe?.image_url ? (
          <img src={recipe.image_url} alt={recipe.title} referrerPolicy="no-referrer" />
        ) : (
          <div className="kitchen-image-placeholder" aria-hidden="true">
            <span className="material-symbols-outlined">restaurant</span>
          </div>
        )}
      </div>
    </section>
  );
}

export default async function KitchenPage() {
  const { restaurant, supabase } = await getCurrentRestaurant();

  if (!restaurant) {
    return (
      <section className="kitchen-empty-state">
        <span className="kitchen-label">YOUR KITCHEN</span>
        <h1>Create your Restaurant</h1>
        <p>Your private home for Recipes, Menu planning, and shopping.</p>
        <Link href="/restaurants/new" className="kitchen-action kitchen-action-light">Create Restaurant</Link>
      </section>
    );
  }

  const [{ weeks }, shopping] = await Promise.all([
    getMenuPlanningData(supabase, restaurant.id),
    getShoppingData(supabase, restaurant.id),
  ]);
  const thisWeek = weeks[0];
  const nextDinner = thisWeek.events[0]?.recipe ?? null;

  return (
    <div className="kitchen-screen">
      <KitchenHero recipe={nextDinner} />

      <section className="kitchen-surface-card" aria-labelledby="this-week-heading">
        <div className="kitchen-card-heading">
          <div>
            <span className="kitchen-label">THIS WEEK</span>
            <h2 id="this-week-heading">{thisWeek.events.length} dinners planned</h2>
          </div>
          <Link href="/menu" className="kitchen-text-action">
            View Menu <span className="material-symbols-outlined" aria-hidden="true">arrow_forward</span>
          </Link>
        </div>
        <WeekProgress events={thisWeek.events} />
      </section>

      <Link href="/pantry" className="kitchen-surface-card kitchen-pantry-card">
        <div className="kitchen-pantry-copy">
          <div className="kitchen-pantry-icon"><span className="material-symbols-outlined" aria-hidden="true">inventory_2</span></div>
          <div>
            <span className="kitchen-label">PANTRY</span>
            <h2>{shopping.activeItems.length} items on your list</h2>
          </div>
        </div>
        <span className="material-symbols-outlined kitchen-chevron" aria-hidden="true">chevron_right</span>
      </Link>

      <section className="kitchen-says-card" aria-label="Big Al Says">
        <div className="kitchen-avatar" aria-hidden="true">BA</div>
        <div className="kitchen-says-copy">
          <span className="kitchen-label">BIG AL SAYS</span>
          <p>&quot;A good sausage makes everything better.&quot;</p>
        </div>
        <span className="material-symbols-outlined kitchen-says-icon" aria-hidden="true">restaurant</span>
      </section>
    </div>
  );
}
