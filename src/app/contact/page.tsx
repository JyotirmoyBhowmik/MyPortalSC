import type { Metadata } from "next";
import { getPageContent, getContentField } from "@/lib/data/content";
import dynamic from "next/dynamic";

const GlobalOperationsDashboard = dynamic(() => import("@/components/visuals/GlobalOperationsDashboard"), {
    loading: () => <div className="w-full h-[450px] animate-pulse bg-surface/10 rounded-xl" />
});
const PingDashboard = dynamic(() => import("@/components/visuals/PingDashboard"), {
    loading: () => <div className="w-full h-[200px] animate-pulse bg-surface/10 rounded-xl" />
});
import ContactForm from "@/components/forms/ContactForm";

export const revalidate = 60;

export const metadata: Metadata = {
    title: "Contact",
    description:
        "Get in touch with Jyotirmoy Bhowmik for collaborations, projects, and opportunities.",
};

const socialLinks = [
    {
        label: "GitHub",
        key: "github",
        icon: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
        ),
    },
    {
        label: "LinkedIn",
        key: "linkedin",
        icon: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
        ),
    },
    {
        label: "Twitter / X",
        key: "twitter",
        icon: (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
        ),
    },
];

export default async function ContactPage() {
    const pageContent = await getPageContent("contact");

    const email = getContentField(pageContent?.content, "email");
    const github = getContentField(pageContent?.content, "github") || "https://github.com/JyotirmoyBhowmik";
    const linkedin = getContentField(pageContent?.content, "linkedin") || "https://www.linkedin.com/in/jyotirmoybhowmik/";
    const twitter = getContentField(pageContent?.content, "twitter") || "https://x.com/jyotu_b";

    // Global Operations Overrides
    const globalOpsTitle = getContentField(pageContent?.content, "global_ops_title") || "Global Operations";
    const globalOpsDesc = getContentField(pageContent?.content, "global_ops_desc") || "Delivering excellence across borders.";

    const socialUrls: Record<string, string> = { github, linkedin, twitter };

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
                        Get in <span className="gradient-text">Touch</span>
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-slide-up stagger-1">
                        I&apos;m always open to new opportunities, collaborations, and
                        conversations. Feel free to reach out!
                    </p>
                </div>
            </section>

            {/* Global Reach */}
            <section className="py-12 px-4 bg-muted/30">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold mb-2">{globalOpsTitle}</h2>
                        <p className="text-muted-foreground text-sm">{globalOpsDesc}</p>
                    </div>
                    <GlobalOperationsDashboard />
                    <div className="mt-6">
                        <PingDashboard />
                    </div>
                </div>
            </section>

            {/* Contact Content */}
            <section className="py-16 px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Direct Contact */}
                        <div className="glass rounded-xl p-8">
                            <h2 className="text-xl font-semibold mb-6">Direct Contact</h2>

                            {/* Email */}
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                                    <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                        />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Email</p>
                                    <a
                                        href={`mailto:${email || "contact@jyotirmoy.dev"}`}
                                        className="text-foreground hover:text-primary transition-colors font-medium"
                                    >
                                        {email || "contact@jyotirmoy.dev"}
                                    </a>
                                </div>
                            </div>

                            {/* Location */}
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center text-accent flex-shrink-0">
                                    <svg
                                        className="w-5 h-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                        />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                        />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Location</p>
                                    <p className="text-foreground font-medium">Kathmandu, Nepal</p>
                                </div>
                            </div>

                            {/* Phone */}
                            <div className="flex items-center gap-4 mt-6">
                                <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center text-success flex-shrink-0">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm text-muted-foreground">Phone</p>
                                    <p className="text-foreground font-medium">+977-9801009825</p>
                                    <p className="text-foreground font-medium">+91-9774135614</p>
                                </div>
                            </div>

                            {/* Social Links */}
                            <div className="mt-8 pt-8 border-t border-border">
                                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                                    Connect Online
                                </h3>
                                <div className="flex gap-3">
                                    {socialLinks.map((social) => {
                                        const url = socialUrls[social.key];
                                        if (!url) return null;
                                        return (
                                            <a
                                                key={social.key}
                                                href={url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-3 rounded-lg bg-muted text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"
                                                aria-label={social.label}
                                            >
                                                {social.icon}
                                            </a>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="glass rounded-xl p-8">
                            <h2 className="text-xl font-semibold mb-6">Send a Message</h2>
                            <ContactForm />
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
