"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import * as d3 from "d3";

export interface GraphNode extends d3.SimulationNodeDatum {
    id: string;
    label: string;
    path: string;
    directory: string;
    group: string;
    color: string;
    extension: string;
    loc: number;
    size_bytes: number;
    symbols: string[];
    symbol_details: Array<{
        name: string;
        kind: string;
        signature: string;
        line: number;
        exported: boolean;
    }>;
    exports: string[];
    calls: string[];
    in_degree: number;
    out_degree: number;
    is_external: boolean;
    x?: number;
    y?: number;
    fx?: number | null;
    fy?: number | null;
}

export interface GraphEdge extends d3.SimulationLinkDatum<GraphNode> {
    source: string | GraphNode;
    target: string | GraphNode;
    type: string;
    count: number;
    specifiers: string[];
}

export interface GraphGroup {
    id: string;
    name: string;
    color: string;
    count: number;
}

export interface GraphData {
    metadata: {
        generated_at: string;
        total_files: number;
        total_nodes: number;
        total_edges: number;
        languages: Record<string, number>;
    };
    groups: GraphGroup[];
    nodes: GraphNode[];
    edges: GraphEdge[];
}

export function findShortestPath(
    nodes: GraphNode[],
    edges: GraphEdge[],
    startId: string,
    targetId: string
): { path: string[]; directed: boolean } {
    if (!startId || !targetId || startId === targetId) return { path: [], directed: false };

    const directedAdj = new Map<string, string[]>();
    const undirectedAdj = new Map<string, string[]>();

    edges.forEach((e) => {
        const s = typeof e.source === "object" ? (e.source as GraphNode).id : e.source;
        const t = typeof e.target === "object" ? (e.target as GraphNode).id : e.target;
        if (!directedAdj.has(s)) directedAdj.set(s, []);
        directedAdj.get(s)!.push(t);

        if (!undirectedAdj.has(s)) undirectedAdj.set(s, []);
        if (!undirectedAdj.has(t)) undirectedAdj.set(t, []);
        undirectedAdj.get(s)!.push(t);
        undirectedAdj.get(t)!.push(s);
    });

    const bfs = (adj: Map<string, string[]>) => {
        const queue: string[][] = [[startId]];
        const visited = new Set<string>([startId]);
        while (queue.length > 0) {
            const p = queue.shift()!;
            const curr = p[p.length - 1];
            if (curr === targetId) return p;
            for (const nxt of adj.get(curr) || []) {
                if (!visited.has(nxt)) {
                    visited.add(nxt);
                    queue.push([...p, nxt]);
                }
            }
        }
        return [];
    };

    const dirPath = bfs(directedAdj);
    if (dirPath.length > 0) return { path: dirPath, directed: true };

    const undirPath = bfs(undirectedAdj);
    return { path: undirPath, directed: false };
}

