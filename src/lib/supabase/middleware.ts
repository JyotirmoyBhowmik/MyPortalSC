import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    // If env vars are missing, skip Supabase session refresh and just continue
    if (!supabaseUrl || !supabaseAnonKey) {
        // Still protect admin routes even without Supabase
        if (
            request.nextUrl.pathname.startsWith("/admin") &&
            !request.nextUrl.pathname.startsWith("/admin/login")
        ) {
            const url = request.nextUrl.clone();
            url.pathname = "/admin/login";
            return NextResponse.redirect(url);
        }
        return NextResponse.next();
    }

    let supabaseResponse = NextResponse.next({
        request,
    });

    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
        cookies: {
            getAll() {
                return request.cookies.getAll();
            },
            setAll(cookiesToSet) {
                cookiesToSet.forEach(({ name, value }) =>
                    request.cookies.set(name, value)
                );
                supabaseResponse = NextResponse.next({
                    request,
                });
                cookiesToSet.forEach(({ name, value, options }) =>
                    supabaseResponse.cookies.set(name, value, options)
                );
            },
        },
    });

    // Refresh the auth token
    let user = null;
    try {
        const { data } = await supabase.auth.getUser();
        user = data?.user ?? null;
    } catch {
        // Auth check failed — treat as unauthenticated
    }

    // Protect admin routes: redirect to login if not authenticated
    if (request.nextUrl.pathname.startsWith("/admin")) {
        if (!user && !request.nextUrl.pathname.startsWith("/admin/login")) {
            const url = request.nextUrl.clone();
            url.pathname = "/admin/login";
            return NextResponse.redirect(url);
        }

        if (user && request.nextUrl.pathname === "/admin/login") {
            const url = request.nextUrl.clone();
            url.pathname = "/admin";
            return NextResponse.redirect(url);
        }

        // --- RBAC Implementation ---
        if (user && !request.nextUrl.pathname.startsWith("/admin/login")) {
            // Check if user is in admin_users and what their role is
            const { data: adminRecord } = await supabase
                .from("admin_users")
                .select("role")
                .eq("user_id", user.id)
                .single();

            // 1. Not an admin at all (e.g., standard authenticated consumer user, if those existed)
            if (!adminRecord) {
                // Force logout and redirect
                await supabase.auth.signOut();
                const url = request.nextUrl.clone();
                url.pathname = "/admin/login";
                return NextResponse.redirect(url);
            }

            // 2. Protect Super Admin Routes
            const pathname = request.nextUrl.pathname;
            const isSuperAdminRoute =
                pathname.startsWith("/admin/users") ||
                pathname.startsWith("/admin/settings") ||
                pathname.startsWith("/admin/audit");

            if (isSuperAdminRoute && adminRecord.role !== "super_admin") {
                // If an 'admin' tries to access a 'super_admin' route, kick them back to the dashboard
                const url = request.nextUrl.clone();
                url.pathname = "/admin";
                return NextResponse.redirect(url);
            }
        }
    }

    return supabaseResponse;
}
