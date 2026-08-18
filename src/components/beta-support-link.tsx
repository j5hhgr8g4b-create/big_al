"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function BetaSupportLink() {
  const pathname = usePathname();

  if (pathname === "/") return null;

  const href = `/feedback?${new URLSearchParams({ from: pathname }).toString()}`;

  return (
    <aside className="mx-auto mt-10 w-full max-w-[430px] px-5 pb-28 text-center">
      <p className="text-xs leading-5 text-[var(--color-text-muted)]">
        Big Al is in private beta. Things may occasionally go wrong.
      </p>
      <Link href={href} className="mt-2 inline-block text-sm font-semibold text-[var(--color-accent)] underline underline-offset-4">
        Send feedback
      </Link>
    </aside>
  );
}
