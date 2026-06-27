"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavIcon = "cooking-pot" | "open-cookbook" | "cloche" | "meal-plan-card" | "shopping-basket";

function NavIcon({ icon }: { icon: NavIcon }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2.35"
      className="nav-icon-svg"
    >
      {icon === "cooking-pot" ? (
        <>
          <path d="M7 11h10v7a3 3 0 0 1-3 3h-4a3 3 0 0 1-3-3z" />
          <path d="M9 11V8a3 3 0 0 1 6 0v3" />
          <path d="M5 11h14" />
        </>
      ) : null}
      {icon === "open-cookbook" ? (
        <>
          <path d="M4 5.5c3-1.7 5.5-1.7 8 0v14c-2.5-1.7-5-1.7-8 0z" />
          <path d="M12 5.5c2.5-1.7 5-1.7 8 0v14c-3-1.7-5.5-1.7-8 0z" />
        </>
      ) : null}
      {icon === "cloche" ? (
        <>
          <path d="M5 15h14" />
          <path d="M7 15a5 5 0 0 1 10 0" />
          <path d="M12 8V6" />
          <path d="M9 19h6" />
        </>
      ) : null}
      {icon === "meal-plan-card" ? (
        <>
          <rect x="5" y="4" width="14" height="16" rx="2" />
          <path d="M8 9h8" />
          <path d="M8 13h8" />
          <path d="M8 17h4" />
        </>
      ) : null}
      {icon === "shopping-basket" ? (
        <>
          <path d="M4 10h16l-2 10H6z" />
          <path d="M8 10l4-5 4 5" />
          <path d="M9 14h6" />
        </>
      ) : null}
    </svg>
  );
}

const navItems = [
  { href: "/", label: "Kitchen", icon: "cooking-pot" },
  { href: "/cookbook", label: "Cookbook", icon: "open-cookbook" },
  { href: "/specials", label: "Specials", icon: "cloche" },
  { href: "/menu", label: "Menu", icon: "meal-plan-card" },
  { href: "/pantry", label: "Pantry", icon: "shopping-basket" },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Primary navigation" className="bottom-nav">
      <ul className="grid h-full grid-cols-5 items-center gap-1">
        {navItems.map((item) => {
          const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`nav-item flex flex-col items-center justify-center gap-1 transition-colors hover:bg-[var(--color-surface-soft)] ${
                  isActive ? "active" : ""
                }`}
              >
                <span aria-hidden="true" className="nav-icon grid h-6 place-items-center">
                  <NavIcon icon={item.icon} />
                </span>
                <span className="nav-label">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
