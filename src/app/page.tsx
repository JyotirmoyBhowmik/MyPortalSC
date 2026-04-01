/**
 * Home Page — The main landing page (route: /).
 * A Server Component that fetches featured projects, skills, certifications,
 * and CMS content in parallel via Promise.all for maximum performance.
 * Uses ISR with 60-second revalidation to balance freshness with speed.
 */
import Link from "next/link";
import { getFeaturedProjects } from "@/lib/data/projects";
import { getSkillsByCategory } from "@/lib/data/skills";
import { getActiveCertifications } from "@/lib/data/certifications";
import { getPageContent, getContentField } from "@/lib/data/content";
import { getFeatureFlag } from "@/lib/data/settings";
import Badge from "@/components/ui/Badge";
import dynamic from "next/dynamic";
import AnimatedSection, { AnimatedCard } from "@/components/animations/AnimatedSection";
import type { Project } from "@/lib/database.types";
import FeaturedProjectsFilter from "@/components/projects/FeaturedProjectsFilter";

const ParticleBackground = dynamic(() => import("@/components/animations/ParticleBackground"));
const TypewriterText = dynamic(() => import("@/components/animations/TypewriterText"));
const SkillsRadarChart = dynamic(() => import("@/components/visuals/SkillsRadarChart"));
const ServerStatusWidget = dynamic(() => import("@/components/visuals/ServerStatusWidget"));

export const revalidate = 60;

