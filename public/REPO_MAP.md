# Codebase Repository Map

> **Aider-Style Structural Outline**: Generated with Tree-Sitter syntax analysis.
> **Summary**: 289 source files | 33,432 lines of code | 604 symbols extracted.
> **Token Economy**: Function bodies and internal statements are elided to maximize AI reasoning context.

---

## Root Configuration & Entry

### `audit_flags.ts` (43 loc)
│    11: function getAllFiles(dirPath: string, arrayOfFiles: string[])

### `eslint.config.mjs` (51 loc)
│    (Declaration/data file with no top-level symbol definitions)

### `extract_docx.py` (59 loc)
│     6: def extract_text_from_docx(docx_path): ...

### `next.config copy.ts` (48 loc)
│    (Declaration/data file with no top-level symbol definitions)

### `next.config.ts` (59 loc)
│    (Declaration/data file with no top-level symbol definitions)

### `postcss.config.mjs` (11 loc)
│    (Declaration/data file with no top-level symbol definitions)

### `vitest.config.ts` (12 loc)
│    (Declaration/data file with no top-level symbol definitions)

## Core Libraries & Data Services (src/lib)

### `src/lib/data/achievements.ts` (23 loc)
│    10: export async function getAllAchievements(): Promise<Achievement[]>

### `src/lib/data/architecture.ts` (65 loc)
│    (Declaration/data file with no top-level symbol definitions)

### `src/lib/data/certifications.ts` (38 loc)
│    10: export async function getActiveCertifications(): Promise<Certification[]>
│    25: export async function getAllCertifications(): Promise<Certification[]>

### `src/lib/data/content.test.ts` (81 loc)
│    (Declaration/data file with no top-level symbol definitions)

### `src/lib/data/content.ts` (60 loc)
│    11: export async function getPageContent( pageKey: string ): Promise<ContentPage | null>
│    30: export function getContentField( content: Json | null | undefined, field: string ): string
│    47: export function getContentData( content: Json | null | undefined, field: string ): any

### `src/lib/data/finances.ts` (63 loc)
│     4: export interface DashboardBudget
│    27: export async function getAllBudgets(): Promise<DashboardBudget[]>
│    50: export async function getFiscalYears()

### `src/lib/data/initiatives.ts` (136 loc)
│    15: export async function getAllPrograms(): Promise<Program[]>
│    28: export async function getProgramByCode(code: string): Promise<Program | null>
│    41: export async function getAllInitiatives(): Promise<InitiativeWithProgram[]>
│    55: export async function getAllInitiativesAdmin(): Promise<InitiativeWithProgram[]>
│    69: export async function getInitiativeBySlug(slug: string): Promise<InitiativeWithProgram | null>
│    81: export async function getInitiativesByProgram(programId: string): Promise<InitiativeWithProgram[]>
│    95: export async function getAllFiscalYears(): Promise<string[]>
│   101: export async function getAllStrategicAreas(): Promise<string[]>
│   107: export async function getInitiativeStats()

### `src/lib/data/projects.ts` (71 loc)
│    10: export async function getPublishedProjects(): Promise<Project[]>
│    25: export async function getFeaturedProjects(limit = 3): Promise<Project[]>
│    41: export async function getProjectBySlug( slug: string ): Promise<Project | null>
│    58: export async function getAllProjects(): Promise<Project[]>

### `src/lib/data/settings.ts` (125 loc)
│    11: export interface SiteSetting
│    52: export async function getSettingsByCategory(category: string): Promise<SiteSetting[]>
│    61: export async function getFeatureFlag(key: string): Promise<boolean>
│    70: export async function getSetting(key: string): Promise<unknown>
│    81: export async function updateSetting(key: string, value: unknown)
│    94: export async function getFeatureFlags(): Promise<Record<string, boolean>>
│   111: export async function getSiteSettingsMap(): Promise<Record<string, unknown>>

### `src/lib/data/skills.ts` (39 loc)
│    10: export async function getAllSkills(): Promise<Skill[]>
│    25: export async function getSkillsByCategory(): Promise< Record<string, Skill[]> >

### `src/lib/database.types.ts` (363 loc)
│     6: export type Json = ...
│    14: export interface Database
│   317: export type Tables = ...
│   319: export type InsertTables = ...
│   321: export type UpdateTables = ...
│   325: export type Project = ...
│   326: export type Skill = ...
│   327: export type Certification = ...
│   328: export type Achievement = ...
│   329: export type ContentPage = ...
│   330: export type PageAnalytic = ...
│   331: export type AuditLogEntry = ...
│   332: export type AdminUser = ...
│   335: export type Program = ...
│   346: export type Initiative = ...
│   361: export type InitiativeWithProgram = ...

### `src/lib/i18n/index.tsx` (93 loc)
│    14: export type Locale = ...
│    24: interface I18nContextValue
│    43: export function useTranslation()
│    47: export function I18nProvider({ children }: { children: ReactNode }): React.JSX.Element

### `src/lib/i18n/translations/bn.ts` (89 loc)
│    (Declaration/data file with no top-level symbol definitions)

### `src/lib/i18n/translations/en.ts` (89 loc)
│    89: export type Translations = ...

### `src/lib/i18n/translations/hi.ts` (89 loc)
│    (Declaration/data file with no top-level symbol definitions)

### `src/lib/supabase/client.ts` (20 loc)
│     3: export function createClient()

### `src/lib/supabase/error.ts` (48 loc)
│     5: export function logDbError(context: string, error: any): void

### `src/lib/supabase/middleware.ts` (111 loc)
│     9: export async function updateSession(request: NextRequest)

### `src/lib/supabase/server.ts` (65 loc)
│     9: export async function createClient()
│    48: function createFallbackClient(url?: string, key?: string)

### `src/lib/utils/currency.test.ts` (54 loc)
│    (Declaration/data file with no top-level symbol definitions)

### `src/lib/utils/currency.ts` (26 loc)
│    15: export function convertToINR(amount: number, currency: string): number
│    20: export function formatINR(amount: number): string

## API Routes (src/app/api)

### `src/app/api/admin/quick-edit-hero/route.ts` (64 loc)
│     9: export async function POST(req: NextRequest)

### `src/app/api/assets/route.ts` (54 loc)
│    19: export async function GET(req: NextRequest)

### `src/app/api/audio/route.ts` (33 loc)
│    17: export async function GET()

### `src/app/api/chat/route.ts` (68 loc)
│    11: export async function POST(req: Request)

### `src/app/api/ephemeral-token/route.ts` (83 loc)
│    14: export async function GET()

### `src/app/api/gemini-token/route.ts` (12 loc)
│     3: export async function GET()

### `src/app/api/health/route.ts` (12 loc)
│     3: export async function GET()

### `src/app/api/media/[...path]/route.ts` (50 loc)
│     6: export async function GET( request: Request, { params }: { params: Promise<{ path: string[] }> } )

### `src/app/api/og/route.tsx` (77 loc)
│     5: export async function GET(request: Request)

### `src/app/api/security-check/route.ts` (98 loc)
│     3: export async function GET(request: Request)

### `src/app/api/send-email/route.ts` (44 loc)
│     5: export async function POST(request: Request)

