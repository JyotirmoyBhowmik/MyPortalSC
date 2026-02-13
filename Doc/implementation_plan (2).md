# CIO-Level Portfolio Enhancement — Tiers 1–7

Transform the portfolio into an enterprise-grade, CIO-level digital presence with world-class security, visual excellence, analytics, and content management — across **English, Hindi, and Bengali**.

> [!IMPORTANT]
> **Core principle**: No existing pages will be modified. All features are additive (new pages, components, routes, DB tables). Every feature has an admin **enable/disable toggle**.

---

## Proposed Changes

### Foundation: Feature Toggle System

New Supabase table + admin UI so every Tier feature can be enabled/disabled from the dashboard.

#### [NEW] [011_feature_toggles.sql](file:///c:/Users/TEST/MyPortalSC/supabase/migrations/011_feature_toggles.sql)
- `site_settings` table: `key TEXT UNIQUE, value JSONB, category TEXT, description TEXT`
- Seed rows for each feature toggle (all `false` by default)

#### [NEW] [settings.ts](file:///c:/Users/TEST/MyPortalSC/src/lib/data/settings.ts)
- `getFeatureFlag(key)`, `getAllSettings()`, `updateSetting()` helpers

#### [NEW] [FeatureGate.tsx](file:///c:/Users/TEST/MyPortalSC/src/components/FeatureGate.tsx)
- Server component that conditionally renders children based on DB toggle

#### [NEW] [admin/settings/page.tsx](file:///c:/Users/TEST/MyPortalSC/src/app/admin/settings/page.tsx)
- Toggle grid: grouped by tier, with on/off switches

---

### Tier 1: Executive Presence & i18n (EN / HI / BN)

#### i18n System
#### [NEW] [i18n/](file:///c:/Users/TEST/MyPortalSC/src/lib/i18n/)
- `translations/{en,hi,bn}.ts` — full translation dictionaries
- `useTranslation()` hook + `LanguageProvider` context
- `LanguageSwitcher.tsx` component (dropdown: English / हिन्दी / বাংলা)

#### Executive Pages
#### [NEW] [executive-summary/page.tsx](file:///c:/Users/TEST/MyPortalSC/src/app/executive-summary/page.tsx)
- Animated KPI counters (years, projects, budget, uptime)
- Board-ready metrics layout, fully i18n

#### [NEW] [testimonials/page.tsx](file:///c:/Users/TEST/MyPortalSC/src/app/testimonials/page.tsx)
- Testimonial carousel, DB-backed, i18n content fields

#### [NEW] [timeline/page.tsx](file:///c:/Users/TEST/MyPortalSC/src/app/timeline/page.tsx)
- Interactive vertical career timeline with org logos, milestones

#### [NEW] [api/pdf-export/route.ts](file:///c:/Users/TEST/MyPortalSC/src/app/api/pdf-export/route.ts)
- HTML-to-PDF generation for executive summary

#### DB
#### [NEW] [012_tier1_tables.sql](file:///c:/Users/TEST/MyPortalSC/supabase/migrations/012_tier1_tables.sql)
- `testimonials` (name, role, org, quote_en, quote_hi, quote_bn, avatar_url, featured)
- `timeline_entries` (year, title_en/hi/bn, org, description_en/hi/bn, logo_url, type)
- `executive_kpis` (key, value, label_en/hi/bn, icon, order_index)

#### Admin
#### [NEW] [admin/testimonials/page.tsx](file:///c:/Users/TEST/MyPortalSC/src/app/admin/testimonials/page.tsx)
#### [NEW] [admin/timeline/page.tsx](file:///c:/Users/TEST/MyPortalSC/src/app/admin/timeline/page.tsx)
#### [NEW] [admin/actions/testimonials.ts](file:///c:/Users/TEST/MyPortalSC/src/app/admin/actions/testimonials.ts)
#### [NEW] [admin/actions/timeline.ts](file:///c:/Users/TEST/MyPortalSC/src/app/admin/actions/timeline.ts)

---

### Tier 2: Security & Trust

#### [NEW] [admin/security/page.tsx](file:///c:/Users/TEST/MyPortalSC/src/app/admin/security/page.tsx)
- 2FA setup with TOTP (QR code generation)
- Active sessions viewer (device, IP, last active, force logout)

