import Link from "next/link";
import { getFeaturedProjects } from "@/lib/data/projects";
import { getSkillsByCategory } from "@/lib/data/skills";
import { getActiveCertifications } from "@/lib/data/certifications";
import { getPageContent, getContentField } from "@/lib/data/content";
import Badge from "@/components/ui/Badge";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [projects, skillsByCategory, certifications, pageContent] = await Promise.all([
    getFeaturedProjects(3),
    getSkillsByCategory(),
    getActiveCertifications(),
    getPageContent("home"),
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
        <div className="absolute inset-0 dot-pattern opacity-30" />
        <div
          className="absolute inset-0"
          style={{ background: "var(--gradient-hero)" }}
        />
        {/* Floating orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/8 rounded-full blur-3xl animate-float" style={{ animationDelay: "3s" }} />

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          {/* Status badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-8 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-xs font-medium text-primary">
              Available for opportunities
            </span>
          </div>

          {/* Name */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight mb-6 animate-slide-up">
            Hi, I&apos;m{" "}
            <span className="gradient-text">{heroTitle || "Jyotirmoy Bhowmik"}</span>
          </h1>

          {/* Tagline / Subtitle */}
          {heroSubtitle && (
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4 animate-slide-up stagger-1">
              {heroSubtitle}
            </h2>
          )}

          {/* Description */}
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-slide-up stagger-2 leading-relaxed">
            {heroDescription ||
              "IT Infrastructure & Project Management leader delivering secure, resilient enterprise infrastructure."}
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 animate-slide-up stagger-3">
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg gradient-bg text-white font-medium shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-shadow"
            >
              View My Work
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-border text-foreground font-medium hover:bg-surface hover:border-border-hover transition-all"
            >
              Get in Touch
            </Link>
          </div>

          {/* Stats row */}
          <div className="flex items-center justify-center gap-8 sm:gap-12 mt-16 animate-fade-in stagger-4">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold gradient-text">
                {projects.length > 0 ? `${projects.length}+` : "0+"}
              </div>
              <div className="text-xs text-muted-foreground mt-1">Projects</div>
            </div>
            <div className="w-px h-10 bg-border" />
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold gradient-text">
                {totalSkills > 0 ? `${totalSkills}+` : "0+"}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Technologies
              </div>
            </div>
            <div className="w-px h-10 bg-border" />
            <div className="text-center">
              <div className="text-2xl sm:text-3xl font-bold gradient-text">
                {certifications.length > 0 ? `${certifications.length}+` : "0+"}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Certifications
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== FEATURED PROJECTS ========== */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Featured <span className="gradient-text">Projects</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              A curated selection of recent work showcasing my expertise in
              modern web development.
            </p>
          </div>

          {/* Project cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, i) => (
              <Link
                key={project.id}
                href={`/projects/${project.slug}`}
                className={`group glass rounded-xl overflow-hidden hover-lift stagger-${i + 1}`}
              >
                {/* Image placeholder */}
                <div className="h-48 bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-xl gradient-bg opacity-30 group-hover:opacity-60 transition-opacity" />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="primary">{project.status}</Badge>
                    {project.domain?.slice(0, 1).map((d) => (
                      <Badge key={d} variant="outline">
                        {d}
                      </Badge>
                    ))}
                  </div>
                  <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
                    {project.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                    {project.short_description}
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {project.technologies?.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>

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
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Skills & <span className="gradient-text">Technologies</span>
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Technologies I work with to build production-ready applications.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(skillsByCategory).map(
              ([category, skills], catIdx) => (
                <div
                  key={category}
                  className={`glass rounded-xl p-6 stagger-${catIdx + 1}`}
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
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* ========== CERTIFICATIONS ========== */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              <span className="gradient-text">Certifications</span> & Badges
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {certifications.map((cert, i) => (
              <div
                key={cert.id}
                className={`glass rounded-xl p-6 hover-lift stagger-${i + 1}`}
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
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== CTA SECTION ========== */}
      <section className="py-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="glass rounded-2xl p-10 sm:p-16 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5" />
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Let&apos;s work <span className="gradient-text">together</span>
              </h2>
              <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
                I&apos;m always open to discussing new projects, collaborations,
                or opportunities to be part of your vision.
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
        </div>
      </section>
    </>
  );
}
