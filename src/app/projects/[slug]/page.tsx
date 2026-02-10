import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProjectBySlug } from "@/lib/data/projects";
import Badge from "@/components/ui/Badge";

export const dynamic = "force-dynamic";

interface Props {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const project = await getProjectBySlug(slug);
    if (!project) return { title: "Project Not Found" };

    return {
        title: project.title,
        description: project.short_description || project.title,
        openGraph: {
            title: project.title,
            description: project.short_description || undefined,
            images: project.featured_image_url
                ? [project.featured_image_url]
                : undefined,
        },
    };
}



export default async function ProjectDetailPage({ params }: Props) {
    const { slug } = await params;
    const project = await getProjectBySlug(slug);
    if (!project) notFound();

    return (
        <>
            {/* Back link */}
            <section className="pt-24 px-4">
                <div className="max-w-4xl mx-auto">
                    <Link
                        href="/projects"
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
                    >
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M7 16l-4-4m0 0l4-4m-4 4h18"
                            />
                        </svg>
                        Back to Projects
                    </Link>
                </div>
            </section>

            {/* Project Header */}
            <section className="px-4 pb-12">
                <div className="max-w-4xl mx-auto">
                    {/* Featured image area */}
                    <div className="glass rounded-xl overflow-hidden mb-8 shadow-2xl shadow-primary/5">
                        <div className="relative h-64 sm:h-96 md:h-[500px] w-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                            {project.featured_image_url ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={project.featured_image_url}
                                    alt={project.title}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-24 h-24 rounded-2xl gradient-bg opacity-30" />
                            )}
                        </div>
                    </div>

                    {/* Badges */}
                    <div className="flex flex-wrap items-center gap-2 mb-6">
                        <Badge
                            variant={
                                project.status === "published"
                                    ? "success"
                                    : project.status === "draft"
                                        ? "warning"
                                        : "outline"
                            }
                        >
                            {project.status}
                        </Badge>
                        {project.domain?.map((d) => (
                            <Badge key={d} variant="primary">
                                {d}
                            </Badge>
                        ))}
                    </div>

                    {/* Title */}
                    <h1 className="text-3xl sm:text-4xl font-bold mb-4">
                        {project.title}
                    </h1>

                    {/* Short description */}
                    {project.short_description && (
                        <p className="text-lg text-muted-foreground mb-6">
                            {project.short_description}
                        </p>
                    )}

                    {/* Meta info */}
                    <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground mb-8">
                        {project.start_date && (
                            <div className="flex items-center gap-2">
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                    />
                                </svg>
                                {new Date(project.start_date).toLocaleDateString("en-US", {
                                    month: "short",
                                    year: "numeric",
                                })}
                                {project.end_date &&
                                    ` – ${new Date(project.end_date).toLocaleDateString(
                                        "en-US",
                                        { month: "short", year: "numeric" }
                                    )}`}
                                {!project.end_date && " – Present"}
                            </div>
                        )}
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-wrap gap-3 mb-12">
                        {project.github_url && (
                            <a
                                href={project.github_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border text-foreground hover:bg-surface hover:border-border-hover transition-all text-sm font-medium"
                            >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                </svg>
                                View Source
                            </a>
                        )}
                        {project.live_url && (
                            <a
                                href={project.live_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg gradient-bg text-white font-medium shadow-lg shadow-primary/20 text-sm"
                            >
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                    />
                                </svg>
                                Live Demo
                            </a>
                        )}
                    </div>

                    {/* Detailed description */}
                    {project.detailed_description && (
                        <div className="glass rounded-xl p-8 mb-8">
                            <h2 className="text-xl font-semibold mb-4">About this project</h2>
                            <div className="text-muted-foreground leading-relaxed whitespace-pre-line">
                                {project.detailed_description}
                            </div>
                        </div>
                    )}

                    {/* Documents */}
                    {(project as any).documents &&
                        ((project as any).documents as any[]).length > 0 && (
                            <div className="glass rounded-xl p-8 mb-8">
                                <h2 className="text-xl font-semibold mb-4">
                                    Project Documents
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {((project as any).documents as any[]).map(
                                        (doc: any, i: number) => (
                                            <a
                                                key={i}
                                                href={doc.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-3 p-4 rounded-lg border border-border hover:bg-surface/50 transition-colors group"
                                            >
                                                <div className="w-10 h-10 rounded bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                                                    DOC
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium truncate group-hover:text-primary transition-colors">
                                                        {doc.name}
                                                    </p>
                                                    {doc.size && (
                                                        <p className="text-xs text-muted-foreground">
                                                            {(doc.size / 1024).toFixed(1)} KB
                                                        </p>
                                                    )}
                                                </div>
                                                <svg
                                                    className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                                    />
                                                </svg>
                                            </a>
                                        )
                                    )}
                                </div>
                            </div>
                        )}

                    {/* Technologies */}
                    {project.technologies && project.technologies.length > 0 && (
                        <div className="glass rounded-xl p-8">
                            <h2 className="text-xl font-semibold mb-4">Tech Stack</h2>
                            <div className="flex flex-wrap gap-2">
                                {project.technologies.map((tech) => (
                                    <Badge key={tech} variant="primary">
                                        {tech}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </>
    );
}
