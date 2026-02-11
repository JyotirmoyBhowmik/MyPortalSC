/* ─────────────────────────────────────────────────────
   FeatureGate — Conditionally render based on DB toggle
   Usage:
     <FeatureGate feature="feature_blog">
       <BlogSection />
     </FeatureGate>
   ───────────────────────────────────────────────────── */
import { getFeatureFlag } from "@/lib/data/settings";

interface Props {
    feature: string;
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

export default async function FeatureGate({ feature, children, fallback }: Props) {
    const enabled = await getFeatureFlag(feature);
    if (!enabled) return fallback ?? null;
    return <>{children}</>;
}
