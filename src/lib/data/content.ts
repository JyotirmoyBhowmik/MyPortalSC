import { createClient } from "@/lib/supabase/server";
import type { ContentPage, Json } from "@/lib/database.types";

export async function getPageContent(
    pageKey: string
): Promise<ContentPage | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("content_pages")
        .select("*")
        .eq("page_key", pageKey)
        .single();

    if (error) {
        console.error(`Error fetching page content for "${pageKey}":`, error);
        return null;
    }
    return data;
}

// Helper to safely extract a string field from JSONB content
export function getContentField(
    content: Json | null | undefined,
    field: string
): string {
    if (
        content &&
        typeof content === "object" &&
        !Array.isArray(content) &&
        field in content
    ) {
        const value = (content as Record<string, Json | undefined>)[field];
        return typeof value === "string" ? value : "";
    }
    return "";
}

// Helper to safely extract any field type from JSONB content
export function getContentData(
    content: Json | null | undefined,
    field: string
): any {
    if (
        content &&
        typeof content === "object" &&
        !Array.isArray(content) &&
        field in content
    ) {
        return (content as Record<string, Json | undefined>)[field];
    }
    return null;
}
