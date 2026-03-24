import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { createClient } from "@supabase/supabase-js";

export async function proxy(request: NextRequest) {
    // 1. Let the original session update run to handle Auth
    const response = await updateSession(request);

    // 2. Check if CSP Headers are enabled and inject them
    try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

        if (supabaseUrl && supabaseAnonKey) {
            const supabase = createClient(supabaseUrl, supabaseAnonKey, {
                auth: { persistSession: false }
            });

            // Using select to be fast
            const { data } = await supabase
                .from("site_settings")
                .select("value")
                .eq("key", "feature_csp_headers")
                .single();

            if (data?.value === true || data?.value === "true") {
                // Apply strict security headers
                response.headers.set('X-Content-Type-Options', 'nosniff');
                response.headers.set('X-Frame-Options', 'DENY');
                response.headers.set('X-XSS-Protection', '1; mode=block');
                response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');

                // Content Security Policy
                response.headers.set(
                    'Content-Security-Policy',
                    "default-src 'self'; " +
                    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://challenges.cloudflare.com https://vercel.live https://static.cloudflareinsights.com; " +
                    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
                    "img-src 'self' blob: data: https:; " +
                    "font-src 'self' data: https://fonts.gstatic.com; " +
                    "frame-src 'self' https://challenges.cloudflare.com; " +
                    "connect-src 'self' https: wss:;"
                );
            }
        }
    } catch (e) {
        // Fail silently and proceed without headers if db is unreachable
        console.error("Proxy settings fetch error:", e);
    }

    return response;
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico, sitemap.xml, robots.txt (metadata files)
         */
        '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
};
