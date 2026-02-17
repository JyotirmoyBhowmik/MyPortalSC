import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
        return createDummyClient();
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
        // Provide a dummy client if cookies() fails (e.g. during static generation)
        console.warn("Using dummy client due to cookie error:", error);
        return createDummyClient();
    }
}

function createDummyClient() {
    return createServerClient(
        "http://localhost:3000",
        "dummy-key",
        {
            cookies: {
                getAll() { return []; },
                setAll() { }
            }
        }
    );
}
