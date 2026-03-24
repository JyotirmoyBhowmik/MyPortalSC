"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Badge from "@/components/ui/Badge";
import type { Project } from "@/lib/database.types";
import { AnimatedCard } from "@/components/animations/AnimatedSection";

export default function FeaturedProjectsFilter({ projects }: { projects: Project[] }) {
    const [activeFilter, setActiveFilter] = useState<string>("All");

    // Extract unique domains from projects to build filter pills
    const domains = useMemo(() => {
        const allDomains = projects.flatMap(p => p.domain || []);
        const uniqueDomains = Array.from(new Set(allDomains)).filter(Boolean);
        return ["All", ...uniqueDomains];
    }, [projects]);

    const filteredProjects = projects.filter(p => 
        activeFilter === "All" || (p.domain && p.domain.includes(activeFilter))
    );

    return (
        <div className="w-full">
            {/* Filter Pills */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-10 min-h-[40px]">
                {domains.map((domain) => (
                    <button
                        key={domain}
                        onClick={() => setActiveFilter(domain)}
                        className={`
                            px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-300 border
                            ${activeFilter === domain 
                                ? "bg-primary text-primary-foreground border-primary shadow-[0_0_10px_rgba(var(--primary),0.3)]" 
                                : "bg-surface/50 text-muted-foreground border-border hover:bg-surface hover:text-foreground hover:border-primary/50"}
                        `}
                    >
                        {domain}
                    </button>
                ))}
            </div>

            {/* Project Cards */}
            <motion.div 
                layout
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
                <AnimatePresence mode="popLayout">
                    {filteredProjects.map((project, i) => (
                        <motion.div
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                            transition={{ duration: 0.3 }}
                            key={project.id}
                        >
                            <AnimatedCard delay={i * 0.1} className="h-full">
                                <Link
                                    href={`/projects/${project.slug}`}
                                    className="group glass rounded-xl overflow-hidden glow-border flex flex-col h-full"
                                >
                                    {/* Image placeholder */}
                                    <div className="h-48 bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center overflow-hidden shrink-0">
                                        {project.featured_image_url ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img
                                                src={project.featured_image_url}
                                                alt={project.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-16 h-16 rounded-xl gradient-bg opacity-30 group-hover:opacity-60 transition-opacity" />
                                        )}
                                    </div>
                                    <div className="p-6 flex flex-col flex-1">
                                        <div className="flex items-center gap-2 mb-3">
                                            <Badge variant="primary">{project.status}</Badge>
                                            <span className="text-xs text-muted-foreground">
                                                {project.start_date ? new Date(project.start_date).getFullYear() : 'Ongoing'}
                                            </span>
                                        </div>
                                        <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                                            {project.title}
                                        </h3>
                                        <p className="text-sm text-muted-foreground mb-4 line-clamp-3 flex-1">
                                            {project.short_description || "No description available."}
                                        </p>
                                        <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-border/50">
                                            {(project.technologies || []).slice(0, 3).map((tech) => (
                                                <span
                                                    key={tech}
                                                    className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-secondary text-secondary-foreground"
                                                >
                                                    {tech}
                                                </span>
                                            ))}
                                            {(project.technologies?.length || 0) > 3 && (
                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-surface text-muted-foreground">
                                                    +{(project.technologies?.length || 0) - 3}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </Link>
                            </AnimatedCard>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>
            
            {filteredProjects.length === 0 && (
                <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    className="text-center py-12 text-muted-foreground"
                >
                    No projects found for {activeFilter}.
                </motion.div>
            )}
        </div>
    );
}
