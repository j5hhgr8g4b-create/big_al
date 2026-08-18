# Kitchen fidelity check

## Result

**PASS.** The fixture-only Kitchen reproduction passed the visual gate before Restaurant data was connected. The production Kitchen now supplies a server-built view model to the same checked component; the visual shell was not reworked during integration.

| Evidence | Value |
| --- | --- |
| Stitch project | `16404102405138321464` |
| Stitch screen | `6f949b405f7644388a68f7730f5ba217` |
| Authoritative raster | `docs/stitch/reference/KITCHEN_SOURCE.png` (`780 × 1768`) |
| Literal comparison viewport | `390 × 884` CSS px at DPR 2 |
| Reference baseline | `tests/visual-snapshots/stitch-reference/kitchen.png` |
| CI comparison budget | pixel threshold `0.2`; maximum differing-pixel ratio `2%` to accommodate cross-platform Chromium font rasterization |
| Required responsive captures | `320`, `375`, `390`, and `430px`, all at `884px` high |
| Static visual gate | `5 passed` |

An exact-zero diagnostic comparison was also run while tuning. It reported a 6% raw differing-pixel ratio, concentrated in antialiasing/JPEG pixels and the approved heart-to-star substitution. At the checked perceptual threshold the local reproduction is below 1%; CI permits up to 2% so the same Chromium version remains stable across macOS and Linux font rasterizers.

## Measured geometry at the reference viewport

All values are CSS pixels.

| Element | Stitch value | Implemented value | Result |
| --- | --- | --- | --- |
| Canvas | `390 × 884`, `#fcf9f3` | `390 × 884`, `#fcf9f3` | MATCH |
| Header | `x0 y0 w390 h64` | `x0 y0 w390 h64` | MATCH |
| Main gutters | `24px` | `24px` | MATCH |
| Main section gap | `16px` | `16px` | MATCH |
| Next Dinner | `x24 y64 w342 h195` | `x24 y64 w342 h195` | MATCH |
| This Week | `x24 y275 w342 h149` | `x24 y275 w342 h149` | MATCH |
| Pantry | `x24 y440 w342 h90` | `x24 y440 w342 h90` | MATCH |
| Big Al Says | `x24 y546 w342 h165` | `x24 y546 w342 h165` | MATCH |
| Bottom navigation | `x0 y781 w390 h103` | `x0 y781 w390 h103` | MATCH |
| Hero image well | `112 × 112`, `4px` border | `112 × 112`, `4px` border | MATCH |
| Pantry icon tile | `48 × 48`, radius `12` | `48 × 48`, radius `12` | MATCH |
| Big Al portrait | `64 × 64`, `3px` border | `64 × 64`, `3px` border | MATCH |
| Sausage spot slot | `40 × 40` | `40 × 40` | MATCH |

The Playwright reference project asserts these boxes before taking the pixel comparison.

## Visual implementation checklist

| Element | Stitch value | Implemented value | Result |
| --- | --- | --- | --- |
| Wordmark | Bricolage Grotesque `26/32`, primary | Same self-hosted face, size, line height, and colour | MATCH |
| Body | Work Sans, warm background, antialiased | Same self-hosted face and computed treatment | MATCH |
| Hero title | Plus Jakarta Sans `16/20`, resolved bold face | Same computed face and metrics | MATCH |
| Hero surface | `#200e31`, radius `24`, `20px` padding | Same | MATCH |
| Hero glow | `192px`, `-48px` offsets, `40px` blur, 60% | Same | MATCH |
| Hero CTA | `#a03f2e`, pill, `10 × 24px` padding | Same | MATCH |
| Card surface | White, radius `16`, low border/shadow | Same | MATCH |
| Week tracker | Seven labels, connectors and four source states | Same state vocabulary and geometry | MATCH |
| Pantry surface | White row card and warm icon tile | Same | MATCH |
| Big Al card | `#f0eee8`, dot texture, three-column composition | Same | MATCH |
| Hero asset crop | Circular `object-cover` | Same checked-in source bitmap and crop | MATCH |
| Portrait crop | Circular `object-cover` | Same checked-in source bitmap and crop | MATCH |
| Spot art | `object-contain`, 80% opacity | Same checked-in source bitmap and treatment | MATCH |
| Navigation order | Kitchen, Cookbook, Specials, Menu, Pantry | Same links in the same order | MATCH |
| Active navigation | Peach Kitchen item and translucent icon pill | Same | MATCH |
| Pantry indicator | Secondary dot with primary border | Same, shown only for real open items | MATCH WITH TRUTHFUL DATA |
| Header trailing icon | Inert heart | House Favourite star and Cookbook-filter link | INTENTIONAL DIFFERENCE |

