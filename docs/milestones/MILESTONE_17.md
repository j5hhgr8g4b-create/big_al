# Milestone 17 — Import Quality & Attribution Hardening

## Status

Planned for Phase 3.

## Goal

Make recipe imports trustworthy enough for private beta users.

## Why this matters

Import is one of Big Al's strongest hooks. If imported recipes are messy, duplicated or poorly attributed, users lose trust quickly. Big Al should preserve the original source, make review clear and prevent accidental clutter.

## Scope

- Improve URL import edge cases found during UAT.
- Strengthen duplicate detection and duplicate save warnings.
- Preserve source URL reliably.
- Surface creator/source attribution clearly during review and after save.
- Improve fallback import states.
- Improve source site naming where practical.
- Document known import limitations.

## Must have

- Exact duplicate source URLs are hard to save accidentally.
- Existing duplicate recipes are easy to find from the warning.
- User can deliberately save a duplicate only through an explicit override.
- Source URL is preserved.
- Creator/source attribution is visible before save.
- Saved recipes display attribution clearly.
- Failed or weak imports land in review/fallback states rather than failing silently.

## Nice to have

- Better source site display names.
- Softer warning for likely title duplicates.
- Clear import confidence or "needs checking" copy.
- Better handling of pages with partial metadata.

## Do not include

- Web-wide plagiarism checking.
- AI attribution search.
- Licensing enforcement.
- Browser automation.
- Aggressive scraping of blocked sites.
- Paid AI cleanup.
- Public creator profiles.

## Acceptance criteria

- Importing the same URL twice does not accidentally create duplicate saved recipes.
- User can still deliberately save a duplicate if they choose to.
- Imported recipe review clearly shows source and attribution fields.
- Saved imported recipe shows source/creator attribution.
- Weak imports are recoverable and reviewable.
- `pnpm lint`, `pnpm typecheck`, `pnpm build` and `git diff --check` pass.

## Edge cases

- Same URL imported twice.
- Same recipe title from different source URL.
- Source URL missing or malformed.
- Page blocked from extraction.
- JSON-LD unavailable.
- Partial ingredients but no method.
- Method but no ingredients.
- Creator unknown.

## Final report required

Codex must report:

1. Import flows tested.
2. Duplicate handling behaviour.
3. Attribution handling behaviour.
4. Fallback states changed.
5. Files changed.
6. Commands run and results.
7. Known limitations.
8. Manual retests required.
