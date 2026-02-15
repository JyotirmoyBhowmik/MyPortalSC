"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { useEffect } from "react";

interface RichTextEditorProps {
    content: string;
    onChange: (html: string) => void;
    minHeight?: string;
}

export default function RichTextEditor({ content, onChange, minHeight = "min-h-[300px]" }: RichTextEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: "text-primary underline",
                },
            }),
            Image.configure({
                HTMLAttributes: {
                    class: "rounded-lg max-w-full h-auto",
                },
            }),
        ],
        content: content,
        editorProps: {
            attributes: {
                class: `prose prose-invert max-w-none focus:outline-none ${minHeight} p-4`,
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    // Handle external content updates (e.g. initial load)
    useEffect(() => {
        if (editor && content !== editor.getHTML()) {
            // Only update if content is effectively different to avoid cursor jumps
            // Use stricter check or just rely on initial? 
            // For simple use case:
            if (editor.getText() === "" && content !== "") {
                editor.commands.setContent(content);
            }
        }
    }, [content, editor]);

    if (!editor) {
        return null;
    }

    return (
        <div className="border border-input rounded-lg overflow-hidden bg-background focus-within:ring-2 focus-within:ring-ring">
            {/* Toolbar */}
            <div className="bg-muted/50 border-b border-border p-2 flex flex-wrap gap-1">
                <MenuButton
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    isActive={editor.isActive("bold")}
                    label="B"
                    title="Bold"
                />
                <MenuButton
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    isActive={editor.isActive("italic")}
                    label="I"
                    title="Italic"
                />
                <MenuButton
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    isActive={editor.isActive("strike")}
                    label="S"
                    title="Strike"
                />
                <div className="w-px h-6 bg-border mx-1" />
                <MenuButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    isActive={editor.isActive("heading", { level: 1 })}
                    label="H1"
                    title="Heading 1"
                />
                <MenuButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    isActive={editor.isActive("heading", { level: 2 })}
                    label="H2"
                    title="Heading 2"
                />
                <MenuButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    isActive={editor.isActive("heading", { level: 3 })}
                    label="H3"
                    title="Heading 3"
                />
                <div className="w-px h-6 bg-border mx-1" />
                <MenuButton
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    isActive={editor.isActive("bulletList")}
                    label="• List"
                    title="Bullet List"
                />
                <MenuButton
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    isActive={editor.isActive("orderedList")}
                    label="1. List"
                    title="Ordered List"
                />
                <div className="w-px h-6 bg-border mx-1" />
                <MenuButton
                    onClick={() => {
                        const url = window.prompt('URL');
                        if (url) {
                            editor.chain().focus().setLink({ href: url }).run();
                        }
                    }}
                    isActive={editor.isActive("link")}
                    label="Link"
                    title="Add Link"
                />
                <MenuButton
                    onClick={() => {
                        const url = window.prompt('Image URL');
                        if (url) {
                            editor.chain().focus().setImage({ src: url }).run();
                        }
                    }}
                    isActive={editor.isActive("image")}
                    label="Image"
                    title="Add Image URL"
                />
            </div>
            <EditorContent editor={editor} />
        </div>
    );
}

function MenuButton({ onClick, isActive, label, title }: { onClick: () => void; isActive: boolean; label: string; title: string }) {
    return (
        <button
            type="button"
            onClick={onClick}
            title={title}
            className={`
                px-2 py-1 text-sm font-medium rounded hover:bg-accent hover:text-accent-foreground transition-colors
                ${isActive ? "bg-primary/20 text-primary" : "text-muted-foreground"}
            `}
        >
            {label}
        </button>
    );
}
