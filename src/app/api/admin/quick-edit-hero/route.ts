/**
 * POST /api/admin/quick-edit-hero
 * Updates the home page hero content (title, subtitle, description) in the content_pages table.
 * Requires an authenticated admin session.
 */
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
    try {
        const supabase = await createClient();

        // Auth check
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Verify admin
        const { data: adminRecord } = await supabase
            .from("admin_users")
            .select("role")
            .eq("user_id", user.id)
            .single();

        if (!adminRecord) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const body = await req.json();
        const { hero_title, hero_subtitle, hero_description } = body;

        if (!hero_title?.trim()) {
            return NextResponse.json({ error: "hero_title is required" }, { status: 400 });
        }

        // Upsert the home page content
        const { error } = await supabase
            .from("content_pages")
            .upsert(
                {
                    page_key: "home",
                    title: "Home",
                    content: {
                        hero_title: hero_title.trim(),
                        hero_subtitle: hero_subtitle?.trim() || "",
                        hero_description: hero_description?.trim() || "",
                    },
                    updated_at: new Date().toISOString(),
                    updated_by: user.id,
                },
                { onConflict: "page_key" }
            );

        if (error) {
            console.error("Quick-edit hero save error:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (err: unknown) {
        return NextResponse.json({ error: (err as Error).message || "Internal error" }, { status: 500 });
    }
}
