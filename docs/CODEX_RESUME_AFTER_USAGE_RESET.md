# Codex Resume After Usage Reset

## Current position

Codex usage ran out during founder UAT shopping-list cleanup.

Big Al is in founder UAT on branch `clean-milestone-4-sync`.

The MVP is not ready for launch sign-off yet. It is ready for continued founder UAT and small bug fixes only.

## Latest GitHub state

Repository: `j5hhgr8g4b-create/big_al`

Branch: `clean-milestone-4-sync`

Latest direct GitHub commit made after Codex ran out:

```text
7f659fb chore: mirror shopping list RPC permission fix
```

This added the missing local migration:

```text
supabase/migrations/20260702183930_uat_shopping_list_restrict_anon_rpc_execute.sql
```

## Supabase state

Project:

```text
j5hhgr8g4b-create's Project
cqcjacirzibfjecrruie
```

Applied remotely:

```text
20260702183804 — uat_shopping_list_cleanup
uat_shopping_list_restrict_anon_rpc_execute
```

Verified remotely:

```text
generate_shopping_list_from_meal_events RPC exists: yes
authenticated can execute: yes
anon can execute: no
```

## Latest shopping UAT work

Shopping list generation and display were improved so Pantry behaves more like a shopping companion and less like copied recipe text.

Expected behaviour:

- obvious non-shopping basics are filtered out, such as water, ice and generic salt/pepper
- spices show as buyable items, not teaspoon amounts
- obvious duplicates are combined where safe
- garlic forms should canonicalise to one Garlic card
- prep clutter should be stripped from shopping item titles
- items should show meal/date context
- fresh short-life items may show buy-closer guidance
- grouped checkbox behaviour should still work

## Key files touched

```text
supabase/migrations/20260702174752_uat_shopping_list_cleanup.sql
supabase/migrations/20260702183930_uat_shopping_list_restrict_anon_rpc_execute.sql
src/lib/shopping/get-shopping.ts
src/app/(app)/pantry/actions.ts
src/app/(app)/pantry/page.tsx
docs/UAT_MVP_M11_M14.md
docs/CHANGELOG.md
docs/CURRENT_STATUS.md
```

## Manual UAT still required

Retest Pantry first.

### Pantry retest

1. Open Pantry without regenerating.
2. Confirm old messy garlic rows display as one Garlic card.
3. Regenerate from Menu.
4. Confirm generated garlic is still one Garlic card.
5. Confirm no prep clutter appears:
   - no `peeled`
   - no `minced`
   - no `Garlic Clove`
   - no malformed `(, minced)`
6. Tick the Garlic card.
7. Confirm grouped checkbox behaviour works.

### Shopping list quality check

Use planned meals containing:

```text
Water
Salt
Black pepper
1/2 tsp cayenne
1/8 tsp turmeric
3 cloves garlic
6 garlic cloves
1 garlic clove
1 large onion (peeled and finely chopped)
2 tbsp tomato puree
Fresh coriander
Chicken or fish planned later in the week
```

Expected:

- water does not appear
- generic salt/pepper do not appear
- spices appear as buyable item names
- garlic appears once
- onion title is clean
- tomato purée is not under Fresh produce
- meal/date context appears
- fresh later-week items say buy closer to cooking day

## Resume prompt for Codex

Paste this when usage resets:

```text
You are working on the Big Al app.

This is founder UAT continuation only.

Before editing, confirm:
1. Branch is clean-milestone-4-sync.
2. You are not on main.
3. git status is clean.
4. Latest remote changes are pulled.
5. Supabase migrations include:
   - 20260702174752_uat_shopping_list_cleanup.sql
   - 20260702183930_uat_shopping_list_restrict_anon_rpc_execute.sql

Do not add new features.
Do not redesign the UI.
Do not add grocery comparison, inventory management, expiry prediction, retailer logic, barcode scanning, nutrition, social features or AI parsing.

Start by verifying Pantry/Shopping founder UAT:
1. Open Pantry without regenerating.
2. Confirm existing messy garlic rows render as one Garlic card.
3. Regenerate from Menu.
4. Confirm generated garlic renders as one Garlic card.
5. Confirm checked/unchecked works for grouped items.
6. Confirm water/generic salt/pepper are filtered.
7. Confirm spices are buyable item names with recipe amount as secondary text.
8. Confirm tomato purée is categorised correctly.
9. Confirm meal/date context is visible but not noisy.
10. Confirm fresh later-week items get subtle buy-closer guidance.

If bugs remain, fix only those bugs.

Run:
- pnpm lint
- pnpm typecheck
- pnpm build
- git diff --check

Update:
- docs/UAT_MVP_M11_M14.md
- docs/CHANGELOG.md
- docs/CURRENT_STATUS.md if appropriate

Final report:
1. What was tested
2. Bugs found
3. Bugs fixed
4. Files changed
5. Commands run and results
6. What Alex should manually retest
7. Whether Pantry is now founder-UAT acceptable
```

## Launch blocker status

Current blockers before launch sign-off:

- founder must complete live authenticated Supabase testing
- Pantry/Shopping must feel useful after the latest cleanup
- duplicate URL import handling must be confirmed safe
- second-user cross-Restaurant RLS check still needs founder/manual validation

## Product reminder

Big Al should make cooking easy and enjoyable.

Pantry should answer:

```text
What do I need to buy?
What meal is it for?
When do I need it?
```

Do not let Pantry become full inventory management yet.
