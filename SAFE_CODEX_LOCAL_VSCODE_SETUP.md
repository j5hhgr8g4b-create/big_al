# Big Al — Safe Local VS Code + Codex Setup

Codex will work locally in Visual Studio Code.

Allowed project folder only:

/Users/Alex/Documents/Cookbook App

## Non-Negotiable Rule

Codex may only work inside /Users/Alex/Documents/Cookbook App.

Codex must not read, write, move, rename, or delete anything outside that folder.

## Local Safety Rules

1. Stay inside /Users/Alex/Documents/Cookbook App.
2. Never use sudo.
3. Never run destructive commands: rm -rf, sudo rm, diskutil, mkfs, dd, format, chmod -R 777, chown -R, killall.
4. Never install global dependencies: npm install -g, brew install, apt install, pip install --user, curl | bash, wget | bash.
5. Only run npm install inside the project folder.
6. Never modify system settings, shell profiles, terminal settings, VS Code global settings, login items, firewall settings, or Mac security settings.
7. Never spend money, buy domains, create paid services, or enable paid APIs.
8. Never deploy without approval.
9. Never git push without approval.
10. Never print secrets.
11. Use .env.local for secrets and .env.example for placeholders.
12. Check git status before major changes.
13. If this is not a Git repository, ask before running git init.
14. Commit after each working milestone.
15. Maintain audit files before milestone completion.
16. Build one milestone at a time.
17. Do not silently change architecture, schema, MVP scope, security, or deployment.

## First Confirmation Required

Before doing anything, Codex must confirm:

1. Current working directory is exactly /Users/Alex/Documents/Cookbook App.
2. Required project documents exist.
3. Git status has been checked.
4. No commands have been run outside the project folder.
