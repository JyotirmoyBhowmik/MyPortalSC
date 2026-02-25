import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/components/ui/ToastProvider";

interface Document {
    name: string;
    url: string;
    size?: number;
}

interface DocumentUploadProps {
    value?: Document[];
    onChange: (files: Document[]) => void;
    onRemove: (index: number) => void;
    bucketName?: string;
    folderPath?: string;
}

export default function DocumentUpload({
    value = [],
    onChange,
    onRemove,
    bucketName = "project-assets",
    folderPath = "projects/documents",
}: DocumentUploadProps) {
    const [uploading, setUploading] = useState(false);
    const supabase = createClient();
    const { showToast } = useToast();

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setUploading(true);
        const uploadedDocs: Document[] = [...value];

        try {
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "")}`;
                const filePath = `${folderPath}/${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from(bucketName)
                    .upload(filePath, file);

                if (uploadError) throw uploadError;

                const { data } = supabase.storage
                    .from(bucketName)
                    .getPublicUrl(filePath);

                // Use proxy route to hide raw Supabase URL from visitors
                const proxyUrl = `/api/assets?path=${encodeURIComponent(filePath)}`;

                uploadedDocs.push({
                    name: file.name,
                    url: proxyUrl,
                    size: file.size,
                });
            }

            onChange(uploadedDocs);
            showToast("Documents uploaded successfully", "success");
        } catch (error) {
            console.error("Upload failed:", error);
            showToast("One or more files failed to upload.", "error");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {value.map((doc, index) => (
                    <div
                        key={index}
                        className="flex items-center justify-between p-3 border border-border rounded-lg bg-muted/30"
                    >
                        <div className="flex items-center gap-3 overflow-hidden">
                            <div className="w-8 h-8 flex items-center justify-center bg-primary/10 rounded">
                                <span className="text-primary font-bold text-xs uppercase">
                                    {doc.name.split(".").pop()}
                                </span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium truncate" title={doc.name}>
                                    {doc.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {(doc.size ? doc.size / 1024 : 0).toFixed(1)} KB
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => onRemove(index)}
                            className="p-1 rounded hover:bg-red-500/10 text-red-500 transition-colors"
                            aria-label="Remove file"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                ))}
            </div>

            <div className="flex items-center gap-4">
                <label
                    className={`
                        flex items-center justify-center
                        cursor-pointer px-4 py-2 rounded-lg border-2 border-dashed
                        border-primary/50 text-primary bg-primary/5
                        hover:bg-primary/10 transition-colors
                        ${uploading ? "opacity-50 cursor-not-allowed" : ""}
                    `}
                >
                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    {uploading ? "Uploading..." : "Upload Document"}
                    <input
                        type="file"
                        multiple
                        onChange={handleFileChange}
                        disabled={uploading}
                        className="hidden"
                    />
                </label>
                <p className="text-xs text-muted-foreground">
                    Upload PDFs, Docs, or Images (Max 10MB each)
                </p>
            </div>
        </div>
    );
}
