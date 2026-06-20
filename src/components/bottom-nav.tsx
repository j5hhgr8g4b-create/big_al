"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Kitchen", shortLabel: "K" },
  { href: "/cookbook", label: "Cookbook", shortLabel: "C" },
  { href: "/specials", label: "Specials", shortLabel: "S" },
  { href: "/menu", label: "Menu", shortLabel: "M" },
  { href: "/pantry", label: "Pantry", shortLabel: "P" },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Primary navigation"
      className="fixed inset-x-0 bottom-0 z-10 mx-auto max-w-md border-t border-[var(--border)] bg-[var(--surface)]/95 px-2 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur"
    >
      <ul className="grid grid-cols-5 gap-1">
        {navItems.map((item) => {
          const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl text-xs font-medium transition-colors ${
                  isActive
                    ? "bg-orange-50 text-[var(--accent)]"
                    : "text-[var(--muted)] hover:bg-stone-50"
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`grid size-6 place-items-center rounded-full text-[0.65rem] font-bold ${
                    isActive ? "bg-[var(--accent)] text-white" : "bg-stone-100"
                  }`}
                >
                  {item.shortLabel}
                </span>
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
