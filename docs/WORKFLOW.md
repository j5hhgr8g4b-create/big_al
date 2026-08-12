# Big Al Delivery Workflow

## Purpose

Keep delivery simple, visible and auditable without duplicating the same information across GitHub and Notion.

## System of record

### GitHub — delivery truth

GitHub holds application code, Supabase migrations, tests, CI, working technical documentation, active milestones/issues, bugs, polish, ideas/future candidates, implementation evidence and technical handover.

### Notion — founder and business truth

Notion holds business plans, founder decisions/rationale, durable product/brand strategy and launch/business context that is not an engineering work queue.

Do not maintain duplicate task trackers in both systems.

## Branch model

`main` is the only long-lived working branch and represents the canonical Big Al product history.

All repository changes should use a short-lived branch from current `main`:

- `milestone/<name>`
- `feature/<name>`
- `fix/<name>`
- `polish/<name>`
- `security/<name>`
- `docs/<name>`

The old June repository history is preserved at `archive/legacy-main-2026-06`.

`clean-milestone-4-sync` was a recovery branch and is retired for new work.

### Standard branch lifecycle

1. Pull current `main`.
2. Create a short-lived task branch.
3. Implement only the approved issue/milestone scope.
4. Add/update focused tests.
5. Run `pnpm test`, `pnpm lint`, `pnpm typecheck`, `pnpm build`, and `git diff --check` where practical.
6. Review the diff.
7. Commit and push the task branch.
8. Open a PR targeting `main`.
9. Merge only when Quality CI passes and any required live/manual acceptance evidence is satisfied.
10. Delete/retire the short-lived branch.

Do not push directly to `main` except in an explicit founder-approved emergency.

Do not maintain long-running development branches.

## Delivery hierarchy

1. **Milestone issue** — one outcome with entry/exit criteria.
2. **Child issues** — only when the milestone genuinely needs separable pieces of work.
3. **Bug / Polish / Idea issues** — independent backlog items.
4. **Task branch + PR** — implementation unit and review boundary.
5. **Merge to `main`** — canonical completion evidence.

For the current solo-founder workflow, do not create dozens of tiny issues for work Codex can complete safely in one milestone prompt.

## Issue labels

Use labels consistently:

- `milestone` — milestone control issue
- `active` — current delivery focus
- `blocked` — concrete dependency missing
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

A bug must include what the user was trying to do, what happened, expected behaviour, reproduction steps, relevant Restaurant/user context without secrets, and severity: Blocker / Important / Polish.

### Idea

An idea must explain the cooking problem it solves, why the current product is insufficient, whether it supports Import → Save → Plan → Shop → Cook, complexity/risk, and whether it should stay parked until beta evidence supports it.

Ideas are not automatically roadmap commitments.

## Product guardrail

Big Al exists to **make cooking easy and enjoyable**.

Protect the core loop:

**Import → Save → Plan → Shop → Cook**

Do not convert GitHub backlog volume into product scope. Simplicity wins.