### `src/app/api/storage/sign-upload/route.ts` (61 loc)
│     5: export async function POST(request: Request)

## UI & Visual Components (src/components)

### `src/components/AppearanceProvider.tsx` (69 loc)
│    11: export type TemplateName = ...
│    20: interface AppearanceContextValue
│    30: export function useAppearance()
│    34: export function AppearanceProvider({ children, initialTemplate = "classic", }: { children: ReactNode; initialTemplate?: TemplateName; })

### `src/components/FeatureGate.tsx` (23 loc)
│    13: interface Props
│    19: export async function FeatureGate({ feature, children, fallback }: Props)

### `src/components/LanguageSwitcher.tsx` (54 loc)
│     6: export function LanguageSwitcher()

### `src/components/RetroToggle.tsx` (61 loc)
│     6: export function RetroToggle()

### `src/components/SettingsProvider.tsx` (18 loc)
│    12: export function SettingsProvider({ settings, children }: { settings: Record<string, boolean>; children: ReactNode })
│    16: export function useSettings()

### `src/components/ThemeProvider.tsx` (170 loc)
│    11: export type ThemeName = ...
│    13: interface ThemeContextValue
│    39: export function useTheme()
│    43: export function ThemeProvider({ children, initialRetro = false }: { children: ReactNode; initialRetro?: boolean })

### `src/components/ThemeSwitcher.tsx` (70 loc)
│     6: export function ThemeSwitcher()

### `src/components/VisitorTracker.tsx` (120 loc)
│     7: interface ClickEvent
│    19: export function VisitorTracker()

### `src/components/admin/AchievementsManager.tsx` (180 loc)
│    14: export function AchievementsManager({ achievements, }: { achievements: Achievement[]; })

### `src/components/admin/AdminSearch.tsx` (119 loc)
│    10: interface SidebarLink
│    17: interface SidebarSection
│    22: interface AdminSearchProps
│    26: export function AdminSearch({ sections }: AdminSearchProps)

### `src/components/admin/AdminShell.tsx` (537 loc)
│   300: function getBreadcrumbs(pathname: string): { label: string; href: string }[]
│   313: export function AdminShell({ children, allowAdminSearch = false, enableRbac = false, }: { children: React.ReactNode; allowAdminSearch?: boolean; enableRbac?: boolean; })

### `src/components/admin/AnalyticsCharts.tsx` (114 loc)
│    19: type TimeSeriesData = ...
│    20: type DeviceData = ...
│    21: type PageData = ...
│    23: interface AnalyticsChartsProps
│    31: export function AnalyticsCharts({ timeSeries, deviceStats, topPages }: AnalyticsChartsProps)

### `src/components/admin/AnalyticsDashboard.tsx` (145 loc)
│     6: interface ClickEvent
│    13: interface TrafficEvent
│    20: interface AnalyticsDashboardProps
│    26: export function AnalyticsDashboard({ clickEvents, pageAnalytics, recentContacts }: AnalyticsDashboardProps)

### `src/components/admin/AppearanceManager.tsx` (383 loc)
│    77: export function AppearanceManager({ currentIcon, currentTemplate }: { currentIcon: string; currentTemplate: string; })

### `src/components/admin/BlogManager.tsx` (202 loc)
│    11: interface Post
│    24: export function BlogManager({ posts }: { posts: Post[] })

### `src/components/admin/CalendarManager.tsx` (145 loc)
│    10: export interface FiscalYear
│    18: interface Props
│    22: export function CalendarManager({ fiscalYears }: Props)

### `src/components/admin/CaseStudiesManager.tsx` (195 loc)
│     9: interface CaseStudy
│    24: export function CaseStudiesManager({ cases }: { cases: CaseStudy[] })

### `src/components/admin/CertificationsManager.tsx` (196 loc)
│    15: const CertForm = (({ cert, onSubmit, onCancel, loading }: { cert?: Certification; onSubmit: (e: React.FormEvent<HTMLFormElement>) => void; onCancel: () => void; loading?: boolean; })) => ...
│    55: export function CertificationsManager({ certifications, }: { certifications: Certification[]; })

### `src/components/admin/ContactsManager.tsx` (146 loc)
│     7: export function ContactsManager({ contacts, showAnalytics = false }: { contacts: any[]; showAnalytics?: boolean })

### `src/components/admin/DatePicker.tsx` (53 loc)
│     8: interface DatePickerProps
│    14: export function DatePicker({ date, setDate, className }: DatePickerProps)

### `src/components/admin/DocumentUpload.tsx` (136 loc)
│     5: interface Document
│    11: interface DocumentUploadProps
│    19: export function DocumentUpload({ value = [], onChange, onRemove, bucketName = "project-assets", folderPath = "projects/documents", }: DocumentUploadProps)

### `src/components/admin/DownloadsManager.tsx` (149 loc)
│     7: interface Download
│    19: export function DownloadsManager({ downloads }: { downloads: Download[] })

### `src/components/admin/EditProjectForm.tsx` (233 loc)
│    11: export function EditProjectForm({ project }: { project: Project })

### `src/components/admin/FinanceManager.tsx` (383 loc)
│    12: interface SelectOption
│    17: interface Props
│    26: export function FinanceManager({ budgets, projects, initiatives, skills, fiscalYears, currencies }: Props)

### `src/components/admin/ImageUpload.tsx` (114 loc)
│     6: interface ImageUploadProps
│    14: export function ImageUpload({ value, onChange, onRemove, bucketName = "project-assets", folderPath = "projects/images", }: ImageUploadProps)

### `src/components/admin/InfraCostEditor.tsx` (181 loc)
│     7: interface CostCategory
│    16: interface Props
│    21: export function InfraCostEditor({ initialConfig, settingKey }: Props)

### `src/components/admin/InitiativesManager.tsx` (450 loc)
│    30: interface InitiativesManagerProps
│    52: export function InitiativesManager({ initiatives, programs, allowDragDrop = true, }: InitiativesManagerProps)

### `src/components/admin/MediaLibrary.tsx` (208 loc)
│     9: export interface MediaItem
│    18: interface MediaLibraryProps
│    24: export function MediaLibrary({ initialMedia, onSelect, selectable = false }: MediaLibraryProps)

### `src/components/admin/MediaPickerModal.tsx` (55 loc)
│     7: interface MediaPickerModalProps
│    12: export function MediaPickerModal({ onSelect, onClose }: MediaPickerModalProps)

### `src/components/admin/MermaidDiagram.tsx` (261 loc)
│    10: interface MermaidDiagramProps
│    15: export function MermaidDiagram({ chart, id = "mermaid-diagram" }: MermaidDiagramProps)

### `src/components/admin/PagesManager.tsx` (204 loc)
│    15: export function PagesManager({ initialAbout, initialContact, allowVersioning = false, allowScheduledPublish = false, }: { initialAbout: Record<string, any>; initialContact: Record<string, any>; allowVersioning?: boolean; allowScheduledPublish?: boolean; })

### `src/components/admin/ProfilePhotoManager.tsx` (229 loc)
│    13: interface Props
│    17: export function AdminProfilePhotoManager({ currentPhotoUrl }: Props)

