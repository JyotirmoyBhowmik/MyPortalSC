import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

if (!supabaseUrl || !supabaseKey) {
    console.error("Missing environment variables!");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
    console.log("Testing connection to Supabase...");
    console.log(`URL: ${supabaseUrl}`);

    // Test 1: Fetch Projects
    console.log("\n--- Projects Table ---");
    const { data: projects, error: projectsError } = await supabase
        .from("projects")
        .select("id, title, status")
        .limit(5);

    if (projectsError) {
        console.error("Error fetching projects:", projectsError.message);
    } else {
        console.log(`Found ${projects?.length ?? 0} projects.`);
        if (projects && projects.length > 0) {
            console.log("Sample project:", projects[0]);
        } else {
            console.warn("WARNING: Projects table is empty or RLS is blocking access.");
        }
    }

    // Test 2: Fetch Content Pages
    console.log("\n--- Content Pages Table ---");
    const { data: content, error: contentError } = await supabase
        .from("content_pages")
        .select("page_key, title")
        .limit(5);

    if (contentError) {
        console.error("Error fetching content:", contentError.message);
    } else {
        console.log(`Found ${content?.length ?? 0} content pages.`);
        if (content && content.length > 0) {
            console.log("Sample content:", content[0]);
        }
    }
}

testConnection();