export default async function HomePage() {
  const [
    projects,
    skillsByCategory,
    certifications,
    pageContent,
    featureParticleBg
  ] = await Promise.all([
    getFeaturedProjects(3),
    getSkillsByCategory(),
    getActiveCertifications(),
    getPageContent("home"),
    getFeatureFlag("feature_particle_bg")
  ]);

  const totalSkills = Object.values(skillsByCategory).flat().length;

  const heroTitle = getContentField(pageContent?.content, "hero_title");
  const heroSubtitle = getContentField(pageContent?.content, "hero_subtitle");
  const heroDescription = getContentField(pageContent?.content, "hero_description");

  return (
    <>
      {/* ========== HERO SECTION ========== */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background effects */}
        {featureParticleBg ? (
          <ParticleBackground />
        ) : (
          <div className="absolute inset-0 dot-pattern opacity-30" />
        )}
        <div
          className="absolute inset-0"
          style={{ background: "var(--gradient-hero)" }}
        />
        {/* Floating orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/8 rounded-full blur-3xl animate-float" style={{ animationDelay: "3s" }} />

        <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 text-center">
          {/* Status badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-8 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-xs font-medium text-primary">
              Available for opportunities
            </span>
          </div>

          {/* Name */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight mb-4 animate-slide-up">
            <span className="gradient-text">{heroTitle || "Jyotirmoy Bhowmik"}</span>
          </h1>

          {/* Tagline / Subtitle with Typewriter */}
          <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4 animate-slide-up stagger-1 max-w-3xl mx-auto">
            <TypewriterText
              texts={[
                "IT Infrastructure & Cloud Specialist",
                "Network & Security Architect",
                "Project Management Leader",
                "OT/ICS Security Expert",
                "Disaster Recovery Strategist",
              ]}
              typingSpeed={70}
              deletingSpeed={35}
              pauseDuration={2500}
            />
          </h2>

          {/* Contact Info Line */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-sm sm:text-base text-muted-foreground mb-8 animate-slide-up stagger-2">
            <span>Kathmandu, Nepal</span>
            <span className="hidden sm:inline">•</span>
            <span>+977-9801009825</span>
            <span className="hidden sm:inline">•</span>
            <span>+91-9774135614</span>
            <span className="hidden sm:inline">•</span>
            <a href="mailto:contact@jyotirmoyb.com" className="hover:text-primary transition-colors">contact@jyotirmoyb.com</a>
          </div>

          {/* Description */}
          <p className="text-base sm:text-xl text-muted-foreground w-full max-w-4xl mx-auto mb-10 animate-slide-up stagger-3 leading-relaxed px-2 sm:px-0">
            {heroDescription ||
              "IT Infrastructure & Project Management leader with 15+ years of experience delivering secure, resilient enterprise infrastructure and technology programs across India and Nepal with multi-country coordination exposure."}
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 animate-slide-up stagger-4 mb-16">
            <Link
              href="/initiatives"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg gradient-bg text-white font-medium shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-shadow"
            >
              View Initiatives
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-border text-foreground font-medium hover:bg-surface hover:border-border-hover transition-all"
            >
              About Me
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-border text-foreground font-medium hover:bg-surface hover:border-border-hover transition-all"
            >
              Get in Touch
            </Link>
            <a
              href="/downloads"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-primary/30 text-primary font-medium hover:bg-primary/10 transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download Resume
            </a>
          </div>



          {/* Stats row */}
          <div className="grid grid-cols-2 md:flex md:flex-row items-center justify-center gap-8 md:gap-12 mt-12 md:mt-16 animate-fade-in stagger-4">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold gradient-text">
                88+
              </div>
              <div className="text-xs text-muted-foreground mt-1">Initiatives</div>
            </div>
            <div className="hidden md:block w-px h-10 bg-border" />
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold gradient-text">
                15+
              </div>
              <div className="text-xs text-muted-foreground mt-1">Years Experience</div>
            </div>
            <div className="hidden md:block w-px h-10 bg-border" />
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold gradient-text">
                12
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Programs
              </div>
            </div>
            <div className="hidden md:block w-px h-10 bg-border" />
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold gradient-text">
                {certifications.length > 0 ? `${certifications.length}+` : "0+"}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Certifications
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== CORE COMPETENCIES SUMMARY (Bento Grid) ========== */}
      <section className="py-24 px-4 bg-surface/50">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection>
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Core <span className="gradient-text">Competencies</span>
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Deep expertise across IT infrastructure, security, cloud, and enterprise technology management.
              </p>
            </div>
          </AnimatedSection>

          <div className="bento-grid">
            {[
              { icon: "🏢", title: "IT Infrastructure", desc: "Data Center, capacity planning, OS administration, patching, service continuity" },
              { icon: "🔒", title: "Network & Security", desc: "Cisco/Juniper, Palo Alto/Fortinet, VPN, Zscaler SASE, network segmentation" },
              { icon: "☁️", title: "Cloud & Collaboration", desc: "AWS, Azure, Microsoft 365, identity management, hybrid cloud" },
              { icon: "🔄", title: "Disaster Recovery", desc: "DR strategy & testing, hybrid DR, Commvault, geo-replication, HPE StoreOnce" },
              { icon: "🖥️", title: "Virtualization", desc: "VMware vSphere/ESXi, Hyper-V, Citrix, Red Hat Virtualization, SAP hosting" },
              { icon: "📋", title: "Project Management", desc: "Scope & planning, vendor management, procurement, budget, risk, governance" },
              { icon: "🤖", title: "Automation & Analytics", desc: "30+ RPA bots (UiPath), Tableau/Power BI dashboards, process improvement" },
            ].map((comp, i) => (
              <AnimatedCard key={comp.title} delay={i * 0.08} className="glass rounded-xl p-6 glow-border transition-all duration-300">
                <div className="text-3xl mb-3">{comp.icon}</div>
                <h3 className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">{comp.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{comp.desc}</p>
              </AnimatedCard>
            ))}
            <AnimatedCard delay={0.64} className="h-full">
              <ServerStatusWidget />
            </AnimatedCard>
          </div>
        </div>
      </section>

      {/* ========== FEATURED PROJECTS ========== */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section header */}
          <AnimatedSection>
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Featured <span className="gradient-text">Projects</span>
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                A curated selection of enterprise infrastructure and technology projects.
              </p>
            </div>
          </AnimatedSection>

          {/* Project cards Filter */}
          <FeaturedProjectsFilter projects={projects as Project[]} />

          {/* View all link */}
          <div className="text-center mt-12">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 text-primary hover:text-primary-hover font-medium transition-colors"
            >
              View all projects
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ========== SKILLS OVERVIEW ========== */}
      <section className="py-24 px-4 bg-surface/50">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection>
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Skills & <span className="gradient-text">Technologies</span>
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Technologies and platforms used to deliver enterprise infrastructure and security solutions.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* Radar chart column */}
            <AnimatedSection className="lg:col-span-1">
              <div className="glass rounded-xl p-6 glow-border h-full flex flex-col items-center justify-start pt-8">
                <h3 className="text-sm font-semibold text-primary uppercase tracking-wider mb-8 text-center">
                  Proficiency Overview
                </h3>
                <SkillsRadarChart
                  data={Object.entries(skillsByCategory).map(([category, skills]) => ({
                    category,
                    avgProficiency:
                      skills.reduce((sum, s) => sum + (s.proficiency_level ?? 0), 0) / skills.length,
                    skillCount: skills.length,
                  }))}
                />
              </div>
            </AnimatedSection>

            {/* Skill cards column */}
            <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {Object.entries(skillsByCategory).map(
              ([category, skills], catIdx) => (
                <AnimatedCard
                  key={category}
                  delay={catIdx * 0.1}
                  className="glass rounded-xl p-6 glow-border"
                >
                  <h3 className="text-sm font-semibold text-primary uppercase tracking-wider mb-4">
                    {category}
                  </h3>
                  <div className="space-y-3">
                    {skills.map((skill) => (
                      <div key={skill.id}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-foreground">
                            {skill.name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {skill.years_of_experience}y
                          </span>
                        </div>
                        <div className="proficiency-bar">
                          <div
                            className="proficiency-bar-fill"
                            style={{
                              width: `${((skill.proficiency_level ?? 0) / 5) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </AnimatedCard>
              )
            )}
            </div>
          </div>
        </div>
      </section>

      {/* ========== CERTIFICATIONS ========== */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection>
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                <span className="gradient-text">Certifications</span> & Badges
              </h2>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {certifications.map((cert, i) => (
              <AnimatedCard
                key={cert.id}
                delay={i * 0.12}
                className="glass rounded-xl p-6 glow-border"
              >
                <div className="w-12 h-12 rounded-lg gradient-bg flex items-center justify-center text-white text-lg font-bold mb-4">
                  🏆
                </div>
                <h3 className="font-semibold text-foreground mb-1">
                  {cert.title}
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  {cert.issuing_organization}
                </p>
                <div className="flex items-center gap-2">
                  <Badge variant="success">Active</Badge>
                  <span className="text-xs text-muted-foreground">
                    {new Date(cert.issue_date).toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
                {cert.credential_url && (
                  <a
                    href={cert.credential_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-primary hover:text-primary-hover mt-3 transition-colors"
                  >
                    Verify credential
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                )}
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>

      {/* ========== CTA SECTION ========== */}
      <section className="py-24 px-4">
        <AnimatedSection className="max-w-3xl mx-auto text-center">
          <div className="glass rounded-2xl p-10 sm:p-16 relative overflow-hidden glow-border">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5" />
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Let&apos;s work <span className="gradient-text">together</span>
              </h2>
              <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
                I&apos;m always open to discussing new challenges, infrastructure
                modernization programs, or opportunities to drive technology
                transformation.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg gradient-bg text-white font-medium shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-shadow"
              >
                Get in Touch
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </AnimatedSection>
      </section>
    </>
  );
}
