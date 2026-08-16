import type { EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest, NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

function safeNextPath(value: string | null) {
  return value?.startsWith("/") && !value.startsWith("//") ? value : "/";
}

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const tokenHash = request.nextUrl.searchParams.get("token_hash");
  const type = request.nextUrl.searchParams.get("type") as EmailOtpType | null;
  const next = safeNextPath(request.nextUrl.searchParams.get("next"));

  if (request.nextUrl.searchParams.has("error")) {
    return NextResponse.redirect(
      new URL("/login?error=Google+sign-in+was+cancelled+or+could+not+be+completed.", request.url),
    );
  }

  const supabase = await createClient();

  const result = code
    ? await supabase.auth.exchangeCodeForSession(code)
    : tokenHash && type
      ? await supabase.auth.verifyOtp({ token_hash: tokenHash, type })
      : { error: new Error("Missing confirmation token") };

  if (!result.error) {
    return NextResponse.redirect(new URL(next, request.url));
  }

  return NextResponse.redirect(
    new URL("/login?error=The+confirmation+link+is+invalid+or+expired.", request.url),
  );
}
