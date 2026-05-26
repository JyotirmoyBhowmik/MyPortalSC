import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    const isUrlValid = !!supabaseUrl && supabaseUrl !== "undefined" && supabaseUrl !== "null" && supabaseUrl.startsWith("http");
    const isKeyValid = !!supabaseAnonKey && supabaseAnonKey !== "undefined" && supabaseAnonKey !== "null" && supabaseAnonKey !== "";

    if (!isUrlValid || !isKeyValid) {
        console.warn("Supabase environment variables are missing or invalid (Browser). Using a dummy client.");
        return createBrowserClient(
            "https://placeholder.supabase.co",
            "dummy-key"
        );
    }

    return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