export default function ArchitectureGraph() {
    const svgRef = useRef<SVGSVGElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);

    const [data, setData] = useState<GraphData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Filter and UI states
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
    const [activeGroups, setActiveGroups] = useState<Set<string>>(new Set());
    const [showExternal, setShowExternal] = useState(true);
    const [showLabels, setShowLabels] = useState(true);
    const [sizeMode, setSizeMode] = useState<"degree" | "loc" | "uniform">("degree");
    const [isPhysicsRunning, setIsPhysicsRunning] = useState(true);

    // Path tracing states
    const [isPathFinderOpen, setIsPathFinderOpen] = useState(false);
    const [pathSourceId, setPathSourceId] = useState<string>("");
    const [pathTargetId, setPathTargetId] = useState<string>("");
    const [activePath, setActivePath] = useState<{ path: string[]; directed: boolean } | null>(null);

    const simulationRef = useRef<d3.Simulation<GraphNode, GraphEdge> | null>(null);
    const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);
    const highlightPathRef = useRef<((path: string[]) => void) | null>(null);
    const resetHighlightRef = useRef<(() => void) | null>(null);

    // Fetch data
    useEffect(() => {
        let isMounted = true;
        fetch("/graph.json")
            .then((res) => {
                if (!res.ok) throw new Error("Failed to load /graph.json");
                return res.json();
            })
            .then((graph: GraphData) => {
                if (isMounted) {
                    setData(graph);
                    setLoading(false);
                }
            })
            .catch((err: Error) => {
                if (isMounted) {
                    setError(err.message);
                    setLoading(false);
                }
            });
        return () => {
            isMounted = false;
        };
    }, []);

    // Filter nodes and edges
    const filteredGraph = useMemo(() => {
        if (!data) return { nodes: [], edges: [] };

        const nodes = data.nodes.filter((n) => {
            if (!showExternal && n.is_external) return false;
            if (activeGroups.size > 0 && !activeGroups.has(n.group)) return false;
            return true;
        });

        const nodeIds = new Set(nodes.map((n) => n.id));
        const edges = data.edges.filter((e) => {
            const s = typeof e.source === "object" ? (e.source as GraphNode).id : e.source;
            const t = typeof e.target === "object" ? (e.target as GraphNode).id : e.target;
            return nodeIds.has(s) && nodeIds.has(t);
        });

        return { nodes, edges };
    }, [data, showExternal, activeGroups]);

    // Node radius calculation
    const getNodeRadius = (node: GraphNode) => {
        if (sizeMode === "uniform") return 6;
        if (sizeMode === "loc") {
            const loc = node.loc || 10;
            return Math.min(24, Math.max(5, Math.sqrt(loc) * 1.2));
        }
        const deg = (node.in_degree || 0) + (node.out_degree || 0);
        return Math.min(22, Math.max(5, 5 + Math.sqrt(deg) * 2.4));
    };

    const getDarkerStroke = (colorStr?: string): string => {
        const c = d3.color(colorStr || "#64748b");
        return c ? c.darker(0.8).formatHex() : "#334155";
    };

    // Initialize D3 force simulation
    useEffect(() => {
        if (!svgRef.current || !containerRef.current || filteredGraph.nodes.length === 0) return;

        const container = containerRef.current;
        const width = container.clientWidth || 1000;
        const height = container.clientHeight || 700;

        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        // Arrowhead definitions
        const defs = svg.append("defs");
        defs.append("marker")
            .attr("id", "portal-arrow")
            .attr("viewBox", "0 -5 10 10")
            .attr("refX", 18)
            .attr("refY", 0)
            .attr("markerWidth", 6)
            .attr("markerHeight", 6)
            .attr("orient", "auto")
            .append("path")
            .attr("d", "M0,-5L10,0L0,5")
            .attr("fill", "#475569");

        defs.append("marker")
            .attr("id", "portal-arrow-active")
            .attr("viewBox", "0 -5 10 10")
            .attr("refX", 20)
            .attr("refY", 0)
            .attr("markerWidth", 7)
            .attr("markerHeight", 7)
            .attr("orient", "auto")
            .append("path")
            .attr("d", "M0,-5L10,0L0,5")
            .attr("fill", "#38bdf8");

        const g = svg.append("g");

        // Zoom Behavior
        const zoom = d3
            .zoom<SVGSVGElement, unknown>()
            .scaleExtent([0.1, 8])
            .on("zoom", (event) => {
                g.attr("transform", event.transform);
            });
        svg.call(zoom);
        zoomRef.current = zoom;

        // Clone nodes and links for simulation
        const simNodes: GraphNode[] = filteredGraph.nodes.map((d) => ({ ...d }));
        const simEdges: GraphEdge[] = filteredGraph.edges.map((d) => ({ ...d }));

        // Links
        const linkElements = g
            .append("g")
            .attr("class", "links")
            .selectAll("line")
            .data(simEdges)
            .enter()
            .append("line")
            .attr("stroke", "#334155")
            .attr("stroke-opacity", 0.35)
            .attr("stroke-width", 1.2)
            .attr("marker-end", "url(#portal-arrow)");

        // Nodes
        const nodeElements = g
            .append("g")
            .attr("class", "nodes")
            .selectAll("circle")
            .data(simNodes)
            .enter()
            .append("circle")
            .attr("r", (d) => getNodeRadius(d))
            .attr("fill", (d) => d.color || "#64748b")
            .attr("stroke", (d) => getDarkerStroke(d.color))
            .attr("stroke-width", 1.5)
            .attr("cursor", "pointer")
            .call(
                d3
                    .drag<SVGCircleElement, GraphNode>()
                    .on("start", (event, d) => {
                        if (!event.active && simulationRef.current) simulationRef.current.alphaTarget(0.3).restart();
                        d.fx = d.x;
                        d.fy = d.y;
                    })
                    .on("drag", (event, d) => {
                        d.fx = event.x;
                        d.fy = event.y;
                    })
                    .on("end", (event) => {
                        if (!event.active && simulationRef.current) simulationRef.current.alphaTarget(0);
                    })
            )
            .on("click", (event, d) => {
                event.stopPropagation();
                setSelectedNode(d);
            })
            .on("mouseenter", (event, d) => {
                highlightGraph(d);
            })
            .on("mouseleave", () => {
                if (!selectedNode) resetHighlight();
            });

        // Labels
        const labelElements = g
            .append("g")
            .attr("class", "labels")
            .selectAll("text")
            .data(simNodes)
            .enter()
            .append("text")
            .attr("dx", (d) => getNodeRadius(d) + 4)
            .attr("dy", ".35em")
            .attr("font-size", 10)
            .attr("font-family", "monospace")
            .attr("fill", "#cbd5e1")
            .attr("pointer-events", "none")
            .attr("user-select", "none")
            .text((d) => d.label)
            .style("display", showLabels ? "block" : "none");

        // Background click clears selection
        svg.on("click", () => {
            setSelectedNode(null);
            resetHighlight();
        });

        // Highlight helper
        function highlightGraph(focusNode: GraphNode) {
            const connected = new Set([focusNode.id]);
            linkElements.each(function (l) {
                const s = typeof l.source === "object" ? (l.source as GraphNode).id : l.source;
                const t = typeof l.target === "object" ? (l.target as GraphNode).id : l.target;
                if (s === focusNode.id) {
                    connected.add(t);
                    d3.select(this)
                        .attr("stroke", "#ec4899")
                        .attr("stroke-opacity", 0.95)
                        .attr("stroke-width", 2.5);
                } else if (t === focusNode.id) {
                    connected.add(s);
                    d3.select(this)
                        .attr("stroke", "#38bdf8")
                        .attr("stroke-opacity", 0.95)
                        .attr("stroke-width", 2.5);
                } else {
                    d3.select(this).attr("stroke-opacity", 0.05);
                }
            });

            nodeElements
                .attr("opacity", (n) => (connected.has(n.id) ? 1 : 0.15))
                .attr("stroke", (n) => (n.id === focusNode.id ? "#ffffff" : getDarkerStroke(n.color)))
                .attr("stroke-width", (n) => (n.id === focusNode.id ? 3.5 : 1.5));

            labelElements.attr("opacity", (n) => (connected.has(n.id) ? 1 : 0.15));
        }

        function resetHighlight() {
            linkElements
                .attr("stroke", "#334155")
                .attr("stroke-opacity", 0.35)
                .attr("stroke-width", 1.2);
            nodeElements
                .attr("opacity", 1)
                .attr("stroke", (n) => getDarkerStroke(n.color))
                .attr("stroke-width", 1.5);
            labelElements.attr("opacity", 1);
        }

        function highlightPathElements(pathIds: string[]) {
            if (!pathIds || pathIds.length === 0) return;
            const pathSet = new Set(pathIds);
            const pathEdgePairs = new Set<string>();
            for (let i = 0; i < pathIds.length - 1; i++) {
                pathEdgePairs.add(`${pathIds[i]}->${pathIds[i + 1]}`);
                pathEdgePairs.add(`${pathIds[i + 1]}->${pathIds[i]}`);
            }

            linkElements.each(function (l) {
                const s = typeof l.source === "object" ? (l.source as GraphNode).id : l.source;
                const t = typeof l.target === "object" ? (l.target as GraphNode).id : l.target;
                const isPathEdge = pathEdgePairs.has(`${s}->${t}`) || pathEdgePairs.has(`${t}->${s}`);

                if (isPathEdge) {
                    d3.select(this)
                        .attr("stroke", "#06b6d4")
                        .attr("stroke-opacity", 1)
                        .attr("stroke-width", 3.5);
                } else {
                    d3.select(this).attr("stroke-opacity", 0.05);
                }
            });

            nodeElements
                .attr("opacity", (n) => (pathSet.has(n.id) ? 1 : 0.1))
                .attr("stroke", (n) => (pathSet.has(n.id) ? "#38bdf8" : getDarkerStroke(n.color)))
                .attr("stroke-width", (n) => (pathSet.has(n.id) ? 4 : 1.5));

            labelElements
                .attr("opacity", (n) => (pathSet.has(n.id) ? 1 : 0.1))
                .style("display", (n) => (pathSet.has(n.id) ? "block" : showLabels ? "block" : "none"));
        }

        highlightPathRef.current = highlightPathElements;
        resetHighlightRef.current = resetHighlight;


        // Force simulation
        const sim = d3
            .forceSimulation(simNodes)
            .force(
                "link",
                d3
                    .forceLink<GraphNode, GraphEdge>(simEdges)
                    .id((d) => d.id)
                    .distance(60)
            )
            .force("charge", d3.forceManyBody().strength(-110).distanceMax(450))
            .force("center", d3.forceCenter(width / 2, height / 2))
            .force("collision", d3.forceCollide<GraphNode>().radius((d) => getNodeRadius(d) + 4))
            .on("tick", () => {
                linkElements
                    .attr("x1", (d) => (d.source as GraphNode).x || 0)
                    .attr("y1", (d) => (d.source as GraphNode).y || 0)
                    .attr("x2", (d) => (d.target as GraphNode).x || 0)
                    .attr("y2", (d) => (d.target as GraphNode).y || 0);

                nodeElements.attr("cx", (d) => d.x || 0).attr("cy", (d) => d.y || 0);
                labelElements.attr("x", (d) => d.x || 0).attr("y", (d) => d.y || 0);
            });

        simulationRef.current = sim;
        setIsPhysicsRunning(true);

        return () => {
            sim.stop();
        };
    }, [filteredGraph, sizeMode, showLabels]);

    // Reactively update highlight when activePath changes
    useEffect(() => {
        if (activePath && activePath.path.length > 0) {
            highlightPathRef.current?.(activePath.path);
        } else {
            resetHighlightRef.current?.();
        }
    }, [activePath]);

    const handleTracePath = () => {
        if (!data || !pathSourceId || !pathTargetId) return;
        const result = findShortestPath(data.nodes, data.edges, pathSourceId, pathTargetId);
        setActivePath(result);
    };

    const handleClearPath = () => {
        setActivePath(null);
        setPathSourceId("");
        setPathTargetId("");
    };

    // Handle search selection
    const handleSelectSearchedNode = (node: GraphNode) => {
        setSelectedNode(node);
        setSearchQuery("");

        if (svgRef.current && zoomRef.current && node.x !== undefined && node.y !== undefined) {
            const svg = d3.select(svgRef.current);
            const container = containerRef.current;
            const width = container?.clientWidth || 1000;
            const height = container?.clientHeight || 700;

            svg.transition()
                .duration(750)
                .call(
                    zoomRef.current.transform,
                    d3.zoomIdentity.translate(width / 2 - node.x * 1.5, height / 2 - node.y * 1.5).scale(1.5)
                );
        }
    };

    // Toggle physics
    const togglePhysics = () => {
        if (!simulationRef.current) return;
        if (isPhysicsRunning) {
            simulationRef.current.stop();
            setIsPhysicsRunning(false);
        } else {
            simulationRef.current.alpha(0.3).restart();
            setIsPhysicsRunning(true);
        }
    };

    // Reset View
    const handleFitView = () => {
        if (!svgRef.current || !zoomRef.current || !containerRef.current) return;
        const width = containerRef.current.clientWidth || 1000;
        const height = containerRef.current.clientHeight || 700;
        d3.select(svgRef.current)
            .transition()
            .duration(750)
            .call(zoomRef.current.transform, d3.zoomIdentity.translate(width / 2, height / 2).scale(0.85).translate(-width / 2, -height / 2));
    };

    const searchMatches = useMemo(() => {
        if (!data || !searchQuery.trim()) return [];
        const q = searchQuery.toLowerCase();
        return data.nodes
            .filter((n) => n.path.toLowerCase().includes(q) || n.symbols.some((s) => s.toLowerCase().includes(q)))
            .slice(0, 10);
    }, [data, searchQuery]);

    if (loading) {
        return (
            <div className="w-full h-[700px] bg-slate-950/80 border border-border rounded-2xl flex flex-col items-center justify-center gap-3">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <span className="font-mono text-sm text-muted-foreground">Loading Architecture Graph...</span>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="w-full h-[700px] bg-slate-950/80 border border-border rounded-2xl flex flex-col items-center justify-center gap-2 p-6 text-center">
                <div className="text-rose-400 font-mono text-sm font-semibold">Unable to load codebase architecture graph</div>
                <p className="text-xs text-muted-foreground max-w-md">
                    Please ensure that the mapping engine has run (`pnpm map`) and generated `graph.json` in the public directory.
                </p>
            </div>
        );
    }

    return (
        <div className="w-full border border-border rounded-2xl overflow-hidden bg-slate-950 flex flex-col shadow-2xl relative">
            {/* Toolbar */}
            <div className="h-14 border-b border-border/60 bg-slate-900/90 backdrop-blur px-4 flex flex-wrap items-center justify-between gap-3 z-10">
                <div className="flex items-center gap-3">
                    <span className="text-xs font-mono px-2 py-1 rounded bg-primary/20 text-primary font-semibold">
                        {data.metadata.total_files} Files · {data.metadata.total_edges} Connections
                    </span>

                    {/* Search */}
                    <div className="relative w-64 sm:w-80">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search modules, paths, symbols..."
                            className="w-full bg-slate-800/90 border border-slate-700/80 rounded-lg px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-primary font-mono"
                        />
                        {searchMatches.length > 0 && (
                            <div className="absolute left-0 right-0 top-full mt-1 bg-slate-900 border border-slate-700 rounded-lg shadow-2xl max-h-60 overflow-y-auto z-50">
                                {searchMatches.map((m) => (
                                    <div
                                        key={m.id}
                                        onClick={() => handleSelectSearchedNode(m)}
                                        className="p-2 hover:bg-slate-800 cursor-pointer border-b border-slate-800/60 last:border-0"
                                    >
                                        <div className="font-semibold text-slate-200 text-xs truncate">{m.label}</div>
                                        <div className="text-[10px] text-slate-400 font-mono truncate">{m.path}</div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Control Actions */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleFitView}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-slate-300 transition"
                    >
                        Fit View
                    </button>

                    <button
                        onClick={togglePhysics}
                        className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-slate-300 transition flex items-center gap-1.5"
                    >
                        <span>{isPhysicsRunning ? "⏸️" : "▶️"}</span>
                        <span>{isPhysicsRunning ? "Pause" : "Resume"}</span>
                    </button>

                    <select
                        value={sizeMode}
                        onChange={(e) => setSizeMode(e.target.value as any)}
                        className="bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-primary font-mono"
                    >
                        <option value="degree">Size: Connections</option>
                        <option value="loc">Size: Lines of Code</option>
                        <option value="uniform">Size: Uniform</option>
                    </select>

                    <button
                        type="button"
                        onClick={() => setIsPathFinderOpen(!isPathFinderOpen)}
                        className={`px-2.5 py-1.5 rounded-lg border text-xs transition flex items-center gap-1.5 font-medium ${
                            isPathFinderOpen
                                ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/50 shadow-sm"
                                : "bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300"
                        }`}
                    >
                        <span>🧭</span>
                        <span>Trace Path</span>
                    </button>
                </div>
            </div>

            {/* Path Finder Panel */}
            {isPathFinderOpen && (
                <div className="bg-slate-900/95 border-b border-cyan-500/30 p-3 px-4 flex flex-wrap items-center justify-between gap-3 text-xs z-20">
                    <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-cyan-400 flex items-center gap-1">
                            <span>🧭</span> Dependency Path Finder:
                        </span>
                        <select
                            value={pathSourceId}
                            onChange={(e) => setPathSourceId(e.target.value)}
                            className="bg-slate-800 border border-slate-700 text-slate-200 rounded px-2 py-1 max-w-[200px] truncate font-mono text-[11px]"
                        >
                            <option value="">Select Source Node...</option>
                            {data.nodes.map((n) => (
                                <option key={n.id} value={n.id}>
                                    {n.label} ({n.path})
                                </option>
                            ))}
                        </select>
                        <span className="text-muted-foreground">&rarr;</span>
                        <select
                            value={pathTargetId}
                            onChange={(e) => setPathTargetId(e.target.value)}
                            className="bg-slate-800 border border-slate-700 text-slate-200 rounded px-2 py-1 max-w-[200px] truncate font-mono text-[11px]"
                        >
                            <option value="">Select Target Node...</option>
                            {data.nodes.map((n) => (
                                <option key={n.id} value={n.id}>
                                    {n.label} ({n.path})
                                </option>
                            ))}
                        </select>
                        <button
                            type="button"
                            onClick={handleTracePath}
                            disabled={!pathSourceId || !pathTargetId}
                            className="px-3 py-1 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-white font-semibold rounded text-xs transition shadow-sm"
                        >
                            Find Path
                        </button>
                        {(activePath || pathSourceId || pathTargetId) && (
                            <button
                                type="button"
                                onClick={handleClearPath}
                                className="px-2 py-1 text-slate-400 hover:text-slate-200 underline text-[11px]"
                            >
                                Clear
                            </button>
                        )}
                    </div>

                    {activePath && (
                        <div className="flex items-center gap-2 text-[11px] font-mono">
                            {activePath.path.length > 0 ? (
                                <div className="flex items-center gap-1 overflow-x-auto max-w-xl py-1">
                                    <span className="text-cyan-400 font-bold">
                                        Path ({activePath.path.length} hops, {activePath.directed ? "Directed" : "Connected"}):
                                    </span>
                                    {activePath.path.map((nodeId, idx) => {
                                        const n = data.nodes.find((item) => item.id === nodeId);
                                        return (
                                            <span key={nodeId} className="flex items-center gap-1">
                                                <span className="px-1.5 py-0.5 rounded bg-cyan-950 border border-cyan-800 text-cyan-200">
                                                    {n ? n.label : nodeId}
                                                </span>
                                                {idx < activePath.path.length - 1 && <span className="text-cyan-400">&rarr;</span>}
                                            </span>
                                        );
                                    })}
                                </div>
                            ) : (
                                <span className="text-amber-400 font-semibold">No dependency path found between selected nodes.</span>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Main Workspace */}
            <div className="relative h-[680px] w-full flex overflow-hidden">
                {/* Sidebar Cluster Filters */}
                <div className="w-60 border-r border-border/60 bg-slate-900/60 backdrop-blur p-3 flex flex-col gap-4 overflow-y-auto z-10 shrink-0 text-xs">
                    <div>
                        <div className="text-[10px] uppercase font-semibold text-slate-400 mb-2 tracking-wider">Filters</div>
                        <label className="flex items-center gap-2 text-slate-300 cursor-pointer mb-2">
                            <input
                                type="checkbox"
                                checked={showExternal}
                                onChange={(e) => setShowExternal(e.target.checked)}
                                className="rounded bg-slate-800 border-slate-700 text-primary"
                            />
                            <span>Include NPM Packages</span>
                        </label>
                        <label className="flex items-center gap-2 text-slate-300 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={showLabels}
                                onChange={(e) => setShowLabels(e.target.checked)}
                                className="rounded bg-slate-800 border-slate-700 text-primary"
                            />
                            <span>Show Node Labels</span>
                        </label>
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <div className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">Clusters</div>
                            {activeGroups.size > 0 && (
                                <button
                                    onClick={() => setActiveGroups(new Set())}
                                    className="text-[10px] text-primary hover:underline"
                                >
                                    Reset
                                </button>
                            )}
                        </div>
                        <div className="space-y-1">
                            {data.groups.map((g) => {
                                const isSelected = activeGroups.has(g.id);
                                return (
                                    <div
                                        key={g.id}
                                        onClick={() => {
                                            const next = new Set(activeGroups);
                                            if (next.has(g.id)) next.delete(g.id);
                                            else next.add(g.id);
                                            setActiveGroups(next);
                                        }}
                                        className={`flex items-center justify-between p-1.5 rounded cursor-pointer transition ${
                                            isSelected ? "bg-primary/20 ring-1 ring-primary" : "hover:bg-slate-800/60"
                                        }`}
                                    >
                                        <div className="flex items-center gap-2 truncate">
                                            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: g.color }} />
                                            <span className="truncate text-slate-300 text-xs">{g.name}</span>
                                        </div>
                                        <span className="text-[10px] font-mono text-slate-500 px-1 rounded bg-slate-800">
                                            {g.count}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Edge Legend */}
                    <div className="mt-auto border-t border-slate-800/80 pt-3">
                        <div className="text-[10px] uppercase font-semibold text-slate-400 mb-2 tracking-wider">Edge Types</div>
                        <div className="space-y-1 text-[11px]">
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-0.5 bg-sky-400 inline-block" />
                                <span className="text-sky-300">Imported By</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-0.5 bg-pink-500 inline-block" />
                                <span className="text-pink-300">Imports (Dependency)</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Graph Canvas */}
                <div ref={containerRef} className="flex-1 relative h-full w-full bg-[#090d16]">
                    <svg ref={svgRef} className="w-full h-full" />
                </div>

                {/* Inspector Drawer */}
                {selectedNode && (
                    <aside className="w-80 sm:w-96 border-l border-border/60 bg-slate-900/95 backdrop-blur flex flex-col z-20 shrink-0 text-xs overflow-hidden shadow-2xl absolute right-0 top-0 bottom-0">
                        <div className="p-3 border-b border-border/60 flex items-center justify-between bg-slate-800/40">
                            <div className="flex items-center gap-2 truncate">
                                <span
                                    className="px-2 py-0.5 rounded text-[10px] font-mono uppercase font-semibold"
                                    style={{
                                        backgroundColor: `${selectedNode.color}25`,
                                        color: selectedNode.color,
                                    }}
                                >
                                    {selectedNode.group}
                                </span>
                                <span className="font-bold text-white truncate text-sm">{selectedNode.label}</span>
                            </div>
                            <button
                                onClick={() => setSelectedNode(null)}
                                className="text-slate-400 hover:text-white text-base px-1.5"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            <div>
                                <label className="text-[10px] uppercase text-slate-500 font-semibold">File Path</label>
                                <div className="font-mono text-slate-200 break-all bg-slate-950/60 p-2 rounded border border-slate-800 text-[11px] mt-1 select-text">
                                    {selectedNode.path}
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-2 text-center">
                                <div className="bg-slate-800/50 p-2 rounded border border-slate-800">
                                    <div className="text-sm font-bold text-white font-mono">
                                        {(selectedNode.loc || 0).toLocaleString()}
                                    </div>
                                    <div className="text-[10px] text-slate-400 uppercase">Lines</div>
                                </div>
                                <div className="bg-slate-800/50 p-2 rounded border border-slate-800">
                                    <div className="text-sm font-bold text-sky-400 font-mono">
                                        {selectedNode.in_degree || 0}
                                    </div>
                                    <div className="text-[10px] text-slate-400 uppercase">In-Degree</div>
                                </div>
                                <div className="bg-slate-800/50 p-2 rounded border border-slate-800">
                                    <div className="text-sm font-bold text-pink-400 font-mono">
                                        {selectedNode.out_degree || 0}
                                    </div>
                                    <div className="text-[10px] text-slate-400 uppercase">Out-Degree</div>
                                </div>
                            </div>

                            {/* Extracted Signatures */}
                            <div>
                                <div className="flex items-center justify-between mb-1">
                                    <label className="text-[10px] uppercase text-slate-500 font-semibold">
                                        Symbols & Signatures ({selectedNode.symbol_details?.length || 0})
                                    </label>
                                </div>
                                <div className="space-y-1.5 max-h-48 overflow-y-auto font-mono text-[11px] bg-slate-950/60 p-2 rounded border border-slate-800 select-text">
                                    {selectedNode.symbol_details && selectedNode.symbol_details.length > 0 ? (
                                        selectedNode.symbol_details.map((s, idx) => (
                                            <div key={idx} className="py-0.5 border-b border-slate-800/60 last:border-0 flex items-start gap-1.5">
                                                <span className="text-primary font-semibold select-none text-[10px]">
                                                    L{s.line}
                                                </span>
                                                <span className="text-slate-300 break-all">{s.signature}</span>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-slate-500 italic">No top-level functions or classes defined.</div>
                                    )}
                                </div>
                            </div>

                            {/* Incoming dependencies */}
                            <div>
                                <label className="text-[10px] uppercase text-slate-500 font-semibold">Imported By (Incoming)</label>
                                <div className="mt-1 space-y-1 max-h-36 overflow-y-auto">
                                    {data.edges
                                        .filter((e) => {
                                            const t = typeof e.target === "object" ? (e.target as GraphNode).id : e.target;
                                            return t === selectedNode.id;
                                        })
                                        .map((e, idx) => {
                                            const sId = typeof e.source === "object" ? (e.source as GraphNode).id : e.source;
                                            return (
                                                <button
                                                    key={idx}
                                                    onClick={() => {
                                                        const targetNode = data.nodes.find((n) => n.id === sId);
                                                        if (targetNode) setSelectedNode(targetNode);
                                                    }}
                                                    className="w-full text-left px-2 py-1 rounded bg-slate-800/70 hover:bg-slate-700 text-sky-300 truncate font-mono text-[11px] block border border-slate-700/50"
                                                >
                                                    {sId}
                                                </button>
                                            );
                                        })}
                                </div>
                            </div>

                            {/* Outgoing dependencies */}
                            <div>
                                <label className="text-[10px] uppercase text-slate-500 font-semibold">Dependencies (Outgoing)</label>
                                <div className="mt-1 space-y-1 max-h-36 overflow-y-auto">
                                    {data.edges
                                        .filter((e) => {
                                            const s = typeof e.source === "object" ? (e.source as GraphNode).id : e.source;
                                            return s === selectedNode.id;
                                        })
                                        .map((e, idx) => {
                                            const tId = typeof e.target === "object" ? (e.target as GraphNode).id : e.target;
                                            return (
                                                <button
                                                    key={idx}
                                                    onClick={() => {
                                                        const targetNode = data.nodes.find((n) => n.id === tId);
                                                        if (targetNode) setSelectedNode(targetNode);
                                                    }}
                                                    className="w-full text-left px-2 py-1 rounded bg-slate-800/70 hover:bg-slate-700 text-pink-300 truncate font-mono text-[11px] block border border-slate-700/50"
                                                >
                                                    {tId}
                                                </button>
                                            );
                                        })}
                                </div>
                            </div>
                        </div>
                    </aside>
                )}
            </div>
        </div>
    );
}
