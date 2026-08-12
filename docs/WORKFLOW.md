# Big Al Delivery Workflow

## Purpose

Keep delivery simple, visible and auditable without duplicating the same information across GitHub and Notion.

## System of record

### GitHub — delivery truth

GitHub holds:

- application code;
- Supabase migrations;
- tests and CI;
- working technical documentation;
- active milestones and delivery issues;
- bugs;
- polish items;
- ideas and future feature candidates;
- implementation evidence and technical handover.

### Notion — founder and business truth

Notion holds:

- business case and financial thinking;
- founder decisions and rationale;
- product principles and durable strategy;
- brand/founder story;
- launch/business planning that is not an engineering work queue.

Do not maintain duplicate task trackers in both systems.

## Delivery hierarchy

Use this hierarchy:

1. **Milestone issue** — one outcome with entry/exit criteria.
2. **Child issues** — only when the milestone genuinely needs separable pieces of work.
3. **Bug / Polish / Idea issues** — independent backlog items.
4. **Pull requests / commits** — implementation evidence.

For the current solo-founder workflow, do not create dozens of tiny issues for work Codex can complete safely in one milestone prompt.

## Issue labels

Use labels consistently:

- `milestone` — milestone control issue
- `active` — current delivery focus
- `blocked` — cannot proceed because a concrete dependency is missing
- `bug` — behaviour is wrong or broken
- `important` — meaningful non-blocking work
- `polish` — quality improvement that does not block the core loop
- `idea` — unapproved product idea
- `future` — deliberately parked
- `repository` — repo/CI/branch/tooling work
- `security` — security or data-isolation concern
- `beta` — private-beta work
- `documentation` — working documentation change

## Milestone states

Represent milestone state in the issue title/body and labels:

- **Planned** — defined but not active
- **Active** — current work
- **Blocked** — entry/exit condition cannot currently be verified
- **Complete** — acceptance criteria and required live checks passed

Do not mark a deployment/beta milestone complete from local tests alone when live evidence is required.

## Current milestone sequence

- M21 — Private Beta: engineering preparation complete; live closeout remains before beta can begin.
- M22 — Beta Findings & Launch Decision: begins only after sufficient M21 beta evidence exists.

Do not invent M23+ scope until M22 evidence and a founder decision justify it.

## Issue intake

### Bug

A bug must include:

- what the user was trying to do;
- what happened;
- expected behaviour;
- reproduction steps;
- Restaurant/user context if relevant without exposing secrets;
- severity: Blocker / Important / Polish.

### Idea

An idea must explain:

- the cooking problem it solves;
- why the current product is insufficient;
- whether it supports Import → Save → Plan → Shop → Cook;
- complexity/risk;
- whether it should stay parked until beta evidence supports it.

Ideas are not automatically roadmap commitments.

## Standard milestone workflow

1. Confirm the active branch and clean status.
2. Read the milestone issue and relevant repository docs.
3. Implement only the approved scope.
4. Add/update focused tests.
5. Run `pnpm test`, `pnpm lint`, `pnpm typecheck`, `pnpm build`, and `git diff --check` where practical.
6. Review the final diff.
7. Commit and push to the active branch.
8. Record manual/live UAT still required.
9. Close the milestone issue only after its acceptance criteria pass.
10. Update `docs/CURRENT_STATUS.md` and `docs/HANDOVER.md` only when the project state actually changes.

## Product guardrail

Big Al exists to **make cooking easy and enjoyable**.

Protect the core loop:

**Import → Save → Plan → Shop → Cook**

Do not convert GitHub backlog volume into product scope. Simplicity wins.
