# Supabase Migration Reconciliation

## Context

GitHub issue #17 tracks a migration history mismatch between the local Big Al
repository and the linked Supabase project `cqcjacirzibfjecrruie`.

The remote schema appears to contain the expected application schema through
M11, but the remote migration ledger does not use the same migration version
filenames as the local repository.

## What Drifted

Local migration files include:

- `202606200001_milestone_1_auth_restaurants.sql`
- `202606200002_milestone_2_cookbook_recipes.sql`
- `202606200003_milestone_3_imports.sql`
- `202606200004_milestone_4_recipe_books_search.sql`
- `202606200005_milestone_5_menu.sql`
- `202606200006_milestone_6_shopping.sql`
- `202606200007_milestone_7_cook_mode.sql`
- `202606280001_m11_import_parser_output.sql`
- `202606280002_m11_discard_import.sql`

Remote Supabase migration history includes:

- `20260627143318` - `milestone_6_shopping`
- `20260627145632` - `milestone_7_cook_mode`
- `20260628134130` - `manual_m11_import_parser_output_and_discard_import`

No local SQL files originally existed for the remote-only migration IDs.

## Remote-Only IDs

The remote-only IDs appear to represent schema work that is already represented
by canonical local migrations:

- `20260627143318` maps to `202606200006_milestone_6_shopping.sql`
- `20260627145632` maps to `202606200007_milestone_7_cook_mode.sql`
- `20260628134130` maps to the manually applied M11 SQL patch represented by:
  - `202606280001_m11_import_parser_output.sql`
  - `202606280002_m11_discard_import.sql`

## Why `db push` Was Unsafe

`supabase db push` compares local migration files with remote migration history.
Because the remote ledger uses different migration versions for schema that
already exists, `db push` could attempt to apply old baseline migrations against
an already-populated schema.

That would be noisy at best and risky at worst. The safe response is
reconciliation, not blindly applying the local migration stack.

## No-Op Alias Files

No-op alias migration files were added for the remote-only IDs:

- `20260627143318_remote_alias_milestone_6_shopping.sql`
- `20260627145632_remote_alias_milestone_7_cook_mode.sql`
- `20260628134130_remote_alias_manual_m11_patch.sql`

These files are documentation-only aliases. They must remain no-op and must not:

- create tables
- alter tables
- create functions
- grant permissions
- run destructive SQL

Their purpose is to make local migration history acknowledge the remote ledger
without changing schema.

## Repair Commands To Review

After review, the local canonical migrations whose schema effects already exist
remotely can be marked as applied:

```bash
pnpm dlx supabase migration repair --status applied 202606200001
pnpm dlx supabase migration repair --status applied 202606200002
pnpm dlx supabase migration repair --status applied 202606200003
pnpm dlx supabase migration repair --status applied 202606200004
pnpm dlx supabase migration repair --status applied 202606200005
pnpm dlx supabase migration repair --status applied 202606200006
pnpm dlx supabase migration repair --status applied 202606200007
pnpm dlx supabase migration repair --status applied 202606280001
pnpm dlx supabase migration repair --status applied 202606280002
```

Do not execute these commands until the repair plan has been explicitly
approved.

## Future Rule

Do not run `supabase db push` when `supabase migration list` shows a local/remote
mismatch.

When migration history is mismatched:

1. Stop before applying migrations.
2. Audit remote schema with read-only queries.
3. Compare remote schema with local migration files.
4. Reconcile migration history intentionally.
5. Run `supabase migration list` again before any future `db push`.