### `src/components/admin/ProjectsTable.tsx` (248 loc)
│    29: export function ProjectsTable({ projects: initialProjects, allowDragDrop = true, allowBulkActions = false, }: { projects: Project[]; allowDragDrop?: boolean; allowBulkActions?: boolean; })

### `src/components/admin/PublicationsManager.tsx` (147 loc)
│     7: interface Publication
│    18: export function PublicationsManager({ publications }: { publications: Publication[] })

### `src/components/admin/QuickEditHero.tsx` (153 loc)
│    12: interface Props
│    18: export function QuickEditHero({ initialTitle, initialSubtitle, initialDescription }: Props)

### `src/components/admin/RealtimeNotifications.tsx` (98 loc)
│     7: interface Notification
│    13: export function RealtimeNotifications()

### `src/components/admin/RichTextEditor.tsx` (161 loc)
│    10: interface RichTextEditorProps
│    16: export function RichTextEditor({ content, onChange, minHeight = "min-h-[300px]" }: RichTextEditorProps)
│   147: function MenuButton({ onClick, isActive, label, title }: { onClick: () => void; isActive: boolean; label: string; title: string })

### `src/components/admin/SettingsManager.tsx` (317 loc)
│   101: interface Props
│   105: export function SettingsManager({ grouped }: Props)

### `src/components/admin/SkillsManager.tsx` (252 loc)
│    27: export function SkillsManager({ skills, allowDragDrop = true, allowBulkActions = false, }: { skills: Skill[]; allowDragDrop?: boolean; allowBulkActions?: boolean; })

### `src/components/admin/SortableRow.tsx` (43 loc)
│     6: interface SortableRowProps
│    13: export function SortableRow({ id, children, className = "", disabled = false }: SortableRowProps)

### `src/components/admin/SpeakingManager.tsx` (174 loc)
│     8: interface SpeakingEvent
│    21: export function SpeakingManager({ events }: { events: SpeakingEvent[] })

### `src/components/admin/TestimonialsManager.tsx` (198 loc)
│    11: interface Testimonial
│    25: export function TestimonialsManager({ testimonials }: { testimonials: Testimonial[] })

### `src/components/admin/TimelineManager.tsx` (195 loc)
│    11: interface TimelineEntry
│    29: export function TimelineManager({ entries }: { entries: TimelineEntry[] })

### `src/components/admin/UserInviteModal.tsx` (115 loc)
│     6: interface UserInviteModalProps
│    11: export function UserInviteModal({ isOpen, onClose }: UserInviteModalProps)

### `src/components/admin/UsersManager.tsx` (130 loc)
│    10: interface AdminUser
│    18: interface UsersManagerProps
│    22: export function UsersManager({ users }: UsersManagerProps)

### `src/components/analytics/ViewCounter.tsx` (45 loc)
│    31: export async function ViewCounter()

### `src/components/animations/AnimatedSection.tsx` (92 loc)
│     6: interface AnimatedSectionProps
│    12: export function AnimatedSection({ children, className = "", delay = 0 }: AnimatedSectionProps)
│    26: export function AnimatedCard({ children, className = "", delay = 0 }: AnimatedSectionProps)
│    63: interface StaggeredContainerProps
│    68: export function StaggeredContainer({ children, className = "" }: StaggeredContainerProps)
│    82: export function StaggeredItem({ children, className = "" }: StaggeredContainerProps)

### `src/components/animations/CountUp.tsx` (63 loc)
│     6: interface CountUpProps
│    15: export function CountUp({ end, duration = 2, suffix = "", prefix = "", className = "", decimals = 0, }: CountUpProps)

### `src/components/animations/PageTransition.tsx` (26 loc)
│     6: export function PageTransition({ children, enabled }: { children: React.ReactNode; enabled: boolean })

### `src/components/animations/ParticleBackground.tsx` (96 loc)
│     5: interface Props
│    10: export function ParticleBackground({ className = "", rgbColor = "99, 220, 163" }: Props)

### `src/components/animations/ScrollReveal.tsx` (51 loc)
│     6: interface Props
│    13: export function ScrollReveal({ children, className = "", delay = 0, direction = "up" }: Props)

### `src/components/animations/TypewriterText.tsx` (64 loc)
│     5: interface TypewriterTextProps
│    13: export function TypewriterText({ texts, typingSpeed = 80, deletingSpeed = 40, pauseDuration = 2000, className = "", }: TypewriterTextProps)

### `src/components/budget/BudgetCharts.tsx` (148 loc)
│    15: interface FYData
│    24: function fmtLakhs(val: number): string
│    31: function CustomTooltip({ active, payload, label }: any)
│    47: export function BudgetVarianceChart({ data }: { data: FYData[] })
│    94: export function BudgetTrendChart({ data }: { data: FYData[] })
│   135: export function PrintExportButton()

### `src/components/budget/FYCompareView.tsx` (155 loc)
│     7: interface Props
│    14: export function FYCompareView({ allBudgets, fiscalYears, defaultFy1, defaultFy2 }: Props)

### `src/components/chat/ChatWidget.tsx` (191 loc)
│     6: interface Message
│    12: export function ChatWidget()

### `src/components/chat/VoiceWidget copy.tsx` (481 loc)
│    21: function base64ToUint8Array(base64: string)
│    31: function executeAction(actionName: string, args?: any)
│    73: type VoiceStatus = ...
│    78: export function VoiceWidget()

### `src/components/chat/VoiceWidget.tsx` (461 loc)
│    16: function base64ToUint8Array(base64: string)
│    27: interface ActionArgs
│    36: function executeAction(actionName: string, args?: ActionArgs)
│    90: type VoiceStatus = ...
│    92: export function VoiceWidget()

### `src/components/executive/ExecutiveSummaryContent.tsx` (198 loc)
│    15: interface KPI
│    26: interface Testimonial
│    37: interface Props
│    45: function AnimatedCounter({ value, suffix }: { value: string; suffix: string | null })
│    89: export function ExecutiveSummaryContent({ kpis, testimonials, budgets = [], allowPdf }: Props)

### `src/components/executive/TestimonialsContent.tsx` (64 loc)
│     5: interface Testimonial
│    16: export function TestimonialsContent({ testimonials }: { testimonials: Testimonial[] })

### `src/components/executive/TimelineContent.tsx` (107 loc)
│     5: interface TimelineEntry
│    34: export function TimelineContent({ entries }: { entries: TimelineEntry[] })

### `src/components/finance/FinanceCharts.tsx` (133 loc)
│     7: interface Props
│    11: export function FinanceCharts({ budgets }: Props)

### `src/components/forms/ContactForm.tsx` (143 loc)
│     8: export function ContactForm()

### `src/components/home/HomeClientRouter.tsx` (35 loc)
│     7: interface HomeClientRouterProps
│    24: export function HomeClientRouter(props: HomeClientRouterProps)

### `src/components/home/HomeCompactCeramic.tsx` (433 loc)
│    12: interface HomeCompactCeramicProps
│    28: export function HomeCompactCeramic(props: HomeCompactCeramicProps)

### `src/components/home/HomeLegacy.tsx` (432 loc)
│    14: interface HomeLegacyProps
│    28: export function HomeLegacy(props: HomeLegacyProps)

