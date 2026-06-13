import Link from "next/link";
import { Metadata } from "next";
import { chartData } from "@/lib/data/architecture";
import MermaidDiagram from "@/components/admin/MermaidDiagram";
export const metadata: Metadata = {
    title: "Site Map | Jyotirmoy Bhowmik",
    description: "Overview of all pages and sections on Jyotirmoy Bhowmik's professional portfolio.",
};

const sitemapStructure = [
    {
        title: "Main Navigation",
        links: [
            { href: "/", label: "Home", description: "The landing page and overview." },
            { href: "/about", label: "About", description: "My professional journey and background." },
            { href: "/initiatives", label: "Initiatives", description: "Strategic IT & Cloud initiatives." },
            { href: "/projects", label: "Projects", description: "Detailed case studies and technical projects." },
            { href: "/skills", label: "Skills", description: "Technical competencies and certifications." },
            { href: "/contact", label: "Contact", description: "Get in touch for professional inquiries." },
        ]
    },
    {
        title: "Extended Features",
        links: [
            { href: "/executive-summary", label: "Executive Summary", description: "High-level professional summary." },
            { href: "/testimonials", label: "Testimonials", description: "Recommendations from colleagues." },
            { href: "/timeline", label: "Timeline", description: "Interactive career timeline." },
            { href: "/blog", label: "Blog", description: "Articles and insights on IT Infrastructure." },
            { href: "/case-studies", label: "Case Studies", description: "In-depth deployment case studies." },
            { href: "/speaking", label: "Speaking", description: "Public speaking and workshop engagements." },
            { href: "/publications", label: "Publications", description: "Published tech articles and guides." },
            { href: "/downloads", label: "Downloads", description: "Downloadable resources and architectures." },
        ]
    },
    {
        title: "Compliance & Policies",
        links: [
            { href: "/privacy", label: "Privacy Policy", description: "Global and India standard data protection." },
            { href: "/deception-and-device-abuse", label: "Deception & Device Abuse", description: "Global and India standard policies." },
        ]
    }
];

export default function SitemapPage() {
    return (
        <div className="min-h-screen pt-20 md:pt-24 pb-12 md:pb-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8 md:mb-12">
                    <h1 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4 tracking-tight">
                        Site <span className="gradient-text">Map</span>
                    </h1>
                    <p className="text-lg md:text-xl text-muted-foreground w-full md:w-2/3">
                        A complete overview of all sections and pages available on the portal.
                    </p>
                </div>

                {/* Sitemap Sections */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                    {sitemapStructure.map((section, idx) => (
                        <div key={idx} className="bg-surface border border-border rounded-xl p-6 md:p-8 hover:border-primary/50 transition-colors">
                            <h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6 pb-2 border-b border-border/50">
                                {section.title}
                            </h2>
                            <ul className="space-y-4">
                                {section.links.map((link) => (
                                    <li key={link.href}>
                                        <Link href={link.href} className="group block focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg">
                                            <div className="flex items-baseline mb-1 gap-2">
                                                <div className="w-1.5 h-1.5 rounded-full bg-primary/40 group-hover:bg-primary transition-colors shrink-0" />
                                                <span className="text-lg font-medium text-foreground group-hover:text-primary transition-colors">
                                                    {link.label}
                                                </span>
                                            </div>
                                            <p className="text-sm text-muted-foreground pl-3.5 border-l-2 border-border/20 group-hover:border-primary/20 transition-colors">
                                                {link.description}
                                            </p>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>

            {/* Architectural Diagram */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 md:mt-24">
                <div className="mb-6 md:mb-8 text-center">
                    <h2 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4 tracking-tight">
                        Architecture <span className="gradient-text">Diagram</span>
                    </h2>
                    <p className="text-lg text-muted-foreground">
                        An interactive dependency graph of the codebase modules and their connections. 
                        You can zoom and pan to explore the structure.
                    </p>
                </div>
                <div className="bg-surface/30 p-2 md:p-4 rounded-2xl border border-border shadow-xl h-[600px] overflow-hidden">
                    <MermaidDiagram chart={chartData} id="public-architecture-map" />
                </div>
            </div>
        </div>
    );
}
