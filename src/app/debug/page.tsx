import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function DebugPage() {
    const supabase = await createClient();

    // Check Env Vars (masked for security)
    const envStatus = {
        url: process.env.NEXT_PUBLIC_SUPABASE_URL ? "Defined (starts with " + process.env.NEXT_PUBLIC_SUPABASE_URL.substring(0, 10) + "...)" : "MISSING",
        key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Defined (starts with " + process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 10) + "...)" : "MISSING",
        node_env: process.env.NODE_ENV
    };

    // Test DB Connection
    const projectsQuery = await supabase.from("projects").select("count");


    return (
        <div className="p-10 font-mono text-sm space-y-4">
            <h1 className="text-xl font-bold">Diagnostics</h1>

            <div className="p-4 border border-gray-700 rounded bg-gray-900 text-white">
                <h2 className="font-bold mb-2">Environment Variables</h2>
                <pre>{JSON.stringify(envStatus, null, 2)}</pre>
            </div>

            <div className="p-4 border border-gray-700 rounded bg-gray-900 text-white">
                <h2 className="font-bold mb-2">Database Connection</h2>
                <p>Projects Count Query: {projectsQuery.error ? "ERROR: " + projectsQuery.error.message : "SUCCESS: Count=" + (projectsQuery.count ?? "unknown")}</p>
                <p>Projects Data: {JSON.stringify(projectsQuery.data)}</p>
            </div>

            <div className="p-4 border border-gray-700 rounded bg-gray-900 text-white">
                <h2 className="font-bold mb-2">Build Info</h2>
                <p>Time: {new Date().toISOString()}</p>
            </div>
        </div>
    );
}
