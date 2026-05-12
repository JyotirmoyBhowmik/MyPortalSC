import type { Metadata } from "next";
import {
    getPageContent,
    getContentField,
    getContentData,
} from "@/lib/data/content";
import { getSkillsByCategory } from "@/lib/data/skills";
import { getAllAchievements } from "@/lib/data/achievements";
import Link from "next/link";
import Image from "next/image";
import VideoPlayer from "@/components/visuals/VideoPlayer";
import dynamic from "next/dynamic";
import { getFeatureFlag, getSetting } from "@/lib/data/settings";
import CredlyBadge from "@/components/ui/CredlyBadge";

const NetworkTopology = dynamic(() => import("@/components/visuals/NetworkTopology"), {
    loading: () => <div className="w-full h-[400px] animate-pulse bg-surface/10 rounded-xl" />
});
const CostComparison = dynamic(() => import("@/components/visuals/CostComparison"), {
    loading: () => <div className="w-full h-[500px] animate-pulse bg-surface/10 rounded-xl" />
});

export const revalidate = 60;

export const metadata: Metadata = {
    title: "About",
    description:
        "Learn about Jyotirmoy Bhowmik — IT Infrastructure & Project Management leader with 15+ years delivering enterprise technology programs.",
};

/* ─── Hardcoded professional data (shown if DB has no content_pages override) ─── */

const professionalSummaryPoints = [
    "IT Infrastructure & Project Management leader with 15+ years of experience delivering secure, resilient enterprise infrastructure and technology programs across India and Nepal with multi-country coordination exposure (Singapore, Malaysia, Bangladesh, Australia).",
    "Strong track record in data center operations, disaster recovery transformation, cloud strategy and migrations (AWS/Azure), Microsoft 365 modernization, and large-scale network & security upgrades.",
    "Deep experience working with Industrial Control Systems (ICS) / SCADA environments—driving IT/OT connectivity, OT security roadmap planning, and segmentation initiatives aligned to IEC 62443 principles.",
    "Skilled in evaluating current-state environments (infra, network, security, IT/OT)—performing gap/risk assessment, defining target architecture (Landing Zone / hybrid), and building practical roadmaps to improve resilience, compliance, and service quality.",
    "Proven people leader and stakeholder partner—leading teams (4–16 members), vendors, and cross-functional groups; delivering outcomes through structured governance, documentation, SOPs, and audit readiness.",
    "Delivered automation and analytics outcomes including 30+ RPA bots and BI dashboards (Tableau/Power BI) to improve operational efficiency and reporting.",
];

const visionStatement =
    "To drive purposeful technology transformation that strengthens enterprise resilience, operational efficiency, and security posture—bridging IT infrastructure, cloud, and OT environments through structured governance, practical roadmaps, and collaborative leadership.";

