# MyPortalSC v2 — Enterprise Portfolio & Admin Platform

> A production-grade, full-stack portfolio and CMS platform built with **Next.js 16**, **React 19**, **Supabase** (PostgreSQL), and **TailwindCSS 4**. Features 41+ server-side feature flags, 4 switchable theme templates, AI-powered chatbot & voice assistant, real-time CRM, RBAC admin panel, i18n (3 languages), and enterprise security headers.

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

## Project Map (Folder Structure - Detailed)

```
src/
├── app/
│   ├── about/
│   │   └── page.tsx
│   │       ├── 𝑓 revalidate
│   │       ├── 𝑓 metadata
│   │       └── 𝑓 AboutPage (default)
│   ├── admin/
│   │   ├── achievements/
│   │   │   └── page.tsx
│   │   │       └── 𝑓 AdminAchievementsPage (default)
│   │   ├── actions/
│   │   │   ├── achievements.ts
│   │   │   │   ├── 𝑓 createAchievement
│   │   │   │   ├── 𝑓 updateAchievement
│   │   │   │   └── 𝑓 deleteAchievement
│   │   │   ├── appearance.ts
│   │   │   │   ├── 𝑓 uploadSiteIcon
│   │   │   │   └── 𝑓 resetSiteIcon
│   │   │   ├── calendar.ts
│   │   │   │   ├── 𝑓 createFiscalYear
│   │   │   │   └── 𝑓 deleteFiscalYear
│   │   │   ├── certifications.ts
│   │   │   │   ├── 𝑓 createCertification
│   │   │   │   ├── 𝑓 updateCertification
│   │   │   │   └── 𝑓 deleteCertification
│   │   │   ├── contact.ts
│   │   │   │   ├── 𝑓 submitContactForm
│   │   │   │   └── 𝑓 replyToContact
│   │   │   ├── downloads.ts
│   │   │   │   ├── 𝑓 createDownload
│   │   │   │   ├── 𝑓 updateDownload
│   │   │   │   └── 𝑓 deleteDownload
│   │   │   ├── enterprise.ts
│   │   │   │   ├── 𝑓 createBlogPost
│   │   │   │   ├── 𝑓 updateBlogPost
│   │   │   │   ├── 𝑓 deleteBlogPost
│   │   │   │   ├── 𝑓 createCaseStudy
│   │   │   │   ├── 𝑓 updateCaseStudy
│   │   │   │   ├── 𝑓 deleteCaseStudy
│   │   │   │   ├── 𝑓 updateContactStatus
│   │   │   │   └── 𝑓 deleteContact
│   │   │   ├── finance.ts
│   │   │   │   ├── 𝑓 createBudget
│   │   │   │   ├── 𝑓 updateBudget
│   │   │   │   └── 𝑓 deleteBudget
│   │   │   ├── initiatives.ts
│   │   │   │   ├── 𝑓 createInitiative
│   │   │   │   ├── 𝑓 updateInitiative
│   │   │   │   ├── 𝑓 deleteInitiative
│   │   │   │   ├── 𝑓 createProgram
│   │   │   │   ├── 𝑓 updateProgram
│   │   │   │   ├── 𝑓 deleteProgram
│   │   │   │   ├── 𝑓 reorderInitiatives
│   │   │   │   └── 𝑓 reorderPrograms
│   │   │   ├── media.ts
│   │   │   │   ├── 𝑓 uploadMedia
│   │   │   │   ├── 𝑓 registerMedia
│   │   │   │   ├── 𝑓 deleteMedia
│   │   │   │   └── 𝑓 getMedia
│   │   │   ├── pages.ts
│   │   │   │   └── 𝑓 updatePageContent
│   │   │   ├── projects.ts
│   │   │   │   ├── 𝑓 createProject
│   │   │   │   ├── 𝑓 updateProject
│   │   │   │   ├── 𝑓 deleteProject
│   │   │   │   ├── 𝑓 toggleProjectStatus
│   │   │   │   └── 𝑓 reorderProjects
│   │   │   ├── publications.ts
│   │   │   │   ├── 𝑓 createPublication
│   │   │   │   ├── 𝑓 updatePublication
│   │   │   │   └── 𝑓 deletePublication
│   │   │   ├── settings.ts
│   │   │   │   ├── 𝑓 toggleFeature
│   │   │   │   └── 𝑓 updateSettingValue
│   │   │   ├── skills.ts
│   │   │   │   ├── 𝑓 createSkill
│   │   │   │   ├── 𝑓 updateSkill
│   │   │   │   ├── 𝑓 deleteSkill
│   │   │   │   └── 𝑓 reorderSkills
│   │   │   ├── speaking.ts
│   │   │   │   ├── 𝑓 createSpeakingEvent
│   │   │   │   ├── 𝑓 updateSpeakingEvent
│   │   │   │   └── 𝑓 deleteSpeakingEvent
│   │   │   ├── testimonials.ts
│   │   │   │   ├── 𝑓 createTestimonial
│   │   │   │   ├── 𝑓 updateTestimonial
│   │   │   │   ├── 𝑓 deleteTestimonial
│   │   │   │   ├── 𝑓 createTimelineEntry
│   │   │   │   ├── 𝑓 updateTimelineEntry
│   │   │   │   ├── 𝑓 deleteTimelineEntry
│   │   │   │   ├── 𝑓 updateTestimonialOrder
│   │   │   │   └── 𝑓 updateTimelineOrder
│   │   │   └── users.ts
│   │   │       ├── 𝑓 inviteUser
│   │   │       ├── 𝑓 updateUserRole
│   │   │       └── 𝑓 removeUser
│   │   ├── analytics/
│   │   │   └── page.tsx
│   │   │       ├── 𝑓 dynamic
│   │   │       └── 𝑓 AdminAnalyticsPage (default)
│   │   ├── appearance/
│   │   │   └── page.tsx
│   │   │       ├── 𝑓 dynamic
│   │   │       └── 𝑓 AdminAppearancePage (default)
│   │   ├── audit/
│   │   │   └── page.tsx
│   │   │       ├── 𝑓 dynamic
│   │   │       └── 𝑓 AdminAuditPage (default)
│   │   ├── blog/
│   │   │   └── page.tsx
│   │   │       ├── 𝑓 dynamic
│   │   │       └── 𝑓 AdminBlogPage (default)
│   │   ├── calendar/
│   │   │   └── page.tsx
│   │   │       └── 𝑓 AdminCalendarPage (default)
│   │   ├── case-studies/
│   │   │   └── page.tsx
│   │   │       ├── 𝑓 dynamic
│   │   │       └── 𝑓 AdminCaseStudiesPage (default)
│   │   ├── certifications/
│   │   │   └── page.tsx
│   │   │       └── 𝑓 AdminCertificationsPage (default)
│   │   ├── contacts/
│   │   │   └── page.tsx
│   │   │       ├── 𝑓 dynamic
│   │   │       └── 𝑓 AdminContactsPage (default)
│   │   ├── downloads/
│   │   │   └── page.tsx
│   │   │       ├── 𝑓 dynamic
│   │   │       └── 𝑓 AdminDownloadsPage (default)
│   │   ├── finances/
│   │   │   └── page.tsx
│   │   │       └── 𝑓 AdminFinancesPage (default)
│   │   ├── heatmap/
│   │   │   └── page.tsx
│   │   │       └── 𝑓 HeatmapPage (default)
│   │   ├── inactive-pages/
│   │   │   └── page.tsx
│   │   │       ├── 𝑓 dynamic
│   │   │       └── 𝑓 InactivePagesPage (default)
│   │   ├── initiatives/
│   │   │   └── page.tsx
│   │   │       └── 𝑓 AdminInitiativesPage (default)
│   │   ├── login/
│   │   │   └── page.tsx
│   │   │       └── 𝑓 AdminLoginPage (default)
│   │   ├── media/
│   │   │   └── page.tsx
│   │   │       ├── 𝑓 dynamic
│   │   │       └── 𝑓 AdminMediaPage (default)
│   │   ├── pages/
│   │   │   └── page.tsx
│   │   │       └── 𝑓 PagesAdminHub (default)
│   │   ├── profile/
│   │   │   └── page.tsx
│   │   │       ├── 𝑓 dynamic
│   │   │       ├── 𝑓 metadata
│   │   │       └── 𝑓 AdminProfilePage (default)
│   │   ├── projects/
│   │   │   ├── [id]/
│   │   │   │   └── edit/
│   │   │   │       └── page.tsx
│   │   │   │           └── 𝑓 EditProjectPage (default)
│   │   │   ├── new/
│   │   │   │   └── page.tsx
│   │   │   │       └── 𝑓 NewProjectPage (default)
│   │   │   └── page.tsx
│   │   │       └── 𝑓 AdminProjectsPage (default)
│   │   ├── publications/
│   │   │   └── page.tsx
│   │   │       ├── 𝑓 dynamic
│   │   │       └── 𝑓 AdminPublicationsPage (default)
│   │   ├── security/
│   │   │   └── page.tsx
│   │   │       ├── 𝑓 dynamic
│   │   │       └── 𝑓 AdminSecurityPage (default)
│   │   ├── settings/
│   │   │   └── page.tsx
│   │   │       └── 𝑓 AdminSettingsPage (default)
│   │   ├── sitemap/
│   │   │   └── page.tsx
│   │   │       └── 𝑓 SiteMapPage (default)
│   │   ├── skills/
│   │   │   └── page.tsx
│   │   │       └── 𝑓 AdminSkillsPage (default)
│   │   ├── speaking/
│   │   │   └── page.tsx
│   │   │       ├── 𝑓 dynamic
│   │   │       └── 𝑓 AdminSpeakingPage (default)
│   │   ├── testimonials/
│   │   │   └── page.tsx
│   │   │       ├── 𝑓 dynamic
│   │   │       └── 𝑓 AdminTestimonialsPage (default)
│   │   ├── timeline/
│   │   │   └── page.tsx
│   │   │       ├── 𝑓 dynamic
│   │   │       └── 𝑓 AdminTimelinePage (default)
│   │   ├── users/
│   │   │   └── page.tsx
│   │   │       ├── 𝑓 dynamic
│   │   │       └── 𝑓 AdminUsersPage (default)
│   │   ├── layout.tsx
│   │   │   ├── 𝑓 dynamic
│   │   │   └── 𝑓 AdminLayout (default)
│   │   └── page.tsx
│   │       ├── 𝑓 dynamic
│   │       └── 𝑓 AdminDashboardPage (default)
│   ├── api/
│   │   ├── admin/
│   │   │   └── quick-edit-hero/
│   │   │       └── route.ts
│   │   │           └── 𝑓 POST
│   │   ├── assets/
│   │   │   └── route.ts
│   │   │       └── 𝑓 GET
│   │   ├── audio/
│   │   │   └── route.ts
│   │   │       └── 𝑓 GET
│   │   ├── chat/
│   │   │   └── route.ts
│   │   │       ├── 𝑓 maxDuration
│   │   │       └── 𝑓 POST
│   │   ├── ephemeral-token/
│   │   │   └── route.ts
│   │   │       └── 𝑓 GET
│   │   ├── gemini-token/
│   │   │   └── route.ts
│   │   │       └── 𝑓 GET
│   │   ├── health/
│   │   │   └── route.ts
│   │   │       ├── 𝑓 GET
│   │   │       └── 𝑓 runtime
│   │   ├── media/
│   │   │   └── [...path]/
│   │   │       └── route.ts
│   │   │           └── 𝑓 GET
│   │   ├── og/
│   │   │   └── route.tsx
│   │   │       ├── 𝑓 runtime
│   │   │       └── 𝑓 GET
│   │   ├── security-check/
│   │   │   └── route.ts
│   │   │       └── 𝑓 GET
│   │   ├── send-email/
│   │   │   └── route.ts
│   │   │       └── 𝑓 POST
│   │   └── storage/
│   │       └── sign-upload/
│   │           └── route.ts
│   │               └── 𝑓 POST
│   ├── blog/
│   │   ├── [slug]/
│   │   │   └── page.tsx
│   │   │       ├── 𝑓 revalidate
│   │   │       ├── 𝑓 generateMetadata
│   │   │       └── 𝑓 BlogPostPage (default)
│   │   └── page.tsx
│   │       ├── 𝑓 revalidate
│   │       ├── 𝑓 metadata
│   │       └── 𝑓 BlogPage (default)
│   ├── budget/
│   │   ├── compare/
│   │   │   └── page.tsx
│   │   │       ├── 𝑓 metadata
│   │   │       ├── 𝑓 revalidate
│   │   │       └── 𝑓 FYComparePage (default)
│   │   ├── cost-center/
│   │   │   └── [slug]/
│   │   │       └── page.tsx
│   │   │           ├── 𝑓 generateMetadata
│   │   │           ├── 𝑓 revalidate
│   │   │           └── 𝑓 CostCenterPage (default)
│   │   ├── loading.tsx
│   │   │   └── 𝑓 BudgetLoading (default)
│   │   └── page.tsx
│   │       ├── 𝑓 metadata
│   │       ├── 𝑓 revalidate
│   │       └── 𝑓 BudgetPage (default)
│   ├── case-studies/
│   │   ├── [slug]/
│   │   │   └── page.tsx
│   │   │       ├── 𝑓 revalidate
│   │   │       ├── 𝑓 generateMetadata
│   │   │       └── 𝑓 CaseStudyPage (default)
│   │   └── page.tsx
│   │       ├── 𝑓 revalidate
│   │       ├── 𝑓 metadata
│   │       └── 𝑓 CaseStudiesPage (default)
│   ├── contact/
│   │   └── page.tsx
│   │       ├── 𝑓 revalidate
│   │       ├── 𝑓 metadata
│   │       └── 𝑓 ContactPage (default)
│   ├── debug/
│   │   └── page.tsx
│   │       ├── 𝑓 dynamic
│   │       └── 𝑓 DebugPage (default)
│   ├── downloads/
│   │   └── page.tsx
│   │       ├── 𝑓 revalidate
│   │       ├── 𝑓 metadata
│   │       └── 𝑓 DownloadsPage (default)
│   ├── executive-summary/
│   │   └── page.tsx
│   │       ├── 𝑓 revalidate
│   │       ├── 𝑓 metadata
│   │       └── 𝑓 ExecutiveSummaryPage (default)
│   ├── initiatives/
│   │   ├── [slug]/
│   │   │   └── page.tsx
│   │   │       ├── 𝑓 revalidate
│   │   │       ├── 𝑓 generateMetadata
│   │   │       └── 𝑓 InitiativeDetailPage (default)
│   │   ├── programs/
│   │   │   └── page.tsx
│   │   │       ├── 𝑓 revalidate
│   │   │       ├── 𝑓 metadata
│   │   │       └── 𝑓 ProgramsPage (default)
│   │   ├── loading.tsx
│   │   │   └── 𝑓 InitiativesLoading (default)
│   │   └── page.tsx
│   │       ├── 𝑓 revalidate
│   │       ├── 𝑓 metadata
│   │       └── 𝑓 InitiativesPage (default)
│   ├── projects/
│   │   ├── [slug]/
│   │   │   └── page.tsx
│   │   │       ├── 𝑓 revalidate
│   │   │       ├── 𝑓 generateMetadata
│   │   │       └── 𝑓 ProjectDetailPage (default)
│   │   └── page.tsx
│   │       ├── 𝑓 revalidate
│   │       ├── 𝑓 metadata
│   │       └── 𝑓 ProjectsPage (default)
│   ├── publications/
│   │   └── page.tsx
│   │       ├── 𝑓 revalidate
│   │       ├── 𝑓 metadata
│   │       └── 𝑓 PublicationsPage (default)
│   ├── security/
│   │   └── page.tsx
│   │       ├── 𝑓 metadata
│   │       └── 𝑓 SecurityPage (default)
│   ├── site-map/
│   │   └── page.tsx
│   │       ├── 𝑓 metadata
│   │       └── 𝑓 SitemapPage (default)
│   ├── skills/
│   │   └── page.tsx
│   │       ├── 𝑓 revalidate
│   │       ├── 𝑓 metadata
│   │       └── 𝑓 SkillsPage (default)
│   ├── speaking/
│   │   └── page.tsx
│   │       ├── 𝑓 revalidate
│   │       ├── 𝑓 metadata
│   │       └── 𝑓 SpeakingPage (default)
│   ├── testimonials/
│   │   └── page.tsx
│   │       ├── 𝑓 revalidate
│   │       ├── 𝑓 metadata
│   │       └── 𝑓 TestimonialsPage (default)
│   ├── timeline/
│   │   └── page.tsx
│   │       ├── 𝑓 revalidate
│   │       ├── 𝑓 metadata
│   │       └── 𝑓 TimelinePage (default)
│   ├── error.tsx
│   │   └── 𝑓 Error (default)
│   ├── icon.tsx
│   │   ├── 𝑓 runtime
│   │   ├── 𝑓 size
│   │   ├── 𝑓 contentType
│   │   └── 𝑓 Icon (default)
│   ├── layout.tsx
│   │   ├── 𝑓 generateMetadata
│   │   └── 𝑓 RootLayout (default)
│   ├── loading.tsx
│   │   └── 𝑓 Loading (default)
│   ├── manifest.ts
│   │   └── 𝑓 manifest (default)
│   ├── not-found.tsx
│   │   └── 𝑓 NotFound (default)
│   ├── page.tsx
│   │   ├── 𝑓 revalidate
│   │   └── 𝑓 HomePage (default)
│   ├── robots.ts
│   │   └── 𝑓 robots (default)
│   └── sitemap.ts
│       ├── 𝑓 revalidate
│       └── 𝑓 sitemap (default)
├── components/
│   ├── admin/
│   │   ├── AchievementsManager.tsx
│   │   │   └── 𝑓 AchievementsManager (default)
│   │   ├── AdminSearch.tsx
│   │   │   └── 𝑓 AdminSearch (default)
│   │   ├── AdminShell.tsx
│   │   │   └── 𝑓 AdminShell (default)
│   │   ├── AnalyticsCharts.tsx
│   │   │   └── 𝑓 AnalyticsCharts (default)
│   │   ├── AnalyticsDashboard.tsx
│   │   │   └── 𝑓 AnalyticsDashboard (default)
│   │   ├── AppearanceManager.tsx
│   │   │   └── 𝑓 AppearanceManager (default)
│   │   ├── BlogManager.tsx
│   │   │   └── 𝑓 BlogManager (default)
│   │   ├── CalendarManager.tsx
│   │   │   └── 𝑓 CalendarManager (default)
│   │   ├── CaseStudiesManager.tsx
│   │   │   └── 𝑓 CaseStudiesManager (default)
│   │   ├── CertificationsManager.tsx
│   │   │   └── 𝑓 CertificationsManager (default)
│   │   ├── ContactsManager.tsx
│   │   │   └── 𝑓 ContactsManager (default)
│   │   ├── DatePicker.tsx
│   │   │   └── 𝑓 DatePicker
│   │   ├── DocumentUpload.tsx
│   │   │   └── 𝑓 DocumentUpload (default)
│   │   ├── DownloadsManager.tsx
│   │   │   └── 𝑓 DownloadsManager (default)
│   │   ├── EditProjectForm.tsx
│   │   │   └── 𝑓 EditProjectForm (default)
│   │   ├── FinanceManager.tsx
│   │   │   └── 𝑓 FinanceManager (default)
│   │   ├── ImageUpload.tsx
│   │   │   └── 𝑓 ImageUpload (default)
│   │   ├── InfraCostEditor.tsx
│   │   │   └── 𝑓 InfraCostEditor (default)
│   │   ├── InitiativesManager.tsx
│   │   │   └── 𝑓 InitiativesManager (default)
│   │   ├── MediaLibrary.tsx
│   │   │   └── 𝑓 MediaLibrary (default)
│   │   ├── MediaPickerModal.tsx
│   │   │   └── 𝑓 MediaPickerModal (default)
│   │   ├── MermaidDiagram.tsx
│   │   │   └── 𝑓 MermaidDiagram (default)
│   │   ├── PagesManager.tsx
│   │   │   └── 𝑓 PagesManager (default)
│   │   ├── ProfilePhotoManager.tsx
│   │   │   └── 𝑓 AdminProfilePhotoManager (default)
│   │   ├── ProjectsTable.tsx
│   │   │   └── 𝑓 ProjectsTable (default)
│   │   ├── PublicationsManager.tsx
│   │   │   └── 𝑓 PublicationsManager (default)
│   │   ├── QuickEditHero.tsx
│   │   │   └── 𝑓 QuickEditHero (default)
│   │   ├── RealtimeNotifications.tsx
│   │   │   └── 𝑓 RealtimeNotifications (default)
│   │   ├── RichTextEditor.tsx
│   │   │   └── 𝑓 RichTextEditor (default)
│   │   ├── SettingsManager.tsx
│   │   │   └── 𝑓 SettingsManager (default)
│   │   ├── SkillsManager.tsx
│   │   │   └── 𝑓 SkillsManager (default)
│   │   ├── SortableRow.tsx
│   │   │   └── 𝑓 SortableRow
│   │   ├── SpeakingManager.tsx
│   │   │   └── 𝑓 SpeakingManager (default)
│   │   ├── TestimonialsManager.tsx
│   │   │   └── 𝑓 TestimonialsManager (default)
│   │   ├── TimelineManager.tsx
│   │   │   └── 𝑓 TimelineManager (default)
│   │   ├── UserInviteModal.tsx
│   │   │   └── 𝑓 UserInviteModal (default)
│   │   └── UsersManager.tsx
│   │       └── 𝑓 UsersManager (default)
│   ├── analytics/
│   │   └── ViewCounter.tsx
│   │       └── 𝑓 ViewCounter (default)
│   ├── animations/
│   │   ├── AnimatedSection.tsx
│   │   │   ├── 𝑓 AnimatedSection (default)
│   │   │   ├── 𝑓 AnimatedCard
│   │   │   ├── 𝑓 StaggeredContainer
│   │   │   └── 𝑓 StaggeredItem
│   │   ├── CountUp.tsx
│   │   │   └── 𝑓 CountUp (default)
│   │   ├── PageTransition.tsx
│   │   │   └── 𝑓 PageTransition (default)
│   │   ├── ParticleBackground.tsx
│   │   │   └── 𝑓 ParticleBackground (default)
│   │   ├── ScrollReveal.tsx
│   │   │   └── 𝑓 ScrollReveal (default)
│   │   └── TypewriterText.tsx
│   │       └── 𝑓 TypewriterText (default)
│   ├── budget/
│   │   ├── BudgetCharts.tsx
│   │   │   ├── 𝑓 BudgetVarianceChart
│   │   │   ├── 𝑓 BudgetTrendChart
│   │   │   └── 𝑓 PrintExportButton
│   │   └── FYCompareView.tsx
│   │       └── 𝑓 FYCompareView (default)
│   ├── chat/
│   │   ├── ChatWidget.tsx
│   │   │   └── 𝑓 ChatWidget (default)
│   │   ├── VoiceWidget copy.tsx
│   │   │   └── 𝑓 VoiceWidget (default)
│   │   └── VoiceWidget.tsx
│   │       └── 𝑓 VoiceWidget (default)
│   ├── executive/
│   │   ├── ExecutiveSummaryContent.tsx
│   │   │   └── 𝑓 ExecutiveSummaryContent (default)
│   │   ├── TestimonialsContent.tsx
│   │   │   └── 𝑓 TestimonialsContent (default)
│   │   └── TimelineContent.tsx
│   │       └── 𝑓 TimelineContent (default)
│   ├── finance/
│   │   └── FinanceCharts.tsx
│   │       └── 𝑓 FinanceCharts (default)
│   ├── forms/
│   │   └── ContactForm.tsx
│   │       └── 𝑓 ContactForm (default)
│   ├── home/
│   │   ├── HomeClientRouter.tsx
│   │   │   └── 𝑓 HomeClientRouter (default)
│   │   ├── HomeCompactCeramic.tsx
│   │   │   └── 𝑓 HomeCompactCeramic (default)
│   │   └── HomeLegacy.tsx
│   │       └── 𝑓 HomeLegacy (default)
│   ├── initiatives/
│   │   ├── InitiativesGrid.tsx
│   │   │   └── 𝑓 InitiativesGrid (default)
│   │   ├── InitiativesTimeline.tsx
│   │   │   └── 𝑓 InitiativesTimeline (default)
│   │   ├── InitiativesViewToggle.tsx
│   │   │   └── 𝑓 InitiativesViewToggle (default)
│   │   └── ProgramCard.tsx
│   │       └── 𝑓 ProgramCard (default)
│   ├── layout/
│   │   ├── Footer.tsx
│   │   │   └── 𝑓 Footer (default)
│   │   ├── LanguageProvider.tsx
│   │   │   ├── 𝑓 LanguageProvider
│   │   │   └── 𝑓 useLanguage
│   │   ├── LanguageSwitcher.tsx
│   │   │   └── 𝑓 LanguageSwitcher (default)
│   │   ├── Navbar.tsx
│   │   │   └── 𝑓 Navbar (default)
│   │   ├── NavbarCeramic.tsx
│   │   │   └── 𝑓 NavbarCeramic (default)
│   │   ├── NavbarClassic.tsx
│   │   │   └── 𝑓 NavbarClassic (default)
│   │   ├── NavbarMinimal.tsx
│   │   │   └── 𝑓 NavbarMinimal (default)
│   │   ├── NavbarPremium.tsx
│   │   │   └── 𝑓 NavbarPremium (default)
│   │   ├── NavbarSidebar.tsx
│   │   │   └── 𝑓 NavbarSidebar (default)
│   │   └── ProgressBar.tsx
│   │       └── 𝑓 ProgressBar (default)
│   ├── pdf/
│   │   └── DownloadPdfButton.tsx
│   │       └── 𝑓 DownloadPdfButton (default)
│   ├── projects/
│   │   ├── FeaturedProjectsFilter.tsx
│   │   │   └── 𝑓 FeaturedProjectsFilter (default)
│   │   ├── ProjectImageWithLightbox.tsx
│   │   │   └── 𝑓 ProjectImageWithLightbox (default)
│   │   └── ProjectsGrid.tsx
│   │       └── 𝑓 ProjectsGrid (default)
│   ├── search/
│   │   ├── CommandPalette.tsx
│   │   │   └── 𝑓 CommandPalette (default)
│   │   └── SearchProvider.tsx
│   │       └── 𝑓 SearchProvider (default)
│   ├── ui/
│   │   ├── Badge.tsx
│   │   │   └── 𝑓 Badge (default)
│   │   ├── Button.tsx
│   │   │   └── 𝑓 Button (default)
│   │   ├── Card.tsx
│   │   │   ├── 𝑓 Card (default)
│   │   │   ├── 𝑓 CardHeader
│   │   │   ├── 𝑓 CardTitle
│   │   │   ├── 𝑓 CardDescription
│   │   │   ├── 𝑓 CardContent
│   │   │   └── 𝑓 CardFooter
│   │   ├── ConfirmDialog.tsx
│   │   │   ├── 𝑓 ConfirmDialog (default)
│   │   │   └── 𝑓 useConfirmDialog
│   │   ├── CredlyBadge.tsx
│   │   │   └── 𝑓 CredlyBadge (default)
│   │   ├── ImageLightbox.tsx
│   │   │   └── 𝑓 ImageLightbox (default)
│   │   ├── Input.tsx
│   │   │   └── 𝑓 Input (default)
│   │   ├── Skeleton.tsx
│   │   │   └── 𝑓 Skeleton (default)
│   │   └── ToastProvider.tsx
│   │       ├── 𝑓 ToastProvider
│   │       └── 𝑓 useToast
│   ├── visuals/
│   │   ├── CostComparison.tsx
│   │   │   └── 𝑓 CostComparison (default)
│   │   ├── DeliveryGlobe.tsx
│   │   │   └── 𝑓 DeliveryGlobe (default)
│   │   ├── GlobalOperationsDashboard.tsx
│   │   │   └── 𝑓 GlobalOperationsDashboard (default)
│   │   ├── NetworkTopology.tsx
│   │   │   └── 𝑓 NetworkTopology (default)
│   │   ├── PingDashboard.tsx
│   │   │   └── 𝑓 PingDashboard (default)
│   │   ├── SecurityScorecard.tsx
│   │   │   └── 𝑓 SecurityScorecard (default)
│   │   ├── ServerStatusWidget.tsx
│   │   │   └── 𝑓 ServerStatusWidget (default)
│   │   ├── SkillsRadarChart.tsx
│   │   │   └── 𝑓 SkillsRadarChart (default)
│   │   ├── VideoPlayer.tsx
│   │   │   └── 𝑓 VideoPlayer (default)
│   │   └── WorldMap.tsx
│   │       └── 𝑓 default
│   ├── FeatureGate.tsx
│   │   └── 𝑓 FeatureGate (default)
│   ├── LanguageSwitcher.tsx
│   │   └── 𝑓 LanguageSwitcher (default)
│   ├── RetroToggle.tsx
│   │   └── 𝑓 RetroToggle (default)
│   ├── SettingsProvider.tsx
│   │   ├── 𝑓 SettingsProvider
│   │   └── 𝑓 useSettings
│   ├── ThemeProvider.tsx
│   │   ├── 𝑓 useTheme
│   │   └── 𝑓 ThemeProvider
│   ├── ThemeSwitcher.tsx
│   │   └── 𝑓 ThemeSwitcher (default)
│   └── VisitorTracker.tsx
│       └── 𝑓 VisitorTracker (default)
├── lib/
│   ├── data/
│   │   ├── achievements.ts
│   │   │   └── 𝑓 getAllAchievements
│   │   ├── architecture.ts
│   │   │   └── 𝑓 chartData
│   │   ├── certifications.ts
│   │   │   ├── 𝑓 getActiveCertifications
│   │   │   └── 𝑓 getAllCertifications
│   │   ├── content.test.ts
│   │   ├── content.ts
│   │   │   ├── 𝑓 getPageContent
│   │   │   ├── 𝑓 getContentField
│   │   │   └── 𝑓 getContentData
│   │   ├── finances.ts
│   │   │   ├── 𝑓 getAllBudgets
│   │   │   └── 𝑓 getFiscalYears
│   │   ├── initiatives.ts
│   │   │   ├── 𝑓 Initiative
│   │   │   ├── 𝑓 InitiativeWithProgram
│   │   │   ├── 𝑓 Program
│   │   │   ├── 𝑓 getAllPrograms
│   │   │   ├── 𝑓 getProgramByCode
│   │   │   ├── 𝑓 getAllInitiatives
│   │   │   ├── 𝑓 getAllInitiativesAdmin
│   │   │   ├── 𝑓 getInitiativeBySlug
│   │   │   ├── 𝑓 getInitiativesByProgram
│   │   │   ├── 𝑓 getAllFiscalYears
│   │   │   ├── 𝑓 getAllStrategicAreas
│   │   │   └── 𝑓 getInitiativeStats
│   │   ├── projects.ts
│   │   │   ├── 𝑓 getPublishedProjects
│   │   │   ├── 𝑓 getFeaturedProjects
│   │   │   ├── 𝑓 getProjectBySlug
│   │   │   └── 𝑓 getAllProjects
│   │   ├── settings.ts
│   │   │   ├── 𝑓 getAllSettings
│   │   │   ├── 𝑓 getSettingsByCategory
│   │   │   ├── 𝑓 getFeatureFlag
│   │   │   ├── 𝑓 getSetting
│   │   │   ├── 𝑓 updateSetting
│   │   │   ├── 𝑓 getFeatureFlags
│   │   │   └── 𝑓 getSiteSettingsMap
│   │   └── skills.ts
│   │       ├── 𝑓 getAllSkills
│   │       └── 𝑓 getSkillsByCategory
│   ├── i18n/
│   │   ├── translations/
│   │   │   ├── bn.ts
│   │   │   │   └── 𝑓 bn
│   │   │   ├── en.ts
│   │   │   │   └── 𝑓 en
│   │   │   └── hi.ts
│   │   │       └── 𝑓 hi
│   │   └── index.tsx
│   │       ├── 𝑓 useTranslation
│   │       └── 𝑓 I18nProvider
│   ├── supabase/
│   │   ├── client.ts
│   │   │   └── 𝑓 createClient
│   │   ├── error.ts
│   │   │   └── 𝑓 logDbError
│   │   ├── middleware.ts
│   │   │   └── 𝑓 updateSession
│   │   └── server.ts
│   │       └── 𝑓 createClient
│   ├── utils/
│   │   ├── currency.test.ts
│   │   └── currency.ts
│   │       ├── 𝑓 EXCHANGE_RATES_TO_INR
│   │       ├── 𝑓 AVAILABLE_CURRENCIES
│   │       ├── 𝑓 convertToINR
│   │       └── 𝑓 formatINR
│   └── database.types.ts
└── proxy.ts
    ├── 𝑓 proxy
    └── 𝑓 config
```

