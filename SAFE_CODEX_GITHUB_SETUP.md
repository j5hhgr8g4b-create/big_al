# Big Al — Safe GitHub + Codespaces Setup

Goal: run all coding work inside GitHub Codespaces so Codex cannot damage the user's personal machine.

## Safety Rules
1. Work only inside this repository.
2. Never run destructive commands: rm -rf, sudo rm, diskutil, mkfs, dd, format, chmod -R 777, chown -R, killall.
3. Never use sudo.
4. Never install global dependencies: npm install -g, brew install, apt install, pip install --user, curl | bash, wget | bash.
5. Never spend money or create paid cloud resources.
6. Never deploy without approval.
7. Never git push without approval.
8. Never print secrets.
9. Use .env.local for real secrets and .env.example for placeholders.
10. Check git status before major changes.
11. Commit after each working milestone.
12. Work milestone by milestone.
13. Maintain audit files before milestone completion.
14. Do not invent product scope.
15. Use Next.js, TypeScript, Tailwind, Supabase, PostgreSQL unless approved otherwise.

## Required Audit Files
- docs/DECISION_LOG.md
- docs/CHANGELOG.md
- docs/CURRENT_STATUS.md
- docs/ARCHITECTURE_DECISIONS.md