#### [NEW] [admin/users/page.tsx](file:///c:/Users/TEST/MyPortalSC/src/app/admin/users/page.tsx)
- RBAC management: assign super_admin / editor / viewer

#### [NEW] [admin/audit-log/page.tsx](file:///c:/Users/TEST/MyPortalSC/src/app/admin/audit-log/page.tsx)
- Enhanced audit log: filter by table/operation/date, CSV export

#### [NEW] [middleware-security.ts](file:///c:/Users/TEST/MyPortalSC/src/lib/security.ts)
- Rate limiter, CSP header generator

#### Config
- `next.config` security headers (CSP, HSTS, X-Frame-Options, X-Content-Type-Options)

#### [NEW] [013_tier2_security.sql](file:///c:/Users/TEST/MyPortalSC/supabase/migrations/013_tier2_security.sql)
- `user_sessions` table, enhanced `admin_users` with role field updates

---

### Tier 3: Visual Excellence & Animations

#### [NEW] [PageTransition.tsx](file:///c:/Users/TEST/MyPortalSC/src/components/animations/PageTransition.tsx)
- Framer Motion page transition wrapper

#### [NEW] [ScrollReveal.tsx](file:///c:/Users/TEST/MyPortalSC/src/components/animations/ScrollReveal.tsx)
- Intersection Observer-based scroll animations

#### [NEW] [ParticleBackground.tsx](file:///c:/Users/TEST/MyPortalSC/src/components/animations/ParticleBackground.tsx)
- Canvas-based animated particle network

#### [NEW] [DeliveryGlobe.tsx](file:///c:/Users/TEST/MyPortalSC/src/components/animations/DeliveryGlobe.tsx)
- 3D globe with project delivery locations

#### [NEW] [MagneticButton.tsx](file:///c:/Users/TEST/MyPortalSC/src/components/ui/MagneticButton.tsx)
#### [NEW] [SkeletonCard.tsx](file:///c:/Users/TEST/MyPortalSC/src/components/ui/SkeletonCard.tsx)

#### Light Theme
- Add `[data-theme="light-professional"]` to `globals.css`

#### Branded Error Pages
- New custom `404.tsx` and `error.tsx` (these are separate new files, not modifying existing)

---

### Tier 4: Data & Analytics

#### [NEW] [admin/analytics-dashboard/page.tsx](file:///c:/Users/TEST/MyPortalSC/src/app/admin/analytics-dashboard/page.tsx)
- Charts: page views over time, top pages, visitor devices, geo breakdown (Recharts)

#### [NEW] [InitiativeHeatmap.tsx](file:///c:/Users/TEST/MyPortalSC/src/components/admin/InitiativeHeatmap.tsx)
- Visual criticality × program heatmap grid

#### [NEW] [ContactAnalytics.tsx](file:///c:/Users/TEST/MyPortalSC/src/components/admin/ContactAnalytics.tsx)
- Contact submission trends, response rates

#### [NEW] [014_tier4_analytics.sql](file:///c:/Users/TEST/MyPortalSC/supabase/migrations/014_tier4_analytics.sql)
- `visitor_events` table, `contact_submissions` table with status tracking

---

### Tier 5: Admin Power Features

#### [NEW] [RichTextEditor.tsx](file:///c:/Users/TEST/MyPortalSC/src/components/admin/RichTextEditor.tsx)
- TipTap-based editor for descriptions

#### [NEW] [DragDropList.tsx](file:///c:/Users/TEST/MyPortalSC/src/components/admin/DragDropList.tsx)
- @dnd-kit based sortable list

#### [NEW] [BulkActions.tsx](file:///c:/Users/TEST/MyPortalSC/src/components/admin/BulkActions.tsx)
- Multi-select toolbar: bulk delete, status change, export

#### [NEW] [admin/media/page.tsx](file:///c:/Users/TEST/MyPortalSC/src/app/admin/media/page.tsx)
- Media library with Supabase Storage: upload, browse, delete

#### [NEW] [admin/activity/page.tsx](file:///c:/Users/TEST/MyPortalSC/src/app/admin/activity/page.tsx)
- Real-time activity feed (recent actions across all tables)

#### [NEW] [AdminSearch.tsx](file:///c:/Users/TEST/MyPortalSC/src/components/admin/AdminSearch.tsx)
- Global search: search across projects, initiatives, skills, certifications

