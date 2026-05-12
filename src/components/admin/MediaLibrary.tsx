"use client";

import { useState, useTransition, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { uploadMedia, deleteMedia, registerMedia } from "@/app/admin/actions/media";
import { useConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/ui/ToastProvider";

export interface MediaItem {
    id: string;
    public_url: string;
    original_name: string;
    mime_type: string;
    storage_path: string;
    folder: string;
}

interface MediaLibraryProps {
    initialMedia: MediaItem[];
    onSelect?: (url: string) => void;
    selectable?: boolean;
}

export default function MediaLibrary({ initialMedia, onSelect, selectable = false }: MediaLibraryProps) {
    const [media, setMedia] = useState<MediaItem[]>(initialMedia);
    const [, startTransition] = useTransition();
    const [uploading, setUploading] = useState(false);
    const { dialog, confirm: confirmDelete } = useConfirmDialog();
    const { showToast } = useToast();

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        setUploading(true);
        try {
            for (const file of acceptedFiles) {
                // 1. Request a presigned URL from our secure proxy route
                const req = await fetch("/api/storage/sign-upload", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        filename: file.name,
                        contentType: file.type,
                    })
                });

                if (!req.ok) {
                    // Fallback to the old server action behavior if the route is unavailable or user lacks permissions
                    const formData = new FormData();
                    formData.append("file", file);
                    await uploadMedia(formData);
                    continue; // Skip the rest of the proxy flow
                }

                // 2. Parse the Secure Payload
                const { uploadUrl, path, publicUrl } = await req.json();

                // 3. Perform a direct PUT upload to the cloud bucket using the short-lived presigned URL
                await fetch(uploadUrl, {
                    method: "PUT",
                    headers: {
                        "Content-Type": file.type,
                    },
                    body: file,
                });

                // 4. Register the securely uploaded file metadata in the DB via Server Action
                const formData = new FormData();
                formData.append("file_name", file.name);
                formData.append("storage_path", path);
                formData.append("public_url", publicUrl);
                formData.append("mime_type", file.type);
                formData.append("size_bytes", file.size.toString());

                await registerMedia(formData);
            }
            showToast("Media uploaded successfully.", "success");
        } catch (err) {
            console.error("Upload failed", err);
            showToast(err instanceof Error ? err.message : "Media upload failed.", "error");
        } finally {
            setUploading(false);
            if (typeof window !== "undefined") {
                window.location.reload();
            }
        }
    }, [media, showToast]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'image/*': [] } });

    function handleDelete(id: string, path: string) {
        confirmDelete("This file will be permanently deleted.", async () => {
            startTransition(async () => {
                const result = await deleteMedia(id, path);
                if (result.success) {
                    setMedia((prev) => prev.filter((m) => m.id !== id));
                    showToast("Media file deleted.", "success");
                } else {
                    showToast(result.error || "Failed to delete file.", "error");
                }
            });
        }, { title: "Delete File?" });
    }

    const [copiedId, setCopiedId] = useState<string | null>(null);

    async function handleCopy(item: MediaItem) {
        if (selectable && onSelect) {
            onSelect(item.public_url);
            return;
        }

        const markdownTag = `![${item.original_name}](${item.public_url})`;
        try {
            await navigator.clipboard.writeText(markdownTag);
            setCopiedId(item.id);
            setTimeout(() => setCopiedId(null), 2000);
        } catch (err) {
            console.error("Failed to copy:", err);
            prompt("Copy this markdown tag manually:", markdownTag);
        }
    }

    return (
        <div className="space-y-6">
            {!selectable && (
                <div className="glass p-4 rounded-xl border border-primary/20 bg-primary/5">
                    <h3 className="font-semibold text-primary mb-1 text-sm flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        How to use this library
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                        Files uploaded here are stored securely in your public cloud bucket.
                        To use an image in your Projects or Blog posts, simply <strong className="text-foreground">Click</strong> on any file below to automatically copy its Markdown embed code to your clipboard.
                    </p>
                </div>
            )}

            {/* Dropzone */}
            <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${isDragActive ? "border-primary bg-primary/10" : "border-border hover:border-primary/50 hover:bg-surface/50"
                    }`}
            >
                <input {...getInputProps()} />
                {uploading ? (
                    <p className="text-sm font-medium animate-pulse">Uploading to Cloud Storage...</p>
                ) : isDragActive ? (
                    <p className="text-sm font-medium text-primary">Drop files here...</p>
                ) : (
                    <div>
                        <p className="text-3xl mb-2">☁️</p>
                        <p className="text-sm font-medium">Drag & drop files here, or click to select</p>
                        <p className="text-xs text-muted-foreground mt-1">Supports JPG, PNG, WEBP, GIF</p>
                    </div>
                )}
            </div>

            {/* Grid */}
            {media.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {media.map((item) => (
                        <div
                            key={item.id}
                            className={`glass rounded-xl overflow-hidden group relative border transition-all cursor-pointer hover:ring-2 hover:ring-primary`}
                            onClick={() => handleCopy(item)}
                            title={selectable ? "Select image" : "Click to copy markdown snippet"}
                        >
                            {/* Copy Success Overlay */}
                            {copiedId === item.id && (
                                <div className="absolute inset-0 bg-primary/80 z-20 flex items-center justify-center backdrop-blur-sm">
                                    <span className="text-primary-foreground text-xs font-bold text-center px-2">Copied!</span>
                                </div>
                            )}

                            {/* Actions (Delete) */}
                            {!selectable && (
                                <button
                                    onClick={(e) => { e.stopPropagation(); handleDelete(item.id, item.storage_path); }}
                                    className="absolute top-1 right-1 z-10 p-1 bg-red-500/90 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                    title="Delete"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                                </button>
                            )}

                            {item.mime_type?.startsWith("image/") ? (
                                <div className="h-32 bg-surface">
                                    <img src={item.public_url} alt={item.original_name} className="w-full h-full object-cover" />
                                </div>
                            ) : (
                                <div className="h-32 bg-surface flex items-center justify-center">
                                    <span className="text-3xl">📄</span>
                                </div>
                            )}
                            <div className="p-2 border-t border-border bg-surface/30">
                                <p className="text-[10px] font-medium text-muted-foreground truncate" title={item.original_name}>{item.original_name}</p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 text-muted-foreground text-sm">
                    No matching files found.
                </div>
            )}
        </div>
    );
}
