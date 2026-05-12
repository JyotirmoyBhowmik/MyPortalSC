import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: Request) {
    try {
        const supabase = await createClient();

        // 1. Authenticate Request
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
        }

        // 2. Determine Authorization Level
        // Fetch user role to ensure they are allowed to upload
        const { data: adminUser } = await supabase
            .from("admin_users")
            .select("role")
            .eq("id", user.id)
            .single();

        if (!adminUser || !["super_admin", "admin", "editor"].includes(adminUser.role)) {
            return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
        }

        // 3. Parse upload intention
        const body = await request.json();
        const { filename, bucket = "media" } = body;

        if (!filename) {
            return NextResponse.json({ error: "Filename is required" }, { status: 400 });
        }

        // 4. Generate unique secure path
        const fileExt = filename.split('.').pop() || '';
        const securePath = `${uuidv4()}.${fileExt}`;

        // 5. Generate a presigned upload URL from Supabase
        const { data, error } = await supabase.storage
            .from(bucket)
            .createSignedUploadUrl(securePath);

        if (error) {
            console.error("Error creating signed upload URL:", error);
            return NextResponse.json({ error: "Failed to create upload URL" }, { status: 500 });
        }

        return NextResponse.json({
            uploadUrl: data.signedUrl,
            path: data.path, // The actual storage path
            token: data.token,
            publicUrl: `/api/media/${data.path}`, // Our new frontend proxy route
        });

    } catch (e: unknown) {
        console.error("Storage Sign-Upload Error:", e);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
