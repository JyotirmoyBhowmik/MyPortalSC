"use client";

import { useRef, useCallback } from "react";

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
    minHeight?: string;
}

/**
 * Lightweight contentEditable-based rich text editor.
 * Provides basic toolbar buttons for Bold, Italic, Underline, and Lists.
 */
export default function RichTextEditor({
    value,
    onChange,
    placeholder = "",
    className = "",
    minHeight = "150px",
}: RichTextEditorProps) {
    const editorRef = useRef<HTMLDivElement>(null);

    const exec = useCallback((command: string, value?: string) => {
        document.execCommand(command, false, value);
        if (editorRef.current) {
            onChange(editorRef.current.innerHTML);
        }
    }, [onChange]);

    return (
        <div className={`border border-border rounded-lg overflow-hidden ${className}`}>
            {/* Toolbar */}
            <div className="flex items-center gap-1 p-2 border-b border-border bg-surface/50">
                <button
                    type="button"
                    onClick={() => exec("bold")}
                    className="p-1.5 rounded hover:bg-surface-hover text-sm font-bold text-muted-foreground hover:text-foreground transition-colors"
                    title="Bold"
                >
                    B
                </button>
                <button
                    type="button"
                    onClick={() => exec("italic")}
                    className="p-1.5 rounded hover:bg-surface-hover text-sm italic text-muted-foreground hover:text-foreground transition-colors"
                    title="Italic"
                >
                    I
                </button>
                <button
                    type="button"
                    onClick={() => exec("underline")}
                    className="p-1.5 rounded hover:bg-surface-hover text-sm underline text-muted-foreground hover:text-foreground transition-colors"
                    title="Underline"
                >
                    U
                </button>
                <span className="w-px h-5 bg-border mx-1" />
                <button
                    type="button"
                    onClick={() => exec("insertUnorderedList")}
                    className="p-1.5 rounded hover:bg-surface-hover text-sm text-muted-foreground hover:text-foreground transition-colors"
                    title="Bullet List"
                >
                    • List
                </button>
                <button
                    type="button"
                    onClick={() => exec("insertOrderedList")}
                    className="p-1.5 rounded hover:bg-surface-hover text-sm text-muted-foreground hover:text-foreground transition-colors"
                    title="Numbered List"
                >
                    1. List
                </button>
            </div>

            {/* Editor Area */}
            <div
                ref={editorRef}
                contentEditable
                suppressContentEditableWarning
                className="p-3 text-sm text-foreground focus:outline-none prose prose-sm max-w-none"
                style={{ minHeight }}
                onInput={() => {
                    if (editorRef.current) {
                        onChange(editorRef.current.innerHTML);
                    }
                }}
                dangerouslySetInnerHTML={{ __html: value }}
                data-placeholder={placeholder}
            />
        </div>
    );
}
