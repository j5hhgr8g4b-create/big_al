import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import styles from "./kitchen-screen.module.css";

export type KitchenDayState = "planned" | "today" | "open" | "muted";

export type KitchenScreenModel = {
  hero: {
    actionHref: string;
    actionLabel: string;
    imageAlt: string;
    imageSrc: string | null;
    kicker: string;
    meta: string;
    title: string;
  };
  pantry: {
    heading: string;
    href: string;
    kicker: string;
    showNotification: boolean;
  };
  quote: {
    avatarAlt: string;
    avatarSrc: string;
    kicker: string;
    spotSrc: string;
    text: string;
  };
  week: {
    actionHref: string;
    actionLabel: string;
    days: Array<{ label: string; state: KitchenDayState }>;
    heading: string;
    kicker: string;
  };
};

type NavKey = "kitchen" | "cookbook" | "specials" | "menu" | "pantry";

const navItems: Array<{ href: string; icon: string; key: NavKey; label: string }> = [
  { href: "/", icon: "home", key: "kitchen", label: "Kitchen" },
  { href: "/cookbook", icon: "menu_book", key: "cookbook", label: "Cookbook" },
  { href: "/specials", icon: "star", key: "specials", label: "Specials" },
  { href: "/menu", icon: "restaurant_menu", key: "menu", label: "Menu" },
  { href: "/pantry", icon: "inventory_2", key: "pantry", label: "Pantry" },
];

const weekDayNames = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

const weekStateLabels: Record<KitchenDayState, string> = {
  muted: "Past day without a planned dinner",
  open: "No dinner planned",
  planned: "Dinner planned",
  today: "Today",
};

function MaterialSymbol({
  filled = false,
  name,
  size = "regular",
}: {
  filled?: boolean;
  name: string;
  size?: "regular" | "small";
}) {
  return (
    <span
      aria-hidden="true"
      className={`${styles.materialSymbol} ${filled ? styles.materialSymbolFilled : ""} ${
        size === "small" ? styles.materialSymbolSmall : ""
      }`}
    >
      {name}
    </span>
  );
}

function Header({
  backHref,
  backLabel,
  trailingAction,
}: {
  backHref: string;
  backLabel: string;
  trailingAction?: ReactNode;
}) {
  return (
    <header className={styles.header} data-testid="kitchen-header">
      <Link
        href={backHref}
        aria-label={backLabel}
        title={backLabel}
        className={`${styles.headerControl} ${styles.headerControlStart}`}
      >
        <MaterialSymbol name="arrow_back" />
      </Link>
      <h1 className={styles.wordmark}>Big Al&apos;s Kitchen</h1>
      <div className={styles.headerActionSlot}>
        {trailingAction ?? (
          <Link
            href="/cookbook?view=house-favourites"
            aria-label="House Favourites"
            className={`${styles.headerControl} ${styles.headerControlEnd}`}
          >
            <MaterialSymbol name="star" />
          </Link>
        )}
      </div>
    </header>
  );
}

function Hero({ hero }: { hero: KitchenScreenModel["hero"] }) {
  return (
    <section className={styles.hero} aria-label="Next dinner" data-testid="kitchen-hero">
      <div className={styles.heroGlow} aria-hidden="true" />
      <div className={styles.heroCopy}>
        <div>
          <span
            className={`${styles.kicker} ${styles.heroKicker}`}
            data-testid="kitchen-hero-kicker"
          >
            {hero.kicker}
          </span>
          <h2 className={styles.heroTitle} data-testid="kitchen-hero-title">
            {hero.title}
          </h2>
          <p className={styles.heroMeta} data-testid="kitchen-hero-meta">
            {hero.meta}
          </p>
        </div>
        <Link
          href={hero.actionHref}
          className={styles.heroAction}
          data-testid="kitchen-hero-action"
        >
          {hero.actionLabel}
          <MaterialSymbol name="chevron_right" size="small" />
        </Link>
      </div>
      <div className={styles.heroImage} data-testid="kitchen-hero-image">
        {hero.imageSrc ? (
          <Image
            src={hero.imageSrc}
            alt={hero.imageAlt}
            fill
            priority
            referrerPolicy="no-referrer"
            unoptimized
            sizes="(min-width: 768px) 144px, 112px"
          />
        ) : (
          <MaterialSymbol name="restaurant_menu" />
        )}
      </div>
    </section>
  );
}

