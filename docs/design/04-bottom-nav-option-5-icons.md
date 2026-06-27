# Bottom Navigation Icon Decision — Option 5

## Decision

Use **Option 5 — Food-Led Simple** for the Big Al bottom navigation.

This set is the most clearly cooking-themed while still staying simple enough for mobile navigation.

## Required icon mapping

Use simple inline SVGs if the current icon package does not render reliably.

- Kitchen → cooking pot
- Cookbook → open cookbook
- Specials → cloche / featured dish
- Menu → meal plan / list card
- Pantry → shopping basket

## Important implementation note

The previous icon pass reported icon names but the app visually showed no icons in the bottom nav.

Do not rely on icon imports if they render invisibly.

If needed, implement a tiny local `NavIcon` component with inline SVG paths in `src/components/bottom-nav.tsx` so the icons definitely render.

## Visual requirements

- Icons must be visible in inactive and active states.
- Inactive icons use warm muted text colour.
- Active icon uses `#FFFCF6`.
- Icon size around 22–24px.
- Stroke width around 2.25–2.4.
- Keep labels full: Kitchen, Cookbook, Specials, Menu, Pantry.
- Selected pill remains aubergine `#352347`.
- Selected label remains readable cream `#FFFCF6`.
- Do not use emoji icons in production.

## Inline SVG direction

Use this icon direction if custom inline SVGs are needed:

### Kitchen — cooking pot

```html
<svg viewBox="0 0 24 24"><path d="M7 11h10v7a3 3 0 0 1-3 3h-4a3 3 0 0 1-3-3z"/><path d="M9 11V8a3 3 0 0 1 6 0v3"/><path d="M5 11h14"/></svg>
```

### Cookbook — open cookbook

```html
<svg viewBox="0 0 24 24"><path d="M4 5.5c3-1.7 5.5-1.7 8 0v14c-2.5-1.7-5-1.7-8 0z"/><path d="M12 5.5c2.5-1.7 5-1.7 8 0v14c-3-1.7-5.5-1.7-8 0z"/></svg>
```

### Specials — cloche / featured dish

```html
<svg viewBox="0 0 24 24"><path d="M5 15h14"/><path d="M7 15a5 5 0 0 1 10 0"/><path d="M12 8V6"/><path d="M9 19h6"/></svg>
```

### Menu — meal plan card

```html
<svg viewBox="0 0 24 24"><rect x="5" y="4" width="14" height="16" rx="2"/><path d="M8 9h8M8 13h8M8 17h4"/></svg>
```

### Pantry — shopping basket

```html
<svg viewBox="0 0 24 24"><path d="M4 10h16l-2 10H6z"/><path d="M8 10l4-5 4 5"/><path d="M9 14h6"/></svg>
```

## Acceptance criteria

- All five bottom nav icons are visible in the browser.
- Selected icon and label are readable on purple.
- Icons feel food/cookbook-related, not generic dashboard icons.
- No new icon package is added unless unavoidable.
- No feature logic is changed.
