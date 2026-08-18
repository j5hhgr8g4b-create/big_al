import { notFound } from "next/navigation";

import { stitchKitchenFixture } from "@/components/kitchen/kitchen.fixture";
import { KitchenScreen } from "@/components/kitchen/kitchen-screen";

export const dynamic = "force-dynamic";

export default function KitchenVisualReferencePage() {
  if (process.env.BIG_AL_VISUAL_TEST !== "1") {
    notFound();
  }

  return <KitchenScreen backHref="/" model={stitchKitchenFixture} />;
}
