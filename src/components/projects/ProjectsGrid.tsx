"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Badge from "@/components/ui/Badge";
import type { Project } from "@/lib/database.types";

interface ProjectsGridProps {
    projects: Project[];
}

export default function ProjectsGrid({ projects }: ProjectsGridProps) {
    const [search, setSearch] = useState("");
    const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
    const [selectedTech, setSelectedTech] = useState<string | null>(null);

    // Extract unique domains and technologies
    const allDomains = useMemo(() => {
        const domains = new Set<string>();
        projects.forEach((p) => p.domain?.forEach((d) => domains.add(d)));
        return Array.from(domains).sort();
    }, [projects]);

    const allTechnologies = useMemo(() => {
        const techs = new Set<string>();
        projects.forEach((p) => p.technologies?.forEach((t) => techs.add(t)));
        return Array.from(techs).sort();
    }, [projects]);

    // Filter projects
    const filtered = useMemo(() => {
        return projects.filter((project) => {
            const matchesSearch =
                !search ||
                project.title.toLowerCase().includes(search.toLowerCase()) ||
                project.short_description
                    ?.toLowerCase()
                    .includes(search.toLowerCase());

            const matchesDomain =
                !selectedDomain || project.domain?.includes(selectedDomain);

            const matchesTech =
                !selectedTech || project.technologies?.includes(selectedTech);

            return matchesSearch && matchesDomain && matchesTech;
        });
    }, [projects, search, selectedDomain, selectedTech]);

    return (
        <>
            {/* Filters */}
            <div className="glass rounded-xl p-6 mb-8">
                <div className="flex flex-col sm:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1">
                        <div className="relative">
                            <svg
                                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                            <input
                                type="text"
                                placeholder="Search projects…"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="admin-input pl-10"
                            />
                        </div>
                    </div>

                    {/* Domain filter */}
                    <select
                        value={selectedDomain || ""}
                        onChange={(e) =>
                            setSelectedDomain(e.target.value || null)
                        }
                        className="admin-input sm:w-48"
                    >
                        <option value="">All Domains</option>
                        {allDomains.map((domain) => (
                            <option key={domain} value={domain}>
                                {domain}
                            </option>
                        ))}
                    </select>

                    {/* Technology filter */}
                    <select
                        value={selectedTech || ""}
                        onChange={(e) =>
                            setSelectedTech(e.target.value || null)
                        }
                        className="admin-input sm:w-48"
                    >
                        <option value="">All Technologies</option>
                        {allTechnologies.map((tech) => (
                            <option key={tech} value={tech}>
                                {tech}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Active filters display */}
                {(search || selectedDomain || selectedTech) && (
                    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
                        <span className="text-xs text-muted-foreground">Filters:</span>
                        {search && (
                            <button
                                onClick={() => setSearch("")}
                                className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                            >
                                &quot;{search}&quot; ×
                            </button>
                        )}
                        {selectedDomain && (
                            <button
                                onClick={() => setSelectedDomain(null)}
                                className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                            >
                                {selectedDomain} ×
                            </button>
                        )}
                        {selectedTech && (
                            <button
                                onClick={() => setSelectedTech(null)}
                                className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                            >
                                {selectedTech} ×
                            </button>
                        )}
                        <button
                            onClick={() => {
                                setSearch("");
                                setSelectedDomain(null);
                                setSelectedTech(null);
                            }}
                            className="text-xs text-muted-foreground hover:text-foreground ml-2 transition-colors"
                        >
                            Clear all
                        </button>
                    </div>
                )}
            </div>

            {/* Results count */}
            <p className="text-sm text-muted-foreground mb-6">
                Showing {filtered.length} of {projects.length} projects
            </p>

            {/* Project Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((project) => (
                    <Link
                        key={project.id}
                        href={`/projects/${project.slug}`}
                        className="group glass rounded-xl overflow-hidden hover-lift"
                    >
                        <div className="h-44 bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center relative overflow-hidden">
                            <div className="w-14 h-14 rounded-xl gradient-bg opacity-25 group-hover:opacity-50 transition-opacity" />
                            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <div className="p-5">
                            <div className="flex items-center gap-2 mb-3">
                                <Badge variant="primary">{project.status}</Badge>
                                {project.domain?.slice(0, 1).map((d) => (
                                    <Badge key={d} variant="outline">
                                        {d}
                                    </Badge>
                                ))}
                            </div>
                            <h3 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
                                {project.title}
                            </h3>
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                                {project.short_description}
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                                {project.technologies?.slice(0, 4).map((tech) => (
                                    <span
                                        key={tech}
                                        className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground"
                                    >
                                        {tech}
                                    </span>
                                ))}
                                {(project.technologies?.length ?? 0) > 4 && (
                                    <span className="text-xs px-2 py-0.5 rounded bg-muted text-muted-foreground">
                                        +{(project.technologies?.length ?? 0) - 4}
                                    </span>
                                )}
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Empty state */}
            {filtered.length === 0 && (
                <div className="text-center py-16">
                    <div className="text-4xl mb-4">🔍</div>
                    <h3 className="text-lg font-semibold mb-2">No projects found</h3>
                    <p className="text-muted-foreground text-sm">
                        Try adjusting your search or filters.
                    </p>
                </div>
            )}
        </>
    );
}
