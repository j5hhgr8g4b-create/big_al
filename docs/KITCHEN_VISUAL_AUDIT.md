# Kitchen visual audit — Stitch benchmark

Reference: Stitch project `16404102405138321464`, screen `6f949b405f7644388a68f7730f5ba217`, **Kitchen (Home) - Refined Theme**.

## Literal shared/composition checklist

| Stitch requirement | Big Al implementation |
| --- | --- |
| Cream `#fcf9f3` full-width mobile canvas | `--color-bg` and `app-shell` |
| 24px mobile gutters and 8px top content offset | `.app-main` |
| 64px sticky top bar with back icon, centred title, trailing control | `.app-header`, `.topbar-icon`, `.brand-wordmark`, auth-preserving sign-out icon |
| Aubergine dinner card, 24px radius, 20px padding, circular food image | `.kitchen-dinner-card`, `.kitchen-dinner-image` |
| Tomato action pill with chevron | `.kitchen-action-dark` |
| White weekly planner card with 16px radius and progress line/dots | `.kitchen-surface-card`, `.kitchen-week-progress` |
| Pantry single-row status card with icon and chevron | `.kitchen-pantry-card` |
| Warm Big Al Says card with circular mark, label, accent copy | `.kitchen-says-card` |
| Navy rounded mobile bottom bar and active icon capsule | `.bottom-nav`, `.nav-item.active` |
| Stitch typography | centrally loaded CSS font stack and shared typography tokens |

## Product substitutions and deliberate deviations

| Stitch element | Implemented | Match / deviation | Reason |
| --- | --- | --- | --- |
| Trailing header heart | Sign-out icon | Deliberate visual substitution | The header heart has no supported Big Al action; auth must remain visible and functional. |
| “Creamy Garlic Sausages” hero data | Current first planned Restaurant recipe | Uses truthful Restaurant-scoped data | No fake recipe/title/metrics. |
| Hero food image | Current recipe image, circular crop | Same visual slot and crop | Uses supported Big Al image data. |
| Big Al chef illustration | Circular `BA` mark | Same size/position slot, simpler art | No supported chef asset; avoids inventing unsupported public Chef mechanics. |
| “5 dinners planned” and pantry count | Current planned events and active shopping items | Truthful values replace reference fixture values | No fake counts. |

The primary implementation target is 320, 375, 390, and 430px. At larger widths the mobile composition scales within the Stitch-style canvas; the mobile bottom bar is hidden at desktop widths as in the reference.
