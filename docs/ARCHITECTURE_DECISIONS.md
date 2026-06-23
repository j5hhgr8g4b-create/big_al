# Architecture Decisions

## ADR-001 — Use Local VS Code Folder

Decision: Use /Users/Alex/Library/CloudStorage/OneDrive-Personal/Cookbook App as the local development folder.

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

## ADR-007 — Use Supabase Cookie-Based SSR Authentication

Decision: Use `@supabase/ssr` with separate browser and server clients plus a Next.js proxy for session refresh.

Reason: Protected Server Components need verified identity from shared cookies, and the proxy keeps refreshed tokens synchronized with the browser.

Status: Approved as part of Milestone 1.

## ADR-008 — Create Restaurants Through an Atomic Database Function

Decision: Create a Restaurant and its owner membership through one authenticated, security-definer PostgreSQL function.

Reason: The two records must succeed or fail together, while direct client inserts remain unavailable under RLS.

Status: Approved as part of Milestone 1.

## ADR-009 — Use Webpack for Production Builds

Decision: Build production output with Next.js webpack rather than Turbopack.

Reason: The Turbopack build compiled successfully but produced missing client-manifest entries at runtime. A webpack rebuild rendered all authenticated and unauthenticated routes without server errors.

Status: Approved during Milestone 1 verification.

## ADR-010 — Save Complete Recipes Atomically

Decision: Create and edit a Recipe, its structured ingredients, and its ordered steps through one authenticated PostgreSQL function.

Reason: Recipe child rows must remain consistent. A failed validation or write rolls back the entire save instead of leaving a partial Recipe.

Status: Approved as part of Milestone 2.

## ADR-011 — Scope Normalized Ingredients to Restaurants

Decision: Store normalized ingredient names per Restaurant and reuse matching rows within that Restaurant.

Reason: This supports structured Recipe data and later ingredient search without exposing or coupling data across private Restaurants.

Status: Approved as part of Milestone 2.

## ADR-012 — Require Import-First Recipe Creation

Decision: Route all new Recipe creation through an Import record while preserving direct editing of existing Recipes.

Reason: This enforces the product rule that content enters as an Import and creates a durable source/review trail before Cookbook conversion.

Status: Approved as part of Milestone 3.

## ADR-013 — Keep Parsing an Explicit Placeholder

Decision: Store parser metadata and a manual-review message without fetching URLs or automatically extracting Recipe content.

Reason: Milestone 3 calls for a parser placeholder. Pretending extraction occurred would obscure provenance and introduce unapproved network and AI behavior.

Status: Approved as part of Milestone 3.

## ADR-014 — Keep Recipe Books as Many-to-Many Organizers

Decision: Link Recipe Books and Recipes through a join table without changing Recipe ownership.

Reason: A Recipe can appear in multiple Books while remaining owned by its Restaurant Cookbook, matching the approved product model.

Status: Approved as part of Milestone 4.

## ADR-015 — Use Literal Restaurant-Scoped Recipe Search

Decision: Search active Recipes using literal case-insensitive containment across Recipe titles and Ingredient names inside one Restaurant.

Reason: This meets MVP search needs without wildcard surprises, cross-Restaurant exposure, or premature full-text infrastructure.

Status: Approved as part of Milestone 4.