### `src/components/initiatives/InitiativesGrid.tsx` (213 loc)
│     7: interface InitiativeItem
│    18: interface InitiativesGridProps
│    39: export function InitiativesGrid({ initiatives, programs, fiscalYears, }: InitiativesGridProps)

### `src/components/initiatives/InitiativesTimeline.tsx` (142 loc)
│     6: interface Initiative
│    16: interface Props
│    27: export function InitiativesTimeline({ initiatives }: Props)

### `src/components/initiatives/InitiativesViewToggle.tsx` (78 loc)
│     8: interface InitiativeItem
│    19: interface Props
│    26: type ViewMode = ...
│    28: export function InitiativesViewToggle({ initiatives, programs, fiscalYears, strategicAreas }: Props)

### `src/components/initiatives/ProgramCard.tsx` (102 loc)
│     7: interface Initiative
│    14: interface ProgramWithInitiatives
│    24: export function ProgramCard({ program }: { program: ProgramWithInitiatives })

### `src/components/layout/Footer.tsx` (150 loc)
│    44: export function Footer({ flags = {} }: { flags?: Record<string, boolean> })

### `src/components/layout/LanguageProvider.tsx` (53 loc)
│     5: type Locale = ...
│     7: interface LanguageContextType
│    16: export function LanguageProvider({ children }: { children: React.ReactNode })
│    47: export function useLanguage()

### `src/components/layout/LanguageSwitcher.tsx` (48 loc)
│     5: export function LanguageSwitcher({ collapsed = false }: { collapsed?: boolean })

### `src/components/layout/Navbar.tsx` (22 loc)
│    12: export function Navbar({ settings = {} }: { settings?: Record<string, unknown> })

### `src/components/layout/NavbarCeramic.tsx` (143 loc)
│    20: export function NavbarCeramic({ flags }: { flags: Record<string, boolean> })

### `src/components/layout/NavbarClassic.tsx` (149 loc)
│     9: export function NavbarClassic({ flags = {} }: { flags?: Record<string, boolean> })

### `src/components/layout/NavbarMinimal.tsx` (88 loc)
│    19: export function NavbarMinimal({ flags = {} }: { flags?: Record<string, boolean> })

### `src/components/layout/NavbarPremium.tsx` (104 loc)
│     9: export function NavbarPremium({ flags = {} }: { flags?: Record<string, boolean> })

### `src/components/layout/NavbarSidebar.tsx` (332 loc)
│    28: interface NavLink
│    34: interface NavGroup
│    39: type ScreenSize = ...
│    41: export function NavbarSidebar({ flags = {} }: { flags?: Record<string, boolean> })

### `src/components/layout/ProgressBar.tsx` (19 loc)
│     5: export function ProgressBar()

### `src/components/pdf/DownloadPdfButton.tsx` (32 loc)
│     6: interface DownloadPdfButtonProps
│    11: export function DownloadPdfButton({ contentRef, fileName = "executive-summary.pdf" }: DownloadPdfButtonProps)

### `src/components/projects/FeaturedProjectsFilter.tsx` (128 loc)
│    11: export function FeaturedProjectsFilter({ projects }: { projects: Project[] })

### `src/components/projects/ProjectImageWithLightbox.tsx` (35 loc)
│     7: interface ProjectImageWithLightboxProps
│    13: export function ProjectImageWithLightbox({ src, alt, className = "" }: ProjectImageWithLightboxProps)

### `src/components/projects/ProjectsGrid.tsx` (235 loc)
│     9: interface ProjectsGridProps
│    13: export function ProjectsGrid({ projects }: ProjectsGridProps)

### `src/components/search/CommandPalette.tsx` (164 loc)
│     6: interface SearchItem
│    14: interface Props
│    18: export function CommandPalette({ items }: Props)

### `src/components/search/SearchProvider.tsx` (41 loc)
│    16: export async function SearchProvider()

### `src/components/ui/Badge.tsx` (37 loc)
│     3: type BadgeVariant = ...
│     5: interface BadgeProps
│    20: export function Badge({ children, variant = "default", className = "", }: BadgeProps)

### `src/components/ui/Button.tsx` (101 loc)
│     6: type ButtonVariant = ...
│     7: type ButtonSize = ...
│     9: interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>
│    33: export function Button({ variant = "primary", size = "md", isLoading = false, children, className = "", disabled, ...props }: ButtonProps)

### `src/components/ui/Card.tsx` (93 loc)
│     3: interface CardProps
│    11: export function Card({ children, className = "", hover = true, glow = false, gradient = false, }: CardProps)
│    33: export function CardHeader({ children, className = "", }: { children: React.ReactNode; className?: string; })
│    43: export function CardTitle({ children, className = "", }: { children: React.ReactNode; className?: string; })
│    57: export function CardDescription({ children, className = "", }: { children: React.ReactNode; className?: string; })
│    71: export function CardContent({ children, className = "", }: { children: React.ReactNode; className?: string; })
│    81: export function CardFooter({ children, className = "", }: { children: React.ReactNode; className?: string; })

### `src/components/ui/ConfirmDialog.tsx` (148 loc)
│     5: interface ConfirmDialogProps
│    34: export function ConfirmDialog({ open, title = "Are you sure?", message, confirmLabel = "Confirm", cancelLabel = "Cancel", variant = "danger", onConfirm, onCancel, }: ConfirmDialogProps)
│   107: export function useConfirmDialog()

### `src/components/ui/CredlyBadge.tsx` (62 loc)
│    13: interface CredlyBadgeProps
│    21: export function CredlyBadge({ badgeId, width = 150, height = 270, className = "", showPublicLink = true, }: CredlyBadgeProps)

### `src/components/ui/ImageLightbox.tsx` (138 loc)
│     7: interface ImageLightboxProps
│    14: export function ImageLightbox({ images, startIndex = 0, isOpen, onClose }: ImageLightboxProps)

### `src/components/ui/Input.tsx` (35 loc)
│     3: interface InputProps extends React.InputHTMLAttributes<HTMLInputElement>

### `src/components/ui/Skeleton.tsx` (22 loc)
│     1: export function Skeleton({ className = "", width, height, }: { className?: string; width?: string; height?: string; })

### `src/components/ui/ToastProvider.tsx` (77 loc)
│     6: export type ToastType = ...
│     8: interface Toast
│    14: interface ToastContextType
│    20: export function ToastProvider({ children }: { children: ReactNode })
│    71: export function useToast()

### `src/components/visual-graph/ArchitectureGraph.tsx` (707 loc)
│     6: export interface GraphNode extends d3.SimulationNodeDatum
│    35: export interface GraphEdge extends d3.SimulationLinkDatum<GraphNode>
│    43: export interface GraphGroup
│    50: export interface GraphData
│    63: export function ArchitectureGraph()

### `src/components/visual-graph/RepoMapViewer.tsx` (198 loc)
│     5: export function RepoMapViewer({ initialContent = "" }: { initialContent?: string })

### `src/components/visuals/CostComparison.tsx` (133 loc)
│     6: interface CostCategory
│    32: export function CostComparison({ initialCategories }: { initialCategories?: CostCategory[] })

### `src/components/visuals/DeliveryGlobe.tsx` (139 loc)
│     8: function Arc({ start, end }: { start: [number, number, number]; end: [number, number, number] })
│    54: function Earth()
│    83: export function DeliveryGlobe()

