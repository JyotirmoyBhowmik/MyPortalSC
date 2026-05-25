import { useState } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/ui/ToastProvider";

interface ImageUploadProps {
    value?: string | null;
    onChange: (url: string) => void;
    onRemove: () => void;
    bucketName?: string;
    folderPath?: string;
}

export default function ImageUpload({
    value,
    onChange,
    onRemove,
    bucketName = "project-assets",
    folderPath = "projects/images",
}: ImageUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [preview, setPreview] = useState<string | null>(value || null);
    const supabase = createClient();
    const { showToast } = useToast();

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Preview immediately
        setPreview(URL.createObjectURL(file));
        setUploading(true);

        try {
            const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "")}`;
            const filePath = `${folderPath}/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from(bucketName)
                .upload(filePath, file);

            if (uploadError) throw uploadError;


            // Use proxy route to hide raw Supabase URL from visitors
            const proxyUrl = `/api/assets?path=${encodeURIComponent(filePath)}`;
            onChange(proxyUrl);
            showToast("Upload successful", "success");
        } catch (error) {
            console.error("Upload failed:", error);
            showToast("Upload failed. Please try again.", "error");
            setPreview(value || null); // Revert preview
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-4">
                {preview ? (
                    <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-border group">
                        <Image
                            src={preview}
                            alt="Preview"
                            fill
                            className="object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button
                                type="button"
                                onClick={() => {
                                    setPreview(null);
                                    onRemove();
                                }}
                                className="text-white text-xs bg-red-500/80 px-2 py-1 rounded hover:bg-red-600"
                            >
                                Remove
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="w-32 h-32 rounded-lg border-2 border-dashed border-border flex items-center justify-center bg-muted/50 text-muted-foreground text-sm">
                        No Image
                    </div>
                )}

                <div className="flex-1">
                    <label className="block mb-2 text-sm font-medium">
                        Change Image
                    </label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        disabled={uploading}
                        className="block w-full text-sm text-muted-foreground
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-full file:border-0
                            file:text-sm file:font-semibold
                            file:bg-primary file:text-primary-foreground
                            hover:file:bg-primary/90
                            disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    {uploading && (
                        <p className="text-xs text-primary mt-2 animate-pulse">
                            Uploading...
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
