# Architecture Decisions

## ADR-001 — Use Local VS Code Folder

Decision: Use /Users/Alex/Documents/Cookbook App as the local development folder.

Reason: GitHub Codespaces did not connect properly.

Status: Approved.

## ADR-002 — Use Next.js

Decision: Use Next.js for the web app.

Reason: Fast MVP development and strong React ecosystem.

Status: Approved.

## ADR-003 — Use Supabase/PostgreSQL

Decision: Use Supabase with PostgreSQL for database, auth, and storage.

Reason: Simple setup, real relational database, built-in auth.

Status: Approved.

## ADR-004 — Mobile-First Web App

Decision: Build responsive mobile-first web app first.

Reason: Recipes, shopping, and cooking happen mainly on phones.

Status: Approved.

## ADR-005 — Use a Source Directory and pnpm

Decision: Keep application code under `src` and manage project dependencies with pnpm.

Reason: A clear source boundary keeps the root focused on configuration and governance, while the existing project-local pnpm setup supports reproducible installs without global packages.

Status: Approved as part of Milestone 0.

## ADR-006 — Group Product and Milestone Documentation

Decision: Store product reference documents in `docs/product` and milestone records in `docs/milestones`.

Reason: Keep the project root focused on required entry points and tool configuration while making product guidance and build progress easy to locate.

Status: Approved after Milestone 0.
