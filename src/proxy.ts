import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

// Cache in global memory to prevent latency on every edge invocation
let cachedSecurityFlag: boolean | null = null;
let lastFetchTime = 0;
const CACHE_TTL_MS = 60000; // 1 minute

export async function proxy(request: NextRequest) {
    // 1. Let the original session update run to handle Auth
    const response = await updateSession(request);

    // 2. UpGuard Strict Security Headers
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    // Default to true for max safety if fetch fails
    let isStrictSecurityEnabled = true;

    if (supabaseUrl && supabaseKey) {
        if (Date.now() - lastFetchTime > CACHE_TTL_MS || cachedSecurityFlag === null) {
            try {
                // Fetch the specific flag via Supabase REST API natively cached
                const res = await fetch(
                    `${supabaseUrl}/rest/v1/site_settings?key=eq.feature_strict_security_headers&select=value`,
                    {
                        headers: {
                            apikey: supabaseKey,
                            Authorization: `Bearer ${supabaseKey}`
                        },
                        next: { revalidate: 60 }
                    }
                );
                
                if (res.ok) {
                    const data = await res.json();
                    if (data && data.length > 0) {
                        const val = data[0].value;
                        isStrictSecurityEnabled = val === true || val === "true";
                        cachedSecurityFlag = isStrictSecurityEnabled;
                        lastFetchTime = Date.now();
                    } else {
                        // If record doesn't exist, check the old feature_csp_headers just in case
                        const resOld = await fetch(
                            `${supabaseUrl}/rest/v1/site_settings?key=eq.feature_csp_headers&select=value`,
                            {
                                headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` },
                                next: { revalidate: 60 }
                            }
                        );
                        if (resOld.ok) {
                            const dataOld = await resOld.json();
                            if (dataOld && dataOld.length > 0) {
                                const valOld = dataOld[0].value;
                                isStrictSecurityEnabled = valOld === true || valOld === "true";
                            }
                        }
                    }
                }
            } catch (err) {
                // Silently fallback to cached or default on network error
            }
        } else {
            isStrictSecurityEnabled = cachedSecurityFlag;
        }
    }

    // Always apply standard baseline headers
    response.headers.set("X-DNS-Prefetch-Control", "on");
    response.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
    response.headers.set("X-XSS-Protection", "1; mode=block"); // Addresses UpGuard XSS vulnerability flag
    response.headers.set("X-Content-Type-Options", "nosniff");
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");

    if (isStrictSecurityEnabled) {
        // Strict Setup: Block framing and strict CSP without unsafe-eval
        response.headers.set("X-Frame-Options", "SAMEORIGIN");
        
        const csp = `
            default-src 'self';
            script-src 'self' 'unsafe-inline' https://vercel.live https://static.cloudflareinsights.com https://challenges.cloudflare.com;
            style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
            img-src 'self' data: https: blob:;
            font-src 'self' data: https://fonts.gstatic.com;
            object-src 'none';
            base-uri 'self';
            frame-ancestors 'self';
            frame-src 'self' https://challenges.cloudflare.com;
            worker-src 'self' blob:;
            media-src 'self' blob: https://*.supabase.co mediastream:;
            connect-src 'self' https://vercel.live https://*.supabase.co wss://*.supabase.co wss://*.googleapis.com https://*.googleapis.com;
        `.replace(/\s{2,}/g, ' ').trim();
        
        response.headers.set("Content-Security-Policy", csp);
    } else {
        // Relaxed fallback for debugging mode or if disabled by Admin
        response.headers.set("X-Frame-Options", "ALLOWALL");
    }

    return response;
}

// Ensure middleware only fires on active user pages to optimize performance
export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
