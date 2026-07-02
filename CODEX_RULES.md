# Codex Rules

## Main Instruction

Build efficiently with minimal token waste. Work milestone by milestone. Do not attempt the full product in one prompt.

## Current Branch Rule

- `main` is stale and must not be used for the next Codex task.
- The current working branch is `clean-milestone-4-sync`.
- Milestones 0-8 are complete.
- URL import foundation already exists.
- The next approved batch is M11-M14:
  - M11 URL import hardening
  - M12 attribution protection
  - M13 Restaurant preferences foundation
  - M14 MVP closeout QA

## Hard Rules

- Do not add features not listed in the current milestone.
- Do not build social/community features in MVP.
- Do not add followers, likes, comments, or view counts.
- Do not build public Restaurants in MVP.
- Do not build pantry inventory management.
- Do not build grocery price comparison.
- Do not build calorie tracking.
- Do not create a blank AI chat homepage.
- Do not over-engineer.
- Do not skip audit log updates.
- Do not work outside /workspaces/big_al.
- Do not run migrations unless the approved milestone explicitly requires it.

## Source Of Truth

- Notion "App HQ" is the source of truth for project progress, decisions, work tracking, and validation.
- Record direction changes in the App HQ Decision Tracker.
- Record delivery tasks and progress in the App HQ Work Tracker.
- Keep validation evidence and status aligned with the validation resources linked from App HQ.
- Local audit documents are supporting snapshots and must not supersede or contradict App HQ.

## Response Format After Each Milestone

1. What was built
2. Files changed
3. Commands run
4. Database changes
5. Audit files updated
6. Setup needed
7. What to test
8. Next recommended prompt
