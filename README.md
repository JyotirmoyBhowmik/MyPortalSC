# MyPortalSC — Enterprise Portfolio & Admin Platform

> A production-grade, full-stack portfolio and CMS platform built with **Next.js 16**, **React 19**, **Supabase** (PostgreSQL), and **TailwindCSS 4**. Features 41+ server-side feature flags, 5 switchable theme templates, AI-powered chatbot & voice assistant, real-time CRM, RBAC admin panel, i18n (3 languages), and enterprise security headers.

---

## Table of Contents

1. [Tech Stack](#tech-stack)
2. [Project Map (Folder Structure)](#project-map-folder-structure)
3. [Data Flow Diagram](#data-flow-diagram)
4. [Getting Started](#getting-started)
5. [Environment Variables](#environment-variables)
6. [Running Locally](#running-locally)
7. [Production Build](#production-build)
8. [Deployment (Vercel)](#deployment-vercel)
9. [Feature Flags](#feature-flags)
10. [Templates & Themes](#templates--themes)
11. [Security Architecture](#security-architecture)
12. [Database Schema](#database-schema)
13. [Internationalization (i18n)](#internationalization-i18n)
14. [API Routes](#api-routes)
15. [Admin Panel](#admin-panel)
16. [Documentation Links](#documentation-links)
17. [License](#license)

---

## Tech Stack

| Layer | Technology | Purpose |
|:---|:---|:---|
| **Framework** | Next.js 16 (App Router, Server Actions) | SSR, ISR, routing, API routes |
| **Runtime** | React 19, TypeScript 5 | UI rendering, type safety |
| **Styling** | TailwindCSS 4, CSS Custom Properties | Utility-first styles, theme tokens |
| **Database** | Supabase (PostgreSQL + Auth + Storage + Realtime) | Backend-as-a-service, RLS, row-level security |
| **AI** | Google Gemini (`@google/genai`), Vercel AI SDK | Chatbot, voice assistant streaming |
| **3D/Visuals** | Three.js, React Three Fiber, Framer Motion | Globe visualization, animations |
| **Email** | Resend | Transactional emails from contact form |
| **CAPTCHA** | Cloudflare Turnstile | Bot protection on forms |
| **Drag & Drop** | dnd-kit | Admin panel reordering |
| **Charts** | Recharts | Skills radar, analytics charts |
| **Rich Text** | Tiptap | WYSIWYG editor in admin |
| **Security** | CSP, HSTS, RBAC, Rate limiting | Header hardening, role-based access |

---

## Project Map (Folder Structure)

```
MyPortalSC/
│
├── public/                         # Static assets served at root URL
│   ├── favicon.ico                 # Browser tab icon
│   ├── pcm-processor.js           # Web Audio worklet for voice widget
│   └── *.svg                      # SVG icons and logos
│
├── src/                            # ═══ ALL APPLICATION SOURCE CODE ═══
│   │
│   ├── app/                        # Next.js App Router — each folder = a route
│   │   ├── layout.tsx              # Root layout: fonts, providers, navbar, footer
│   │   ├── page.tsx                # Homepage: hero, competencies, projects, skills, CTA
│   │   ├── globals.css             # Design system: CSS variables, template tokens, utilities
│   │   ├── error.tsx               # Global error boundary UI
│   │   ├── not-found.tsx           # Custom 404 page
│   │   ├── loading.tsx             # Global loading skeleton
│   │   ├── sitemap.ts              # Dynamic XML sitemap (DB-driven, feature-gated)
│   │   ├── robots.ts               # robots.txt generator (blocks /admin, /api)
│   │   ├── manifest.ts             # PWA manifest for installability
│   │   ├── icon.tsx                # Dynamic favicon generator
│   │   │
│   │   ├── about/                  # /about — Profile & bio page
│   │   ├── contact/                # /contact — Contact form with Turnstile CAPTCHA
│   │   ├── projects/               # /projects — Project showcase with slug detail pages
│   │   ├── skills/                 # /skills — Technology proficiency display
│   │   ├── initiatives/            # /initiatives — 88+ enterprise IT initiatives grid/timeline
│   │   ├── blog/                   # /blog — CMS-driven blog (feature-gated)
│   │   ├── case-studies/           # /case-studies — Detailed case study pages
│   │   ├── testimonials/           # /testimonials — Client testimonials
│   │   ├── timeline/               # /timeline — Professional career timeline
│   │   ├── executive-summary/      # /executive-summary — One-page leadership summary
│   │   ├── publications/           # /publications — Published articles & papers
│   │   ├── speaking/               # /speaking — Conference talks & events
│   │   ├── downloads/              # /downloads — Resume & document downloads
│   │   ├── site-map/               # /site-map — HTML sitemap for users
│   │   ├── debug/                  # /debug — Dev-only diagnostic page
│   │   │
│   │   ├── admin/                  # ═══ ADMIN PANEL (auth-protected) ═══
│   │   │   ├── layout.tsx          # Admin layout: force-dynamic, RBAC flags
│   │   │   ├── page.tsx            # Admin dashboard: stats, quick actions
│   │   │   ├── login/              # /admin/login — Auth login page
│   │   │   ├── actions/            # Server Actions (16 modules):
│   │   │   │   ├── achievements.ts #   CRUD for achievements
│   │   │   │   ├── appearance.ts   #   Site icon/branding management
│   │   │   │   ├── certifications.ts # CRUD for certifications
│   │   │   │   ├── contact.ts      #   Contact form submissions & CRM
│   │   │   │   ├── downloads.ts    #   Downloadable file management
│   │   │   │   ├── enterprise.ts   #   Programs & initiative bulk ops
│   │   │   │   ├── initiatives.ts  #   CRUD for initiatives
│   │   │   │   ├── media.ts        #   Media library (Supabase Storage)
│   │   │   │   ├── pages.ts        #   CMS page content editing
│   │   │   │   ├── projects.ts     #   CRUD for projects
│   │   │   │   ├── publications.ts #   CRUD for publications
│   │   │   │   ├── settings.ts     #   Feature flag toggling
│   │   │   │   ├── skills.ts       #   CRUD for skills
│   │   │   │   ├── speaking.ts     #   CRUD for speaking events
│   │   │   │   ├── testimonials.ts #   CRUD for testimonials
│   │   │   │   └── users.ts        #   Admin user invite/RBAC management
│   │   │   ├── achievements/       # Achievement management page
│   │   │   ├── analytics/          # Visitor & page analytics dashboard
│   │   │   ├── appearance/         # Icon & branding settings
│   │   │   ├── audit/              # Audit log viewer (super_admin only)
│   │   │   ├── blog/               # Blog post editor
│   │   │   ├── case-studies/       # Case study editor
│   │   │   ├── certifications/     # Certification management
│   │   │   ├── contacts/           # CRM: contact submissions
│   │   │   ├── downloads/          # Download file management
│   │   │   ├── initiatives/        # Initiative & program management
│   │   │   ├── media/              # Media library browser
│   │   │   ├── pages/              # CMS page content editor
│   │   │   ├── projects/           # Project management
│   │   │   ├── publications/       # Publication management
│   │   │   ├── security/           # Security settings dashboard
│   │   │   ├── settings/           # Feature flags toggle panel (super_admin)
│   │   │   ├── skills/             # Skills management
│   │   │   ├── speaking/           # Speaking event management
│   │   │   ├── testimonials/       # Testimonial management
│   │   │   ├── timeline/           # Timeline entry management
│   │   │   └── users/              # Admin user management (super_admin)
│   │   │
│   │   └── api/                    # ═══ API ROUTES ═══
│   │       ├── chat/               # AI chatbot streaming endpoint
│   │       ├── audio/              # Voice widget audio processing
│   │       ├── send-email/         # Contact form email dispatch (Resend)
│   │       ├── assets/             # Dynamic asset serving
│   │       ├── storage/            # Supabase Storage proxy
│   │       ├── media/              # Media file operations
│   │       ├── og/                 # Dynamic Open Graph image generation
│   │       ├── health/             # Health check endpoint
│   │       ├── ephemeral-token/    # Short-lived auth token generation
│   │       └── gemini-token/       # Gemini AI session token
│   │
│   ├── components/                 # ═══ REUSABLE UI COMPONENTS ═══
│   │   │
│   │   ├── FeatureGate.tsx         # Server component: conditionally render by DB flag
│   │   ├── ThemeProvider.tsx        # Client: theme context (4 color schemes + retro mode)
│   │   ├── SettingsProvider.tsx     # Client: settings context for child components
│   │   ├── VisitorTracker.tsx       # Client: privacy-first page view recorder
│   │   ├── ThemeSwitcher.tsx        # Client: theme selection dropdown
│   │   ├── LanguageSwitcher.tsx     # Client: language picker (EN/HI/BN)
│   │   ├── RetroToggle.tsx          # Client: retro CRT mode toggle
│   │   │
│   │   ├── admin/                  # Admin panel components (29 files):
│   │   │   ├── AdminShell.tsx      #   Main admin layout: sidebar, navigation, search
│   │   │   ├── SettingsManager.tsx  #   Feature flag toggle grid
│   │   │   ├── ProjectsTable.tsx   #   Drag-sortable project list
│   │   │   ├── BlogManager.tsx     #   Blog CRUD with rich text
│   │   │   ├── MediaLibrary.tsx    #   Image/file browser & uploader
│   │   │   ├── RichTextEditor.tsx  #   Tiptap WYSIWYG editor wrapper
│   │   │   ├── ImageUpload.tsx     #   Drag & drop image uploader
│   │   │   ├── DocumentUpload.tsx  #   Document file uploader
│   │   │   ├── DatePicker.tsx      #   Calendar date picker
│   │   │   ├── SortableRow.tsx     #   dnd-kit sortable table row
│   │   │   ├── UserInviteModal.tsx #   Admin user invitation dialog
│   │   │   ├── RealtimeNotifications.tsx # Supabase realtime event listener
│   │   │   └── *Manager.tsx        #   CRUD managers for each content type
│   │   │
│   │   ├── layout/                 # Layout components:
│   │   │   ├── Navbar.tsx          #   Router: loads NavbarSidebar dynamically
│   │   │   ├── NavbarSidebar.tsx   #   Main sidebar navigation (default)
│   │   │   ├── NavbarClassic.tsx   #   Classic top navbar variant
│   │   │   ├── NavbarMinimal.tsx   #   Minimal navbar variant
│   │   │   ├── NavbarPremium.tsx   #   Premium glassmorphism navbar
│   │   │   ├── Footer.tsx          #   Site footer with feature-gated sections
│   │   │   ├── ProgressBar.tsx     #   Page scroll progress indicator
│   │   │   ├── LanguageProvider.tsx #  Language context wrapper
│   │   │   └── LanguageSwitcher.tsx #  In-navbar language picker
│   │   │
│   │   ├── chat/                   # AI components:
│   │   │   ├── ChatWidget.tsx      #   Floating AI chatbot (Gemini-powered)
│   │   │   └── VoiceWidget.tsx     #   Voice assistant with WebRTC audio
│   │   │
│   │   ├── ui/                     # Primitive UI components:
│   │   │   ├── Button.tsx          #   Multi-variant button (primary/secondary/ghost/danger)
│   │   │   ├── Badge.tsx           #   Status badge (success/warning/danger/info)
│   │   │   ├── Card.tsx            #   Glass-morphism card wrapper
│   │   │   ├── Skeleton.tsx        #   Loading skeleton placeholder
│   │   │   ├── ConfirmDialog.tsx   #   Modal confirmation dialog
│   │   │   ├── ImageLightbox.tsx   #   Full-screen image viewer
│   │   │   └── ToastProvider.tsx   #   Toast notification system
│   │   │
│   │   ├── animations/             # Motion & effects:
│   │   │   ├── AnimatedSection.tsx #   Scroll-triggered fade/slide reveal
│   │   │   ├── ParticleBackground.tsx # Canvas particle system
│   │   │   ├── ScrollReveal.tsx    #   Intersection observer reveal
│   │   │   ├── PageTransition.tsx  #   Framer Motion page transitions
│   │   │   ├── TypewriterText.tsx  #   Typing animation effect
│   │   │   └── CountUp.tsx         #   Animated number counter
│   │   │
│   │   ├── forms/                  # Form components:
│   │   │   └── ContactForm.tsx     #   Contact form with Turnstile CAPTCHA
│   │   │
│   │   ├── visuals/                # Data visualization components:
│   │   │   ├── WorldMap.tsx        #   Interactive SVG world map
│   │   │   ├── DeliveryGlobe.tsx   #   3D Three.js rotating globe
│   │   │   ├── NetworkTopology.tsx #   Network infrastructure diagram
│   │   │   ├── SkillsRadarChart.tsx #  Recharts radar chart
│   │   │   ├── PingDashboard.tsx   #   Live server ping monitor
│   │   │   ├── ServerStatusWidget.tsx # Server health status card
│   │   │   ├── CostComparison.tsx  #   ROI/cost comparison chart
│   │   │   ├── GlobalOperationsDashboard.tsx # Operations overview
│   │   │   └── VideoPlayer.tsx     #   Responsive video embed
│   │   │
│   │   ├── executive/              # Executive summary components:
│   │   │   ├── ExecutiveSummaryContent.tsx # Full executive briefing
│   │   │   ├── TestimonialsContent.tsx    # Testimonial carousel
│   │   │   └── TimelineContent.tsx        # Career timeline
│   │   │
│   │   ├── projects/               # Project display components:
│   │   │   ├── ProjectsGrid.tsx    #   Filterable project card grid
│   │   │   ├── FeaturedProjectsFilter.tsx # Homepage featured filter
│   │   │   └── ProjectImageWithLightbox.tsx # Image with zoom
│   │   │
│   │   ├── initiatives/            # Initiative display components:
│   │   │   ├── InitiativesGrid.tsx #   Card grid with filters
│   │   │   ├── InitiativesTimeline.tsx # Timeline view
│   │   │   └── InitiativesViewToggle.tsx # Grid/Timeline switcher
│   │   │
│   │   ├── analytics/              # Analytics components:
│   │   │   └── ViewCounter.tsx     #   Live page view counter
│   │   │
│   │   └── pdf/                    # PDF components:
│   │       └── DownloadPdfButton.tsx # Client-side PDF generation
│   │
│   ├── lib/                        # ═══ SHARED LIBRARIES & UTILITIES ═══
│   │   │
│   │   ├── database.types.ts       # TypeScript types auto-generated from Supabase schema
│   │   │
│   │   ├── data/                   # Data Access Layer (DAL) — all DB queries:
│   │   │   ├── settings.ts         #   Feature flags, site settings CRUD
│   │   │   ├── projects.ts         #   Project queries (published, featured, by slug)
│   │   │   ├── skills.ts           #   Skills queries, grouped by category
│   │   │   ├── certifications.ts   #   Certification queries
│   │   │   ├── achievements.ts     #   Achievement queries
│   │   │   ├── initiatives.ts      #   Initiatives & programs queries
│   │   │   └── content.ts          #   CMS page content & JSONB helpers
│   │   │
│   │   ├── supabase/               # Supabase client factories:
│   │   │   ├── client.ts           #   Browser-side client (createBrowserClient)
│   │   │   ├── server.ts           #   Server-side client (createServerClient + cookies)
│   │   │   └── middleware.ts       #   Edge middleware client (auth refresh + RBAC)
│   │   │
│   │   └── i18n/                   # Internationalization:
│   │       ├── index.tsx           #   I18nProvider context & useTranslation hook
│   │       └── translations/       #   Language packs:
│   │           ├── en.ts           #     English (default)
│   │           ├── hi.ts           #     Hindi
│   │           └── bn.ts           #     Bengali
│   │
│   └── proxy.ts                    # Edge middleware: security headers, CSP, HSTS
│
├── supabase/                       # ═══ DATABASE MIGRATIONS ═══
│   └── migrations/                 # 24 sequential SQL migration files:
│       ├── 001_schema.sql          #   Core tables (projects, skills, certs, etc.)
│       ├── 002_rls_policies.sql    #   Row Level Security policies
│       ├── 003_functions_triggers.sql # DB functions & audit triggers
│       ├── 004_seed_data.sql       #   Initial seed data
│       ├── 009_initiatives_and_programs.sql # Initiatives/programs schema
│       ├── 011_feature_toggles.sql #   41+ feature flag definitions
│       ├── 012_tier1_tables.sql    #   Blog, case studies, testimonials, etc.
│       ├── 013_tier2_security.sql  #   RBAC & security tables
│       └── ...                     #   (24 total migration files)
│
├── scripts/                        # Utility scripts
│   └── test-db.ts                  # Database connection test
│
├── docs/                           # ═══ DOCUMENTATION ═══
│   ├── ADMIN_MANUAL.md             # End-user guide for admin panel
│   ├── CODEBASE_MANUAL.md          # Developer guide for contributing
│   ├── DEPLOYMENT_V2.md            # Deployment guide v2
│   └── DEPLOYMENT_V3.md            # Deployment guide v3 (latest)
│
├── .github/workflows/              # CI/CD automation
│
├── next.config.ts                  # Next.js config: images, security headers
├── vercel.json                     # Vercel deployment: security headers, routing
├── tsconfig.json                   # TypeScript compiler configuration
├── package.json                    # Dependencies & scripts
├── eslint.config.mjs               # ESLint flat config (Next.js + TypeScript)
├── postcss.config.mjs              # PostCSS: TailwindCSS 4 plugin
├── .env.example                    # Environment variable template
├── .gitignore                      # Git exclusion rules
└── .npmrc                          # npm configuration
```

---

## Data Flow Diagram

This diagram shows how data moves from user interaction to database persistence:

```
┌─────────────────── CLIENT (Browser) ────────────────────┐
│                                                          │
│  User Action (click, form submit, navigation)            │
│       │                                                  │
│       ▼                                                  │
│  React Component (e.g., ContactForm.tsx)                 │
│       │                                                  │
│       ├──── Client-side validation ────►  Toast/Error    │
│       │                                                  │
│       ▼                                                  │
│  Server Action / API Route call                          │
│  (via fetch or Next.js server action binding)            │
│                                                          │
└──────────────────────┬───────────────────────────────────┘
                       │
                       ▼
┌─────────────── SERVER (Next.js Edge/Node) ──────────────┐
│                                                          │
│  ┌── Middleware (proxy.ts) ──────────────────────────┐   │
│  │  1. Session refresh (Supabase Auth)               │   │
│  │  2. RBAC check (admin_users table)                │   │
│  │  3. Security headers (CSP, HSTS, X-Frame)         │   │
│  └───────────────────────────────────────────────────┘   │
│                       │                                  │
│                       ▼                                  │
│  ┌── Server Action (admin/actions/*.ts) ─────────────┐  │
│  │  1. Auth verification (getUser)                    │  │
│  │  2. Input validation / sanitization                │  │
│  │  3. Data Access Layer call (lib/data/*.ts)         │  │
│  │  4. Return success/error to client                 │  │
│  └───────────────┬───────────────────────────────────┘  │
│                   │                                      │
│                   ▼                                      │
│  ┌── Data Access Layer (lib/data/*.ts) ──────────────┐  │
│  │  • createClient() → Supabase server client         │  │
│  │  • Type-safe queries with Database types            │  │
│  │  • React cache() for request deduplication          │  │
│  └───────────────┬───────────────────────────────────┘  │
│                   │                                      │
└───────────────────┼──────────────────────────────────────┘
                    │
                    ▼
┌─────────────── SUPABASE (Cloud) ────────────────────────┐
│                                                          │
│  ┌── PostgreSQL ─────────────────────────────────────┐  │
│  │  • 15+ tables (projects, skills, initiatives...)   │  │
│  │  • Row Level Security (RLS) policies               │  │
│  │  • Audit triggers → audit_log table                │  │
│  │  • updated_at auto-update triggers                 │  │
│  └───────────────────────────────────────────────────┘  │
│                                                          │
│  ┌── Auth ───────────────────────────────────────────┐  │
│  │  • Email/password authentication                   │  │
│  │  • JWT tokens (access + refresh)                   │  │
│  │  • Session management via cookies                  │  │
│  └───────────────────────────────────────────────────┘  │
│                                                          │
│  ┌── Storage ────────────────────────────────────────┐  │
│  │  • Media bucket (images, documents)                │  │
│  │  • resume-docs bucket (downloadable files)         │  │
│  │  • Public URL generation                           │  │
│  └───────────────────────────────────────────────────┘  │
│                                                          │
│  ┌── Realtime ───────────────────────────────────────┐  │
│  │  • WebSocket subscriptions for admin notifications │  │
│  │  • Live updates on contact form submissions        │  │
│  └───────────────────────────────────────────────────┘  │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

---

## Getting Started

### Prerequisites

- **Node.js 18+** and npm (or pnpm/yarn)
- **Supabase project** — [Create one free at supabase.com](https://supabase.com)
- **Git** — for version control

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/JyotirmoyBhowmik/MyPortalSC.git
cd MyPortalSC

# 2. Install dependencies
npm install

# 3. Copy environment template and fill in your keys
cp .env.example .env.local
```

---

## Environment Variables

Create a `.env.local` file from the `.env.example` template:

```env
# ─── Supabase (Required) ───────────────────────────────
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# ─── Email Service (Required for contact form) ─────────
RESEND_API_KEY=re_YOUR_KEY_HERE
ADMIN_EMAIL=admin@yourdomain.com

# ─── AI Chatbot (Required for AI features) ─────────────
GOOGLE_GENERATIVE_AI_API_KEY=AIza...

# ─── CAPTCHA (Required for form protection) ─────────────
NEXT_PUBLIC_TURNSTILE_SITE_KEY=0x...
TURNSTILE_SECRET_KEY=0x...

# ─── Site Configuration ────────────────────────────────
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NODE_ENV=development

# ─── Analytics (Optional) ──────────────────────────────
# NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

> **⚠️ Security Note:** Never commit `.env.local` to version control. The `.gitignore` already excludes `.env*` files. Store production secrets in Vercel's Environment Variables dashboard.

---

## Running Locally

```bash
# Start the development server (hot-reload enabled)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Key Development Notes

- **Server Components** are the default — React components fetch data server-side
- **`"use client"`** directive marks client-only components (forms, animations, providers)
- **ISR (Incremental Static Regeneration)** is set to 60s on most pages via `export const revalidate = 60`
- **Admin routes** are `force-dynamic` — never pre-rendered at build time

---

## Production Build

```bash
# Build the production bundle
npm run build

# Start the production server
npm start
```

The build output will show any type errors or missing env warnings.

---

## Deployment (Vercel)

### Steps

1. Push your code to GitHub
2. Import the repository in [Vercel Dashboard](https://vercel.com/new)
3. Add all environment variables from `.env.example` to Vercel's **Settings → Environment Variables**
4. Deploy — Vercel auto-detects Next.js and configures the build

### `vercel.json` Configuration

The included `vercel.json` applies:

- **Security headers** on all routes (HSTS, X-Content-Type-Options, Referrer-Policy, Permissions-Policy)
- **Cache headers** on static assets for CDN performance
- **Build command** and output directory configuration

### Other Platforms

For Docker or self-hosted deployments, add `output: 'standalone'` to `next.config.ts`:

```ts
const nextConfig: NextConfig = {
  output: 'standalone',
  // ... rest of config
};
```

---

## Feature Flags

The platform includes **41+ toggleable feature flags** managed from **Admin → Settings**. Each flag is stored in the `site_settings` Supabase table and checked server-side via `getFeatureFlag()`.

| Category | Flags | Purpose |
|:---|:---|:---|
| **Content** | `feature_executive_summary`, `feature_timeline`, `feature_achievements`, `feature_certifications`, `feature_blog`, `feature_case_studies`, `feature_publications`, `feature_speaking`, `feature_downloads` | Show/hide entire content sections |
| **Visual & UX** | `feature_particle_bg`, `feature_3d_globe`, `feature_video_intro`, `feature_magnetic_buttons`, `feature_page_transitions` | Enable/disable visual effects |
| **Templates** | `site_template` (classic / premium / minimal / executive) | Switch entire site theme |
| **Security** | `feature_captcha`, `feature_csp_headers`, `feature_strict_security_headers`, `feature_rbac`, `feature_session_management` | Toggle security features |
| **AI** | `feature_ai_chatbot`, `feature_voice_widget` | Enable AI assistant components |
| **CRM** | `feature_contact_crm`, `feature_contact_analytics`, `feature_newsletter` | CRM functionality toggles |
| **SEO** | `feature_og_images`, `feature_jsonld`, `feature_pwa` | SEO & PWA toggles |
| **Admin** | `feature_admin_search`, `feature_realtime_notifications` | Admin panel features |

### How Feature Gating Works

```tsx
// Server Component usage (recommended):
import { FeatureGate } from "@/components/FeatureGate";

<FeatureGate feature="feature_blog">
  <BlogSection />  {/* Only renders if flag is true in DB */}
</FeatureGate>

// Direct function usage:
import { getFeatureFlag } from "@/lib/data/settings";
const isEnabled = await getFeatureFlag("feature_blog");
```

---

## Templates & Themes

### Site Templates (Admin-controlled)

Switch between templates from the **Admin Appearance Panel** (`/admin/appearance`) or **Admin Settings** dropdown:

| Template | Name | Description |
|:---|:---|:---|
| `ceramic` | Ceramic Dark | Unglazed dark ceramic texture, high-contrast neon accents, tactile layouts, and generous padding. |
| `ceramic-light` | Ceramic Light | Clean unglazed white porcelain aesthetic, top-centered Lookbook navigation, soft shadows, and slate blue accents. |
| `glass-dark` | Glass Exec Dark | Premium glassmorphism backdrop-blur, dark translucent surfaces, and vibrant neon-cyan accent highlights. |
| `light-modern` | Light Exec Modern | Bright minimalist white canvas, thin clean line borders, spacious responsive layouts, and slate accents. |
| `classic` | Classic Slate | Standard left-sidebar navigation, traditional layouts, solid surfaces, and structured enterprise routing. |

> **🎨 Cohesive Visual Adaptive System:** Key charts and diagrams (such as the **Skills Radar Chart** and the **Interactive Architecture Map**) feature dynamic theme sensing via a custom DOM `MutationObserver`. When an administrator updates the preset template, the charts and diagram elements instantly adapt their outlines, borders, text colors, and backgrounds to coordinate with the new theme in real-time.

### Color Themes (User-controlled)

Users can switch between 4 color themes via the ThemeSwitcher:

| Theme | Background | Primary Color |
|:---|:---|:---|
| Deep Navy | `#0a192f` | Green accents |
| Midnight Purple | `#0f0a1e` | Purple accents |
| Carbon | `#111111` | Neutral accents |
| Emerald Forest | `#081c15` | Emerald accents |

### Retro Mode

A toggle enables a retro CRT scanline effect across the entire site.

---

## Security Architecture

### Edge Middleware (`src/proxy.ts`)

Every request passes through edge middleware that applies:

1. **Session refresh** — Supabase JWT token renewal
2. **RBAC enforcement** — Admin route protection based on `admin_users` role
3. **Security headers** — Applied to every response:
   - `Strict-Transport-Security` (HSTS with 2-year max-age, preload)
   - `X-Content-Type-Options: nosniff`
   - `X-Frame-Options: SAMEORIGIN`
   - `X-XSS-Protection: 1; mode=block`
   - `Referrer-Policy: strict-origin-when-cross-origin`
   - `Permissions-Policy: camera=(), microphone=(), geolocation=()`
   - Full `Content-Security-Policy` when strict mode is enabled

### Database Security (RLS)

- **Row Level Security** enforced on all tables
- **Public read** for published content (projects, skills, initiatives)
- **Authenticated write** only via admin panel
- **Audit logging** — all mutations are recorded in `audit_log` table

### RBAC Roles

| Role | Access |
|:---|:---|
| `super_admin` | Full access: all admin pages + users, settings, audit log |
| `admin` | Content management only: projects, blog, media, etc. |

---

## Database Schema

Core tables in Supabase PostgreSQL:

| Table | Purpose |
|:---|:---|
| `projects` | Portfolio projects with slug routing |
| `skills` | Technology skills with proficiency levels |
| `certifications` | Professional certifications |
| `achievements` | Career achievements |
| `initiatives` | IT infrastructure initiatives |
| `programs` | Initiative program groupings |
| `content_pages` | CMS JSONB content for editable pages |
| `site_settings` | Feature flags & configuration (key-value) |
| `admin_users` | RBAC user records (links to Supabase Auth) |
| `audit_log` | Mutation audit trail |
| `page_analytics` | Page view aggregates |
| `visitor_events` | Individual visit records |
| `blog_posts` | Blog articles |
| `case_studies` | Detailed case study write-ups |
| `testimonials` | Client testimonials |

---

## Internationalization (i18n)

The site supports 3 languages with client-side switching:

| Code | Language | File |
|:---|:---|:---|
| `en` | English (default) | `src/lib/i18n/translations/en.ts` |
| `hi` | Hindi (हिन्दी) | `src/lib/i18n/translations/hi.ts` |
| `bn` | Bengali (বাংলা) | `src/lib/i18n/translations/bn.ts` |

Usage in components:

```tsx
const { t, tDB, locale } = useTranslation();
<h1>{t.hero.title}</h1>           // Static translation
<p>{tDB(project, "title")}</p>    // DB field with locale fallback
```

---

## API Routes

| Route | Method | Purpose |
|:---|:---|:---|
| `/api/chat` | POST | Gemini AI chatbot streaming response |
| `/api/audio` | POST | Voice widget audio processing |
| `/api/send-email` | POST | Contact form email via Resend |
| `/api/og` | GET | Dynamic Open Graph image generation |
| `/api/health` | GET | Health check (returns 200 OK) |
| `/api/storage/*` | GET/POST | Supabase Storage proxy |
| `/api/media/*` | GET/POST/DELETE | Media library operations |
| `/api/assets/*` | GET | Dynamic asset serving |
| `/api/ephemeral-token` | POST | Short-lived auth token |
| `/api/gemini-token` | POST | Gemini session token |

---

## Admin Panel

Access at `/admin` (requires authentication).

### Dashboard Features

- **Quick stats**: Total projects, skills, initiatives, certifications
- **Recent activity**: Latest content updates
- **Quick actions**: Jump to any management section

### Content Managers

Each content type has a dedicated manager component with:

- **Create/Edit/Delete** forms with validation
- **Drag-and-drop reordering** (via dnd-kit)
- **Image & document upload** (via Supabase Storage)
- **Rich text editing** (via Tiptap)
- **Status management** (draft/published/archived)

---

## Documentation Links

- **[Admin Manual](docs/ADMIN_MANUAL.md)** — End-user guide for the admin panel
- **[Codebase Manual](docs/CODEBASE_MANUAL.md)** — Developer guide for contributing
- **[Deployment Guide v3](docs/DEPLOYMENT_V3.md)** — Latest deployment instructions

---

## License

Private. All rights reserved. © Jyotirmoy Bhowmik
