# Decision Log

## Template

### YYYY-MM-DD — Decision Title
Decision:
Reason:
Alternatives Considered:
Impact:
Files Affected:
Approved By:

---

### 2026-06-20 — Use GitHub Codespaces For Safety
Decision:
All Codex development work should happen inside GitHub Codespaces.

Reason:
This isolates coding work from the user's personal machine.

Alternatives Considered:
Local Mac development, Replit, Docker locally.

Impact:
Development happens in a cloud environment connected to GitHub.

Files Affected:
SAFE_CODEX_GITHUB_SETUP.md, CODEX_RULES.md

Approved By:
Founder

---

### 2026-06-20 — Implement Milestone 0 Within Approved Architecture
Decision:
Create the initial application with the Next.js App Router, TypeScript, Tailwind CSS, and a Supabase browser client, using a mobile-first shell and the five approved bottom navigation tabs.

Reason:
This implements Milestone 0 using the stack and navigation already approved in the project documents.

Alternatives Considered:
Pages Router, a desktop-first shell, adding authentication or database tables during setup.

Impact:
The project gains a runnable application foundation without changing the database schema or expanding beyond Milestone 0.

Files Affected:
package.json, app/*, components/*, lib/supabase/client.ts, configuration files, .env.example, docs/*

Approved By:
Founder (via Milestone 0 build prompt)
