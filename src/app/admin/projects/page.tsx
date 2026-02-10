import Link from "next/link";
import { getAllProjects } from "@/lib/data/projects";
import ProjectsTable from "@/components/admin/ProjectsTable";

export default async function AdminProjectsPage() {
    const projects = await getAllProjects();

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold">Projects</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Manage your portfolio projects
                    </p>
                </div>
                <Link
                    href="/admin/projects/new"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg gradient-bg text-white font-medium text-sm shadow-lg shadow-primary/20"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Project
                </Link>
            </div>

            <ProjectsTable projects={projects} />
        </div>
    );
}
