import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
        console.warn("Supabase environment variables are missing (Browser). Using a dummy client.");
        return createBrowserClient(
            "https://placeholder.supabase.co",
            "dummy-key"
        );
    }

    return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