### `src/components/visuals/GlobalOperationsDashboard.tsx` (159 loc)
│    11: type TabId = ...
│    13: export function GlobalOperationsDashboard()
│   107: function MetricCard({ title, value, subtitle, icon, delay }: { title: string; value: string; subtitle: string; icon: string; delay: number })
│   124: function NOCRadar()

### `src/components/visuals/NetworkTopology.tsx` (183 loc)
│     6: interface TopoNode
│    18: interface TopoLink
│    57: export function NetworkTopology()

### `src/components/visuals/PingDashboard.tsx` (140 loc)
│     5: interface PingResult
│    13: export function PingDashboard()

### `src/components/visuals/SecurityScorecard.tsx` (146 loc)
│     6: interface SecurityCheck
│    15: interface SecurityData
│    31: export function SecurityScorecard()

### `src/components/visuals/ServerStatusWidget.tsx` (93 loc)
│     6: export function ServerStatusWidget()

### `src/components/visuals/SkillsRadarChart.tsx` (154 loc)
│    16: interface SkillCategory
│    22: interface SkillsRadarChartProps
│    26: export function SkillsRadarChart({ data }: SkillsRadarChartProps)

### `src/components/visuals/VideoPlayer.tsx` (54 loc)
│     5: interface VideoPlayerProps
│    11: export function VideoPlayer({ src, poster, className = "" }: VideoPlayerProps)

### `src/components/visuals/WorldMap.tsx` (100 loc)
│    24: const WorldMap = (()) => ...

## App Pages & Layouts (src/app)

### `src/app/about/page.tsx` (540 loc)
│   113: export async function AboutPage()

### `src/app/blog/[slug]/page.tsx` (101 loc)
│     9: export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata>
│    46: export async function BlogPostPage({ params }: { params: Promise<{ slug: string }> })

### `src/app/blog/page.tsx` (78 loc)
│    14: export async function BlogPage()

### `src/app/budget/compare/page.tsx` (54 loc)
│    14: export async function FYComparePage()

### `src/app/budget/cost-center/[slug]/page.tsx` (155 loc)
│     8: export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata>
│    18: function toINR(b: { exchange_rate_to_inr?: number, currency?: string, expense_amount: number }): number
│    25: const renderStatusDot = ((status: string | undefined)) => ...
│    32: export async function CostCenterPage({ params }: { params: { slug: string } })

### `src/app/budget/loading.tsx` (49 loc)
│     1: export function BudgetLoading()

### `src/app/budget/page.tsx` (412 loc)
│    16: function categorize(b: DashboardBudget): "capex_project" | "capex_regular" | "opex_project" | "opex_regular"
│    23: function toINR(b: DashboardBudget): number
│    29: function planINR(b: DashboardBudget): number
│    36: function fmtLakhs(n: number): string
│    50: const renderStatusDot = ((status: string | undefined)) => ...
│    57: export async function BudgetPage({ searchParams }: { searchParams: Promise<{ role?: string; forecast?: string }> })

### `src/app/case-studies/[slug]/page.tsx` (115 loc)
│    10: export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata>
│    47: export async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> })

### `src/app/case-studies/page.tsx` (82 loc)
│    14: export async function CaseStudiesPage()

### `src/app/contact/page.tsx` (219 loc)
│    52: export async function ContactPage()

### `src/app/debug/page.tsx` (40 loc)
│     5: export async function DebugPage()

### `src/app/deception-and-device-abuse/page.tsx` (104 loc)
│     8: export function DeceptionAndDeviceAbusePage()

### `src/app/downloads/page.tsx` (80 loc)
│    12: export async function DownloadsPage()

### `src/app/error.tsx` (31 loc)
│    10: export function Error({ error, reset, }: { error: Error & { digest?: string }; reset: () => void; })

### `src/app/executive-summary/page.tsx` (40 loc)
│    14: export async function ExecutiveSummaryPage()

### `src/app/icon.tsx` (41 loc)
│    14: export function Icon()

### `src/app/initiatives/[slug]/page.tsx` (239 loc)
│    13: interface Props
│    17: export async function generateMetadata({ params }: Props): Promise<Metadata>
│    34: function toINR(b: any): number
│    41: export async function InitiativeDetailPage({ params }: Props)

### `src/app/initiatives/loading.tsx` (37 loc)
│     1: export function InitiativesLoading()

### `src/app/initiatives/page.tsx` (184 loc)
│    22: function toINR(b: any): number
│    29: export async function InitiativesPage()

### `src/app/initiatives/programs/page.tsx` (77 loc)
│    18: export async function ProgramsPage()

### `src/app/layout.test.tsx` (21 loc)
│    (Declaration/data file with no top-level symbol definitions)

### `src/app/layout.tsx` (166 loc)
│    42: export async function generateMetadata(): Promise<Metadata>
│    96: export async function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>)

### `src/app/loading.tsx` (24 loc)
│     1: export function Loading()

### `src/app/manifest.ts` (22 loc)
│     7: export function manifest(): MetadataRoute.Manifest

### `src/app/not-found.tsx` (70 loc)
│     5: export function NotFound()

### `src/app/page.tsx` (80 loc)
│    14: export async function HomePage()

### `src/app/privacy/page.tsx` (108 loc)
│     8: export function PrivacyPage()

### `src/app/projects/[slug]/page.tsx` (294 loc)
│    10: interface KeyMetric
│    16: interface Props
│    20: export async function generateMetadata({ params }: Props): Promise<Metadata>
│    40: export async function ProjectDetailPage({ params }: Props)

### `src/app/projects/page.tsx` (44 loc)
│    13: export async function ProjectsPage()

### `src/app/publications/page.tsx` (78 loc)
│    12: export async function PublicationsPage()

### `src/app/robots.ts` (20 loc)
│     7: export function robots(): MetadataRoute.Robots

### `src/app/security/page.tsx` (56 loc)
│    21: export async function SecurityPage()

### `src/app/site-map/page.tsx` (105 loc)
│    45: export function SitemapPage()

### `src/app/sitemap.ts` (93 loc)
│    13: export async function sitemap(): Promise<MetadataRoute.Sitemap>

### `src/app/skills/page.tsx` (80 loc)
│    11: export async function SkillsPage()

### `src/app/speaking/page.tsx` (88 loc)
│    12: export async function SpeakingPage()

### `src/app/testimonials/page.tsx` (31 loc)
│    13: export async function TestimonialsPage()

### `src/app/timeline/page.tsx` (31 loc)
│    13: export async function TimelinePage()

### `src/app/visual-graph/layout.tsx` (14 loc)
│     8: export function VisualGraphLayout({ children, }: { children: React.ReactNode; })

### `src/app/visual-graph/page.tsx` (96 loc)
│     8: export function VisualGraphPage()

## Admin Portal (src/app/admin)

### `src/app/admin/achievements/page.tsx` (7 loc)
│     4: export async function AdminAchievementsPage()

### `src/app/admin/actions/achievements.ts` (34 loc)
│     7: export async function createAchievement( data: Omit<InsertTables<"achievements">, "id" | "created_at" | "updated_at"> )
│    17: export async function updateAchievement( id: string, data: UpdateTables<"achievements"> )
│    28: export async function deleteAchievement(id: string)

