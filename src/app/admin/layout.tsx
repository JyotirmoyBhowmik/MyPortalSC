import AdminShell from "@/components/admin/AdminShell";

// Force all admin routes to be server-rendered on demand (never prerendered)
// This prevents build errors when Supabase env vars aren't available at build time
export const dynamic = "force-dynamic";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <AdminShell>{children}</AdminShell>;
}