#### [NEW] [015_tier5_admin.sql](file:///c:/Users/TEST/MyPortalSC/supabase/migrations/015_tier5_admin.sql)
- `content_versions` table, `media_library` table, `scheduled_at` column additions

---

### Tier 6: SEO, Performance & Accessibility

#### [NEW] [api/og/route.tsx](file:///c:/Users/TEST/MyPortalSC/src/app/api/og/route.tsx)
- Dynamic OG image generation (using `@vercel/og`)

#### [NEW] [JsonLd.tsx](file:///c:/Users/TEST/MyPortalSC/src/components/seo/JsonLd.tsx)
- Structured data component (Person, Organization, Portfolio)

#### [NEW] [sitemap.ts](file:///c:/Users/TEST/MyPortalSC/src/app/sitemap.ts)
#### [NEW] [robots.ts](file:///c:/Users/TEST/MyPortalSC/src/app/robots.ts)

#### [NEW] [SkipLink.tsx](file:///c:/Users/TEST/MyPortalSC/src/components/accessibility/SkipLink.tsx)
- Keyboard skip-to-content link

#### [NEW] [manifest.ts](file:///c:/Users/TEST/MyPortalSC/src/app/manifest.ts)
- PWA manifest

---

### Tier 7: Enterprise Features

#### [NEW] [blog/page.tsx](file:///c:/Users/TEST/MyPortalSC/src/app/blog/page.tsx)
#### [NEW] [blog/[slug]/page.tsx](file:///c:/Users/TEST/MyPortalSC/src/app/blog/[slug]/page.tsx)
- Markdown blog with categories, tags, reading time

#### [NEW] [case-studies/page.tsx](file:///c:/Users/TEST/MyPortalSC/src/app/case-studies/page.tsx)
#### [NEW] [case-studies/[slug]/page.tsx](file:///c:/Users/TEST/MyPortalSC/src/app/case-studies/[slug]/page.tsx)
- Deep-dive case study pages with outcomes and metrics

#### [NEW] [speaking/page.tsx](file:///c:/Users/TEST/MyPortalSC/src/app/speaking/page.tsx)
- Events, conferences, panels

#### [NEW] [publications/page.tsx](file:///c:/Users/TEST/MyPortalSC/src/app/publications/page.tsx)
- Awards, papers, recognitions

#### [NEW] [downloads/page.tsx](file:///c:/Users/TEST/MyPortalSC/src/app/downloads/page.tsx)
- Downloadable resources with Supabase Storage

#### Newsletter
#### [NEW] [NewsletterSignup.tsx](file:///c:/Users/TEST/MyPortalSC/src/components/NewsletterSignup.tsx)

#### Admin
#### [NEW] [admin/blog/page.tsx](file:///c:/Users/TEST/MyPortalSC/src/app/admin/blog/page.tsx)
#### [NEW] [admin/case-studies/page.tsx](file:///c:/Users/TEST/MyPortalSC/src/app/admin/case-studies/page.tsx)
#### [NEW] [admin/speaking/page.tsx](file:///c:/Users/TEST/MyPortalSC/src/app/admin/speaking/page.tsx)
#### [NEW] [admin/publications/page.tsx](file:///c:/Users/TEST/MyPortalSC/src/app/admin/publications/page.tsx)
#### [NEW] [admin/downloads/page.tsx](file:///c:/Users/TEST/MyPortalSC/src/app/admin/downloads/page.tsx)
#### [NEW] [admin/contacts/page.tsx](file:///c:/Users/TEST/MyPortalSC/src/app/admin/contacts/page.tsx)
- Contact form CRM: submissions, status, notes, export

#### [NEW] [016_tier7_enterprise.sql](file:///c:/Users/TEST/MyPortalSC/supabase/migrations/016_tier7_enterprise.sql)
- Tables: `blog_posts`, `case_studies`, `speaking_events`, `publications`, `downloads`, `newsletter_subscribers`, `contact_submissions`

---

## Verification Plan

### Automated Tests
- `npm run build` after each tier (zero errors, all routes compile)
- Verify all new admin pages render behind auth

### Manual Verification
- Each feature toggle can be enabled/disabled from Admin → Settings
- i18n switcher renders content in EN, HI, BN
- All new pages appear only when their toggle is ON
- Security headers present in response (CSP, HSTS, etc.)
- Visual browser check of all 4+1 themes

---

## Estimated New Files: ~65+ | New DB Tables: ~15 | New Admin Pages: ~12
