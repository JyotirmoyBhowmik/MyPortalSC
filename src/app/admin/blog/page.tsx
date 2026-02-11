import { createClient } from "@/lib/supabase/server";
import BlogManager from "@/components/admin/BlogManager";

export const dynamic = "force-dynamic";

export default async function AdminBlogPage() {
    const supabase = await createClient();
    const { data } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false });

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold">Blog Posts</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Manage articles, insights, and thought leadership content.
                </p>
            </div>
            <BlogManager posts={data ?? []} />
        </div>
    );
}