const experience = [
    {
        role: "Project Manager & IT Infrastructure Team Lead",
        company: "ITC Infotech India Ltd. (Seconded to Surya Nepal Pvt. Ltd.)",
        location: "Kolkata, India",
        period: "Sep 2016 – Present",
        description:
            "Lead infrastructure operations and project delivery for enterprise Data Center, Disaster Recovery, ICS/SCADA and SAP ERP environments; manage vendors and coordinate global project teams to align technology outcomes with business objectives.\n\n• Own end-to-end infrastructure delivery and operations across data center, DR, server platforms, and network/security services.\n• Drive cloud modernization—migrated enterprise productivity to Microsoft 365 (E3/E5) with SharePoint/OneDrive.\n• Modernized security posture with Zscaler SASE, replacing legacy proxy/VPN.\n• Led DR migration from traditional to hybrid virtual design with landing-zone approach.\n• Deployed 30+ RPA bots across IT service desk and finance/reporting processes.\n• Built Tableau/Power BI dashboards for sales, inventory, and performance reporting.\n• Delivered IT/OT connectivity improvements for SCADA environments and sustainability initiatives.",
        techEnv: "AWS; Azure; Microsoft 365; VMware; Hyper-V; RHEL; Windows Server; Cisco; Palo Alto/Fortinet/Check Point; Zscaler SASE; Commvault; HPE StoreOnce; Tableau; Power BI; UiPath; Zabbix",
    },
    {
        role: "Senior Engineer – IT Infrastructure & System Integration",
        company: "Payoda Technologies Pvt. Ltd.",
        location: "Aizawl, India",
        period: "May 2014 – Sep 2016",
        description:
            "Client: Mizoram State Data Centre, Mizoram State e-Governance Society (Govt. of Mizoram)\n\n• Primary networking and security engineer for a state government data center; led a 12-member team supporting LAN/WAN, switching and firewall security for e-governance applications.\n• Technical lead for RHEL Linux and SQL Server environments—installation, configuration, performance tuning, patching and availability management.\n• Conducted requirement analysis and contributed to infrastructure upgrade design; coordinated vendors and procurement.",
        techEnv: "RHEL; SQL Server; Cisco; Juniper; Palo Alto; VMware",
    },
    {
        role: "Assistant System Administrator Engineer",
        company: "Global Innov Source (Sify Technologies)",
        location: "Agartala, India",
        period: "Jun 2012 – Apr 2014",
        description:
            "Client: Tripura State Data Center, Tripura State e-Governance Society (Govt. of Tripura)\n\n• Supported Tier-III data center operations within a 16-member team; administered RHEL server farms and network devices.\n• Assisted implementation of virtualization and backup systems; supported incident resolution and performance improvements.\n• Created documentation and trained junior team members to standardize operational processes.",
        techEnv: "RHEL; VMware; Cisco; Network monitoring tools",
    },
];

const education = [
    { degree: "Master of Computer Applications (MCA)", institution: "Tripura University", year: "2013" },
    { degree: "Bachelor of Computer Applications (BCA)", institution: "ICFAI University (Tripura)", year: "2010" },
    { degree: "Higher Secondary (12th, Science)", institution: "National Institute of Open Schooling (NIOS)", year: "2007" },
];

const coreRoles = [
    "Lead OT/IT network architecture and multi-site roadmap execution (LAN/WAN/Wi-Fi; secure segmentation).",
    "Operate Data Center, DR and backup/restore governance (availability, capacity and recovery readiness).",
    "Manage ISP/WAN/Internet services; coordinate endpoint operations, patching and compliance renewals.",
    "Own budgeting, CAPEX/OPEX procurement, vendor negotiation and contract renewals; deliver service reporting.",
];

const businessValueThemes = [
    { theme: "Risk Reduction", desc: "Reduced operational/cyber risk through stronger security architecture, controlled access and governance." },
    { theme: "Reliability", desc: "Improved reliability via standardization, lifecycle remediation and DC/DR/backup resilience." },
    { theme: "Collaboration", desc: "Faster execution and collaboration through modern workplace adoption and digitized workflows." },
    { theme: "Transparency", desc: "Better transparency with monitoring dashboards, health reporting and disciplined operational reviews." },
    { theme: "Cost Control", desc: "Stronger cost control through budgeting discipline, vendor negotiation and timely renewals." },
];

const selectedPrograms = [
    "Industrial OT Network Segmentation aligned to IEC 62443 principles",
    "Cloud Landing Zone Architecture Design",
    "Core Network Switch Lifecycle Replacement – EOL remediation",
    "Core Backbone Upgrade (1G to 10G)",
    "Disaster Recovery Geo-Redundancy Migration",
    "Enterprise Backup & Storage Enhancement / Disk-Based Backup Modernization",
    "Microsoft 365 Enterprise Rollout + Intune/MDM procurement",
    "Network Access Control (RADIUS/802.1x) & AAA security implementation",
    "Infrastructure Observability Suite (Zabbix)",
    "Unified Enterprise Wi-Fi 6 Rollout (Multi-Site)",
    "Mission-Critical ERP Virtualization and Zero-Impact ERP OS Migration",
    "RPA deployment (Attended/Unattended) scale-out + Finance/Service Desk automation",
];

/* ─── Component ─── */

