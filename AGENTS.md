# Big Al — Codex Working Permissions

Codex is authorised to complete the explicitly requested Big Al milestone autonomously within this repository and the scope of the task.

## Working directory and branch

Primary Codespaces path:

```text
/workspaces/big_al
```

Active branch unless explicitly changed:

```text
clean-milestone-4-sync
```

`main` is stale and must not be used for active work.

## Codex may do without asking for routine approval

- Read and search any file in this repository.
- Create, edit, move or delete files required by the requested milestone.
- Run development, test and diagnostic commands.
- Run `pnpm install` when dependencies genuinely require it.
- Run `pnpm test`, `pnpm lint`, `pnpm typecheck`, `pnpm build`, and `git diff --check`.
- Start development/test servers where required.
- Inspect Git status, logs, branches and diffs.
- Create database migration files when explicitly required by the milestone.
- Make application changes required to satisfy the milestone.
- Fix issues directly caused by its own changes.
- Add or update automated tests.
- Format code.
- Commit completed milestone work.
- Push completed milestone work to the current working branch.
- Perform a safe, non-destructive rebase of the current working branch onto its remote counterpart when required solely to reconcile remote changes before push.

Routine actions covered above should not trigger repeated approval prompts.

## Codex must stop before

- force pushing;
- rewriting shared remote history destructively;
- merging into `main`;
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

- Notion **App HQ**: live project position, founder decisions and next action.
- GitHub: implementation, migrations, tests and technical audit trail.
- `docs/CURRENT_STATUS.md`: concise repository state.
- `docs/HANDOVER.md`: resume point.

If repository documents contradict App HQ, reconcile the live repository control documents before starting unrelated work.

## Standard milestone workflow

1. Confirm working directory, branch and clean status.
2. Read the active milestone and relevant implementation.
3. Implement only the requested scope.
4. Run relevant tests and required quality checks.
5. Review the final diff for unintended changes.
6. Fix milestone-related failures.
7. Commit intentionally.
8. Push to the current working branch.
9. Return a concise completion report including remaining limitations and required manual UAT.

Do not declare a live/deployment milestone complete solely from local automated tests when the milestone requires live verification.
