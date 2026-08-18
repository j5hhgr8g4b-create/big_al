# Kitchen — authoritative Stitch reference

## Provenance

| Field | Value |
| --- | --- |
| Stitch project | `Mobile-Optimized Web UI` |
| Project resource | `projects/16404102405138321464` |
| Screen | `Kitchen (Home) - Refined Theme` |
| Screen resource | `projects/16404102405138321464/screens/6f949b405f7644388a68f7730f5ba217` |
| Device type | `MOBILE` |
| Stitch screenshot metadata | `780 × 1768` |
| Exact generated HTML | [`reference/KITCHEN_SOURCE.html`](reference/KITCHEN_SOURCE.html) |
| Exact reference screenshot | [`reference/KITCHEN_SOURCE.png`](reference/KITCHEN_SOURCE.png) |
| Applied Design DNA | [`DESIGN.md`](DESIGN.md) |

The downloaded screenshot is exactly `780 × 1768`. The generated HTML sets a minimum body height of `884px`, and the screenshot is exactly twice `390 × 884`; repeatable reference captures therefore use a `390 × 884` CSS viewport at device scale factor `2`.

Stitch project metadata also reports a `390 × 711` canvas instance for this screen. That value describes the canvas placement instance, not the exported screenshot raster or the generated page's minimum viewport height, so it is retained here as metadata rather than used as the screenshot viewport.

## Applied design system resolution

The project exposes two design-system assets:

| Asset | Display name | Surface | Primary | Canvas state |
| --- | --- | --- | --- | --- |
| `assets/37c4e90529a441a29ffb7bf5f87d96f7` | Velvet Hearth | `#fcf9f3` | `#200e31` | Visible design-system instance beside the target screen |
| `assets/d7eb07f3e18741c2aebfeebd8a1fe560` | Kitchen Hearth | `#fff8f5` | `#050235` | Hidden earlier design-system instance |

The target HTML declares `#fcf9f3` for the surface and `#200e31` for primary, plus the rest of the Velvet Hearth token set. `docs/stitch/DESIGN.md` is therefore the exact `designMd` export from `assets/37c4e90529a441a29ffb7bf5f87d96f7`. The older project-level `Kitchen Hearth` DNA is not the token source for this target screen.

## Exact visible copy

1. `Big Al's Kitchen`
2. `NEXT DINNER`
3. `Creamy Garlic Sausages`
4. `30 min • Easy • Serves 4`
5. `Let's Cook`
6. `THIS WEEK`
7. `5 dinners planned`
8. `View Menu`
9. Day labels: `M T W T F S S`
10. `PANTRY`
11. `12 items on your list`
12. `BIG AL SAYS`
13. `"A good sausage makes everything better."`
14. Navigation: `Kitchen`, `Cookbook`, `Specials`, `Menu`, `Pantry`

No visible string contains an encoded HTML entity.

## Page structure and exact layout rules

### Canvas and top bar

- Canvas: warm cream `#fcf9f3`; Work Sans body text; minimum height `max(884px, 100dvh)`.
- Top bar: `64px` high, full width, sticky at the top, `24px` horizontal padding.
- Leading and trailing controls: `24px` Material Symbols inside `8px` padding; `arrow_back` and `favorite` in the source.
- Wordmark: Bricolage Grotesque, `26px / 32px`, CSS weight `700` synthesized from the imported `500` face, target primary colour.
- Main column: `24px` mobile gutters, `16px` vertical gap, and zero top padding. The generated `pt-sm` class has no matching spacing token and does not emit CSS. At the generated `md` breakpoint the column caps at `48rem` and centres.

At `390 × 884`, the exact CSS-pixel border boxes are:

| Element | x | y | width | height |
| --- | ---: | ---: | ---: | ---: |
| Header | 0 | 0 | 390 | 64 |
| Main content column | 24 | 64 | 342 | intrinsic |
| Next Dinner | 24 | 64 | 342 | 195 |
| This Week | 24 | 275 | 342 | 149 |
| Pantry | 24 | 440 | 342 | 90 |
| Big Al Says | 24 | 546 | 342 | 165 |
| Bottom navigation | 0 | 781 | 390 | 103 |

### Next Dinner hero

- Surface `#200e31`; `24px` radius; `20px` padding; clipped overflow.
- Shadow: `0 8px 30px rgba(32, 14, 49, 0.15)`.
- Decorative layer: `192px` primary-container circle, offset `-48px` right and bottom, `60%` opacity, `40px` blur.
- Kicker: Work Sans weight `400`, uppercase, `10px / 15px`, wide tracking, secondary-fixed `#ffdad3`.
- Title: Plus Jakarta Sans, actual `16px / 20px`; the available local face resolves to weight `700`; white. At `390px` it wraps as `Creamy Garlic` / `Sausages`.
- Metadata: Work Sans, `14px / 20px`, primary-fixed-dim `#d6bdeb`, `90%` opacity.
- CTA: secondary `#a03f2e`, white label, `10px` vertical and `24px` horizontal padding, full pill, `24px` top margin, chevron-right icon.
- Image well: `112 × 112px` below `768px`; `144 × 144px` from `768px`; circular crop; `4px` primary-container border.

