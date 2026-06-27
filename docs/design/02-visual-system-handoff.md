# Big Al Visual Implementation Handoff

## Approved direction

Big Al should feel like:

**A warm, handwritten, food-led mobile cookbook app with Apple-level UI discipline.**

It should not feel like:
- a SaaS dashboard
- a plain web document
- a Notion clone
- a Bootstrap/admin template
- a generic recipe website
- an amateur sketchbook

## Approved visual reference

Use:

`01-approved-kitchen-reference.html`

This is the approved Kitchen visual target. Do not creatively reinterpret it.

## Chosen style direction

Header/font style:
- Option 5: Handwritten Kitchen
- Handwritten accents are allowed for screen titles, section labels, and Big Al personality moments.
- Do not make all text handwritten.
- Body copy, metadata, buttons, form fields and longer text must remain clean and readable.

Palette:
- Base palette: Fresh Herb
- Accent replacement: Tomato Red

## Core colour tokens

```css
:root {
  --color-bg: #F6F3EA;
  --color-surface: #FFFCF6;
  --color-surface-soft: #FAF6EE;
  --color-surface-warm: #EEF0E4;

  --color-purple-900: #291939;
  --color-purple-800: #352347;
  --color-purple-700: #433056;

  --color-text: #211C18;
  --color-text-soft: #2D2621;
  --color-text-muted: #6A655D;
  --color-text-faint: #8A857C;
  --color-text-inverse: #FFFCF6;

  --color-green-700: #5D6D41;
  --color-green-600: #70824C;
  --color-green-100: #E6EBD8;

  --color-accent: #B9543C;
  --color-accent-soft: #D98A77;
  --color-honey: #D8A85B;

  --color-note: #F4E7B7;
  --color-note-border: #D7B96C;

  --color-border: #DDD7CA;
  --color-border-strong: #CFC9BB;

  --radius-md: 14px;
  --radius-lg: 18px;
  --radius-xl: 22px;
  --radius-2xl: 24px;
  --radius-full: 999px;

  --shadow-card: 0 4px 14px rgba(43, 23, 65, 0.08);
  --shadow-hero: 0 14px 30px rgba(43, 23, 65, 0.20);

  --font-ui: -apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "Inter", "Nunito Sans", system-ui, sans-serif;
  --font-hand: "Marker Felt", "Bradley Hand", "Segoe Print", "Comic Sans MS", cursive;
}
```

## Font rules

Use `--font-ui` for:
- body copy
- metadata
- buttons
- forms
- nav icons
- longer content
- recipe methods and ingredients

Use `--font-hand` for:
- screen titles
- short section labels
- handwritten-style accents
- Big Al Says
- small personality moments

Do not use handwritten font for long paragraphs or forms.

## Mobile frame rules

The app must behave like a mobile app.

Required:
- app frame max-width around 430px
- centered on desktop
- full-width on mobile
- cream background inside app
- bottom nav constrained to app frame
- page content constrained to app frame
- no full-width desktop hero banners

## Bottom navigation

Use the approved nav pattern from the reference.

Baseline:
- light cream background
- fixed at bottom
- height around 78px
- subtle top border
- subtle top shadow

Selected state:
- aubergine purple background `#352347`
- cream readable text `#FFFCF6`
- cream icon
- rounded selected pill
- clear but not heavy

Labels:
- Kitchen
- Cookbook
- Specials
- Menu
- Pantry

Do not abbreviate labels.

## Button rules

Buttons should feel optimised for mobile.

Primary:
- one clear primary action per card/section
- strong contrast
- minimum 40px height where possible
- rounded 14px
- readable system font

Secondary:
- quieter
- lower visual weight
- still button-shaped
- never plain text unless it is obviously a tertiary link

## Kitchen-specific notes

Kitchen reference is approved.

Preserve:
- handwritten Kitchen title
- Wallaces Bistro badge
- centred intro card
- Next Dinner hero structure
- single-line “Tonight?” title
- Import Recipe as primary action
- Browse cookbook as secondary action
- purple selected nav
- Tomato Red accent

## Screen adaptation principles

Apply the same system to all app screens, but respect each screen’s purpose.

Cookbook:
- card-led
- recipe rows/cards should feel tactile
- search/filter should sit in cream rounded controls
- use food-led thumbnails where available

Specials:
- should feel like a discovery/tasting board
- use cards, stickers, badges
- no generic AI/search-page feel

Menu:
- should feel like weekly meal planning, not a spreadsheet
- day cards should be rounded and readable

Pantry:
- shopping-list companion, not inventory control
- grouped sections, simple check rows, clear progress

Recipe detail:
- food/image hero where available
- clear recipe title hierarchy
- action buttons tactile
- method/ingredients readable

Cook Mode:
- can be darker and more focused
- large readable cooking text
- minimal distractions
- keep Big Al warmth via notes/tips, not clutter

## Do not implement

Do not add:
- new AI logic
- paid AI logic
- internet search
- grocery price comparison
- calorie tracking
- followers
- likes
- view counts
- influencer mechanics
- database migrations
- new Supabase tables
- new auth behaviour
- new feature logic

This is a visual implementation pass only.
