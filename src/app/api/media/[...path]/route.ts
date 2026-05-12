import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const CACHE_CONTROL_MAX_AGE = 60 * 60 * 24 * 30; // 30 days caching

export async function GET(
    request: Request,
    { params }: { params: Promise<{ path: string[] }> }
) {
    try {
        const resolvedParams = await params;
        const urlPath = resolvedParams.path.join('/');
        const supabase = await createClient();

        // Optional: Ensure only logged in users can stream private media, else return HTTP 403
        // For right now, this logic will just privately proxy a public bucket over the Vercel backend
        // to obscure the raw database URL from the user. Future RLS implementations can inject Session
        // tokens into the backend Supabase JS API call here before fetching.

        // 1. Fetch file directly over the backend server via streaming byte arrays
        const { data, error } = await supabase.storage
            .from("media")
            .download(urlPath);

        if (error) {
            console.error("Storage streaming error:", error);
            if (error.message.includes("Object not found")) {
                return NextResponse.json({ error: "Media not found" }, { status: 404 });
            }
            return NextResponse.json({ error: "Storage error" }, { status: 500 });
        }

        // 2. Transcode Blob to a modern fetch API compatible format and configure Headers
        const headers = new Headers();
        headers.set("Content-Type", data.type || "application/octet-stream");
        headers.set('Cache-Control', `public, max-age=${CACHE_CONTROL_MAX_AGE}, immutable`);

        // Read the blob buffer correctly in Edge & Node runtimes
        const buffer = Buffer.from(await data.arrayBuffer());

        return new NextResponse(buffer, {
            status: 200,
            headers,
        });

    } catch (e: unknown) {
        console.error("Proxy Media Route Error:", e);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
