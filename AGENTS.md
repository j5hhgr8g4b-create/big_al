# Big Al — Codex Working Permissions

Codex is authorised to complete explicitly requested Big Al work autonomously within this repository and the approved scope.

## Working directory and branch model

Primary Codespaces path:

```text
/workspaces/big_al
```

Canonical branch:

```text
main
```

`main` is the only long-lived working branch.

For meaningful implementation work, create a short-lived branch from current `main`, using a clear name such as:

- `milestone/<name>`
- `feature/<name>`
- `fix/<name>`
- `polish/<name>`
- `security/<name>`
- `docs/<name>`

Do not start new work from `clean-milestone-4-sync`. The old June history is preserved at `archive/legacy-main-2026-06` and is read-only historical context.

## Codex may do without asking for routine approval

- Read and search any file in this repository.
- Create a short-lived working branch from `main` for an approved task.
- Create, edit, move or delete files required by the requested work.
- Run development, test and diagnostic commands.
- Run `pnpm install` when dependencies genuinely require it.
- Run `pnpm test`, `pnpm lint`, `pnpm typecheck`, `pnpm build`, and `git diff --check`.
- Start development/test servers where required.
- Inspect Git status, logs, branches and diffs.
- Create database migration files when explicitly required by the milestone.
- Make application changes required to satisfy the approved task.
- Fix issues directly caused by its own changes.
- Add or update automated tests.
- Format code.
- Commit completed work to the short-lived branch.
- Push the short-lived branch.
- Open a pull request targeting `main` when the implementation is ready.
- Perform a safe, non-destructive rebase of a short-lived branch onto current `main` or its remote counterpart when required before PR/merge.

Routine actions covered above should not trigger repeated approval prompts.

## Codex must stop before

- force pushing;
- rewriting shared remote history destructively;
- bypassing failed required CI to merge into `main`;
- changing the repository branch strategy;
- deleting substantial existing functionality;
- changing agreed product scope;
- adding a major dependency when a simpler solution exists;
- altering authentication architecture without explicit milestone approval;
- weakening Supabase RLS or other security protections;
- modifying production secrets or credentials;
- resetting, dropping or destructively modifying production data;
- changing Supabase projects;
- making unrelated changes outside the requested milestone.

Direct commits to `main` are acceptable only for tiny, low-risk documentation/control corrections. Product, database, security and meaningful implementation work should use a branch + PR.

## Product guardrails

Big Al's mission is:

**Make cooking easy and enjoyable.**

The product is a living cookbook, planning tool, shopping companion and cooking companion.

Prioritise:

1. Simplicity
2. Readability
3. Accessibility
4. Ease of cooking
5. Speed

Protect the core loop:

**Import → Save → Plan → Shop → Cook**

Do not introduce followers, likes, view counts, influencer mechanics, public feeds, grocery price comparison, calorie tracking, full pantry inventory, or generic AI chatbot behaviour.

## Source of truth

- GitHub: delivery truth — code, migrations, tests, CI, working documentation, issues, ideas and technical evidence.
- Notion: founder/business truth — business plans, founder decisions and durable strategy.
- `docs/CURRENT_STATUS.md`: concise delivery state.
- `docs/HANDOVER.md`: resume point.

Do not maintain duplicate task trackers across GitHub and Notion.

## Standard implementation workflow

1. Start from current `main`.
2. Confirm clean status and pull latest `main`.
3. Create a short-lived branch for meaningful work.
4. Read the active milestone/issue and relevant implementation.
5. Implement only approved scope.
6. Run relevant tests and required quality checks.
7. Review the final diff for unintended changes.
8. Fix task-related failures.
9. Commit intentionally and push the branch.
10. Open a PR to `main`.
11. Merge only when Quality CI passes and required live/manual evidence is satisfied for the task.
12. Retire the branch after merge.
13. Return a concise completion report including remaining limitations and required manual UAT.

Do not declare a live/deployment milestone complete solely from automated tests when live verification is required.