### `src/app/admin/actions/appearance.ts` (83 loc)
│     6: export async function uploadSiteIcon(formData: FormData)
│    69: export async function resetSiteIcon()

### `src/app/admin/actions/calendar.ts` (44 loc)
│     6: export async function createFiscalYear(formData: FormData)
│    29: export async function deleteFiscalYear(id: string)

### `src/app/admin/actions/certifications.ts` (34 loc)
│     7: export async function createCertification( data: Omit<InsertTables<"certifications">, "id" | "created_at" | "updated_at"> )
│    17: export async function updateCertification( id: string, data: UpdateTables<"certifications"> )
│    28: export async function deleteCertification(id: string)

### `src/app/admin/actions/contact.ts` (167 loc)
│    12: function checkRateLimit(ip: string): boolean
│    28: export async function submitContactForm(formData: FormData)
│   129: export async function replyToContact(id: string, email: string, name: string, replyMessage: string)

### `src/app/admin/actions/downloads.ts` (44 loc)
│     6: export async function createDownload(formData: FormData)
│    22: export async function updateDownload(id: string, formData: FormData)
│    38: export async function deleteDownload(id: string)

### `src/app/admin/actions/enterprise.ts` (170 loc)
│     8: function isValidDate(dateString: string | null): boolean
│    14: export async function createBlogPost(formData: FormData)
│    43: export async function updateBlogPost(id: string, formData: FormData)
│    75: export async function deleteBlogPost(id: string)
│    85: export async function createCaseStudy(formData: FormData)
│   116: export async function updateCaseStudy(id: string, formData: FormData)
│   145: export async function deleteCaseStudy(id: string)
│   154: export async function updateContactStatus(id: string, status: string, notes?: string)
│   164: export async function deleteContact(id: string)

### `src/app/admin/actions/finance.ts` (131 loc)
│     6: export async function createBudget(formData: FormData)
│    62: export async function updateBudget(id: string, formData: FormData)
│   117: export async function deleteBudget(id: string)

### `src/app/admin/actions/initiatives.ts` (200 loc)
│     8: export async function createInitiative(formData: FormData)
│    43: export async function updateInitiative(id: string, formData: FormData)
│    79: export async function deleteInitiative(id: string)
│    98: export async function createProgram(formData: FormData)
│   118: export async function updateProgram(id: string, formData: FormData)
│   141: export async function deleteProgram(id: string)
│   158: export async function reorderInitiatives( orderedIds: { id: string; sort_order: number }[] )
│   180: export async function reorderPrograms( orderedIds: { id: string; sort_order: number }[] )

### `src/app/admin/actions/media.ts` (148 loc)
│     7: export async function uploadMedia(formData: FormData)
│    67: export async function registerMedia(formData: FormData)
│   115: export async function deleteMedia(id: string, storagePath: string)
│   144: export async function getMedia()

### `src/app/admin/actions/pages.ts` (52 loc)
│     6: export async function updatePageContent(pageKey: string, newContent: Record<string, unknown>)

### `src/app/admin/actions/projects.ts` (85 loc)
│     7: export async function createProject( data: Omit<InsertTables<"projects">, "id" | "created_at" | "updated_at"> )
│    26: export async function updateProject( id: string, data: UpdateTables<"projects"> )
│    43: export async function deleteProject(id: string)
│    57: export async function toggleProjectStatus( id: string, currentStatus: string )
│    65: export async function reorderProjects( orderedIds: { id: string; sort_order: number }[] )

### `src/app/admin/actions/publications.ts` (44 loc)
│     6: export async function createPublication(formData: FormData)
│    22: export async function updatePublication(id: string, formData: FormData)
│    38: export async function deletePublication(id: string)

### `src/app/admin/actions/settings.ts` (58 loc)
│     6: export async function toggleFeature(key: string, enabled: boolean)
│    33: export async function updateSettingValue(key: string, value: unknown)

### `src/app/admin/actions/skills.ts` (57 loc)
│     7: export async function createSkill( data: Omit<InsertTables<"skills">, "id" | "created_at" | "updated_at"> )
│    18: export async function updateSkill( id: string, data: UpdateTables<"skills"> )
│    30: export async function deleteSkill(id: string)
│    39: export async function reorderSkills( orderedIds: { id: string; sort_order: number }[] )

### `src/app/admin/actions/speaking.ts` (48 loc)
│     6: export async function createSpeakingEvent(formData: FormData)
│    24: export async function updateSpeakingEvent(id: string, formData: FormData)
│    42: export async function deleteSpeakingEvent(id: string)

### `src/app/admin/actions/testimonials.ts` (146 loc)
│     6: export async function createTestimonial(formData: FormData)
│    26: export async function updateTestimonial(id: string, formData: FormData)
│    46: export async function deleteTestimonial(id: string)
│    56: export async function createTimelineEntry(formData: FormData)
│    78: export async function updateTimelineEntry(id: string, formData: FormData)
│   100: export async function deleteTimelineEntry(id: string)
│   108: export async function updateTestimonialOrder(items: { id: string; sort_order: number }[])
│   129: export async function updateTimelineOrder(items: { id: string; sort_order: number }[])

### `src/app/admin/actions/users.ts` (146 loc)
│     7: export async function inviteUser(email: string, role: string, providedFullName?: string)
│    78: export async function updateUserRole(userId: string, role: string)
│   111: export async function removeUser(userId: string)

### `src/app/admin/analytics/page.tsx` (139 loc)
│     8: export async function AdminAnalyticsPage()

### `src/app/admin/appearance/page.tsx` (44 loc)
│     6: export async function AdminAppearancePage()

### `src/app/admin/audit/page.tsx` (67 loc)
│     7: export async function AdminAuditPage()

### `src/app/admin/blog/page.tsx` (21 loc)
│     6: export async function AdminBlogPage()

### `src/app/admin/calendar/page.tsx` (19 loc)
│     4: export async function AdminCalendarPage()

### `src/app/admin/case-studies/page.tsx` (21 loc)
│     6: export async function AdminCaseStudiesPage()

### `src/app/admin/certifications/page.tsx` (7 loc)
│     4: export async function AdminCertificationsPage()

### `src/app/admin/contacts/page.tsx` (33 loc)
│     8: export async function AdminContactsPage()

### `src/app/admin/downloads/page.tsx` (11 loc)
│     6: export async function AdminDownloadsPage()

### `src/app/admin/finances/page.tsx` (42 loc)
│     8: export async function AdminFinancesPage()

### `src/app/admin/heatmap/page.tsx` (145 loc)
│     3: export async function HeatmapPage()

### `src/app/admin/inactive-pages/page.tsx` (137 loc)
│    33: export async function InactivePagesPage()

### `src/app/admin/initiatives/page.tsx` (25 loc)
│     5: export async function AdminInitiativesPage()

### `src/app/admin/layout.tsx` (23 loc)
│    13: export async function AdminLayout({ children, }: { children: React.ReactNode; })

### `src/app/admin/login/page.tsx` (245 loc)
│     8: export function AdminLoginPage()

### `src/app/admin/media/page.tsx` (25 loc)
│     8: export async function AdminMediaPage()