export default async function AboutPage() {
    const [pageContent, skillsByCategory, achievements] = await Promise.all([
        getPageContent("about"),
        getSkillsByCategory(),
        getAllAchievements(),
    ]);

    const showTopology = await getFeatureFlag("feature_network_topology");
    const showCostComparison = await getFeatureFlag("feature_cost_comparison");
    const infraCostConfigStr = await getSetting("config_infra_cost");
    const infraCostConfig = typeof infraCostConfigStr === "string" ? JSON.parse(infraCostConfigStr) : infraCostConfigStr;

    const biography = getContentField(pageContent?.content, "biography");
    const dbVision = getContentField(pageContent?.content, "vision_statement");
    const dbExperience = getContentData(pageContent?.content, "experience");
    const dbEducation = getContentData(pageContent?.content, "education");
    const dbVideoLink = getContentField(pageContent?.content, "videoLink");

    // Profile photo — use DB-managed URL, fall back to static file
    const profilePhotoUrl = await getSetting("profile_photo_url");
    const profilePhotoSrc = (typeof profilePhotoUrl === "string" && profilePhotoUrl.trim()) 
        ? profilePhotoUrl.trim() 
        : "/images/profile.jpg";

    const displayVision = dbVision || visionStatement;
    const displayExperience = dbExperience || experience;
    const displayEducation = dbEducation || education;
    const displayVideoLink = dbVideoLink || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

    return (
        <>
            {/* Hero */}
            <section className="py-24 px-4 relative overflow-hidden">
                <div className="absolute inset-0 dot-pattern opacity-20" />
                <div
                    className="absolute inset-0"
                    style={{ background: "var(--gradient-hero)" }}
                />

                <div className="relative z-10 max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl sm:text-5xl font-bold mb-6 animate-slide-up">
                        About <span className="gradient-text">Me</span>
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-slide-up stagger-1">
                        IT Infrastructure &amp; Project Management Leader with 15+ years
                        delivering secure, resilient enterprise technology programs.
                    </p>
                </div>
            </section>

            {/* Professional Summary + Bio */}
            <section className="py-16 px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="glass rounded-xl p-8 sm:p-12 mb-12">
                        <div className="flex items-start gap-6">
                            {/* Profile Photo */}
                            <div className="hidden sm:block flex-shrink-0">
                                <div className="relative w-24 h-24 rounded-2xl overflow-hidden ring-2 ring-primary/30 ring-offset-2 ring-offset-background shadow-xl">
                                    <Image
                                        src={profilePhotoSrc}
                                        alt="Jyotirmoy Bhowmik — Professional Photo"
                                        fill
                                        className="object-cover"
                                        sizes="96px"
                                        priority
                                        unoptimized={profilePhotoSrc.startsWith("blob:")}
                                    />
                                    {/* Fallback initials overlay — hidden when image loads */}
                                    <div className="absolute inset-0 gradient-bg flex items-center justify-center text-white text-2xl font-bold select-none" aria-hidden="true">
                                        JB
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold mb-2">Jyotirmoy Bhowmik</h2>
                                <p className="text-primary font-medium mb-4">
                                    Project Manager – IT Infrastructure &amp; Network | Security | Cloud
                                </p>
                                {biography ? (
                                    <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                                        {biography}
                                    </p>
                                ) : (
                                    <ul className="space-y-3">
                                        {professionalSummaryPoints.map((point, i) => (
                                            <li key={i} className="flex gap-3 text-muted-foreground leading-relaxed">
                                                <span className="text-primary mt-1 flex-shrink-0">▸</span>
                                                <span>{point}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Video Introduction */}
                    <div className="mb-16">
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-black/50 aspect-video">
                            <VideoPlayer
                                src={displayVideoLink}
                                poster="/images/video-poster.jpg"
                                className="w-full h-full"
                            />
                            <div className="absolute bottom-6 left-6 right-6">
                                <h3 className="text-white text-xl font-bold mb-2 drop-shadow-md">Leading with Purpose</h3>
                                <p className="text-white/80 text-sm max-w-lg drop-shadow-md">
                                    A brief introduction to my leadership philosophy and delivering value efficiently.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Vision Statement */}
                    {displayVision && (
                        <div className="relative p-8 sm:p-10 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent border border-primary/20 mb-16">
                            <div className="absolute top-0 left-0 -translate-x-3 -translate-y-3 text-6xl text-primary/20 font-serif">
                                &ldquo;
                            </div>
                            <h3 className="text-xl font-semibold text-primary mb-4 flex items-center gap-2">
                                <span className="w-8 h-[1px] bg-primary"></span>
                                Vision Statement
                            </h3>
                            <blockquote className="text-xl sm:text-2xl font-medium leading-relaxed text-foreground">
                                {displayVision}
                            </blockquote>
                        </div>
                    )}

                    {/* Selected High-Impact Programs */}
                    <div className="mb-16">
                        <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
                            <span className="w-2 h-8 bg-primary rounded-full" />
                            Selected <span className="gradient-text">Programs Delivered</span>
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {selectedPrograms.map((prog, idx) => (
                                <div key={idx} className="flex items-start gap-3 glass rounded-lg p-4 hover-lift">
                                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold flex-shrink-0 mt-0.5">
                                        {idx + 1}
                                    </div>
                                    <span className="text-sm text-foreground">{prog}</span>
                                </div>
                            ))}
                        </div>
                        <div className="text-center mt-6">
                            <Link
                                href="/initiatives"
                                className="inline-flex items-center gap-2 text-primary hover:text-primary-hover font-medium transition-colors"
                            >
                                View all 88 initiatives
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </Link>
                        </div>
                    </div>

                    {/* Enterprise Architecture */}
                    {showTopology && (
                        <div className="mb-16">
                            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
                                <span className="w-2 h-8 bg-primary rounded-full" />
                                Enterprise <span className="gradient-text">Architecture</span>
                            </h2>
                            <NetworkTopology />
                        </div>
                    )}

                    {/* Infrastructure Cost Model */}
                    {showCostComparison && (
                        <div className="mb-16">
                            <CostComparison initialCategories={infraCostConfig || undefined} />
                        </div>
                    )}

                    {/* Professional Experience */}
                    <div className="mb-16">
                        <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
                            <span className="w-2 h-8 bg-accent rounded-full" />
                            Professional <span className="gradient-text">Experience</span>
                        </h2>
                        <div className="space-y-8 pl-4 border-l-2 border-border/50">
                            {(displayExperience as Record<string, string | string[]>[]).map((exp: Record<string, any>, idx: number) => (
                                <div key={idx} className="relative pl-8">
                                    <div className="absolute top-0 left-[-9px] w-4 h-4 rounded-full bg-background border-2 border-accent" />
                                    <div className="glass p-6 rounded-xl hover-lift">
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                                            <h3 className="text-xl font-bold text-foreground">
                                                {exp.role}
                                            </h3>
                                            <span className="text-sm font-medium px-3 py-1 rounded-full bg-primary/10 text-primary self-start sm:self-auto">
                                                {exp.period}
                                            </span>
                                        </div>
                                        <div className="mb-4">
                                            <p className="text-lg font-medium text-accent">
                                                {exp.company}
                                            </p>
                                            <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                                {exp.location}
                                            </p>
                                        </div>
                                        <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                                            {exp.description}
                                        </p>
                                        {exp.techEnv && (
                                            <div className="mt-4 pt-4 border-t border-border/50">
                                                <p className="text-xs text-muted-foreground">
                                                    <span className="font-semibold text-primary">Technology Environment:</span>{" "}
                                                    {exp.techEnv}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Core Roles & Responsibilities */}
                    <div className="mb-16">
                        <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
                            <span className="w-2 h-8 bg-success rounded-full" />
                            Core Roles & <span className="gradient-text">Responsibilities</span>
                        </h2>
                        <div className="glass rounded-xl p-8">
                            <ul className="space-y-4">
                                {coreRoles.map((role, idx) => (
                                    <li key={idx} className="flex items-start gap-3">
                                        <span className="w-6 h-6 rounded-full bg-success/10 flex items-center justify-center text-success text-sm flex-shrink-0 mt-0.5">✓</span>
                                        <span className="text-foreground leading-relaxed">{role}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Business Value Delivered */}
                    <div className="mb-16">
                        <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
                            <span className="w-2 h-8 bg-warning rounded-full" />
                            Business Value <span className="gradient-text">Delivered</span>
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {businessValueThemes.map((bv, idx) => (
                                <div key={idx} className="glass rounded-xl p-6 hover-lift">
                                    <h3 className="text-lg font-semibold text-primary mb-2">{bv.theme}</h3>
                                    <p className="text-sm text-muted-foreground leading-relaxed">{bv.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Education */}
                    <div className="mb-16">
                        <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
                            <span className="w-2 h-8 bg-primary rounded-full" />
                            Education
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {(displayEducation as Record<string, string | string[]>[]).map((edu: Record<string, any>, idx: number) => (
                                <div key={idx} className="glass p-6 rounded-xl hover-lift">
                                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-xl font-bold mb-4">
                                        🎓
                                    </div>
                                    <h3 className="text-lg font-bold text-foreground mb-1">
                                        {edu.degree}
                                    </h3>
                                    <p className="text-accent font-medium mb-2">{edu.institution}</p>
                                    <p className="text-sm text-muted-foreground">{edu.year}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Languages */}
                    <div className="mb-16">
                        <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                            <span className="w-2 h-8 bg-success rounded-full" />
                            Languages
                        </h2>
                        <div className="glass p-6 rounded-xl inline-block">
                            <p className="text-lg text-foreground font-medium">
                                Hindi, English, Bengali (Fluent)
                            </p>
                        </div>
                    </div>

                    {/* Certifications & Credly Badges */}
                    <div className="mb-16">
                        <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
                            <span className="w-2 h-8 bg-accent rounded-full" />
                            Certifications &amp; <span className="gradient-text">Badges</span>
                        </h2>
                        <div className="glass rounded-xl p-8">
                            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                                Verified digital credentials issued by industry-recognized certification bodies.
                            </p>
                            <div className="flex flex-wrap gap-8 items-start">
                                {/* Credly Badge — Google IT Support */}
                                <div className="flex flex-col items-center gap-2">
                                    <CredlyBadge
                                        badgeId="a2220b94-78b5-40ec-903a-4df93599bff4"
                                        width={150}
                                        height={270}
                                    />
                                </div>
                            </div>
                            <div className="mt-6 pt-4 border-t border-border/30">
                                <a
                                    href="https://www.credly.com/users/jyotirmoy-bhowmik/badges"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary-hover font-medium transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                    View all badges on Credly
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Skills Deep Dive */}
            <section className="py-16 px-4 bg-surface/50">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl font-bold mb-12 text-center">
                        Core <span className="gradient-text">Competencies</span>
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {Object.entries(skillsByCategory).map(([category, skills]) => (
                            <div key={category} className="glass rounded-xl p-6">
                                <h3 className="text-lg font-semibold text-primary mb-6 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-primary" />
                                    {category}
                                </h3>
                                <div className="space-y-4">
                                    {skills.map((skill) => (
                                        <div key={skill.id} className="flex items-center gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-1.5">
                                                    <span className="text-sm font-medium">
                                                        {skill.name}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground">
                                                        {skill.proficiency_level && `${skill.proficiency_level}/5 · `}
                                                        {skill.years_of_experience}y exp
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
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Achievements */}
            <section className="py-16 px-4">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold mb-12 text-center">
                        <span className="gradient-text">Achievements</span>
                    </h2>

                    <div className="space-y-6">
                        {achievements.map((achievement, i) => (
                            <div
                                key={achievement.id}
                                className={`glass rounded-xl p-6 hover-lift stagger-${i + 1}`}
                            >
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-accent/15 flex items-center justify-center text-accent text-lg flex-shrink-0">
                                        🏅
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-foreground">
                                            {achievement.title}
                                        </h3>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            {achievement.description}
                                        </p>
                                        <div className="flex items-center gap-3 mt-3">
                                            {achievement.category && (
                                                <span className="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary">
                                                    {achievement.category}
                                                </span>
                                            )}
                                            <span className="text-xs text-muted-foreground">
                                                {new Date(
                                                    achievement.achievement_date
                                                ).toLocaleDateString("en-US", {
                                                    month: "long",
                                                    year: "numeric",
                                                })}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {achievements.length === 0 && (
                            <p className="text-center text-muted-foreground py-8">
                                Achievements coming soon…
                            </p>
                        )}
                    </div>
                </div>
            </section>
        </>
    );
}
