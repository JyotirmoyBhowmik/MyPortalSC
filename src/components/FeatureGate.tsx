/**
 * FeatureGate — Server Component for conditional rendering based on DB flags.
 * Checks feature_flag value in Supabase and renders children only if enabled.
 * This is the primary mechanism for toggling entire sections without deploys.
 *
 * Usage:
 *   <FeatureGate feature="feature_blog">
 *     <BlogSection />
 *   </FeatureGate>
 */
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