### `src/app/admin/page.tsx` (195 loc)
│    13: export async function AdminDashboardPage()

### `src/app/admin/pages/page.tsx` (56 loc)
│     6: export async function PagesAdminHub()

### `src/app/admin/profile/page.tsx` (36 loc)
│    10: export async function AdminProfilePage()

### `src/app/admin/projects/[id]/edit/page.tsx` (33 loc)
│     5: interface Props
│     9: export async function EditProjectPage({ params }: Props)

### `src/app/admin/projects/new/page.tsx` (239 loc)
│    10: export function NewProjectPage()

### `src/app/admin/projects/page.tsx` (36 loc)
│     6: export async function AdminProjectsPage()

### `src/app/admin/publications/page.tsx` (11 loc)
│     6: export async function AdminPublicationsPage()

### `src/app/admin/security/page.tsx` (95 loc)
│     6: export async function AdminSecurityPage()

### `src/app/admin/settings/page.tsx` (25 loc)
│     4: export async function AdminSettingsPage()

### `src/app/admin/sitemap/page.tsx` (128 loc)
│    52: export function SiteMapPage()

### `src/app/admin/skills/page.tsx` (12 loc)
│     5: export async function AdminSkillsPage()

### `src/app/admin/speaking/page.tsx` (11 loc)
│     6: export async function AdminSpeakingPage()

### `src/app/admin/testimonials/page.tsx` (21 loc)
│     6: export async function AdminTestimonialsPage()

### `src/app/admin/timeline/page.tsx` (21 loc)
│     6: export async function AdminTimelinePage()

### `src/app/admin/users/page.tsx` (14 loc)
│     6: export async function AdminUsersPage()

## Database Migrations & Schema (supabase)

### `supabase/migrations/001_schema.sql` (155 loc)
│     7: CREATE TABLE admin_users
│    17: CREATE TABLE projects
│    38: CREATE TABLE skills
│    51: CREATE TABLE certifications
│    67: CREATE TABLE achievements
│    81: CREATE TABLE content_pages
│    92: CREATE TABLE page_analytics
│   102: CREATE TABLE audit_log

### `supabase/migrations/002_rls_policies.sql` (260 loc)
│    (Declaration/data file with no top-level symbol definitions)

### `supabase/migrations/003_functions_triggers.sql` (83 loc)
│     6: CREATE FUNCTION update_updated_at_column()
│    16: CREATE TRIGGER update_projects_updated_at
│    21: CREATE TRIGGER update_admin_users_updated_at
│    26: CREATE TRIGGER update_skills_updated_at
│    31: CREATE TRIGGER update_certifications_updated_at
│    36: CREATE TRIGGER update_achievements_updated_at
│    44: CREATE FUNCTION log_audit_event()
│    66: CREATE TRIGGER projects_audit_trigger
│    71: CREATE TRIGGER skills_audit_trigger
│    76: CREATE TRIGGER certifications_audit_trigger
│    81: CREATE TRIGGER achievements_audit_trigger

### `supabase/migrations/004_seed_data.sql` (609 loc)
│    (Declaration/data file with no top-level symbol definitions)

### `supabase/migrations/005_fix_rls.sql` (37 loc)
│    (Declaration/data file with no top-level symbol definitions)

### `supabase/migrations/006_force_full_refresh.sql` (663 loc)
│    (Declaration/data file with no top-level symbol definitions)

### `supabase/migrations/007_fix_infinite_recursion.sql` (149 loc)
│     7: CREATE FUNCTION is_admin_user()

### `supabase/migrations/008_add_project_documents_and_storage.sql` (39 loc)
│    (Declaration/data file with no top-level symbol definitions)

### `supabase/migrations/009_initiatives_and_programs.sql` (103 loc)
│     7: CREATE TABLE programs
│    19: CREATE TABLE initiatives
│    87: CREATE FUNCTION update_updated_at_column()
│    97: CREATE TRIGGER programs_updated_at
│   101: CREATE TRIGGER initiatives_updated_at

### `supabase/migrations/010_seed_initiatives.sql` (136 loc)
│    (Declaration/data file with no top-level symbol definitions)

### `supabase/migrations/011_feature_toggles.sql` (87 loc)
│     5: CREATE TABLE site_settings
│    17: CREATE TRIGGER set_site_settings_updated_at

### `supabase/migrations/012_tier1_tables.sql` (120 loc)
│     6: CREATE TABLE testimonials
│    22: CREATE TRIGGER set_testimonials_updated_at
│    33: CREATE TABLE timeline_entries
│    52: CREATE TRIGGER set_timeline_entries_updated_at
│    63: CREATE TABLE executive_kpis
│    78: CREATE TRIGGER set_executive_kpis_updated_at

### `supabase/migrations/013_tier2_security.sql` (74 loc)
│    21: CREATE TABLE user_sessions
│    41: CREATE TABLE rate_limits
│    53: CREATE TABLE contact_submissions
│    65: CREATE TRIGGER set_contact_submissions_updated_at

### `supabase/migrations/014_tier4_analytics.sql` (26 loc)
│     6: CREATE TABLE visitor_events

### `supabase/migrations/015_tier5_admin.sql` (44 loc)
│     6: CREATE TABLE content_versions
│    24: CREATE TABLE media_library

### `supabase/migrations/016_tier5_security_headers.sql` (11 loc)
│    (Declaration/data file with no top-level symbol definitions)

### `supabase/migrations/016_tier7_enterprise.sql` (162 loc)
│     6: CREATE TABLE blog_posts
│    23: CREATE TRIGGER set_blog_posts_updated_at
│    36: CREATE TABLE case_studies
│    57: CREATE TRIGGER set_case_studies_updated_at
│    67: CREATE TABLE speaking_events
│    83: CREATE TRIGGER set_speaking_events_updated_at
│    93: CREATE TABLE publications
│   107: CREATE TRIGGER set_publications_updated_at
│   117: CREATE TABLE downloads
│   132: CREATE TRIGGER set_downloads_updated_at
│   142: CREATE TABLE newsletter_subscribers

### `supabase/migrations/017_case_study_fields.sql` (15 loc)
│    (Declaration/data file with no top-level symbol definitions)

### `supabase/migrations/017_fix_contact_form.sql` (10 loc)
│    (Declaration/data file with no top-level symbol definitions)

### `supabase/migrations/017_theme_system.sql` (7 loc)
│    (Declaration/data file with no top-level symbol definitions)

### `supabase/migrations/018_click_events_and_integrity.sql` (35 loc)
│     2: CREATE TABLE public.click_events

### `supabase/migrations/018_fix_triggers_idempotent.sql` (83 loc)
│     8: CREATE TRIGGER set_blog_posts_updated_at
│    13: CREATE TRIGGER set_case_studies_updated_at
│    18: CREATE TRIGGER set_speaking_events_updated_at
│    23: CREATE TRIGGER set_publications_updated_at
│    28: CREATE TRIGGER set_downloads_updated_at
│    33: CREATE TRIGGER set_contact_submissions_updated_at

### `supabase/migrations/019_enable_realtime.sql` (2 loc)
│    (Declaration/data file with no top-level symbol definitions)

