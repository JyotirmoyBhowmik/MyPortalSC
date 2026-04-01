"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface Initiative {
    id: string;
    title: string;
    slug: string;
    criticality: string;
}

interface ProgramWithInitiatives {
    code: string;
    name: string;
    icon: string;
    description: string | null;
    initiatives: Initiative[];
    critical: number;
    high: number;
}

export default function ProgramCard({ program }: { program: ProgramWithInitiatives }) {
    const [isExpanded, setIsExpanded] = useState(false);

    const initialCount = 4;
    const hasMore = program.initiatives.length > initialCount;
    const displayedInitiatives = isExpanded ? program.initiatives : program.initiatives.slice(0, initialCount);

    return (
        <div className="glass rounded-xl p-6 hover-lift transition-all duration-300 h-full flex flex-col">
            <div className="flex items-start gap-4 mb-4">
                <div className="text-3xl">{program.icon}</div>
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-bold text-xs flex-shrink-0">
                            {program.code}
                        </span>
                        <h3 className="text-lg font-bold text-foreground leading-tight">
                            {program.name}
                        </h3>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed mt-2">
                        {program.description}
                    </p>
                </div>
            </div>

            {/* Stats row */}
            <div className="flex items-center gap-4 pt-4 border-t border-border/50">
                <span className="text-sm font-medium text-foreground">
                    {program.initiatives.length} initiative{program.initiatives.length !== 1 ? "s" : ""}
                </span>
                {program.critical > 0 && (
                    <span className="text-xs px-2 py-0.5 rounded bg-red-500/10 text-red-400">
                        {program.critical} Critical
                    </span>
                )}
                {program.high > 0 && (
                    <span className="text-xs px-2 py-0.5 rounded bg-amber-500/10 text-amber-400">
                        {program.high} High
                    </span>
                )}
            </div>

            {/* Initiative list */}
            <div className="mt-4 flex-1 flex flex-col justify-end">
                <motion.div layout className="space-y-2">
                    <AnimatePresence initial={false}>
                        {displayedInitiatives.map((init) => (
                            <motion.div
                                key={init.id}
                                layout
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                <Link
                                    href={`/initiatives/${init.slug}`}
                                    className="block text-sm text-muted-foreground hover:text-primary transition-colors truncate pl-4 border-l-2 border-border/50 hover:border-primary/50"
                                >
                                    {init.title}
                                </Link>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
                
                {hasMore && (
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="text-sm text-primary font-medium pl-4 mt-2 text-left hover:underline focus:outline-none"
                    >
                        {isExpanded ? "Show less" : `+${program.initiatives.length - initialCount} more`}
                    </button>
                )}
            </div>
        </div>
    );
}