## Copy check

The fixture benchmark uses the exact Stitch strings, including `Big Al's Kitchen`, `Let's Cook`, the dinner metadata separators, and the quoted Big Al line. The browser test rejects visible encoded entities such as `&apos;`, `&amp;`, and `&quot;`.

Production replaces only data-bearing copy:

| Slot | Production rule |
| --- | --- |
| Next Dinner title | Earliest active dinner on or after today across This Week and Next Week |
| Metadata | Available prep-plus-cook minutes, difficulty, and servings only; missing fields and separators are omitted |
| Cook action | `/cookbook/recipes/{recipeId}/cook` |
| No Restaurant | `Create your Restaurant` and `/restaurants/new` in the same hero slot |
| No future dinner | `No dinner planned` and `/menu` in the same hero slot |
| This Week | Real dinner-event count with correct singular/plural; dots use distinct planned dates |
| Pantry | Real active shopping-item count with correct singular/plural |
| Big Al Says | Exact Stitch quote remains static |

## Responsive screenshot results

| Project | Baseline | Result | Observed source reflow |
| --- | --- | --- | --- |
| `kitchen-320` | `tests/visual-snapshots/kitchen-320/kitchen.png` | PASS | Three-line dinner title, two-line metadata and CTA; equal-width nav accommodation prevents horizontal overflow |
| `kitchen-375` | `tests/visual-snapshots/kitchen-375/kitchen.png` | PASS | Two-line dinner title and wrapped servings value |
| `kitchen-390` | `tests/visual-snapshots/kitchen-390/kitchen.png` | PASS | Literal target composition |
| `kitchen-430` | `tests/visual-snapshots/kitchen-430/kitchen.png` | PASS | One-line dinner title and naturally shorter intrinsic cards |
| `stitch-reference` | `tests/visual-snapshots/stitch-reference/kitchen.png` | PASS | Direct `390 × 884` DPR-2 comparison against Stitch |

Every project checks the exact visible copy, navigation order/current state, horizontal overflow, successful font/image decoding, and that Big Al Says can scroll fully above the fixed navigation.

## Intentional differences

1. Stitch's inert heart is the approved House Favourite star. It links to `/cookbook?view=house-favourites`; the empty filtered state now includes `View all Recipes`.
2. Stitch's missing image alternatives and icon-button labels were corrected. The sausage spot is marked decorative, day states receive full non-visual labels, and the Pantry indicator has a text equivalent.
3. At `340px` and below the five nav items use equal columns instead of Stitch's overflowing five `64px` minimums. Order, icon treatment, active state and touch usability are unchanged.
4. Main bottom clearance is `119px` instead of Stitch's `96px`, so all content can scroll above the `103px` fixed nav. This does not move any element at the reference viewport.
5. Fonts and Stitch image assets are checked in and self-hosted to make captures deterministic; the rendered files and treatments match the source.
6. The fixture page is available only to the visual-test build path. A normal production build returns `404` for `/__visual/kitchen`, verified against `next start`.
7. The leading arrow retains the Stitch icon and geometry but links to Restaurant Cooking Preferences on the authenticated Kitchen, preserving that existing destination without adding UI.

No unexplained visual deviation remains at the required widths.

## Business-logic and isolation check

- `/` remains inside the authenticated `(app)` layout and keeps the existing Supabase claims check.
- `getCurrentRestaurant()` remains the only Restaurant selection seam; no Restaurant ID is accepted from the URL or client.
- Menu and Pantry reads use the cookie-bound server client, explicit Restaurant filters, and existing RLS.
- One shared calendar snapshot drives the Menu range, Pantry range, next-dinner selection and day dots; read errors fail into the existing error boundary instead of masquerading as zero data.
- No schema, migration, RLS policy, service-role path, or database mutation was added.
- Existing Menu, Pantry, Recipe, Cook Mode, House Favourite actions, and RPCs remain in place.
- The live Kitchen adds no client-side Supabase call and receives only a plain serializable view model.
- Other authenticated routes retain the existing header, Sign out control, support link, and navigation.

## Verification commands

```text
pnpm test:visual
NODE_VERSION=22.23.2 /Users/Alex/.nvm/nvm-exec pnpm test
pnpm lint
pnpm typecheck
pnpm build
git diff --check
```

The durable PR/issue report records the final command results and Preview evidence.
