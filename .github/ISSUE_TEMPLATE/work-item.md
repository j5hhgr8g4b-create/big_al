---
name: Codex work item
about: Executable Big Al work ticket for Codex with evidence returned to the issue
title: ""
labels: "active"
assignees: "j5hhgr8g4b-create"
---

## Outcome

Describe the single result this work item must achieve.

## Context

State the current product/repository condition and link the relevant milestone or parent issue.

## Scope

### In scope
- 

### Out of scope
- 

## Required work

1. 

## Acceptance criteria

- [ ] 

## Required verification

Run relevant checks. For implementation work, normally include:

```bash
pnpm test
pnpm lint
pnpm typecheck
pnpm build
git diff --check
```

Do not mark live/manual gates PASS without live/manual evidence.

## Git / safety

- Start from current `main`.
- Use a short-lived task branch.
- Do not push directly to `main`.
- Keep changes within this ticket.
- Link any PR to this issue.
- Do not weaken authentication, RLS or security controls to make a test pass.

## Codex completion report

When finished, post a comment to **this issue** containing:

1. branch / commit / PR references;
2. what changed or was verified;
3. commands/checks run and their results;
4. live/manual evidence;
5. each acceptance criterion marked **PASS / FAIL / NOT TESTED** with evidence;
6. blockers and limitations;
7. exact recommended next action.

Do not rely on terminal output as the durable handoff. ChatGPT will review this GitHub issue and linked PR/code directly.
