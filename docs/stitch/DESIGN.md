---
name: Velvet Hearth
colors:
  surface: '#fcf9f3'
  surface-dim: '#dcdad4'
  surface-bright: '#fcf9f3'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3ed'
  surface-container: '#f0eee8'
  surface-container-high: '#ebe8e2'
  surface-container-highest: '#e5e2dc'
  on-surface: '#1c1c18'
  on-surface-variant: '#4a454d'
  inverse-surface: '#31312d'
  inverse-on-surface: '#f3f0eb'
  outline: '#7b757e'
  outline-variant: '#ccc4ce'
  surface-tint: '#6a567e'
  primary: '#200e31'
  on-primary: '#ffffff'
  primary-container: '#352347'
  on-primary-container: '#a089b4'
  inverse-primary: '#d6bdeb'
  secondary: '#a03f2e'
  on-secondary: '#ffffff'
  secondary-container: '#fe8770'
  on-secondary-container: '#741f11'
  tertiary: '#0a1a0d'
  on-tertiary: '#ffffff'
  tertiary-container: '#1f2f20'
  on-tertiary-container: '#859784'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#f0dbff'
  primary-fixed-dim: '#d6bdeb'
  on-primary-fixed: '#251336'
  on-primary-fixed-variant: '#523f65'
  secondary-fixed: '#ffdad3'
  secondary-fixed-dim: '#ffb4a6'
  on-secondary-fixed: '#3f0300'
  on-secondary-fixed-variant: '#802919'
  tertiary-fixed: '#d4e8d2'
  tertiary-fixed-dim: '#b8ccb6'
  on-tertiary-fixed: '#0f1f11'
  on-tertiary-fixed-variant: '#3a4b3b'
  background: '#fcf9f3'
  on-background: '#1c1c18'
  surface-variant: '#e5e2dc'
  aubergine-deep: '#2A1C38'
  burnt-clay: '#8C392A'
  clove-tint: '#E8E1D9'
  cook-mode-bg: '#1E1B18'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '800'
    lineHeight: 48px
    letterSpacing: -0.03em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 26px
    fontWeight: '700'
    lineHeight: 32px
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 30px
  accent-hand:
    fontFamily: Bricolage Grotesque
    fontSize: 18px
    fontWeight: '500'
    lineHeight: 24px
  body-lg:
    fontFamily: Work Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 30px
  body-md:
    fontFamily: Work Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
  label-md:
    fontFamily: Work Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Work Sans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  margin-mobile: 24px
  margin-desktop: 64px
  gutter: 16px
  section-gap: 48px
---

## Brand & Style

The brand personality is that of a sophisticated, calming, and premium culinary guide. It is designed for the discerning home chef who views the kitchen as a sanctuary. The emotional response is one of relaxed focus—moving away from high-energy "kitchen chaos" toward a "slow-living" editorial experience. 

The design style is **Modern-Tactile with a Premium Minimalist lean**. It moves away from high-contrast utility toward a softened, atmospheric interface. The aesthetic is defined by deep, desaturated tones, ample whitespace, and a "soft-touch" digital feel. It avoids the harshness of pure black or pure white, opting instead for a rich, cream-based foundation and an "ink-on-vellum" quality. Visual depth is achieved through subtle tonal shifts rather than aggressive shadows, creating an interface that feels both expensive and approachable.

## Colors

The palette is rooted in deep, culinary-inspired pigments that evoke a sense of heritage and quality.

- **Primary (Softened Aubergine):** A deep, desaturated purple used for branding, primary navigation, and heavy structural elements. It provides a more relaxed alternative to black.
- **Secondary (Muted Burnt Orange):** A sophisticated, earthy red-orange. This is used for primary actions and highlights, offering appetite appeal without the urgency of a standard "signal" red.
- **Surface (Warm Cream):** The primary background color. It is designed to look like high-quality, uncoated paper, reducing eye strain and providing a luxurious canvas.
- **Tertiary (Sage Green):** A muted, natural green used for secondary status indicators and category labels, reinforcing the organic nature of the content.
- **Cook Mode:** A specific dark-mode override (`#1E1B18`) used only during active cooking sessions to provide high contrast against the bright screens often found in kitchens.

