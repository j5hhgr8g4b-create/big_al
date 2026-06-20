import { createBrowserClient } from "@supabase/ssr";

import { getSupabaseConfig } from "@/lib/supabase/config";

let browserClient: ReturnType<typeof createBrowserClient> | undefined;

export function createClient() {
  const { publishableKey, url } = getSupabaseConfig();

  browserClient ??= createBrowserClient(url, publishableKey);
  return browserClient;
}
