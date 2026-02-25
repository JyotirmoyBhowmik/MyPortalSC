"use client";

import { useState, useTransition } from "react";
import Button from "@/components/ui/Button";
import { updatePageContent } from "@/app/admin/actions/pages";
import { useSettings } from "@/components/SettingsProvider";
import dynamic from "next/dynamic";
import { useToast } from "@/components/ui/ToastProvider";

const RichTextEditor = dynamic(() => import("./RichTextEditor"), {
    ssr: false,
    loading: () => <div className="admin-input min-h-[150px] animate-pulse bg-surface/50" />,
});

export default function PagesManager({
    initialAbout,
    initialContact,
    allowVersioning = false,
    allowScheduledPublish = false,
}: {
    initialAbout: Record<string, any>;
    initialContact: Record<string, any>;
    allowVersioning?: boolean;
    allowScheduledPublish?: boolean;
}) {
    const settings = useSettings();
    const useRichEditor = !!settings?.feature_rich_editor;
    const [isPending, startTransition] = useTransition();
    const { showToast } = useToast();

    // About State
    const [biography, setBiography] = useState(initialAbout.biography || "");
    const [vision, setVision] = useState(initialAbout.vision_statement || "");
    const [videoLink, setVideoLink] = useState(initialAbout.videoLink || "");

    // Contact State
    const [email, setEmail] = useState(initialContact.email || "");
    const [globalOpsTitle, setGlobalOpsTitle] = useState(initialContact.global_ops_title || "Global Operations");
    const [globalOpsDesc, setGlobalOpsDesc] = useState(initialContact.global_ops_desc || "Delivering excellence across borders.");

    const [activeTab, setActiveTab] = useState<"about" | "contact">("about");

    function handleSave(pageKey: "about" | "contact") {
        startTransition(async () => {
            let contentToSave = {};

            if (pageKey === "about") {
                contentToSave = {
                    biography,
                    vision_statement: vision,
                    videoLink
                };
            } else {
                contentToSave = {
                    email,
                    global_ops_title: globalOpsTitle,
                    global_ops_desc: globalOpsDesc
                };
            }

            const result = await updatePageContent(pageKey, contentToSave);

            if (result.success) {
                showToast(`${pageKey.charAt(0).toUpperCase() + pageKey.slice(1)} page updated.`, "success");
            } else {
                showToast(result.error || "Failed to update.", "error");
            }
        });
    }

    return (
        <div className="space-y-6">
            {/* Tabs */}
            <div className="flex gap-2 border-b border-border/50 pb-4">
                <button
                    onClick={() => setActiveTab("about")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === "about" ? "bg-primary text-white" : "bg-surface text-muted-foreground hover:text-foreground"}`}
                >
                    About Page
                </button>
                <button
                    onClick={() => setActiveTab("contact")}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === "contact" ? "bg-primary text-white" : "bg-surface text-muted-foreground hover:text-foreground"}`}
                >
                    Contact Page
                </button>
            </div>

            {/* About Edit Form */}
            {activeTab === "about" && (
                <div className="glass p-6 rounded-xl space-y-6 animate-fade-in">
                    <div>
                        <label className="block text-sm font-medium mb-2">Intro Video URL</label>
                        <p className="text-xs text-muted-foreground mb-3">Copy an exact `.mp4` link from the Media Library to replace the default video.</p>
                        <input
                            type="url"
                            value={videoLink}
                            onChange={(e) => setVideoLink(e.target.value)}
                            className="admin-input"
                            placeholder="https://commondatastorage.googleapis.com/..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Biography Override (Optional)</label>
                        {useRichEditor ? (
                            <RichTextEditor
                                content={biography}
                                onChange={setBiography}
                                // placeholder="Leave blank to use the default hardcoded bullets." // TipTap extension required for placeholders
                                minHeight="min-h-[150px]"
                            />
                        ) : (
                            <textarea
                                value={biography}
                                onChange={(e) => setBiography(e.target.value)}
                                className="admin-input min-h-[150px]"
                                placeholder="Leave blank to use the default hardcoded bullets."
                            />
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Vision Statement Override (Optional)</label>
                        {useRichEditor ? (
                            <RichTextEditor
                                content={vision}
                                onChange={setVision}
                                // placeholder="To drive purposeful technology transformation..."
                                minHeight="min-h-[100px]"
                            />
                        ) : (
                            <textarea
                                value={vision}
                                onChange={(e) => setVision(e.target.value)}
                                className="admin-input min-h-[100px]"
                                placeholder="To drive purposeful technology transformation..."
                            />
                        )}
                    </div>

                    <div className="flex justify-end pt-4">
                        <Button
                            variant="primary"
                            isLoading={isPending}
                            onClick={() => handleSave("about")}
                        >
                            Save About Page
                        </Button>
                    </div>
                </div>
            )}

            {/* Contact Edit Form */}
            {activeTab === "contact" && (
                <div className="glass p-6 rounded-xl space-y-6 animate-fade-in">
                    <div>
                        <label className="block text-sm font-medium mb-2">Primary Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="admin-input"
                            placeholder="contact@jyotirmoyb.com"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium mb-2">Global Operations Title</label>
                            <input
                                type="text"
                                value={globalOpsTitle}
                                onChange={(e) => setGlobalOpsTitle(e.target.value)}
                                className="admin-input"
                                placeholder="Global Operations"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Global Operations Subtitle</label>
                            <input
                                type="text"
                                value={globalOpsDesc}
                                onChange={(e) => setGlobalOpsDesc(e.target.value)}
                                className="admin-input"
                                placeholder="Delivering excellence across borders."
                            />
                        </div>
                    </div>

                    <div className="flex justify-end pt-4">
                        <Button
                            variant="primary"
                            isLoading={isPending}
                            onClick={() => handleSave("contact")}
                        >
                            Save Contact Page
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
