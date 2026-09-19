"use client";

import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import DOMPurify from "isomorphic-dompurify";
import { useTheme } from "@/components/ThemeProvider";
import { useAppearance } from '@/components/AppearanceProvider';

interface MermaidDiagramProps {
    chart: string;
    id?: string;
}

export default function MermaidDiagram({ chart, id = "mermaid-diagram" }: MermaidDiagramProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const { theme, activeTemplate } = useTheme();
    const { template } = useAppearance();
    const [svgCode, setSvgCode] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const isLight = 
        theme === "compact-ceramic" || 
        activeTemplate === "ceramic-light" || 
        activeTemplate === "light-modern" ||
        ["ceramic-light", "light-modern", "minimal", "ceramic"].includes(template);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            let primaryColor = '#7c3aed';
            let primaryTextColor = '#ffffff';
            let primaryBorderColor = '#a78bfa';
            let lineColor = '#6b7280';
            let secondaryColor = '#3b82f6';
            let tertiaryColor = '#10b981';

            if (isLight) {
                if (template === 'ceramic-light' || theme === 'compact-ceramic') {
                    primaryColor = '#f4f4f2';
                    primaryTextColor = '#1a1c1b';
                    primaryBorderColor = '#c4c7c7';
                    lineColor = '#747878';
                    secondaryColor = '#505f76';
                    tertiaryColor = '#ffffff';
                } else if (template === 'light-modern' || template === 'ceramic') {
                    primaryColor = '#f1f5f9';
                    primaryTextColor = '#1e293b';
                    primaryBorderColor = '#cbd5e1';
                    lineColor = '#94a3b8';
                    secondaryColor = '#3b82f6';
                    tertiaryColor = '#ffffff';
                } else {
                    primaryColor = '#f3f4f6';
                    primaryTextColor = '#111827';
                    primaryBorderColor = '#d1d5db';
                    lineColor = '#94a3b8';
                    secondaryColor = '#2563eb';
                    tertiaryColor = '#ffffff';
                }
            }

            mermaid.initialize({
                startOnLoad: false,
                theme: isLight ? 'neutral' : 'dark',
                securityLevel: 'strict',
                fontFamily: 'monospace',
                themeVariables: {
                    primaryColor,
                    primaryTextColor,
                    primaryBorderColor,
                    lineColor,
                    secondaryColor,
                    tertiaryColor,
                }
            });
        }

        const renderDiagram = async () => {
            setLoading(true);
            try {
                const renderId = `${id}-${Math.random().toString(36).substring(2, 9)}`;
                const { svg } = await mermaid.render(renderId, chart);
                const sanitizedSvg = DOMPurify.sanitize(svg, {
                    USE_PROFILES: { svg: true },
                    ADD_ATTR: ['style']
                });
                setSvgCode(sanitizedSvg);
                setError(null);
            } catch (err: any) {
                console.error("Mermaid parsing error:", err);
                setError(err.message || "Failed to render diagram.");
            } finally {
                setLoading(false);
            }
        };

        renderDiagram();
    }, [chart, id, isLight, template, theme]);

    if (error) {
        return (
            <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500 font-mono text-xs overflow-auto">
                <p className="font-bold mb-2">Mermaid Render Error:</p>
                <pre>{error}</pre>
                <div className="mt-4 pt-4 border-t border-red-500/20 text-muted-foreground">
                    <p className="font-bold mb-2">Raw Chart:</p>
                    <pre>{chart}</pre>
                </div>
            </div>
        );
    }

    if (loading || !svgCode) {
        return (
            <div className="h-64 flex items-center justify-center border-2 border-dashed border-border rounded-lg">
                <div className="animate-pulse text-muted-foreground flex items-center gap-2">
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Rendering Architecture Map...
                </div>
            </div>
        );
    }

    return (
        <div 
            ref={containerRef}
            className={`mermaid-container w-full h-full min-h-[400px] rounded-xl shadow-inner relative overflow-hidden group border transition-all duration-300 ${
                isLight 
                    ? "bg-[#F9F9F7] border-[#E5E5E1] mermaid-light" 
                    : "bg-[#0F172A]/50 border-border mermaid-dark"
            }`}
        >
            <style dangerouslySetInnerHTML={{ __html: `
                /* Scoped Light Theme Overrides */
                .mermaid-light .node rect {
                    fill: #FFFFFF !important;
                    stroke: #E5E5E1 !important;
                    stroke-width: 1.5px !important;
                }
                .mermaid-light .node.hotspot rect {
                    fill: #7c3aed !important;
                    stroke: #a78bfa !important;
                    stroke-width: 2.5px !important;
                }
                .mermaid-light .node .label, 
                .mermaid-light .node text, 
                .mermaid-light .node tspan,
                .mermaid-light .node div,
                .mermaid-light .node span,
                .mermaid-light .nodeLabel {
                    fill: #1A1A1A !important;
                    color: #1A1A1A !important;
                }
                .mermaid-light .node.hotspot .label, 
                .mermaid-light .node.hotspot text, 
                .mermaid-light .node.hotspot tspan,
                .mermaid-light .node.hotspot div,
                .mermaid-light .node.hotspot span,
                .mermaid-light .node.hotspot .nodeLabel {
                    fill: #FFFFFF !important;
                    color: #FFFFFF !important;
                }
                .mermaid-light .cluster rect {
                    fill: #F9F9F7 !important;
                    stroke: #E5E5E1 !important;
                    stroke-width: 1px !important;
                }
                .mermaid-light .cluster .label, 
                .mermaid-light .cluster text, 
                .mermaid-light .cluster tspan {
                    fill: #64748B !important;
                    color: #64748B !important;
                    font-weight: 700 !important;
                }
                .mermaid-light .edgePath .path {
                    stroke: #94A3B8 !important;
                    stroke-width: 1.5px !important;
                }
                .mermaid-light .edgeLabel rect {
                    fill: #F9F9F7 !important;
                }
                .mermaid-light .edgeLabel text, 
                .mermaid-light .edgeLabel tspan {
                    fill: #64748B !important;
                    color: #64748B !important;
                }

                /* Scoped Dark Theme Overrides */
                .mermaid-dark .node rect {
                    fill: #1E293B !important;
                    stroke: #334155 !important;
                    stroke-width: 1.5px !important;
                }
                .mermaid-dark .node.hotspot rect {
                    fill: #7c3aed !important;
                    stroke: #a78bfa !important;
                    stroke-width: 2.5px !important;
                }
                .mermaid-dark .node .label, 
                .mermaid-dark .node text, 
                .mermaid-dark .node tspan,
                .mermaid-dark .node div,
                .mermaid-dark .node span,
                .mermaid-dark .nodeLabel {
                    fill: #F8FAFC !important;
                    color: #F8FAFC !important;
                }
                .mermaid-dark .node.hotspot .label, 
                .mermaid-dark .node.hotspot text, 
                .mermaid-dark .node.hotspot tspan,
                .mermaid-dark .node.hotspot div,
                .mermaid-dark .node.hotspot span,
                .mermaid-dark .node.hotspot .nodeLabel {
                    fill: #FFFFFF !important;
                    color: #FFFFFF !important;
                }
                .mermaid-dark .cluster rect {
                    fill: #0F172A !important;
                    stroke: #1E293B !important;
                    stroke-width: 1px !important;
                }
                .mermaid-dark .cluster .label, 
                .mermaid-dark .cluster text, 
                .mermaid-dark .cluster tspan {
                    fill: #94A3B8 !important;
                    color: #94A3B8 !important;
                    font-weight: 700 !important;
                }
                .mermaid-dark .edgePath .path {
                    stroke: #475569 !important;
                    stroke-width: 1.5px !important;
                }
                .mermaid-dark .edgeLabel rect {
                    fill: #0F172A !important;
                }
                .mermaid-dark .edgeLabel text, 
                .mermaid-dark .edgeLabel tspan {
                    fill: #94A3B8 !important;
                    color: #94A3B8 !important;
                }
            ` }} />
            <TransformWrapper
                initialScale={1}
                minScale={0.2}
                maxScale={4}
                centerOnInit={true}
                wheel={{ step: 0.1 }}
            >
                <TransformComponent wrapperClass="w-full h-full cursor-grab active:cursor-grabbing !w-full !h-full" contentClass="w-full h-full flex items-center justify-center min-h-[400px]">
                    <div dangerouslySetInnerHTML={{ __html: svgCode }} className="w-full h-full" />
                </TransformComponent>
            </TransformWrapper>
            
            <div className="absolute top-4 right-4 text-xs text-muted-foreground bg-background/80 backdrop-blur px-3 py-1.5 rounded-lg border border-border flex items-center gap-2 z-10 pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg>
                Scroll to Zoom, Drag to Pan
            </div>
        </div>
    );
}
