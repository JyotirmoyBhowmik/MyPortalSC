# MyPortalSC — Enterprise Portfolio Platform

A premium, full-stack portfolio & admin platform built with **Next.js 16**, **React 19**, **Supabase**, and **TailwindCSS 4**. Features 41 server-side feature flags, 3 switchable templates, AI-powered chatbot, voice assistant, real-time CRM, and a complete admin panel.

---

## Tech Stack

| Layer | Technology |
|:---|:---|
| Framework | Next.js 16 (App Router, Server Actions) |
| Runtime | React 19, TypeScript 5 |
| Styling | TailwindCSS 4, CSS Custom Properties |
| Database | Supabase (PostgreSQL + Auth + Storage) |
| AI | Google Gemini (`@google/genai`), Vercel AI SDK |
| 3D/Visuals | Three.js, React Three Fiber, Framer Motion |
| Email | Resend |
| CAPTCHA | Cloudflare Turnstile |
| Drag & Drop | dnd-kit |
| Charts | Recharts |
| Security | CSP, HSTS, Rate limiting, RBAC |

---

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Supabase project (PostgreSQL)

### Installation

```bash
git clone https://github.com/JyotirmoyBhowmik/MyPortalSC.git
cd MyPortalSC
npm install
```

### Environment Variables

Create a `.env.local` file:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Email (Resend)
RESEND_API_KEY=re_...
ADMIN_EMAIL=admin@yourdomain.com

# AI
GOOGLE_GENERATIVE_AI_API_KEY=AIza...

# CAPTCHA (Cloudflare Turnstile)
NEXT_PUBLIC_TURNSTILE_SITE_KEY=0x...
TURNSTILE_SECRET_KEY=0x...

# Site
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Production Build

```bash
npm run build
npm start
```

---

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── admin/              # Admin panel (22 subpages)
│   │   ├── actions/        # Server Actions (15 modules)
│   │   ├── appearance/     # Icon & branding management
│   │   ├── settings/       # Feature flags & config
│   │   └── ...
│   ├── api/                # API routes (chat, email, storage, etc.)
│   ├── (public pages)/     # about, projects, skills, contact, etc.
│   ├── layout.tsx          # Root layout with providers
│   ├── globals.css         # Design system & template variables
│   └── sitemap.ts          # Dynamic DB-driven sitemap
├── components/
│   ├── admin/              # Admin UI components (28 files)
│   ├── layout/             # Navbar variants, Footer
│   ├── chat/               # AI Chat & Voice widgets
│   ├── ui/                 # Button, Badge, ConfirmDialog, RichTextEditor
│   ├── animations/         # Particles, ScrollReveal, PageTransition
│   └── forms/              # ContactForm with Turnstile
├── lib/
│   ├── data/               # Data access layer (7 modules)
│   ├── supabase/           # Client/Server/Middleware helpers
│   └── i18n/               # Internationalization
└── middleware.ts            # Auth + dynamic CSP
```

---

## Feature Flags

The platform includes **41 toggleable feature flags** managed from the admin Settings page. Each flag controls a specific feature at the server level:

| Category | Flags |
|:---|:---|
| Content & Core | `feature_executive_summary`, `feature_timeline`, `feature_achievements`, `feature_certifications` |
| Visual & UX | `feature_particle_bg`, `feature_3d_globe`, `feature_video_intro`, `feature_magnetic_buttons`, `feature_page_transitions` |
| Templates | `site_template` (classic / premium / minimal / executive) |
| Security | `feature_captcha`, `feature_csp_headers`, `feature_rbac`, `feature_session_management` |
| AI | `feature_ai_chatbot`, `feature_voice_widget` |
| CRM | `feature_contact_crm`, `feature_contact_analytics`, `feature_newsletter` |

---

## Templates

Switch between templates from **Admin → Settings → `site_template`**:

| Template | Description |
|:---|:---|
| `classic` | Default dark theme with electric green accents |
| `premium` / `glass` | Glass-morphism dark theme |
| `minimal` | Clean, light-mode with subtle blue accents |
| `executive` | Corporate navy & gold palette |

---

## Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Import in [Vercel](https://vercel.com)
3. Add environment variables
4. Deploy

### Other Platforms
Any Node.js 18+ hosting that supports Next.js. Set `output: 'standalone'` in `next.config.ts` for Docker deployments.

---

## Documentation

- **[Admin Manual](docs/ADMIN_MANUAL.md)** — End-user guide for the admin panel
- **[Codebase Manual](docs/CODEBASE_MANUAL.md)** — Developer guide for contributing

---

## License

Private. All rights reserved.
