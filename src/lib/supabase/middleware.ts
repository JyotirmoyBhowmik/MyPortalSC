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
        if (
            !user &&
            !request.nextUrl.pathname.startsWith("/admin/login")
        ) {
            const url = request.nextUrl.clone();
            url.pathname = "/admin/login";
            return NextResponse.redirect(url);
        }

        // If user is logged in and tries to visit login page, redirect to dashboard
        if (user && request.nextUrl.pathname === "/admin/login") {
            const url = request.nextUrl.clone();
            url.pathname = "/admin";
            return NextResponse.redirect(url);
        }
    }

    return supabaseResponse;
}
