# Supabase

Database changes are stored as ordered SQL files in `migrations`.

## Apply Milestone 1

1. Create or open the intended Supabase project.
2. Open the SQL Editor.
3. Run `migrations/202606200001_milestone_1_auth_restaurants.sql`.
4. Add the project URL and publishable key to `.env.local`.
5. Add `http://localhost:3000/auth/callback` to the allowed Auth redirect URLs.

The Milestone 1 migration is restartable during initial setup. It preserves tables that already exist and recreates its named triggers and policies consistently.

Do not place service-role keys or database passwords in this repository.
