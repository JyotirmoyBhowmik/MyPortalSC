# Admin Manual — MyPortalSC

## Accessing the Admin Panel

Navigate to `/admin/login` and sign in with your Supabase-authenticated admin account. You must have a record in the `admin_users` table with role `super_admin`, `admin`, or `editor`.

---

## Dashboard

The main dashboard (`/admin`) shows:
- **Stats cards**: Projects, Skills, Certifications, Initiatives, Page Views, Achievements
- **Activity Feed**: Recent audit log entries (if `feature_activity_feed` is enabled)

---

## Content Management

### Pages (`/admin/pages`)
Edit static page content for About and Contact pages. Fields include biography, vision statement, and other text blocks. When `feature_rich_editor` is enabled, textareas upgrade to a rich text editor with Bold/Italic/Underline/Lists.

### Projects (`/admin/projects`)
Full CRUD for portfolio projects. Supports:
- Title, slug, description, tech stack
- Status toggle (published/draft)
- Drag-and-drop reordering (when `feature_drag_drop` is on)
- **Delete confirmation dialog** prevents accidental deletion

### Skills (`/admin/skills`)
Manage technical skills with category, proficiency level, and years of experience. Drag-and-drop reordering available.

### Initiatives (`/admin/initiatives`)
Enterprise initiative management with programs, criticality ratings, strategic areas, and fiscal year tracking.

### Blog, Case Studies, Testimonials, Speaking, Publications
Additional content modules under "Under Development" section. Enable via feature flags in Settings.

---

## CRM (`/admin/contacts`)

Manage contact form submissions. View sender details, subject, message, and status (new → read → replied → archived). Reply directly from the panel (sends via Resend email API).

---

## Media Library (`/admin/media`)

Upload and manage media files (images, documents). Stored in Supabase Storage. When `feature_secure_storage` is enabled, files are served through a proxy API.

---

## Appearance (`/admin/appearance`)

### Site Icon
- **Browse**: Click "Browse Icon" to select a PNG, ICO, SVG, JPEG, or WebP file (max 512KB)
- **Preview**: See how the icon looks at 32px, 48px, and 64px
- **Save**: Click "Save Icon" to upload and apply
- **Reset**: Click "Reset to Default" to revert to the default "JB" generated icon

---

## Settings & Feature Flags (`/admin/settings`)

Toggle any of the 41 feature flags. Changes take effect immediately. Flags are grouped by category:
- **Content & Core**: Executive Summary, Timeline, Achievements, Certifications
- **Engagement & CRM**: Contact CRM, Downloads, Newsletter
- **Visual & UX**: Particle Background, 3D Globe, Video Intro, Magnetic Buttons
- **System & Config**: Templates, i18n, RBAC, CSP Headers

### Template Switching
The `site_template` setting controls the portfolio's visual design. Options:
- `classic` — Dark theme with green accents (default)
- `premium` — Glass-morphism dark theme
- `minimal` — Clean light-mode theme
- `executive` — Corporate navy & gold

---

## Security (`/admin/security`)

View security status cards (HTTPS, RLS, Rate Limiting). When `feature_session_management` is enabled, active user sessions are displayed with device info and last-active timestamps.

---

## Analytics (`/admin/analytics`)

View page analytics: view counts by page, device breakdown, and visitor trends.

---

## Audit Log (`/admin/audit`)

Review all admin actions with timestamps, user IDs, and action descriptions. Useful for compliance and debugging.

---

## Users & Roles (`/admin/users`)

Manage admin users. When `feature_rbac` is enabled, sensitive sections (Users, Settings) are restricted based on user roles.
