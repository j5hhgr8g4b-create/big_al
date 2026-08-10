# Milestone 20 — Beta Readiness Review

## Status

Complete in Phase 3 — **GO**. M21 is next and has not started.

Closeout commit: `17c6b7c — M20 harden recipe URL import security`

## Decision

**GO — proceed to M21 Private Beta Testing.**

The founder-authenticated Import → Save → Plan → Shop → Cook loop passed before this review, M15-M19 are complete, and no technical M20 blocker remains.

## Readiness evidence

- Founder authenticated UAT passed the complete Import → Save → Plan → Shop → Cook loop.
- M15 Founder UAT Closeout, M16 Core Reliability, M17 Import Quality, M18 Shopping Reliability and M19 Cook Mode Polish are complete.
- The server-side URL importer now accepts only validated public HTTP/HTTPS destinations.
- DNS results are checked for unsafe IPv4 and IPv6 destinations, including private, loopback, link-local, metadata, IPv4-mapped IPv6, 6to4 and special-purpose ranges.
- The validated DNS address is pinned into the connection and shared-agent socket reuse is disabled.
- Every redirect destination is resolved and revalidated, with a small redirect limit.
- Responses must be HTML or XHTML and streamed body consumption is capped at 2 MiB.
- The ten-second timeout covers DNS, redirects and response streaming.
- Rejected and failed automatic extraction retains the existing manual-review recovery path without exposing security details to the user.
- Focused importer security tests pass 22/22.
- `pnpm lint`, `pnpm typecheck`, `pnpm build` and `git diff --check` pass.
- No remaining technical M20 blocker was identified.

## M21 entry checks

These are beta-entry verification tasks, not unresolved M20 blockers:

1. Run a live authenticated two-user Restaurant-isolation smoke test.
2. Run a live supported public recipe import.
3. Confirm a rejected or unsafe import reaches manual-review recovery.

Current RLS, RPC and server-access review found no demonstrated cross-Restaurant access path. The missing two-user exercise remains a verification gap rather than evidence of a security failure.

## Accepted limitations

- Shopping interpretation remains deterministic and can be literal.
- Cook Mode instruction quality depends on the imported recipe.
- Minor visual polish remains.
- The current UX assumes one active/first Restaurant.
- Native screen-awake support is not implemented.

These do not block private beta unless real beta evidence shows they prevent successful cooking.

## Goal

Decide whether Big Al is ready to invite private beta testers.

## Why this matters

Private beta should be earned by readiness. Big Al should not be shown to testers until the founder UAT evidence says the core loop is stable enough.

This milestone is a review and preparation milestone, not a feature build.

## Scope

- Review founder UAT evidence.
- Review known bugs and blockers.
- Review security/RLS confidence.
- Review core loop readiness.
- Define private beta test scope.
- Define tester instructions.
- Define tester feedback process.
- Decide go/no-go for M21 Private Beta Testing.

## Must have

- Clear go/no-go decision.
- Launch blockers listed.
- Non-blocking polish separated.
- Private beta task list written.
- Tester feedback method defined.
- Tester invitation criteria defined.
- Beta risks documented.

## Nice to have

- Short tester welcome copy.
- Simple beta checklist.
- Known limitations note for testers.
- Founder observation guide.

## Do not include

- New feature build.
- Public launch preparation.
- Marketing site work.
- Referral system.
- Public waitlist.
- Broad analytics implementation.

## Acceptance criteria

- Founder can clearly say whether M21 should begin.
- Beta test scope is narrow and practical.
- Testers know what to try.
- Feedback path is clear.
- Known limitations are documented.
- Any remaining blockers have owners or explicit decisions.

## Edge cases

- Founder UAT still has unresolved blockers.
- Pantry is not good enough for testers.
- Duplicate import handling remains unclear.
- RLS confidence is incomplete.
- Tester instructions would require too much personal explanation.

## Final report required

Codex or the reviewer must report:

1. Founder UAT evidence reviewed.
2. Blockers remaining.
3. Non-blocking polish remaining.
4. Beta test scope.
5. Tester instructions.
6. Feedback process.
7. Go/no-go decision for M21.