### This Week card

- White `#ffffff` surface, `16px` radius, `20px` padding.
- Border: `1px` at `20%` of `#ccc4ce`.
- Shadow: `0 4px 20px rgba(32, 14, 49, 0.04)`.
- Header row bottom gap: `24px`.
- Kicker: `10px / 15px` uppercase Work Sans with wide tracking.
- Heading: Plus Jakarta Sans rendered at `18px / 28px`, resolving to the loaded `700` face.
- Action: Work Sans weight `400` at `14px / 20px`, secondary `#a03f2e`, arrow-forward icon.
- Progress: seven equal day nodes joined by `1px` lines. Monday–Wednesday are filled secondary dots; Thursday is a `2px` primary ring; Friday is an outline-variant ring; Saturday and Sunday are `40%`-opacity surface-variant dots.

### Pantry card

- White surface, `16px` radius, `20px` padding, same low-contrast border and shadow as This Week.
- Row layout with `16px` gap.
- Icon tile: `48 × 48px`, `12px` radius, surface-container `#f0eee8`, filled `inventory_2` Material Symbol.
- Copy: `10px / 15px` uppercase kicker and `16px / 24px` Plus Jakarta Sans heading.
- Trailing control: `chevron_right` in outline `#7b757e`.

### Big Al Says card

- Surface-container `#f0eee8`; `16px` radius; `20px` padding; `16px` internal gap.
- Border: `1px` at `40%` of `#ccc4ce`; soft small shadow.
- Texture: `#200e31` one-pixel radial dots on a `16 × 16px` repeat at `3%` opacity.
- Portrait: `64 × 64px`, circular crop, `3px` white border.
- Quote: Bricolage Grotesque at `20px / 25px`, weight `500`. At `390px` it wraps as `"A good sausage` / `makes` / `everything` / `better."`.
- Decorative sausage image: `40 × 40px` object-contain slot, `80%` opacity.

### Bottom navigation

- Fixed to the bottom, full width, target primary `#200e31`, `24px` top radii.
- `16px` horizontal and `12px` vertical padding.
- Shadow: `0 -4px 20px rgba(32, 14, 49, 0.15)`.
- Five labels and source icons: `home`, `menu_book`, `star`, `restaurant_menu`, `inventory_2`.
- Each item has a `64px` minimum width and `8px` padding.
- Active Kitchen item uses secondary-container `#fe8770`; the icon sits in a primary-fixed translucent pill with `16px` horizontal and `4px` vertical padding.
- Labels are Work Sans `11px / 16.5px`; Kitchen uses weight `600`, while inactive labels use `400`.
- Pantry includes a `8 × 8px` secondary notification dot with a primary border.
- The generated HTML hides this navigation at `768px` and above. The required fidelity viewports are all below that breakpoint.

## Exact source assets

| Slot | Checked-in asset | Source treatment |
| --- | --- | --- |
| Dinner hero | `/stitch/kitchen/creamy-garlic-sausages.jpg` | Circular `object-cover` crop |
| Big Al portrait | `/stitch/kitchen/big-al-chef.jpg` | Circular `object-cover` crop |
| Sausage spot art | `/stitch/kitchen/sausage-fork.jpg` | `object-contain` inside `40 × 40px` |

The original remote URLs and full generated `data-alt` descriptions remain verbatim in `reference/KITCHEN_SOURCE.html`.

## Typography and icons

- Plus Jakarta Sans: exact Latin WOFF2 from the Google Fonts source referenced by Stitch.
- Work Sans: exact Latin WOFF2 from the Google Fonts source referenced by Stitch.
- Bricolage Grotesque: exact Latin WOFF2 from the Google Fonts source referenced by Stitch.
- Material Symbols Outlined: official Google Fonts WOFF2 subset for the nine ligatures used by the screen, retaining fill-axis support.
- Local self-hosting removes runtime font-network variance while retaining the source font files.

The generated Tailwind configuration defines named typography sizes, but the screen markup uses classes such as `font-headline-md` and `font-label-md` as font-family utilities. Those classes do not apply the same-named size tokens. The reproduction therefore follows the computed sizes listed above and the exported PNG, not unused nominal token sizes.

## Responsive evidence targets

Repeat captures at:

- `320 × 884`
- `375 × 884`
- `390 × 884` at device scale factor `2` for direct reference comparison
- `430 × 884`

The `390 × 884` capture is the literal Stitch comparison. The other required widths verify wrapping, spacing, fixed navigation, and horizontal overflow without changing the target composition.