## Key Files & Directories

- **`src/app/`**: Next.js App Router root containing all frontend and backend API endpoints.
- **`src/app/admin/`**: Protected directory for the RBAC-secured admin portal.
- **`src/proxy.ts`**: Edge middleware responsible for RBAC validation, session refresh, and applying strict HTTP security headers.
- **`src/lib/database.types.ts`**: TypeScript definitions automatically synced from the Supabase schema to ensure type-safe database calls.
- **`src/lib/supabase/`**: Core configurations for Supabase SSR integrations, creating distinct clients for browser, server components, and middleware.
- **`src/components/admin/`**: Reusable React components designed exclusively for the admin CMS interface (editors, lists, uploaders).
- **`src/components/ui/`**: General, highly-reusable TailwindCSS UI components (buttons, modals, tooltips) used across both the public site and admin portal.
- **`src/lib/data/`**: Abstraction layer for backend queries. Wraps database interactions and enforces logic (like feature flag checks) before sending data to the UI.
- **`src/app/api/`**: Next.js Route Handlers exposing backend services for AI (Gemini), email (Resend), dynamic Open Graph images, and media streaming.


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

## Detailed Features

The MyPortalSC v2 platform includes a wide range of specialized modules, heavily controlled by an overarching server-side feature flag system.

### 1. Advanced Content Management System (CMS)
- **Rich Text & Media Integration:** Full WYSIWYG editing via Tiptap, with integrated Supabase Storage for drag-and-drop media uploads.
- **Dynamic Content Modules:** Portfolios, Blogs, Case Studies, Certifications, Timelines, and Speaking engagements, all modeled via PostgreSQL tables.
- **Drag-and-Drop Reordering:** Granular control of rendering order for skills, projects, and achievements utilizing `dnd-kit`.
- **Status Workflows:** Built-in draft, publish, and archive workflows per content type.

