# Big Al — Project Governance Rules

## Purpose
Big Al must maintain a complete audit trail of product decisions, technical decisions, and implementation changes.

## Mandatory Audit Files
- docs/DECISION_LOG.md
- docs/CHANGELOG.md
- docs/CURRENT_STATUS.md
- docs/ARCHITECTURE_DECISIONS.md

## No Silent Decisions
Codex may not silently change architecture, schema, MVP scope, security rules, deployment strategy, or major features.

## Decision Log Entry Must Include
- Date
- Decision
- Reason
- Alternatives considered
- Impact
- Files affected
- Approved by

## Changelog Entry Must Include
- Date
- Milestone
- Summary
- Files changed
- Database changes
- Testing required
- Known issues

## Current Status Must Include
- Current milestone
- Completed milestones
- What works
- Known issues
- Blocked items
- Next task

## Milestone Completion Rule
A milestone is not complete until:
1. Code works
2. Checks are documented
3. Git commit is created
4. Audit documents are updated
5. CURRENT_STATUS.md is updated
