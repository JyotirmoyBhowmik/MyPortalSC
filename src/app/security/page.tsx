import type { Metadata } from "next";
import dynamic from "next/dynamic";

const SecurityScorecard = dynamic(() => import("@/components/visuals/SecurityScorecard"), {
    loading: () => (
        <div className="flex items-center justify-center py-20">
            <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
    ),
});

export const metadata: Metadata = {
    title: "Security | Jyotirmoy Bhowmik",
    description:
        "Live security posture assessment for jyotirmoyb.com — HTTP headers, CSP, HSTS, and more.",
};

import { getFeatureFlag } from "@/lib/data/settings";
import { notFound } from "next/navigation";

export default async function SecurityPage() {
    const isEnabled = await getFeatureFlag("feature_security_scorecard");
    if (!isEnabled) notFound();
    return (
        <main className="min-h-screen pt-24 pb-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Hero */}
                <section className="text-center py-12">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 mb-6">
                        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                        <span className="text-xs font-medium text-green-400">Live Scan</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black mb-4">
                        Security <span className="gradient-text">Scorecard</span>
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                        Real-time assessment of HTTP security headers protecting this site.
                        Walk the talk — enterprise security starts at the application layer.
                    </p>
                </section>

                {/* Scorecard */}
                <SecurityScorecard />

                {/* Footer note */}
                <div className="mt-12 text-center">
                    <p className="text-xs text-muted-foreground">
                        This page performs a live self-scan of the site&apos;s HTTP response headers.
                        <br />
                        Results reflect real-time configuration from the Edge Middleware.
                    </p>
                </div>
            </div>
        </main>
    );
}