### 2. Enterprise-Grade Security & Authentication
- **Role-Based Access Control (RBAC):** Distinct `admin` and `super_admin` tiers controlled via Edge Middleware.
- **Secure Sessions:** Automated server-side session refreshes connected to Supabase Auth.
- **Edge Security Headers:** Strict CSP, HSTS with preloading, clickjacking, and XSS protection enabled on all routes natively.
- **Bot Protection:** Cloudflare Turnstile CAPTCHA protects form submissions and API endpoints.

### 3. AI & Interactive Modalities
- **AI Chatbot Assistant:** Streaming contextual conversations powered by Google Gemini and Vercel AI SDK.
- **Voice Capabilities:** Web Audio API and server-side processors drive an interactive AI voice widget.
- **Dynamic 3D Visuals:** React Three Fiber integrations offer high-performance WebGL animations such as spinning 3D globes and interactive particle backgrounds.

### 4. Developer Experience & Analytics
- **Toggleable Feature Flags:** 41+ flags govern sections, effects, and modules without requiring redeployments.
- **Multi-Theme Support:** 4 layout templates (Classic, Premium, Minimal, Executive) combined with 4 user-selectable color themes, and a specialized Retro CRT mode.
- **Integrated CRM & Telemetry:** Built in contact ingestion hooked to Resend for notification emails, complemented by custom on-platform pageview and visitor event tracking.


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