function WeekCard({ week }: { week: KitchenScreenModel["week"] }) {
  return (
    <section className={styles.weekCard} aria-label="This week" data-testid="kitchen-week">
      <div className={styles.weekHeader}>
        <div>
          <span className={styles.kicker}>{week.kicker}</span>
          <h2 className={styles.weekHeading}>{week.heading}</h2>
        </div>
        <Link href={week.actionHref} className={styles.weekAction}>
          {week.actionLabel}
          <MaterialSymbol name="arrow_forward" size="small" />
        </Link>
      </div>
      <div className={styles.weekTracker} aria-label={week.heading} role="list">
        {week.days.map((day, index) => (
          <div
            className={styles.weekTrackerPart}
            key={`${day.label}-${index}`}
            role="listitem"
          >
            {index > 0 ? (
              <span
                aria-hidden="true"
                className={`${styles.weekConnector} ${
                  day.state === "muted" ? styles.weekConnectorMuted : ""
                }`}
              />
            ) : null}
            <span
              className={`${styles.weekDay} ${
                day.state === "muted" ? styles.weekDayMuted : ""
              }`}
            >
              <span aria-hidden="true">{day.label}</span>
              <span className="sr-only">
                {weekDayNames[index]}: {weekStateLabels[day.state]}
              </span>
              <span
                aria-hidden="true"
                className={`${styles.weekDot} ${styles[`weekDot_${day.state}`]}`}
              />
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

function PantryCard({ pantry }: { pantry: KitchenScreenModel["pantry"] }) {
  return (
    <Link
      href={pantry.href}
      className={styles.pantryCard}
      data-testid="kitchen-pantry"
    >
      <span className={styles.pantryContent}>
        <span className={styles.pantryIcon}>
          <MaterialSymbol name="inventory_2" filled />
        </span>
        <span>
          <span className={styles.kicker}>{pantry.kicker}</span>
          <span className={styles.pantryHeading}>{pantry.heading}</span>
        </span>
      </span>
      <span className={styles.pantryChevron}>
        <MaterialSymbol name="chevron_right" />
      </span>
      {pantry.showNotification ? (
        <span className="sr-only">Pantry has open items.</span>
      ) : null}
    </Link>
  );
}

function BigAlSays({ quote }: { quote: KitchenScreenModel["quote"] }) {
  return (
    <section className={styles.saysCard} aria-label="Big Al says" data-testid="kitchen-says">
      <span className={styles.saysTexture} aria-hidden="true" />
      <span className={styles.saysAvatar}>
        <Image
          src={quote.avatarSrc}
          alt={quote.avatarAlt}
          fill
          unoptimized
          sizes="64px"
        />
      </span>
      <span className={styles.saysCopy}>
        <span className={styles.kicker}>{quote.kicker}</span>
        <span className={styles.saysQuote}>{quote.text}</span>
      </span>
      <span className={styles.saysSpot}>
        <Image
          src={quote.spotSrc}
          alt=""
          aria-hidden="true"
          fill
          unoptimized
          sizes="40px"
        />
      </span>
    </section>
  );
}

function KitchenNav({
  active,
  pantryNotification,
}: {
  active: NavKey;
  pantryNotification: boolean;
}) {
  return (
    <nav
      className={styles.bottomNav}
      aria-label="Primary navigation"
      data-testid="kitchen-nav"
    >
      {navItems.map((item) => {
        const isActive = item.key === active;

        return (
          <Link
            href={item.href}
            key={item.key}
            aria-current={isActive ? "page" : undefined}
            className={`${styles.navItem} ${isActive ? styles.navItemActive : ""}`}
          >
            {isActive ? (
              <span className={styles.navActiveIcon}>
                <MaterialSymbol name={item.icon} filled />
              </span>
            ) : (
              <span className={styles.navIcon}>
                <MaterialSymbol name={item.icon} />
              </span>
            )}
            {item.key === "pantry" && pantryNotification ? (
              <span className={styles.navNotification} aria-hidden="true" />
            ) : null}
            <span className={styles.navLabel}>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export function KitchenScreen({
  activeNav = "kitchen",
  backHref = "/cookbook",
  backLabel = "Back",
  model,
  trailingHeaderAction,
}: {
  activeNav?: NavKey;
  backHref?: string;
  backLabel?: string;
  model: KitchenScreenModel;
  trailingHeaderAction?: ReactNode;
}) {
  return (
    <div className={styles.screen} data-testid="kitchen-screen">
      <Header backHref={backHref} backLabel={backLabel} trailingAction={trailingHeaderAction} />
      <main className={styles.main} data-testid="kitchen-main">
        <Hero hero={model.hero} />
        <WeekCard week={model.week} />
        <PantryCard pantry={model.pantry} />
        <BigAlSays quote={model.quote} />
      </main>
      <KitchenNav active={activeNav} pantryNotification={model.pantry.showNotification} />
    </div>
  );
}
