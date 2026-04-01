/**
 * Admin Panel Layout — The root layout for all /admin routes.
 * Forces dynamic rendering (no SSR/SSG build-time caching) because admin routes
 * require fresh auth state and Supabase environment variables on every request.
 */
import AdminShell from "@/components/admin/AdminShell";
import { getFeatureFlag } from "@/lib/data/settings";

// Force all admin routes to be server-rendered on demand (never prerendered)
// This prevents build errors when Supabase env vars aren't available at build time
export const dynamic = "force-dynamic";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [allowAdminSearch, enableRbac] = await Promise.all([
        getFeatureFlag("feature_admin_search"),
        getFeatureFlag("feature_rbac"),
    ]);
    return <AdminShell allowAdminSearch={allowAdminSearch} enableRbac={enableRbac}>{children}</AdminShell>;
}