Switch between templates from **Admin → Settings → `site_template`**:

| Template | Description |
|:---|:---|
| `classic` | Default dark theme with electric green accents |
| `premium` / `glass` | Glassmorphism dark theme with translucent surfaces |
| `minimal` | Clean, light-mode UI with subtle blue accents |
| `executive` | Corporate navy & gold palette |

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

## Database Entities & Attributes

### `admin_users`

| Attribute | Type |
|:---|:---|
| `id` | `string` |
| `user_id` | `string` |
| `full_name` | `string` |
| `role` | `"admin" \| "super_admin"` |
| `created_at` | `string` |
| `updated_at` | `string` |

### `projects`

| Attribute | Type |
|:---|:---|
| `id` | `string` |
| `title` | `string` |
| `slug` | `string` |
| `short_description` | `string \| null` |
| `detailed_description` | `string \| null` |
| `status` | `"draft" \| "published" \| "archived"` |
| `domain` | `string[] \| null` |
| `technologies` | `string[] \| null` |
| `start_date` | `string \| null` |
| `end_date` | `string \| null` |
| `featured_image_url` | `string \| null` |
| `github_url` | `string \| null` |
| `duration` | `string \| null` |
| `is_published` | `boolean` |
| `published_at` | `string \| null` |
| `sort_order` | `number` |
| `live_url` | `string \| null` |
| `order_index` | `number` |
| `created_at` | `string` |
| `updated_at` | `string` |
| `created_by` | `string \| null` |
| `challenge` | `string \| null` |
| `approach` | `string \| null` |
| `architecture_notes` | `string \| null` |
| `outcome` | `string \| null` |
| `key_metrics` | `Json \| null` |

