"use client";

import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

interface MermaidDiagramProps {
    chart: string;
    id?: string;
}

export default function MermaidDiagram({ chart, id = "mermaid-diagram" }: MermaidDiagramProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [svgCode, setSvgCode] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const [template, setTemplate] = useState<string>("classic");

    // Generate a unique ID to avoid Mermaid render clashes
    const uniqueIdRef = useRef(`mermaid-${id.replace(/[^a-zA-Z0-9_-]/g, "")}-${Math.random().toString(36).substring(2, 9)}`);

    useEffect(() => {
        const getTemplate = () => {
            const bodyTemplate = document.body.getAttribute("data-template");
            const htmlTemplate = document.documentElement.getAttribute("data-template");
            return bodyTemplate || htmlTemplate || "classic";
        };
        
        setTemplate(getTemplate());

        const observer = new MutationObserver(() => {
            setTemplate(getTemplate());
        });

        observer.observe(document.body, { attributes: true, attributeFilter: ["data-template"] });
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-template"] });

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const isLight = ["ceramic-light", "light-modern", "minimal", "ceramic"].includes(template);
            
            let primaryColor = '#7c3aed'; // Purple theme primary
            let primaryTextColor = '#ffffff';
            let primaryBorderColor = '#a78bfa';
            let lineColor = '#6b7280';
            let secondaryColor = '#3b82f6';
            let tertiaryColor = '#10b981';

            if (isLight) {
                if (template === 'ceramic-light') {
                    primaryColor = '#f4f4f2'; // Soft unglazed surface dim
                    primaryTextColor = '#1a1c1b'; // Charcoal primary text
                    primaryBorderColor = '#c4c7c7'; // Tactile outline
                    lineColor = '#747878'; // Slate blue line
                    secondaryColor = '#505f76'; // Slate blue accent
                    tertiaryColor = '#ffffff';
                } else if (template === 'light-modern' || template === 'ceramic') {
                    primaryColor = '#f1f5f9';
                    primaryTextColor = '#1e293b';
                    primaryBorderColor = '#cbd5e1';
                    lineColor = '#94a3b8';
                    secondaryColor = '#3b82f6';
                    tertiaryColor = '#ffffff';
                } else if (template === 'minimal') {
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
                securityLevel: 'loose',
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
                const { svg } = await mermaid.render(uniqueIdRef.current, chart);
                setSvgCode(svg);
                setError(null);
            } catch (err: any) {
                console.error("Mermaid parsing error:", err);
                setError(err.message || "Failed to render diagram.");
            } finally {
                setLoading(false);
            }
        };

        renderDiagram();
    }, [chart, template]);

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
            className="mermaid-container w-full h-full min-h-[400px] bg-surface/50 border border-border rounded-xl shadow-inner relative overflow-hidden group"
        >
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
