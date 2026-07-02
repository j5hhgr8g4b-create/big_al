# Milestone 11 — URL Import Hardening

Status: Complete

## Summary

Improved the existing URL import foundation in place. URL imports now normalize common tracking parameters, choose the strongest Recipe JSON-LD candidate, preserve source URLs, use basic page metadata as a partial fallback, and show clearer extraction states during review.

## Files Changed

- `src/lib/imports/recipe-url-extractor.ts`
- `src/lib/imports/get-import.ts`
- `src/app/(app)/cookbook/imports/actions.ts`
- `src/app/(app)/cookbook/imports/[importId]/review/page.tsx`

## Validation

- `pnpm lint`
- `pnpm typecheck`

## Known Limits

Extraction still depends on accessible recipe pages with JSON-LD or basic metadata. No AI extraction, OCR, browser automation, or scraping workaround was added.
