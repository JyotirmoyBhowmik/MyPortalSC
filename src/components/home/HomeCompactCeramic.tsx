"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Project } from "@/lib/database.types";
import { useTheme } from "../ThemeProvider";
import dynamic from "next/dynamic";

const ServerStatusWidget = dynamic(() => import("../visuals/ServerStatusWidget"), { ssr: false });

interface HomeCompactCeramicProps {
    projects: Project[];
    skillsByCategory: Record<string, any[]>;
    certifications: any[];
    featureParticleBg: boolean;
    budgets: any[];
    formattedSpend: string;
    heroTitle: string;
    heroSubtitle: string;
    heroDescription: string;
    availableForOpportunities?: boolean;
    location?: string;
    experienceYears?: string;
    initiativesCount?: number;
}

export default function HomeCompactCeramic(props: HomeCompactCeramicProps) {
    const {
        projects,
        skillsByCategory,
        certifications,
        budgets,
        formattedSpend,
        heroTitle,
        heroSubtitle,
        heroDescription,
        availableForOpportunities = true,
        location,
        experienceYears,
        initiativesCount,
    } = props;

    const { theme, setTheme, themes } = useTheme();
    const [activeFilter, setActiveFilter] = useState<string>("All");

    // Extract unique domains for project filtering
    const domains = useMemo(() => {
        const allDomains = projects.flatMap(p => p.domain || []);
        const uniqueDomains = Array.from(new Set(allDomains)).filter(Boolean);
        return ["All", ...uniqueDomains];
    }, [projects]);

    const filteredProjects = useMemo(() => {
        return projects.filter(p => 
            activeFilter === "All" || (p.domain && p.domain.includes(activeFilter))
        );
    }, [projects, activeFilter]);

    return (
        <div className="min-h-screen bg-[#F9F9F7] text-[#505F76] font-sans antialiased overflow-x-hidden p-0">
            {/* ========== MAIN GRID CONTENTS ========== */}
            <main className="max-w-[1200px] mx-auto px-6 py-8 sm:px-8 md:py-12 transition-all duration-300">
                {/* ========== TOP HEADER WITH PUBLIC THEME SWATCHES ========== */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#E5E5E1] pb-6 mb-8 gap-4 select-none">
                    <div>
                        <h2 className="text-[#1A1A1A] font-mono text-[10px] uppercase tracking-[0.15em] font-bold">System Status</h2>
                        <p className="text-xs text-[#64748B] mt-0.5">Tactile Minimalist Portfolio Console</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-xs font-mono text-[#64748B]">Active Theme:</span>
                        <div className="flex gap-1.5 bg-white border border-[#E5E5E1] p-1 rounded-lg">
                            {themes.map((t) => (
                                <button
                                    key={t.name}
                                    onClick={() => {
                                        document.documentElement.classList.add('theme-transitioning');
                                        setTheme(t.name);
                                        setTimeout(() => {
                                            document.documentElement.classList.remove('theme-transitioning');
                                        }, 600);
                                    }}
                                    title={t.label}
                                    className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all ${
                                        theme === t.name 
                                            ? "border-[#1A1A1A] scale-110" 
                                            : "border-transparent hover:scale-105"
                                    }`}
                                >
                                    <span 
                                        className="w-4 h-4 rounded-full border border-black/10 shrink-0" 
                                        style={{ background: t.swatch }}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* ==================== LEFT COLUMN (GOVERNANCE SNAPSHOT) ==================== */}
                    <div className="lg:col-span-5 space-y-8">
                        <div className="font-mono text-[9px] uppercase tracking-[0.15em] text-[#64748B] font-bold border-b border-[#E5E5E1] pb-2">
                            Governance Snapshot
                        </div>

                        {/* Profile/Hero Card */}
                        <div className="bg-white border border-[#E5E5E1] rounded-2xl p-6 sm:p-8 relative overflow-hidden transition-all duration-300">
                            <div className="flex flex-col md:flex-row lg:flex-col xl:flex-row items-center md:items-start lg:items-center xl:items-start gap-6 sm:gap-8">
                                {/* Portrait photo Container */}
                                <div className="relative w-36 h-36 rounded-2xl overflow-hidden bg-[#F1F1EF] border border-[#E5E5E1] shrink-0">
                                    <Image
                                        src="/profile.jpg"
                                        alt={heroTitle || "Jyotirmoy Bhowmik"}
                                        fill
                                        unoptimized={true}
                                        className="object-cover"
                                        onError={(e) => {
                                            e.currentTarget.src = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=crop&w=300&h=300&q=80";
                                        }}
                                    />
                                    {availableForOpportunities && (
                                        <div className="absolute bottom-2 left-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#1A1A1A] text-white font-mono text-[9px] uppercase tracking-wider font-extrabold shadow-sm border border-white/20 select-none">
                                            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                                            Active
                                        </div>
                                    )}
                                </div>

                                {/* Metadata fields */}
                                <div className="flex-1 min-w-0 text-center md:text-left lg:text-center xl:text-left space-y-4">
                                    <div>
                                        <h1 className="text-3xl font-extrabold text-[#1A1A1A] tracking-tight leading-tight">
                                            {heroTitle || "Jyotirmoy Bhowmik"}
                                        </h1>
                                        <p className="font-mono text-[10px] uppercase tracking-wider text-[#64748B] font-bold mt-1 max-w-[280px] mx-auto md:mx-0 lg:mx-auto xl:mx-0">
                                            {heroSubtitle || "IT Infrastructure & Project Management Leader"}
                                        </p>
                                    </div>
                                    <p className="text-xs text-[#505F76] leading-relaxed max-w-sm mx-auto md:mx-0 lg:mx-auto xl:mx-0">
                                        {heroDescription || "IT Infrastructure & Project Management leader with 15+ years of experience delivering secure, resilient enterprise infrastructure and technology programs across India and Nepal."}
                                    </p>
                                    <div className="flex flex-wrap items-center justify-center md:justify-start lg:justify-center xl:justify-start gap-3 pt-2">
                                        <Link href="/contact" className="px-4 py-2 bg-[#1A1A1A] hover:bg-black text-white text-xs font-semibold rounded-lg shadow-sm hover:shadow transition-all">
                                            GET IN TOUCH
                                        </Link>
                                        <Link href="/downloads" className="px-4 py-2 border border-[#E5E5E1] hover:border-[#1A1A1A] text-[#1A1A1A] text-xs font-semibold rounded-lg hover:bg-[#F1F1EF] transition-all">
                                            VIEW RESUME ↗
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            {/* Secondary Telemetry details grid */}
                            <div className="grid grid-cols-3 border-t border-[#E5E5E1] mt-8 pt-6 gap-4 font-mono text-[9px] leading-tight select-none">
                                <div className="text-center md:text-left lg:text-center xl:text-left">
                                    <span className="block text-[#64748B] uppercase tracking-wider mb-1">LOCATION</span>
                                    <strong className="text-[#1A1A1A] text-xs font-semibold">{location || "Kathmandu, Nepal"}</strong>
                                </div>
                                <div className="text-center md:text-left lg:text-center xl:text-left border-x border-[#E5E5E1] px-2">
                                    <span className="block text-[#64748B] uppercase tracking-wider mb-1">EXPERIENCE</span>
                                    <strong className="text-[#1A1A1A] text-xs font-semibold">{experienceYears || "15+ Years"}</strong>
                                </div>
                                <div className="text-center md:text-left lg:text-center xl:text-left">
                                    <span className="block text-[#64748B] uppercase tracking-wider mb-1">IMPACT</span>
                                    <strong className="text-[#1A1A1A] text-xs font-semibold">{initiativesCount ? `${initiativesCount}+ Initiatives` : "88+ Initiatives"}</strong>
                                </div>
                            </div>
                        </div>

                        {/* Proficiencies Card */}
                        <div className="bg-white border border-[#E5E5E1] rounded-2xl p-6 sm:p-8 space-y-6 transition-all duration-300">
                            <div className="flex items-center justify-between border-b border-[#E5E5E1] pb-3 select-none">
                                <h3 className="text-[#1A1A1A] font-extrabold text-sm tracking-tight">Technical Proficiencies</h3>
                                <span className="text-xs">🛡️</span>
                            </div>

                            {/* Grouped tags */}
                            <div className="space-y-4">
                                <div>
                                    <span className="block font-mono text-[9px] uppercase tracking-wider text-[#64748B] font-bold mb-2">INFRASTRUCTURE</span>
                                    <div className="flex flex-wrap gap-1.5">
                                        {["Data Center", "DR/BCP", "VMware", "RHEL"].map(tag => (
                                            <span key={tag} className="px-2.5 py-1 rounded bg-[#F1F1EF] text-[#1A1A1A] font-mono text-[10px] font-semibold border border-[#E5E5E1] select-none">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <span className="block font-mono text-[9px] uppercase tracking-wider text-[#64748B] font-bold mb-2">CLOUD & SECURITY</span>
                                    <div className="flex flex-wrap gap-1.5">
                                        {["AWS/Azure", "Palo Alto", "Zscaler", "Fortinet"].map(tag => (
                                            <span key={tag} className="px-2.5 py-1 rounded bg-[#F1F1EF] text-[#1A1A1A] font-mono text-[10px] font-semibold border border-[#E5E5E1] select-none">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <span className="block font-mono text-[9px] uppercase tracking-wider text-[#64748B] font-bold mb-2">FRAMEWORKS & DEV</span>
                                    <div className="flex flex-wrap gap-1.5">
                                        {["Next.js", "React", "Python", "UiPath"].map(tag => (
                                            <span key={tag} className="px-2.5 py-1 rounded bg-[#F1F1EF] text-[#1A1A1A] font-mono text-[10px] font-semibold border border-[#E5E5E1] select-none">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Program Management Telemetry meters */}
                            <div className="border-t border-[#E5E5E1] pt-6 space-y-4 font-mono text-[10px]">
                                <span className="block uppercase tracking-wider text-[#64748B] font-bold select-none">PROGRAM MANAGEMENT</span>
                                <div>
                                    <div className="flex items-center justify-between mb-1.5 font-semibold text-[#1A1A1A]">
                                        <span>Vendor Governance</span>
                                        <span>100%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-[#F1F1EF] rounded-full overflow-hidden border border-[#E5E5E1]">
                                        <div className="h-full bg-[#1A1A1A] rounded-full" style={{ width: "100%" }} />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex items-center justify-between mb-1.5 font-semibold text-[#1A1A1A]">
                                        <span>Budget Control</span>
                                        <span>98%</span>
                                    </div>
                                    <div className="h-1.5 w-full bg-[#F1F1EF] rounded-full overflow-hidden border border-[#E5E5E1]">
                                        <div className="h-full bg-[#1A1A1A] rounded-full" style={{ width: "98%" }} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Dynamic Infrastructure Telemetry Console */}
                        <div className="hover-lift transition-all duration-300">
                            <ServerStatusWidget />
                        </div>

                        {/* Engagement Metrics Charcoal card */}
                        <div className="bg-[#1A1A1A] text-white rounded-2xl p-6 sm:p-8 space-y-6 transition-all duration-300 relative overflow-hidden shadow-inner">
                            <span className="block font-mono text-[9px] uppercase tracking-[0.15em] text-[#A3A3A3] font-bold select-none">📊 ENGAGEMENT METRICS</span>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <strong className="block text-3xl font-extrabold tracking-tight text-white">{formattedSpend || "₹18.9Cr+"}</strong>
                                    <span className="font-mono text-[9px] uppercase tracking-wider text-[#A3A3A3] mt-1 block">BUDGET MANAGED</span>
                                </div>
                                <div>
                                    <strong className="block text-3xl font-extrabold tracking-tight text-white">88+</strong>
                                    <span className="font-mono text-[9px] uppercase tracking-wider text-[#A3A3A3] mt-1 block">INITIATIVES DONE</span>
                                </div>
                            </div>

                            {/* Mini CSS sparkline chart */}
                            <div className="h-16 flex items-end gap-2 pt-2 select-none">
                                {[40, 60, 45, 80, 50, 75, 90, 85, 95, 100].map((height, i) => (
                                    <div 
                                        key={i} 
                                        className="flex-1 bg-white/20 rounded-sm hover:bg-[#10B981] transition-all cursor-pointer"
                                        style={{ height: `${height}%` }}
                                        title={`Metric Point ${i + 1}: ${height}%`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* ==================== RIGHT COLUMN (FEATURED PROJECTS) ==================== */}
                    <div className="lg:col-span-7 space-y-8">
                        <div className="flex items-center justify-between border-b border-[#E5E5E1] pb-2 font-mono text-[9px] uppercase tracking-[0.15em] text-[#64748B] font-bold">
                            <span>Featured Projects</span>
                            <Link href="/projects" className="underline hover:text-[#1A1A1A] transition-colors normal-case font-sans font-semibold">View More Projects →</Link>
                        </div>

                        <div>
                            <h3 className="text-xl font-extrabold text-[#1A1A1A] tracking-tight leading-tight">Enterprise Projects</h3>
                            <p className="text-xs text-[#64748B] mt-0.5">High-impact critical technology deployments</p>
                        </div>

                        {/* Filter Tabs */}
                        <div className="flex flex-wrap items-center gap-2 border-b border-[#E5E5E1] pb-3 min-h-[40px] select-none">
                            {domains.map((domain) => (
                                <button
                                    key={domain}
                                    onClick={() => setActiveFilter(domain)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${activeFilter === domain
                                        ? "bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-sm"
                                        : "bg-white text-[#505F76] border-[#E5E5E1] hover:bg-[#F1F1EF] hover:text-[#1A1A1A]"
                                    }`}
                                >
                                    {domain}
                                </button>
                            ))}
                        </div>

                        {/* Project list feed */}
                        <div className="space-y-6">
                            {filteredProjects.map((project) => (
                                <div 
                                    key={project.id}
                                    className="bg-white border border-[#E5E5E1] rounded-2xl overflow-hidden hover:border-[#1A1A1A] transition-all group flex flex-col sm:flex-row"
                                >
                                    {/* Project image */}
                                    <div className="relative w-full sm:w-[200px] h-[150px] sm:h-auto shrink-0 bg-[#F1F1EF] border-b sm:border-b-0 sm:border-r border-[#E5E5E1] overflow-hidden">
                                        {project.featured_image_url && 
                                         project.featured_image_url !== "image" && 
                                         (project.featured_image_url.startsWith("/") || project.featured_image_url.startsWith("http")) ? (
                                            <Image
                                                src={project.featured_image_url}
                                                alt={project.title}
                                                fill
                                                unoptimized={true}
                                                className="object-cover group-hover:scale-102 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-3xl select-none">
                                                📁
                                            </div>
                                        )}
                                        {/* Overlay domain tag */}
                                        {project.domain && project.domain.length > 0 && (
                                            <div className="absolute top-2.5 left-2.5 inline-flex px-2 py-0.5 rounded bg-white/90 backdrop-blur-sm border border-[#E5E5E1] font-mono text-[9px] uppercase tracking-wider font-extrabold text-[#1A1A1A] shadow-sm select-none">
                                                {project.domain[0]}
                                            </div>
                                        )}
                                    </div>

                                    {/* Card text fields */}
                                    <div className="p-6 flex-1 flex flex-col justify-between min-w-0">
                                        <div>
                                            <h4 className="text-base font-extrabold text-[#1A1A1A] tracking-tight group-hover:text-black transition-colors leading-tight mb-2 line-clamp-1">
                                                {project.title}
                                            </h4>
                                            <p className="text-xs text-[#505F76] leading-relaxed line-clamp-2 sm:line-clamp-3">
                                                {project.short_description || "No description available."}
                                            </p>
                                        </div>

                                        {/* Technologies & telemetry bottom footer row */}
                                        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#E5E5E1] mt-4 font-mono text-[9px]">
                                            <div className="flex flex-wrap gap-1">
                                                {(project.technologies || []).slice(0, 3).map((tech) => (
                                                    <span key={tech} className="px-2 py-0.5 rounded bg-[#F1F1EF] border border-[#E5E5E1] text-[#505F76] font-medium select-none">
                                                        {tech}
                                                    </span>
                                                ))}
                                            </div>
                                            <Link href={`/projects/${project.slug}`} className="inline-flex items-center gap-1 font-bold text-[#1A1A1A] hover:underline uppercase tracking-wider select-none">
                                                {project.status === "published" ? "↳ Live" : "↳ Details"}
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {filteredProjects.length === 0 && (
                                <div className="text-center py-12 text-xs text-[#64748B] bg-white border border-[#E5E5E1] rounded-2xl select-none">
                                    No featured projects found for the active filter.
                                </div>
                            )}
                        </div>

                        {/* ==================== CERTIFICATIONS LOOKBOOK REGISTRY ==================== */}
                        {certifications && certifications.length > 0 && (
                            <div className="space-y-6 border-t border-[#E5E5E1] pt-8 mt-12">
                                <div className="select-none">
                                    <div className="font-mono text-[9px] uppercase tracking-[0.15em] text-[#64748B] font-bold border-b border-[#E5E5E1] pb-2">
                                        Verified Credentials Registry
                                    </div>
                                    <h3 className="text-xl font-extrabold text-[#1A1A1A] tracking-tight leading-tight mt-4">
                                        Professional Certifications
                                    </h3>
                                    <p className="text-xs text-[#64748B] mt-0.5">
                                        Industry accredited credentials in Infrastructure, Security & Cloud Architecture
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {certifications.map((cert, index) => {
                                        const indexStr = String(index + 1).padStart(2, '0');
                                        return (
                                            <div 
                                                key={cert.id || index}
                                                className="bg-white border border-[#E5E5E1] rounded-2xl p-5 hover:border-[#1A1A1A] transition-all hover-lift"
                                            >
                                                <div className="flex items-start justify-between select-none">
                                                    <span className="font-mono text-[10px] text-[#64748B] font-bold">
                                                        [{indexStr}]
                                                    </span>
                                                    <span className="inline-flex px-2 py-0.5 rounded bg-[#F1F1EF] border border-[#E5E5E1] font-mono text-[8px] uppercase tracking-wider font-extrabold text-[#1A1A1A]">
                                                        Active
                                                    </span>
                                                </div>

                                                <h4 className="text-sm font-extrabold text-[#1A1A1A] tracking-tight mt-3 mb-1 line-clamp-1">
                                                    {cert.title}
                                                </h4>
                                                <p className="font-mono text-[9px] uppercase tracking-wider text-[#64748B] font-bold select-none">
                                                    {cert.issuing_organization}
                                                </p>

                                                <div className="flex items-center justify-between mt-4 pt-3 border-t border-[#E5E5E1] font-mono text-[9px] select-none">
                                                    <span className="text-[#64748B]">
                                                        ISSUED: {new Date(cert.issue_date).toLocaleDateString("en-US", {
                                                            month: "short",
                                                            year: "numeric",
                                                        }).toUpperCase()}
                                                    </span>
                                                    {cert.credential_url && (
                                                        <a
                                                            href={cert.credential_url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-1 font-bold text-[#1A1A1A] hover:underline uppercase tracking-wider"
                                                        >
                                                            Verify ↗
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
