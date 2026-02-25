import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
    // 1. Supabase Session Refresh (and Route Access Control)
    const response = await updateSession(request);

    // 2. Fetch feature_csp_headers dynamically at the Edge
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseAnonKey) {
        const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
            cookies: {
                getAll: () => request.cookies.getAll(),
                setAll: () => { } // Read-only here
            }
        });

        try {
            const { data } = await supabase
                .from("site_settings")
                .select("value")
                .eq("key", "feature_csp_headers")
                .single();

            const enabled = data?.value === true || data?.value === "true";

            if (enabled) {
                // Strict CSP for Next.js App Router including Turnstile and AI services
                const csp = "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://vercel.live https://static.cloudflareinsights.com https://challenges.cloudflare.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https: blob:; font-src 'self' data: https://fonts.gstatic.com; worker-src 'self' blob:; media-src 'self' blob: https://cqtluudfmigefqphmfbb.supabase.co mediastream:; connect-src 'self' https://vercel.live https://*.supabase.co wss://*.supabase.co wss://*.googleapis.com https://*.googleapis.com; frame-src 'self' https://challenges.cloudflare.com;";
                response.headers.set("Content-Security-Policy", csp);
            }
        } catch (e) {
            // Silently bypass on DB error
        }
    }

    return response;
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};
