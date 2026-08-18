# Big Al shared UI foundation

The shared UI foundation follows the refined Stitch project `16404102405138321464` (`Mobile-Optimized Web UI`). It is implemented in `src/app/globals.css` and the font variables in `src/app/layout.tsx`, so product screens can reuse the same primitives without page-specific token overrides.

## Visual language

- Paper base: `--color-bg` (`#fff8f5`), with white card surfaces.
- Structural ink: `--color-purple-800` (`#1d1b4b`) and `--color-purple-900` (`#050235`).
- Action tomato: `--color-accent` (`#e54b2d`). House Favourite remains a star signal and keeps its approved data behaviour.
- Warm support: `--color-surface-warm` (`#f4f1e8`) and the existing note surface tokens.
- Rounded tactile controls: full-pill buttons and inputs; 16px card/image radius via the shared radius tokens.
- Shared shadows, borders, focus rings, content width, safe-area spacing, and responsive bottom navigation live in the global stylesheet.

## Typography

- Plus Jakarta Sans: screen and hero headings (`--font-display`).
- Work Sans: body copy, controls, and navigation (`--font-body` / `--font-ui`).
- Bricolage Grotesque: short accent labels and section kickers (`--font-hand`).

## Stitch reference coverage

The foundation was checked against the refined Kitchen, Cookbook, Menu, Pantry, Specials, Recipe Detail, Cook Mode, Login, and Sign Up screens. Hidden legacy variants and the unidentified stale canvas remain out of scope. The primary navigation remains Kitchen, Cookbook, Specials, Menu, Pantry.