### `skills`

| Attribute | Type |
|:---|:---|
| `id` | `string` |
| `name` | `string` |
| `category` | `string` |
| `proficiency_level` | `number \| null` |
| `years_of_experience` | `number \| null` |
| `icon_url` | `string \| null` |
| `order_index` | `number` |
| `created_at` | `string` |
| `updated_at` | `string` |

### `certifications`

| Attribute | Type |
|:---|:---|
| `id` | `string` |
| `title` | `string` |
| `issuing_organization` | `string` |
| `issue_date` | `string` |
| `expiry_date` | `string \| null` |
| `credential_id` | `string \| null` |
| `credential_url` | `string \| null` |
| `badge_image_url` | `string \| null` |
| `status` | `"active" \| "expired" \| "archived"` |
| `created_at` | `string` |
| `updated_at` | `string` |

### `achievements`

| Attribute | Type |
|:---|:---|
| `id` | `string` |
| `title` | `string` |
| `description` | `string \| null` |
| `achievement_date` | `string` |
| `category` | `string \| null` |
| `icon_url` | `string \| null` |
| `order_index` | `number` |
| `created_at` | `string` |
| `updated_at` | `string` |

### `content_pages`

| Attribute | Type |
|:---|:---|
| `id` | `string` |
| `page_key` | `string` |
| `title` | `string` |
| `content` | `Json \| null` |
| `meta_description` | `string \| null` |
| `updated_at` | `string` |
| `updated_by` | `string \| null` |

### `page_analytics`

| Attribute | Type |
|:---|:---|
| `id` | `string` |
| `page_path` | `string` |
| `view_count` | `number` |
| `unique_visitors` | `number` |
| `last_viewed` | `string` |
| `created_at` | `string` |

### `audit_log`

| Attribute | Type |
|:---|:---|
| `id` | `string` |
| `table_name` | `string` |
| `operation` | `"INSERT" \| "UPDATE" \| "DELETE"` |
| `record_id` | `string` |
| `old_data` | `Json \| null` |
| `new_data` | `Json \| null` |
| `user_id` | `string \| null` |
| `timestamp` | `string` |



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
