/**
 * Supabase Server Client — Creates a server-side Supabase instance with cookie access.
 * Used in Server Components and Server Actions. Handles the Next.js cookies() API
 * and falls back gracefully during static generation (when cookies aren't available).
 */
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
        return createFallbackClient("https://placeholder.supabase.co", "dummy-key");
    }

    try {
        const cookieStore = await cookies();

        return createServerClient(supabaseUrl, supabaseAnonKey, {
            cookies: {
                getAll() {
                    return cookieStore.getAll();
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        );
                    } catch {
                        // The `setAll` method was called from a Server Component.
                        // This can be ignored if you have middleware refreshing sessions.
                    }
                },
            },
        });
    } catch (error) {
        // If cookies() fails (e.g. during Next.js static generation pass),
        // we return an anonymous client that can safely fetch public data
        // without triggering connection refused or warnings.
        return createFallbackClient(supabaseUrl || "https://placeholder.supabase.co", supabaseAnonKey || "dummy-key");
    }
}

function createFallbackClient(url: string, key: string) {
    return createServerClient(url, key, {
        cookies: {
            getAll() { return []; },
            setAll() { }
        }
    });
}
