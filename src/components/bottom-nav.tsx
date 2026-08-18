"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavIcon = "home" | "menu_book" | "star" | "restaurant_menu" | "inventory_2";

function NavIcon({ icon }: { icon: NavIcon }) {
  return <span className="material-symbols-outlined nav-material-icon" aria-hidden="true">{icon}</span>;
}

const navItems = [
  { href: "/", label: "Kitchen", icon: "home" },
  { href: "/cookbook", label: "Cookbook", icon: "menu_book" },
  { href: "/specials", label: "Specials", icon: "star" },
  { href: "/menu", label: "Menu", icon: "restaurant_menu" },
  { href: "/pantry", label: "Pantry", icon: "inventory_2" },
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
