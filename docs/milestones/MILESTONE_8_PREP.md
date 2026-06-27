# Milestone 8 Readiness Notes

## Founder decision

Proceed with building the remaining milestones first, then work back through the product systematically applying updates, polish and hardening.

This is acceptable as long as each milestone remains tightly scoped and MVP-first.

## Guardrail

Do not use M8 as permission to turn Big Al into a generic AI app.

Big Al should help with cooking from the Restaurant’s stored cookbook, menu, shopping and cooking history.

## Cost guardrail

The current MVP version must remain free to run from an AI-provider perspective.

Do not introduce a paid AI subscription, paid model, paid API key, paid usage plan, or billing-gated provider setup in M8.

If an AI upgrade is useful later, treat it as a future paid/subscription phase after the MVP loop is proven.

## M8 build posture

- Build the smallest useful Basic Big Al experience.
- Prefer deterministic data-backed helper actions over open-ended AI behaviour.
- Keep outputs grounded in the Restaurant’s own data.
- Clearly handle “I do not have enough information yet.”
- Avoid internet search, broad generation and unsupported claims.
- Avoid paid AI dependencies during the MVP build.

## Post-milestone plan

After remaining milestones are built, return through the system for:

- wording polish
- accessibility pass
- mobile cooking usability
- data quality checks
- empty state tightening
- Supabase RLS regression checks
- MVP launch hardening