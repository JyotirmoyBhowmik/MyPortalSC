"use client";

import { useRef } from "react";
import { useReactToPrint } from "react-to-print";

interface DownloadPdfButtonProps {
    contentRef: React.RefObject<HTMLDivElement | null>;
    fileName?: string;
}

export default function DownloadPdfButton({ contentRef, fileName = "executive-summary.pdf" }: DownloadPdfButtonProps) {
    const handlePrint = useReactToPrint({
        content: () => contentRef.current,
        documentTitle: fileName,
        bodyClass: "print-body",
    } as any);

    return (
        <button
            onClick={handlePrint}
            className="fixed bottom-8 right-8 z-50 flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full shadow-xl hover:scale-105 transition-all font-bold print:hidden animate-in fade-in slide-in-from-bottom-4 duration-1000"
            aria-label="Download as PDF"
        >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            <span>Download PDF</span>
        </button>
    );
}
