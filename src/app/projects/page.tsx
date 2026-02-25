import type { Metadata } from "next";
import { getPublishedProjects } from "@/lib/data/projects";
import ProjectsGrid from "@/components/projects/ProjectsGrid";

export const revalidate = 60;

export const metadata: Metadata = {
    title: "Projects",
    description:
        "Explore enterprise projects by Jyotirmoy Bhowmik — IT infrastructure, security, cloud, and technology programs.",
};

export default async function ProjectsPage() {
    const projects = await getPublishedProjects();

    return (
        <>
            {/* Hero */}
            <section className="py-24 px-4 relative overflow-hidden">
                <div className="absolute inset-0 dot-pattern opacity-20" />
                <div
                    className="absolute inset-0"
                    style={{ background: "var(--gradient-hero)" }}
                />
                <div className="relative z-10 max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl sm:text-5xl font-bold mb-6 animate-slide-up">
                        Enterprise <span className="gradient-text">Projects</span>
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto animate-slide-up stagger-1">
                        A collection of enterprise technology projects spanning infrastructure,
                        security, cloud, and operational technology.
                    </p>
                </div>
            </section>

            {/* Projects Grid */}
            <section className="py-16 px-4">
                <div className="max-w-6xl mx-auto">
                    <ProjectsGrid projects={projects} />
                </div>
            </section>
        </>
    );
}
