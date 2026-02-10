# Deployment Guide — Dynamic Web Portfolio

This guide walks you through deploying the database to **Supabase** and the app to **Vercel**.

---

## Part 1: Supabase Database Setup

Your Supabase project: https://supabase.com/dashboard/project/gflvvfvlbldxbsalndio

### Step 1: Apply the Schema Migration

1. Go to **[SQL Editor](https://supabase.com/dashboard/project/gflvvfvlbldxbsalndio/sql/new)**
2. Copy the **entire contents** of `supabase/migrations/001_schema.sql` and paste it into the editor
3. Click **Run** (or press `Ctrl+Enter`)
4. You should see a success message — this creates all 8 tables

### Step 2: Enable Row Level Security

1. In the same SQL Editor, click **New Query**
2. Paste the contents of `supabase/migrations/002_rls_policies.sql`
3. Click **Run**
4. This enables RLS and sets up public-read + admin-write policies

### Step 3: Create Functions & Triggers

1. Click **New Query**
2. Paste the contents of `supabase/migrations/003_functions_triggers.sql`
3. Click **Run**
4. This creates auto-`updated_at` and audit logging triggers

### Step 4: Seed Sample Data

1. Click **New Query**
2. Paste the contents of `supabase/migrations/004_seed_data.sql`
3. Click **Run**
4. This loads sample projects, skills, certifications, and achievements

### Step 5: Create an Admin User

1. Go to **[Authentication → Users](https://supabase.com/dashboard/project/gflvvfvlbldxbsalndio/auth/users)**
2. Click **Add user** → **Create New User**
3. Enter your email and a strong password
4. Check **Auto Confirm User**
5. Click **Create User**
6. Copy the user's **UUID** from the user list

Now register them as an admin in the database:

1. Go to **[SQL Editor](https://supabase.com/dashboard/project/gflvvfvlbldxbsalndio/sql/new)**
2. Run:

```sql
INSERT INTO admin_users (user_id, full_name, role)
VALUES (
  'PASTE-YOUR-USER-UUID-HERE',
  'Jyotirmoy Bhowmik',
  'super_admin'
);
```

### Step 6: Get the Service Role Key

1. Go to **[Settings → API](https://supabase.com/dashboard/project/gflvvfvlbldxbsalndio/settings/api)**
2. Copy the **service_role** key (under "Project API keys")
3. Update your `.env.local`:

```
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

### Step 7: Verify Tables

Go to **[Table Editor](https://supabase.com/dashboard/project/gflvvfvlbldxbsalndio/editor)** and confirm you see:
- `admin_users`
- `projects`
- `skills`
- `certifications`
- `achievements`
- `content_pages`
- `page_analytics`
- `audit_log`

---

## Part 2: Local Testing

After completing the Supabase setup:

```bash
# Start the dev server
npm run dev

# Open in browser
# http://localhost:3000
```

Test these pages:
- **Home** → Should show featured projects, skills, certifications
- **About** → Biography, skills deep-dive, achievements
- **Projects** → Filterable project grid
- **Contact** → Contact form and social links
- **Admin Login** → `/admin/login` — use the credentials you created in Step 5
- **Admin Dashboard** → `/admin` — manage all content via CRUD interfaces

---

## Part 3: Deploy to Vercel

### Option A: Deploy via GitHub (Recommended)

1. Push your code to GitHub (already done — `MyPortalSC` repo)
2. Go to [vercel.com](https://vercel.com) and sign in
3. Click **Add New → Project**
4. Import your `MyPortalSC` repository
5. Vercel auto-detects Next.js — keep default settings
6. Add **Environment Variables**:

| Variable | Value |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://gflvvfvlbldxbsalndio.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `sb_publishable_94cf64jbe508dk9uZqs18A_xxbA_i31` |
| `SUPABASE_SERVICE_ROLE_KEY` | *(your service role key from Step 6)* |
| `NEXT_PUBLIC_SITE_URL` | *(your Vercel deployment URL, e.g. `https://myportalsc.vercel.app`)* |

7. Click **Deploy**

### Option B: Deploy via CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add NEXT_PUBLIC_SITE_URL

# Redeploy with env vars
vercel --prod
```

---

## Post-Deployment Checklist

- [ ] All SQL migrations applied in Supabase
- [ ] Admin user created with `super_admin` role
- [ ] Service Role Key added to environment
- [ ] Site URL updated to production URL
- [ ] Admin login works at `your-domain.com/admin/login`
- [ ] Public pages render with data from Supabase
- [ ] CRUD operations work in admin dashboard

---

## Troubleshooting

| Issue | Solution |
|---|---|
| "No data showing on pages" | Check that seed data was applied and RLS policies allow public reads |
| "Admin login fails" | Verify user exists in Supabase Auth AND in `admin_users` table |
| "Unauthorized on admin pages" | Check middleware is running; ensure cookies are being set correctly |
| "Build fails on Vercel" | Ensure all env vars are set; check build logs for missing dependencies |
| "RLS policy error" | Run `002_rls_policies.sql` again; check table-level RLS is enabled |
