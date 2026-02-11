# Deployment V3 Guide — Portfolio Overhaul

This document covers the V3 overhaul of the Jyotirmoy Bhowmik Portfolio, transforming it from a generic "Full-Stack Developer" portfolio into a comprehensive **IT Infrastructure & Project Management** professional showcase.

## 1. Version Highlights

| Feature | V2 | V3 |
|---------|-----|-----|
| **Persona** | Full-Stack Developer | IT Infrastructure & PM Leader |
| **Initiatives** | 5 placeholder projects | 88 real-world initiatives (static data) |
| **About Page** | Generic bio | Full professional experience, education, vision statement |
| **Navigation** | Home, About, Skills, Projects, Contact | + **Initiatives** link |
| **Programs** | N/A | 12 program categories (A–L) |
| **Contact** | India | Kathmandu, Nepal + dual phone numbers |
| **Initiative Pages** | N/A | 88 individual pages + programs overview |

## 2. Architecture Changes

### Static Initiatives Data (No Database Migration Required)

The 88 initiatives are stored as a **static TypeScript data file** at:
```
src/lib/data/initiatives.ts
```

This approach was chosen over Supabase because:
- All initiative data is read-only and unlikely to change frequently
- Eliminates database migration complexity
- Enables static site generation (`generateStaticParams`) for all 88 detail pages
- Zero latency for initiative data—no DB round-trips

### New Routes

| Route | Description |
|-------|-------------|
| `/initiatives` | Main listing with multi-filter grid |
| `/initiatives/[slug]` | Individual initiative detail page (88 pages) |
| `/initiatives/programs` | Programs overview (12 categories) |

### New Components

| File | Description |
|------|-------------|
| `src/components/initiatives/InitiativesGrid.tsx` | Client-side filterable grid |
| `src/lib/data/initiatives.ts` | Static data: 88 initiatives + 12 programs |

### Modified Files

| File | Changes |
|------|---------|
| `src/app/layout.tsx` | SEO metadata updated to IT Infrastructure |
| `src/app/page.tsx` | Hero, stats, competencies, CTA rewritten |
| `src/app/about/page.tsx` | Professional experience, vision, education, core roles |
| `src/app/projects/page.tsx` | Hero text updated (no more "web applications") |
| `src/app/skills/page.tsx` | Subtitle reflects infrastructure expertise |
| `src/app/contact/page.tsx` | Location: Kathmandu, Nepal + phones |
| `src/components/layout/Navbar.tsx` | Added Initiatives nav link |
| `src/components/layout/Footer.tsx` | Updated tagline, added location/email |

## 3. Deployment Instructions

### Step 1: Push Code Changes

```bash
git add .
git commit -m "feat: v3 portfolio overhaul — IT Infrastructure & PM showcase with 88 initiatives"
git push origin main
```

Vercel will auto-deploy from `main` branch.

### Step 2: Database (Optional)

No database migrations are required for V3. The initiatives system is entirely static.

However, you may want to:
- Update `content_pages` in Supabase for the `home` and `about` pages (optional — hardcoded defaults exist)
- Add real skills to the `skills` table if not already populated
- Add certifications to the `certifications` table
- Add achievements to the `achievements` table

### Step 3: Verification

1. **Home Page**: Verify the hero shows "IT Infrastructure & Project Management", stats show 88+ Initiatives, and 8 core competency cards render
2. **About Page**: Check professional summary (6 bullet points), vision statement, 12 selected programs, 3 experience entries, core roles, business value themes, and education
3. **Initiatives Page**: Verify 88 initiatives load, filters work (FY, Program, Criticality, Search), and cards link to detail pages
4. **Initiative Detail**: Click any initiative and verify metadata (FY, program, criticality, strategic area, delivery focus) and related initiatives
5. **Programs Page**: Navigate to `/initiatives/programs` and verify 12 program cards with initiative counts
6. **Projects Page**: Verify hero text says "Enterprise Projects" (not "My Projects")
7. **Skills Page**: Verify subtitle mentions infrastructure and security
8. **Contact Page**: Verify location shows "Kathmandu, Nepal" with both phone numbers
9. **Navbar**: Verify "Initiatives" link appears between Skills and Projects
10. **Footer**: Verify updated tagline and contact info

## 4. Environment Variables

No new environment variables are required for V3. Ensure the standard Supabase keys are set:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 5. Data Model — Initiatives

Each initiative has the following fields:

```typescript
interface Initiative {
    id: number;           // Sequential (1–88)
    title: string;        // e.g., "Industrial OT Network Segmentation (IEC 62443)"
    program: string;      // Letter code: A–L
    programName: string;  // e.g., "OT/Factory Modernization & Security"
    fiscalYear: string;   // e.g., "2024-25"
    strategicArea: string;// e.g., "OT Security"
    criticality: string;  // "Critical" | "High" | "Medium" | "Low"
    deliveryFocus: string;// Semi-colon separated delivery phases
    slug: string;         // Auto-generated URL slug
}
```

### Programs (A–L)

| Code | Program Name |
|------|-------------|
| A | OT/Factory Modernization & Security |
| B | Network Modernization & Site Connectivity |
| C | Data Center, Storage & Backup/DR Resilience |
| D | Cloud Foundations & Digital Platforms |
| E | Collaboration & Content Modernization |
| F | Security Hardening & Compliance Enablement |
| G | Automation, Analytics & Business Enablement |
| H | Business Applications, FinTech Integrations & Governance |
| I | Physical Security & Surveillance Modernization |
| J | IT Asset Management & Operational Efficiency |
| K | Assessments, Due Diligence & Strategy/POCs |
| L | Other Initiatives |

---
*Generated by Antigravity Agent — February 2026*
