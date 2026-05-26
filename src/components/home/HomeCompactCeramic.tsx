"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import Badge from "@/components/ui/Badge";
import type { Project } from "@/lib/database.types";
import { useTheme } from "../ThemeProvider";

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
    } = props;

    const { theme, setTheme, themes } = useTheme();
    const [activeFilter, setActiveFilter] = useState<string>("All");
    const [showStyleConfig, setShowStyleConfig] = useState(false);

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
        <div className="min-h-screen bg-[#F9F9F7] text-[#505F76] font-sans antialiased overflow-x-hidden p-0 md:pl-[240px] pt-[72px]">
            {/* ========== TOP HORIZONTAL NAVBAR ========== */}
            <header className="fixed top-0 left-0 md:left-[240px] right-0 h-[72px] bg-white border-b border-[#E5E5E1] z-40 px-6 sm:px-8 flex items-center justify-between transition-all duration-300">
                <div className="flex items-center gap-8">
                    <span className="font-extrabold text-lg text-[#1A1A1A] tracking-tight">JB Portal</span>
                    <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold">
                        <Link href="/" className="text-[#1A1A1A] border-b-2 border-[#1A1A1A] pb-1.5 transition-colors">Overview</Link>
                        <Link href="/initiatives" className="hover:text-[#1A1A1A] pb-1.5 transition-colors">Initiatives</Link>
                        <Link href="/projects" className="hover:text-[#1A1A1A] pb-1.5 transition-colors">Projects</Link>
                        <Link href="/timeline" className="hover:text-[#1A1A1A] pb-1.5 transition-colors">Timeline</Link>
                    </nav>
                </div>
                <div className="flex items-center gap-4">
                    {/* Public Notification Bell */}
                    <button className="p-2 rounded-lg hover:bg-[#F1F1EF] transition-colors relative" aria-label="Notifications">
                        <svg className="w-5 h-5 text-[#505F76]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#10B981]" />
                    </button>
                    {/* Settings Cog (Public theme switch toggler) */}
                    <button 
                        onClick={() => setShowStyleConfig(!showStyleConfig)}
                        className={`p-2 rounded-lg hover:bg-[#F1F1EF] transition-colors ${showStyleConfig ? "bg-[#F1F1EF] text-[#1A1A1A]" : ""}`} 
                        aria-label="Toggle Styles Panel"
                    >
                        <svg className="w-5 h-5 text-[#505F76]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </button>
                    {/* User profile picture */}
                    <Link href="/admin" className="w-9 h-9 rounded-full bg-[#E5E5E1] overflow-hidden border border-[#E5E5E1] flex items-center justify-center">
                        <Image
                            src="/images/profile.jpg"
                            alt="Profile"
                            width={36}
                            height={36}
                            unoptimized={true}
                            className="object-cover"
                            onError={(e) => {
                                // Fallback if local image doesn't exist
                                e.currentTarget.src = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=crop&w=80&h=80&q=80";
                            }}
                        />
                    </Link>
                </div>
            </header>

            {/* ========== LEFT FIXED SIDEBAR ========== */}
            <aside className="fixed top-0 left-0 bottom-0 w-[240px] bg-white border-r border-[#E5E5E1] z-50 hidden md:flex flex-col p-6 select-none justify-between transition-all duration-300">
                <div className="space-y-8">
                    {/* Brand header */}
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#1A1A1A] flex items-center justify-center text-white font-extrabold text-sm tracking-tight shadow-sm">
                            JB
                        </div>
                        <div>
                            <h2 className="text-[#1A1A1A] font-extrabold text-base tracking-tight leading-tight">JB Leader</h2>
                            <p className="font-mono text-[9px] uppercase tracking-wider text-[#64748B] font-medium">INFRASTRUCTURE & PM</p>
                        </div>
                    </div>

                    {/* Navigation menu */}
                    <nav className="flex flex-col gap-2">
                        <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-[#F1F1EF] text-[#1A1A1A] text-sm font-semibold transition-all">
                            <span className="text-base">👤</span> Overview
                        </Link>
                        <Link href="/initiatives" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:text-[#1A1A1A] hover:bg-[#F1F1EF] transition-all">
                            <span className="text-base">🚀</span> Initiatives
                        </Link>
                        <Link href="/projects" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:text-[#1A1A1A] hover:bg-[#F1F1EF] transition-all">
                            <span className="text-base">📁</span> Projects
                        </Link>
                        <Link href="/timeline" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium hover:text-[#1A1A1A] hover:bg-[#F1F1EF] transition-all">
                            <span className="text-base">📅</span> Credentials
                        </Link>
                    </nav>
                </div>

                <div className="space-y-4">
                    {/* CONFIGURE STYLES Admin link card */}
                    <button 
                        onClick={() => setShowStyleConfig(!showStyleConfig)}
                        className="w-full bg-white border border-dashed border-[#E5E5E1] rounded-xl p-4 text-left hover:border-[#1A1A1A] transition-all group"
                    >
                        <div className="flex items-center justify-between mb-1.5">
                            <span className="w-5 h-5 rounded-full bg-[#F1F1EF] flex items-center justify-center text-xs">🔧</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                        </div>
                        <h4 className="text-[#1A1A1A] font-bold text-xs group-hover:text-primary transition-colors">CONFIGURE STYLES</h4>
                        <p className="font-mono text-[9px] text-[#64748B] mt-0.5">Admin Setting Panel Console</p>
                    </button>

                    {/* View/Download Resume link */}
                    <a 
                        href="/downloads" 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#505F76] hover:text-[#1A1A1A] text-sm font-semibold transition-all hover:bg-[#F1F1EF]"
                    >
                        <span className="text-base">📥</span> View & Download Resume
                    </a>
                </div>
            </aside>

            {/* ========== PUBLIC STYLE SELECTOR CONFIG DRAWER (SLIDE-DOWN) ========== */}
            {showStyleConfig && (
                <div className="fixed top-[72px] left-0 md:left-[240px] right-0 bg-white border-b border-[#E5E5E1] shadow-md z-40 p-6 animate-slide-down transition-all duration-300">
                    <div className="max-w-4xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <h3 className="text-[#1A1A1A] font-extrabold text-sm tracking-tight mb-1">Color Theme & Layout System</h3>
                            <p className="text-xs text-[#64748B]">Select a premium design palette to instantly morph the entire website interface.</p>
                        </div>
                        <div className="flex flex-wrap gap-2.5">
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
                                    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold border transition-all ${theme === t.name
                                        ? "bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-sm"
                                        : "bg-white text-[#505F76] border-[#E5E5E1] hover:bg-[#F1F1EF] hover:text-[#1A1A1A]"
                                    }`}
                                >
                                    <span 
                                        className="w-4 h-4 rounded-full border border-black/10 shrink-0" 
                                        style={{ background: t.swatch }}
                                    />
                                    {t.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* ========== MAIN GRID CONTENTS ========== */}
            <main className="max-w-[1200px] mx-auto px-6 py-8 sm:px-8 md:py-12 transition-all duration-300">
                {/* Telemetry/Active banner */}
                <div className="bg-white border border-[#E5E5E1] rounded-lg px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 mb-8 font-mono text-[10px] text-[#64748B]">
                    <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse shrink-0" />
                        <span className="text-[#505F76]">Active Address:</span>
                        <code className="text-[#1A1A1A] bg-[#F1F1EF] px-1.5 py-0.5 rounded font-medium">https://jyotirmoyb.com/</code>
                    </div>
                    <div>
                        Source: <span className="font-semibold text-[#1A1A1A]">localStorage DB (src/types.ts)</span> • <Link href="/admin" className="underline hover:text-[#1A1A1A]">Edit dynamic table</Link>
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
                            <div className="flex flex-col md:flex-row lg:flex-col xl:flex-row items-center lg:items-start xl:items-center gap-6 sm:gap-8">
                                {/* Portrait photo Container */}
                                <div className="relative w-36 h-36 rounded-2xl overflow-hidden bg-[#F1F1EF] border border-[#E5E5E1] shrink-0">
                                    <Image
                                        src="/images/profile.jpg"
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
                                    <strong className="text-[#1A1A1A] text-xs font-semibold">Kathmandu, Nepal</strong>
                                </div>
                                <div className="text-center md:text-left lg:text-center xl:text-left border-x border-[#E5E5E1] px-2">
                                    <span className="block text-[#64748B] uppercase tracking-wider mb-1">EXPERIENCE</span>
                                    <strong className="text-[#1A1A1A] text-xs font-semibold">15+ Years</strong>
                                </div>
                                <div className="text-center md:text-left lg:text-center xl:text-left">
                                    <span className="block text-[#64748B] uppercase tracking-wider mb-1">IMPACT</span>
                                    <strong className="text-[#1A1A1A] text-xs font-semibold">hh+ Initiatives</strong>
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
                                        {project.featured_image_url ? (
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
                    </div>
                </div>
            </main>

            {/* ========== FLOATING ACTIONS CHAT WIDGET ICON ========== */}
            <div className="fixed bottom-6 right-6 z-40 select-none">
                <a 
                    href="/contact" 
                    className="w-12 h-12 bg-[#1A1A1A] hover:bg-black text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all hover:scale-105"
                    title="Send a message"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                </a>
            </div>
        </div>
    );
}
