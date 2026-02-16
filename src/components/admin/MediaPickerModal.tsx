"use client";

import { useEffect, useState } from "react";
import MediaLibrary, { MediaItem } from "./MediaLibrary";
import { getMedia } from "@/app/admin/actions/media";

interface MediaPickerModalProps {
    onSelect: (url: string) => void;
    onClose: () => void;
}

export default function MediaPickerModal({ onSelect, onClose }: MediaPickerModalProps) {
    const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchMedia() {
            setLoading(true);
            const data = await getMedia();
            setMediaItems(data);
            setLoading(false);
        }
        fetchMedia();
    }, []);

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="glass rounded-2xl w-full max-w-5xl h-[80vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between p-4 border-b border-border/50">
                    <h2 className="text-lg font-bold">Select Media</h2>
                    <button onClick={onClose} className="p-2 hover:bg-surface rounded-full transition-colors">
                        ✕
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                    {loading ? (
                        <div className="flex items-center justify-center h-full">
                            <p className="animate-pulse text-muted-foreground">Loading library...</p>
                        </div>
                    ) : (
                        <MediaLibrary
                            initialMedia={mediaItems}
                            selectable={true}
                            onSelect={(url) => {
                                onSelect(url);
                                onClose();
                            }}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
