import Link from 'next/link';

const navItems = [
  { href: '/', label: 'Kitchen' },
  { href: '/cookbook', label: 'Cookbook' },
  { href: '/specials', label: 'Specials' },
  { href: '/menu', label: 'Menu' },
  { href: '/pantry', label: 'Pantry' }
] as const;

export function BottomNav() {
  return (
    <nav
      aria-label="Primary navigation"
      className="fixed inset-x-0 bottom-0 z-20 mx-auto max-w-md border-t border-gravy/10 bg-cream/95 px-2 py-2 backdrop-blur"
    >
      <ul className="grid grid-cols-5 gap-1">
        {navItems.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="flex min-h-12 items-center justify-center rounded-2xl px-2 py-2 text-xs font-semibold text-gravy/75 transition hover:bg-butter/70 focus:outline-none focus:ring-2 focus:ring-tomato"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
