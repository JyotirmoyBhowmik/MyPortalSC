"use client";

import React, { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

interface MermaidDiagramProps {
    chart: string;
    id?: string;
}

export default function MermaidDiagram({ chart, id = "mermaid-diagram" }: MermaidDiagramProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [svgCode, setSvgCode] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        mermaid.initialize({
            startOnLoad: false,
            theme: 'dark',
            securityLevel: 'loose',
            fontFamily: 'monospace',
            themeVariables: {
                primaryColor: '#7c3aed',
                primaryTextColor: '#fff',
                primaryBorderColor: '#a78bfa',
                lineColor: '#6b7280',
                secondaryColor: '#3b82f6',
                tertiaryColor: '#10b981'
            }
        });

        const renderDiagram = async () => {
            try {
                if (containerRef.current) {
                    const { svg } = await mermaid.render(id, chart);
                    setSvgCode(svg);
                    setError(null);
                }
            } catch (err: any) {
                console.error("Mermaid parsing error:", err);
                setError(err.message || "Failed to render diagram.");
            }
        };

        renderDiagram();
    }, [chart, id]);

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

    if (!svgCode) {
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
            className="mermaid-container w-full overflow-auto bg-surface/50 border border-border rounded-xl p-6 shadow-inner custom-scrollbar"
            dangerouslySetInnerHTML={{ __html: svgCode }}
        />
    );
}
