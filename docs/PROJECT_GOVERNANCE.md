# Big Al — Project Governance

## Purpose

Keep project direction, implementation and evidence aligned without maintaining duplicate project-management systems.

## Source of truth

- **Notion App HQ** owns the live project position, founder decisions and immediate next action.
- **GitHub** owns code, migrations, tests, milestone implementation records and the technical audit trail.
- Repository status files are concise snapshots and must not contradict App HQ.

The old Notion Work Tracker and superseded dashboards have been archived. Do not treat them as live sources of truth.

## Live repository control files

Keep these aligned when project state changes materially:

- `docs/CURRENT_STATUS.md`
- `docs/HANDOVER.md`
- `docs/milestones/README.md`
- the active milestone record
- `docs/CHANGELOG.md` when implementation or milestone status changes
- `AGENTS.md` for Codex permissions

Historical milestone files should generally remain untouched after completion unless they contain a dangerous factual error.

## No silent decisions

Codex must not silently change:

- product scope;
- architecture;
- authentication model;
- database ownership model;
- RLS/security rules;
- deployment strategy;
- branch strategy;
- destructive data behaviour.

These require an explicit milestone or founder decision.

## Milestone completion rule

A milestone is complete only when the evidence required by that milestone passes.

A local build is not enough when the milestone requires live database work, authenticated UAT, security verification or founder acceptance.

## Product control

Every decision should support:

**Make cooking easy and enjoyable.**

Protect:

**Import → Save → Plan → Shop → Cook**

Prefer simplicity over feature quantity. Food is the hero. Restaurants are the collaboration model. Community should reward cooking behaviour rather than popularity.

## Documentation rule

Do not create a new tracker/page/file merely because information can be documented. Prefer updating the smallest existing live control document.

Archive or leave historical records in place rather than letting multiple pages claim to be the current status.
