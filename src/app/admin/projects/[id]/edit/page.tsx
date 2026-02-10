import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import EditProjectForm from "@/components/admin/EditProjectForm";

interface Props {
    params: Promise<{ id: string }>;
}

export default async function EditProjectPage({ params }: Props) {
    const { id } = await params;
    const supabase = await createClient();

    const { data: project, error } = await supabase
        .from("projects")
        .select("*")
        .eq("id", id)
        .single();

    if (error || !project) notFound();

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold">Edit Project</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Editing: {project.title}
                </p>
            </div>

            <EditProjectForm project={project} />
        </div>
    );
}
