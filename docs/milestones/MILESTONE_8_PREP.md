# Milestone 8 Readiness Notes

## Founder decision

Proceed with building the remaining milestones first, then work back through the product systematically applying updates, polish and hardening.

This is acceptable as long as each milestone remains tightly scoped and MVP-first.

## Guardrail

Do not use M8 as permission to turn Big Al into a generic AI app.

Big Al should help with cooking from the Restaurant’s stored cookbook, menu, shopping and cooking history.

## M8 build posture

- Build the smallest useful Basic Big Al experience.
- Prefer deterministic data-backed helper actions over open-ended AI behaviour.
- Keep outputs grounded in the Restaurant’s own data.
- Clearly handle “I do not have enough information yet.”
- Avoid internet search, broad generation and unsupported claims.

## Post-milestone plan

After remaining milestones are built, return through the system for:

- wording polish
- accessibility pass
- mobile cooking usability
- data quality checks
- empty state tightening
- Supabase RLS regression checks
- MVP launch hardening