## Typography

The typography system is designed for long-form reading and clear instructional hierarchy.

- **Plus Jakarta Sans (Headings):** Provides a modern, geometric clarity. The weight is kept slightly heavier to ground the airy layout.
- **Work Sans (Body & UI):** Chosen for its exceptional legibility and neutral character. Line heights are intentionally generous (up to 1.6x) to ensure users can follow recipes at arm's length.
- **Bricolage Grotesque (Accents):** Used sparingly for editorial "notes," chef tips, and pull-quotes. This acts as the human voice in the system.

Mobile scales prioritize legibility over density; headlines should wrap gracefully with increased line-height to maintain an elegant, uncrowded feel.

## Layout & Spacing

The design utilizes a **fluid grid with exaggerated margins** to reinforce the premium editorial feel.

- **Grid Model:** A 12-column grid on desktop and a 4-column grid on mobile. 
- **Rhythm:** An 8px base unit drives all spatial decisions. Content blocks use "loose" spacing (32px+) to prevent the UI from feeling like a utility tool.
- **Adaptivity:** On mobile, margins are increased to 24px to create a protective frame around content. On desktop, the content width is capped at 1280px to maintain comfortable line lengths for recipe instructions.
- **Hierarchy:** Use "spatial grouping" where related ingredients or steps are kept in tight proximity (8px-16px), while distinct phases of a process are separated by large gaps (48px) to denote a transition in the user's journey.

## Elevation & Depth

Depth in this design system is conveyed through **Tonal Layering and Low-Contrast Shadows**.

- **Surface Levels:** The primary background is the warm Cream. Secondary containers (cards, sidebars) use a slightly deeper "Clove" tint or a pure White, depending on the required focus.
- **Shadow Profile:** Shadows are extremely soft, using the Primary Aubergine color at very low opacities (3-6%). This prevents the UI from feeling "gray" and maintains the warm, organic temperature.
- **Interaction:** Active states are signaled by a subtle 1px inset border or a slight tonal shift rather than a heavy lift. The goal is to make elements feel like they are resting on the page, not hovering far above it.
- **Cook Mode Depth:** In dark states, elevation is shown strictly through lighter tonal shades of gray-purple, with no shadows used to minimize screen glare.

## Shapes

The shape language is sophisticated and controlled. We avoid both harsh 90-degree angles and overly "bouncy" or "bubbly" curves.

- **Primary Radius:** A 0.5rem (8px) radius is the standard for most cards and input fields, providing a soft but structured appearance.
- **Secondary Radius:** Larger containers use a 1rem (16px) radius to emphasize their role as a "holding area" for content.
- **Pill Shapes:** Reserved exclusively for interactive elements like buttons and chips to distinguish them from static content containers.
- **Image Treatment:** All recipe photography must use the 1rem corner radius to integrate seamlessly with the UI architecture.

## Components

- **Buttons:** Primary buttons use the Softened Aubergine with Cream text. Secondary buttons use a Burnt Orange ghost style (outline). All buttons use a pill-shaped geometry.
- **Cards:** Cards should be rendered with a White background against the Cream surface, featuring a 1rem radius and a 1px "Clove" border for definition without high-contrast shadows.
- **Input Fields:** These use a subtle "Clove" tint background with a bottom-only border in Aubergine when focused. This mimics the look of a lined notebook.
- **Chips & Tags:** Small, pill-shaped tags use the Tertiary Sage Green with a dark-tinted text. They should have no shadow.
- **Navigation:** Bottom navigation on mobile uses a solid Aubergine bar with icons in desaturated Cream. The active state is indicated by a Burnt Orange underline or dot.
- **Checkboxes:** In recipe lists, checkboxes should be styled as soft-edged squares that transition to a Burnt Orange fill when checked, providing a satisfying "completed" visual cue.
- **Progress Bars:** Use a thin, 4px track in "Clove" with a Burnt Orange filler to indicate recipe progress or prep timing.