### `supabase/migrations/019_new_feature_flags.sql` (7 loc)
│    (Declaration/data file with no top-level symbol definitions)

### `supabase/migrations/020_dynamic_configs.sql` (19 loc)
│    (Declaration/data file with no top-level symbol definitions)

### `supabase/migrations/021_contact_crm.sql` (38 loc)
│     4: CREATE TABLE contact_submissions

### `supabase/migrations/022_contact_indexes.sql` (4 loc)
│    (Declaration/data file with no top-level symbol definitions)

### `supabase/migrations/023_finance_budgets.sql` (54 loc)
│     5: CREATE TABLE financial_budgets
│    52: CREATE TRIGGER financial_budgets_updated_at

### `supabase/migrations/024_fiscal_calendar.sql` (51 loc)
│     5: CREATE TABLE fiscal_years
│    26: CREATE TRIGGER fiscal_years_updated_at

### `supabase/migrations/025_it_budget_details.sql` (18 loc)
│    (Declaration/data file with no top-level symbol definitions)

### `supabase/migrations/026_seed_budgets.sql` (116 loc)
│    (Declaration/data file with no top-level symbol definitions)

### `supabase/migrations/027_seed_all_initiatives_budgets.sql` (57 loc)
│    (Declaration/data file with no top-level symbol definitions)

### `supabase/migrations/028_budget_approval_workflow.sql` (17 loc)
│    (Declaration/data file with no top-level symbol definitions)

### `supabase/migrations/028_cleanup_orphan_column.sql` (6 loc)
│    (Declaration/data file with no top-level symbol definitions)

### `supabase/migrations/029_fix_click_events_policy.sql` (9 loc)
│    (Declaration/data file with no top-level symbol definitions)

### `supabase/migrations/029_rebuild_realistic_budgets.sql` (262 loc)
│    (Declaration/data file with no top-level symbol definitions)

### `supabase/migrations/030_new_admin_flags.sql` (46 loc)
│    (Declaration/data file with no top-level symbol definitions)

### `supabase/migrations/20240522000001_add_published_at_to_case_studies.sql` (8 loc)
│    (Declaration/data file with no top-level symbol definitions)

### `supabase/migrations/20240522000002_update_profile_timeline.sql` (30 loc)
│    (Declaration/data file with no top-level symbol definitions)

## Tooling & Automation Scripts (scripts)

### `scripts/codebase_mapper/__init__.py` (5 loc)
│    (Declaration/data file with no top-level symbol definitions)

### `scripts/codebase_mapper/config.py` (88 loc)
│  class MapperConfig [L72]
│      81: def __post_init__(self): ...

### `scripts/codebase_mapper/crawler.py` (101 loc)
│  class FileEntry [L15]
│  class RepoCrawler [L23]
│      24: def __init__(self, root_dir: Path, custom_ignores: Optional[List[str]] = None): ...
│      28: def _build_pathspec(self, custom_ignores: List[str]) -> pathspec.PathSpec: ...
│      43: def is_ignored(self, rel_path: str) -> bool: ...
│      52: def count_lines(self, abs_path: Path) -> int: ...
│      59: def crawl(self) -> Iterator[FileEntry]: ...

### `scripts/codebase_mapper/graph_builder.py` (213 loc)
│    17: def classify_group(rel_path: str) -> str: ...
│  class GraphBuilder [L39]
│      40: def __init__(self, config: MapperConfig): ...
│      45: def build(self) -> Dict[str, Any]: ...

### `scripts/codebase_mapper/main.py` (119 loc)
│    27: def main(): ...

### `scripts/codebase_mapper/parser.py` (699 loc)
│  class CodeSymbol [L24]
│  class ImportRef [L34]
│  class ParsedFile [L42]
│  class CodebaseParser [L51]
│      52: def __init__(self): ...
│      57: def _init_tree_sitter(self): ...
│      69: def parse_file(self, rel_path: str, abs_path: Path, ext: str) -> ParsedFile: ...
│      90: def _detect_language(self, ext: str) -> str: ...
│     104: def _normalize_signature(self, text: str) -> str: ...
│     113: def _parse_tree_sitter( self, rel_path: str, content_bytes: bytes, content_str: str, language: str ) -> ParsedFile: ...
│     142: def _extract_js_ts( self, node, code: bytes, symbols: List[CodeSymbol], imports: List[ImportRef], exports: Set[str], calls: Set[str], ): ...
│     399: def _extract_python( self, node, code: bytes, symbols: List[CodeSymbol], imports: List[ImportRef], exports: Set[str], calls: Set[str], ): ...
│     517: def _parse_sql(self, rel_path: str, content: str) -> ParsedFile: ...
│     568: def _parse_fallback(self, rel_path: str, content: str, language: str) -> ParsedFile: ...

### `scripts/codebase_mapper/repo_map_generator.py` (130 loc)
│  class RepoMapGenerator [L15]
│      16: def __init__(self, config: MapperConfig): ...
│      21: def generate(self) -> str: ...

### `scripts/codebase_mapper/resolver.py` (107 loc)
│  class ResolvedTarget [L13]
│  class PathResolver [L19]
│      20: def __init__(self, root_dir: Path, known_files: Optional[Set[str]] = None): ...
│      25: def _load_tsconfig_aliases(self) -> Dict[str, str]: ...
│      42: def resolve(self, current_file_rel: str, import_source: str) -> ResolvedTarget: ...
│      86: def _match_extension(self, base_rel: str) -> Optional[str]: ...

### `scripts/codebase_mapper/server.py` (56 loc)
│  class CORSRequestHandler [L11]
│      12: def end_headers(self): ...
│      19: def do_OPTIONS(self): ...
│      23: def log_message(self, format, *args): ...
│    29: def run_server(directory: Path, port: int = 3333, max_tries: int = 10) -> tuple[int, http.server.HTTPServer]: ...

### `scripts/codebase_mapper/visualizer_generator.py` (839 loc)
│  class VisualizerGenerator [L807]
│     808: def __init__(self, config: MapperConfig): ...
│     811: def generate(self, graph_data: Dict[str, Any]) -> Path: ...

### `scripts/test-db.ts` (55 loc)
│    16: async function testConnection()

## Other Modules

### `public/pcm-processor.js` (16 loc)
│  class  [L1]
│     2: process(inputs)

### `src/proxy.ts` (120 loc)
│    16: export async function proxy(request: NextRequest)

### `tests/test_codebase_mapper.py` (262 loc)
│    32: def test_crawler_excludes_standard_directories(tmp_path: Path): ...
│    51: def test_parser_typescript_function_signatures(tmp_path: Path): ...
│    75: def test_parser_typescript_interfaces_and_types(tmp_path: Path): ...
│    95: def test_parser_python_signatures(tmp_path: Path): ...
│   117: def test_resolver_alias_and_relative(tmp_path: Path): ...
│   154: def test_graph_builder_full_pipeline(tmp_path: Path): ...
│   185: def test_repo_map_generator_output(tmp_path: Path): ...
│   203: def test_visualizer_generation(tmp_path: Path): ...
│   228: def test_empty_file_handling(tmp_path: Path): ...
│   239: def test_malformed_syntax_fallback(tmp_path: Path): ...
│   249: def test_circular_imports(tmp_path: Path): ...

