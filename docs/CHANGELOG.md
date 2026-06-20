# Changelog

## Template

### YYYY-MM-DD — Milestone X

Summary:
-

Files Changed:
-

Commands Run:
-

Database Changes:
-

Testing Required:
-

Known Issues:
-

---

### 2026-06-20 — Local VS Code Safety Setup

Summary:
Created local Codex safety and governance documents.

Files Changed:
SAFE_CODEX_LOCAL_VSCODE_SETUP.md, LOCAL_CODEX_START_PROMPT.md, CODEX_RULES.md, docs/*

Commands Run:
None.

Database Changes:
None.

Testing Required:
Confirm files are placed in /Users/Alex/Documents/Cookbook App.

Known Issues:
Application not built yet.

---

### 2026-06-20 — Milestone 0

Summary:
Created the Next.js TypeScript foundation with Tailwind CSS, a Supabase browser client, environment placeholders, a mobile app shell, and five-tab bottom navigation.

Files Changed:
Added project configuration, dependency lockfile, `src/app`, `src/components`, `src/lib`, and updated README and audit documents.

Commands Run:
Verified the working folder and required files; checked Git state and tool versions; ran `git init`; installed project dependencies with pnpm; ran `pnpm lint`, `pnpm typecheck`, and `pnpm build`; reviewed Git status and the source layout.

Database Changes:
None.

Testing Required:
Add real Supabase values to `.env.local`, run `pnpm dev`, and confirm the five navigation tabs at mobile and desktop widths.

Known Issues:
Supabase is not connected until local environment values are provided. Feature pages are intentional Milestone 0 placeholders.
