import type { KitchenScreenModel } from "./kitchen-screen";

export const stitchKitchenFixture: KitchenScreenModel = {
  hero: {
    actionHref: "/cookbook/recipes/stitch-fixture/cook",
    actionLabel: "Let's Cook",
    imageAlt: "Creamy garlic sausages in a cast iron skillet",
    imageSrc: "/stitch/kitchen/creamy-garlic-sausages.jpg",
    kicker: "NEXT DINNER",
    meta: "30 min • Easy • Serves 4",
    title: "Creamy Garlic Sausages",
  },
  pantry: {
    heading: "12 items on your list",
    href: "/pantry",
    kicker: "PANTRY",
    showNotification: true,
  },
  quote: {
    avatarAlt: "Big Al chef illustration",
    avatarSrc: "/stitch/kitchen/big-al-chef.jpg",
    kicker: "BIG AL SAYS",
    spotSrc: "/stitch/kitchen/sausage-fork.jpg",
    text: '"A good sausage makes everything better."',
  },
  week: {
    actionHref: "/menu",
    actionLabel: "View Menu",
    days: [
      { label: "M", state: "planned" },
      { label: "T", state: "planned" },
      { label: "W", state: "planned" },
      { label: "T", state: "today" },
      { label: "F", state: "open" },
      { label: "S", state: "muted" },
      { label: "S", state: "muted" },
    ],
    heading: "5 dinners planned",
    kicker: "THIS WEEK",
  },
};
