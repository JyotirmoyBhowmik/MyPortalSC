# Deployment V2 Guide — Modern Portfolio Architecture

This guide outlines the architecture and deployment steps for V2 of the Jyotirmoy Bhowmik Portfolio. It leverages a modern tech stack (Next.js 16, Supabase, Tailwind CSS 4) and follows a rigorous security and performance standard.

## 1. Architecture Overview

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS 4 ("Deep Modern" Design System)
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth (Row Level Security protected)
- **Deployment**: Vercel (Production)

## 2. Prerequisites

Ensure you have the following accounts and tools:

- [Vercel Account](https://vercel.com)
- [Supabase Account](https://supabase.com)
- [GitHub Repository](https://github.com)
- **Node.js 20+** (Local development)

## 3. Environment Configuration (Critical)

Your application relies on specific environment variables. **Never commit `.env.local` to Git.**

### Required Variables

| Variable | Description | Location |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase Project URL | Supabase > Settings > API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public API Key (`anon`) | Supabase > Settings > API |
| `SUPABASE_SERVICE_ROLE_KEY` | **Secret** Admin Key (`service_role`) | Supabase > Settings > API |
| `NEXT_PUBLIC_SITE_URL` | Production URL (e.g., `https://your-domain.com`) | Vercel > Settings |

> [!IMPORTANT]
> The `SUPABASE_SERVICE_ROLE_KEY` is mandatory for server-side operations and admin data seeding. Ensure this is added to Vercel Environment Variables.

## 4. Database Setup & Migration

The database schema is version-controlled in `supabase/migrations/`. To set up a fresh database or update an existing one:

1.  **Login to Supabase Dashboard**.
2.  Navigate to the **SQL Editor**.
3.  Run the migration files in this specific order:

    -   **`001_schema.sql`**: Creates tables, constraints, and indexes. _(Idempotent)_
    -   **`002_rls_policies.sql`**: Applies Row Level Security policies. _(Idempotent)_
    -   **`003_functions_triggers.sql`**: Sets up auto-update timestamps and audit logs. _(Idempotent)_
    -   **`004_seed_data.sql`**: Populates initial content (Profile, Projects, Skills). _(Idempotent)_

> [!TIP]
> All scripts use `IF NOT EXISTS` and `ON CONFLICT DO NOTHING` clauses, so they are safe to run multiple times without errors.

## 5. Deployment Information

### Triggering a Deploy
Pushing to the `main` (or `master`) branch on GitHub will automatically trigger a deployment on Vercel.

```bash
git add .
git commit -m "feat: update portfolio content v2"
git push origin main
```

### Verification
After deployment, check the following:

1.  **Public Pages**: Ensure Home, About, and Projects load with the new content.
2.  **Admin Access**: Navigate to `/admin/login`. Log in with your admin credentials.
3.  **Database Connection**: Verify that project details reflect the seed data.

## 6. Content Management
You can update content directly via the `/admin` dashboard or by modifying `004_seed_data.sql` and re-running it.

-   **Profile / Bio / Vision**: Stored in `content_pages` table.
-   **Projects**: Managed in `projects` table.
-   **Skills**: Managed in `skills` table.

---
*Created by Antigravity Agent - 2026*
