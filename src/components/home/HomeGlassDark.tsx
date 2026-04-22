import Link from "next/link";
import Badge from "@/components/ui/Badge";
import AnimatedSection, { AnimatedCard } from "@/components/animations/AnimatedSection";
import type { Project } from "@/lib/database.types";
import FeaturedProjectsFilter from "@/components/projects/FeaturedProjectsFilter";

interface HomeGlassDarkProps {
    projects: any[];
    skillsByCategory: Record<string, any[]>;
    certifications: any[];
    budgets: any[];
    formattedSpend: string;
    heroTitle: string;
    heroSubtitle: string;
    heroDescription: string;
}

export default function HomeGlassDark(props: HomeGlassDarkProps) {
    const {
        projects,
        certifications,
        formattedSpend,
        heroTitle,
        heroDescription
    } = props;

    // Glass Executive Dark strictly avoids particles and uses gradient hero layering instead.
    return (
        <div className="bg-background min-h-screen text-foreground relative z-0">
            {/* ========== HERO SECTION (Glass Dark) ========== */}
            <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-4 sm:px-6 overflow-hidden">
                {/* Custom dark gradient hero layered behind everything */}
                <div 
                    className="absolute inset-0 z-[-1] pointer-events-none" 
                    style={{ background: "var(--gradient-hero)" }} 
                />
                
                <div className="relative z-10 w-full max-w-5xl mx-auto text-center space-y-8">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass animate-fade-in shadow-sm">
                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                        <span className="text-sm font-medium text-foreground">
                            Available for opportunities
                        </span>
                    </div>

                    <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold tracking-tighter text-heading animate-slide-up">
                        {heroTitle || "Jyotirmoy Bhowmik"}
                    </h1>

                    <h2 className="text-2xl sm:text-3xl font-semibold text-muted-foreground animate-slide-up stagger-1">
                        IT Infrastructure & Cloud Specialist
                    </h2>

                    <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed animate-slide-up stagger-2">
                        {heroDescription ||
                            "IT Infrastructure & Project Management leader with 15+ years of experience delivering secure, resilient enterprise infrastructure and technology programs."}
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-4 pt-4 animate-slide-up stagger-3">
                        <Link
                            href="/contact"
                            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-primary text-primary-foreground font-semibold hover:bg-primary-hover hover:-translate-y-0.5 transition-all shadow-lg"
                        >
                            Get in Touch
                        </Link>
                        <Link
                            href="/projects"
                            className="inline-flex items-center gap-2 px-8 py-4 rounded-full glass text-heading font-medium hover:bg-surface-hover hover:-translate-y-0.5 transition-all shadow-sm"
                        >
                            View Projects
                        </Link>
                    </div>
                </div>
            </section>

            {/* ========== STATS SECTION (Glass Cards) ========== */}
            <section className="py-12 px-4 sm:px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 animate-slide-up stagger-4 hover-lift-container">
                        {props.budgets.length > 0 && (
                            <div className="glass hover-lift p-8 text-center flex flex-col justify-center transition-all duration-200">
                                <div className="text-4xl font-bold text-heading mb-2">{formattedSpend}</div>
                                <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">IT Budget Spend</div>
                            </div>
                        )}
                        <div className="glass hover-lift p-8 text-center flex flex-col justify-center transition-all duration-200">
                            <div className="text-4xl font-bold text-heading mb-2">88+</div>
                            <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Initiatives</div>
                        </div>
                        <div className="glass hover-lift p-8 text-center flex flex-col justify-center transition-all duration-200">
                            <div className="text-4xl font-bold text-heading mb-2">15+</div>
                            <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Years Exp.</div>
                        </div>
                        <div className="glass hover-lift p-8 text-center flex flex-col justify-center transition-all duration-200">
                            <div className="text-4xl font-bold text-heading mb-2">{certifications.length}+</div>
                            <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Certifications</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ========== FEATURED PROJECTS ========== */}
            <section className="py-24 px-4 sm:px-6 relative">
                {/* Subtle soft gradient back layer behind projects */}
                <div 
                    className="absolute inset-0 z-[-1] pointer-events-none opacity-50" 
                    style={{ background: "linear-gradient(180deg, transparent 0%, rgba(11, 15, 20, 1) 100%)" }} 
                />

                <div className="max-w-6xl mx-auto">
                    <AnimatedSection>
                        <div className="text-center mb-16">
                            <h2 className="text-3xl sm:text-4xl font-bold text-heading mb-4">
                                Featured Projects
                            </h2>
                            <p className="text-muted-foreground max-w-xl mx-auto">
                                Enterprise infrastructure and technology transformations.
                            </p>
                        </div>
                    </AnimatedSection>

                    {/* The project filter component leverages standard generic cards, but utilizing our specific Glass Executive tokens it'll magically map perfectly to the sleek UI */}
                    <FeaturedProjectsFilter projects={projects as Project[]} />

                    <div className="text-center mt-12">
                        <Link
                            href="/projects"
                            className="inline-flex items-center gap-2 text-primary hover:text-primary-hover font-semibold transition-colors"
                        >
                            View all projects
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
