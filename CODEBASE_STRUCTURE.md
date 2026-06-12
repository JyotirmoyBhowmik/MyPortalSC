# Codebase Structure

This document outlines the directory structure of the `src/` folder down to the function and object export level.

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
