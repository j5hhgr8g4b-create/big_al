# M21 Two-Restaurant Isolation Verification

Use this checklist for the live M21 closeout in issue #19. It is a verification aid, not a replacement for ordinary authenticated browser sessions.

## Preconditions

Use two separate browser profiles and two ordinary Supabase Auth users:

- User A belongs only to Restaurant A.
- User B belongs only to Restaurant B.
- Record opaque IDs locally during the run; never post email addresses, passwords, access tokens or service-role values.
- Use the stable beta origin documented in issue #32.

Create one clearly identifiable test record per domain for each user. Capture the resulting URL or record ID privately so the opposite session can attempt the same read or mutation.

## Deterministic run order

For each user, complete the normal journey first:

1. Sign in and confirm the expected Restaurant is selected.
2. Create or import one test Recipe and save it.
3. Confirm the Recipe appears in Cookbook.
4. Plan it in Menu and generate Shopping.
5. Open Cook Mode and finish the recipe so a persisted Cook record exists.
6. Submit one beta feedback entry from the relevant page.
7. Sign out before switching profiles.

Then run the matrix in both directions. User A tests User B's identifiers, and User B tests User A's identifiers. A read must return no other-Restaurant data; a mutation must fail with an access error or affect zero rows.

## Isolation matrix

| Domain | Own-session positive check | Opposite-session read check | Opposite-session mutation check | Evidence to record |
|---|---|---|---|---|
| Recipes | Own saved Recipe is visible and editable | Known other Recipe URL/ID returns not-found, no row, or no usable data | Edit/archive other Recipe fails or changes zero rows | Recipe IDs and response/result for A→B and B→A |
| Imports | Own import and review state are visible | Known other Import URL/ID returns no data | Discard/save other Import fails or changes zero rows | Import IDs and review/discard result both directions |
| Menu | Own planned meal is visible for its Restaurant | Other Menu event is absent | Add/edit/delete using other Restaurant context fails or changes zero rows | Menu event IDs/dates and mutation result both directions |
| Shopping | Own generated list/items are visible | Other list/items are absent | Purchased/clear/add operations against other IDs fail or change zero rows | List/item IDs and mutation result both directions |
| Preferences | Own Restaurant preferences load and save | Other Restaurant preferences are not returned | Save using other Restaurant ID fails | Before/after own values and cross-ID result both directions |
| Cook records | Own completed Cook record is visible | Other Cook record is absent | Cook-again/update operations against other Cook ID fail or change zero rows | Cook IDs and result both directions |
| Beta feedback | Own submitted feedback is visible to its submitter | Other user's feedback is absent | `submit_beta_feedback` for other Restaurant is denied | Feedback IDs, read result, and RPC result both directions |

Do not treat a UI link being hidden as sufficient evidence. Where practical, use the known URL/ID through the normal authenticated browser session and capture the user-visible result. Do not use service-role SQL or impersonated identities as acceptance evidence.

## Evidence block for issue #19

Copy this block after the live run and replace every `NOT TESTED` with a result and short evidence reference. Keep secrets and personal email addresses out of the issue.

```text
M21 two-Restaurant isolation — [date/time UTC]
Stable origin: [origin]
User A own Restaurant: PASS / FAIL / NOT TESTED
User B own Restaurant: PASS / FAIL / NOT TESTED

| Domain | A own | A→B read | A→B mutation | B own | B→A read | B→A mutation |
| Recipes | NOT TESTED | NOT TESTED | NOT TESTED | NOT TESTED | NOT TESTED | NOT TESTED |
| Imports | NOT TESTED | NOT TESTED | NOT TESTED | NOT TESTED | NOT TESTED | NOT TESTED |
| Menu | NOT TESTED | NOT TESTED | NOT TESTED | NOT TESTED | NOT TESTED | NOT TESTED |
| Shopping | NOT TESTED | NOT TESTED | NOT TESTED | NOT TESTED | NOT TESTED | NOT TESTED |
| Preferences | NOT TESTED | NOT TESTED | NOT TESTED | NOT TESTED | NOT TESTED | NOT TESTED |
| Cook records | NOT TESTED | NOT TESTED | NOT TESTED | NOT TESTED | NOT TESTED | NOT TESTED |
| Feedback | NOT TESTED | NOT TESTED | NOT TESTED | NOT TESTED | NOT TESTED | NOT TESTED |

Raw diagnostic leakage: PASS / FAIL / NOT TESTED
Security/RLS changes made: none / describe approved fix
Overall isolation: PASS only when every cell above passes; otherwise NO-GO
```

## Existing automated coverage

`pnpm test` currently covers the beta feedback validator and migration security shape, including authenticated Restaurant membership checks, restricted grants, and the absence of direct authenticated INSERT grants. Those tests are useful regression coverage but do not prove the two-user live matrix; the browser evidence above remains mandatory.

## Failure handling

- Stop immediately and mark **BLOCKER** if any cross-Restaurant read exposes data or any mutation changes another Restaurant.
- Preserve the smallest reproducible IDs and user/session direction privately for diagnosis.
- Do not retry destructive actions repeatedly. Re-authenticate, refresh the Restaurant context, and retry once only when the UI indicates a transient session issue.
- If a failure is only an expired/invalid session, record it as **NOT TESTED** and obtain a fresh ordinary session before drawing an isolation conclusion.
