<!--
Historical project design-system export retained for provenance only.
The authoritative Kitchen screen uses docs/stitch/DESIGN.md (Velvet Hearth).
-->
---
name: Kitchen Hearth
colors:
  surface: '#fff8f5'
  surface-dim: '#e1d8d4'
  surface-bright: '#fff8f5'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#fbf2ed'
  surface-container: '#f5ece7'
  surface-container-high: '#efe6e2'
  surface-container-highest: '#e9e1dc'
  on-surface: '#1e1b18'
  on-surface-variant: '#47464f'
  inverse-surface: '#34302c'
  inverse-on-surface: '#f8efea'
  outline: '#787680'
  outline-variant: '#c8c5d0'
  surface-tint: '#5b598c'
  primary: '#050235'
  on-primary: '#ffffff'
  primary-container: '#1d1b4b'
  on-primary-container: '#8583ba'
  inverse-primary: '#c4c1fb'
  secondary: '#b4280c'
  on-secondary: '#ffffff'
  secondary-container: '#fe5d3d'
  on-secondary-container: '#5c0a00'
  tertiary: '#0b0b07'
  on-tertiary: '#ffffff'
  tertiary-container: '#22221d'
  on-tertiary-container: '#8b8982'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2dfff'
  primary-fixed-dim: '#c4c1fb'
  on-primary-fixed: '#171545'
  on-primary-fixed-variant: '#434173'
  secondary-fixed: '#ffdad3'
  secondary-fixed-dim: '#ffb4a4'
  on-secondary-fixed: '#3e0500'
  on-secondary-fixed-variant: '#8d1600'
  tertiary-fixed: '#e5e2da'
  tertiary-fixed-dim: '#c9c6be'
  on-tertiary-fixed: '#1c1c17'
  on-tertiary-fixed-variant: '#474741'
  background: '#fff8f5'
  on-background: '#1e1b18'
  surface-variant: '#e9e1dc'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 36px
    fontWeight: '800'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 34px
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 22px
    fontWeight: '700'
    lineHeight: 28px
  accent-hand:
    fontFamily: Bricolage Grotesque
    fontSize: 18px
    fontWeight: '500'
    lineHeight: 24px
  body-lg:
    fontFamily: Work Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Work Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Work Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 30px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 8px
  sm: 16px
  md: 24px
  lg: 32px
  xl: 48px
  margin-mobile: 20px
  gutter: 16px
---

## Brand & Style

The brand personality is that of a warm, dependable, and slightly whimsical culinary companion. It targets home cooks who value the ritual of cooking over industrial efficiency. The emotional response should be one of comfort, encouragement, and tactile delight—reminiscent of a well-loved physical cookbook stained with olive oil and filled with handwritten notes.

The design style is a blend of **Modern-Tactile** and **Soft-Minimalism**. It utilizes a "paper-and-ink" foundation with a soft cream base to reduce eye strain and increase warmth. Visual interest is driven by high-contrast navy accents, vibrant pops of tomato-red, and playful, hand-drawn illustrations that break the rigid digital grid. Elements feel physical through the use of soft shadows, generous rounding, and organic movement.

## Colors

This design system uses a palette rooted in natural, food-inspired tones. The default mode is **Light**, utilizing a cream background to simulate high-quality paper.

- **Primary (Deep Navy):** Used for navigation bars, primary text, and grounding structural elements. It provides a sense of authority and reliability.
- **Secondary (Tomato Red):** Reserved for primary actions, badges, and high-energy highlights. It evokes appetite and urgency.
- **Surface (Cream):** The primary canvas. It is softer than pure white, providing a cozy, approachable atmosphere.
- **Accents (Earth Tones):** Moss green and mustard yellow are used sparingly for category tags and secondary status indicators, reinforcing the "from-the-earth" culinary theme.

## Typography

The typography strategy balances modern legibility with a "hand-crafted" feel.

- **Plus Jakarta Sans** is the primary typeface for headers, providing a friendly yet clean geometric structure.
- **Work Sans** is used for all body copy and lists, chosen for its exceptional readability in recipe ingredient lists and step-by-step instructions.
- **Bricolage Grotesque** acts as the "handwritten" accent. It is used for "Chef’s Tips," quotes, and playful annotations, mimicking the marginalia found in personal recipe books.

For mobile devices, scale headlines down by 15-20% to maintain a comfortable reading rhythm in narrow containers. Maintain generous line height (at least 1.5x) for recipe steps to ensure they are readable from a distance on a kitchen counter.

## Layout & Spacing

The layout follows a **fluid grid** model with a focus on generous white space (the "breathing room" of the design). 

- **Grid:** Use a 4-column grid for mobile and a 12-column grid for tablet/desktop. 
- **Rhythm:** An 8px linear scale governs all padding and margins. 
- **Safe Zones:** Mobile screens must maintain a 20px outer margin to prevent content from feeling cramped against the device edges.
- **Stacking:** Use "Card-on-Canvas" stacking. Components should have clear vertical separation (24px or 32px) to denote different sections of a recipe or meal plan.

## Elevation & Depth

Visual hierarchy is achieved through **Tonal Layering** and **Soft Ambient Shadows**.

- **Level 0 (Canvas):** The cream background.
- **Level 1 (Cards/Containers):** Pure white surfaces with a very subtle, diffused shadow (Blur: 20px, Y: 4px, Opacity: 5% Navy). This creates a "resting" effect on the paper-like background.
- **Level 2 (Active/Interactive):** Elements like "Cook Now" buttons or active recipe cards use a slightly more pronounced shadow and a 1px soft border (Navy at 10% opacity) to signify clickability.
- **Depth Cues:** Do not use heavy black shadows. Shadows should always be tinted with the Primary Navy color to maintain a cohesive, warm atmosphere.

## Shapes

The shape language is organic and inviting. All interactive containers and buttons must use rounded corners to avoid the "sharpness" of traditional corporate software.

- **Standard Containers:** Use 16px (1rem) corner radius.
- **Buttons & Chips:** Use 32px (Pill-shaped) for a more tactile, "bouncy" feel.
- **Images:** Recipe photography should always feature rounded corners (16px) to match the UI containers, often accompanied by a thin, cream-colored inner stroke to make the images feel "set into" the page.

## Components

- **Buttons:** Primary buttons are Navy with White text or Secondary Red with White text. They feature a slight "squish" animation on press. Use pill shapes for high-level actions.
- **Cards:** White backgrounds on the Cream canvas. Cards include a "Header" area for the recipe title and a "Footer" for metadata (time, difficulty).
- **Checkboxes:** Styled as "Hand-drawn" circles that fill with a checkmark and a strikethrough animation for the text when an ingredient is gathered.
- **Input Fields:** Soft cream backgrounds with a 1px Navy border. Focus states should use a Mustard Yellow glow to indicate activity.
- **Chips/Tags:** Small, pill-shaped markers using Earth Tones (Green/Yellow) with dark text for category filtering (e.g., "Quick & Easy").
- **Navigation Bar:** A grounded Navy bar at the bottom for mobile, with high-contrast white icons. The active state is indicated by a Secondary Red dot or a Mustard Yellow icon tint.
