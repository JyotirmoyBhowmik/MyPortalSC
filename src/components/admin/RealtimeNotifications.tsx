"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface Notification {
    id: string;
    message: string;
    timestamp: number;
}

export default function RealtimeNotifications() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        // Subscribe to INSERTS on contact_submissions table
        const channel = supabase
            .channel("schema-db-changes")
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "contact_submissions",
                },
                (payload) => {
                    const newForm = payload.new;
                    const newNotif: Notification = {
                        id: crypto.randomUUID(),
                        message: `New message from ${newForm.name} regarding "${newForm.subject || 'Website Inquiry'}"`,
                        timestamp: Date.now(),
                    };

                    setNotifications((prev) => [...prev, newNotif]);

                    // Auto-dismiss after 8 seconds
                    setTimeout(() => {
                        setNotifications((prev) => prev.filter((n) => n.id !== newNotif.id));
                    }, 8000);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [supabase]);

    const handleDismiss = (id: string) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    };

    const handleView = (id: string) => {
        handleDismiss(id);
        router.push("/admin/contacts");
    };

    if (notifications.length === 0) return null;

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full">
            {notifications.map((notif) => (
                <div
                    key={notif.id}
                    className="glass rounded-xl p-4 shadow-2xl border-l-4 border-l-primary animate-in slide-in-from-bottom-5 fade-in duration-300"
                >
                    <div className="flex justify-between items-start gap-3">
                        <div>
                            <h4 className="text-sm font-bold text-foreground">New Contact Received 🔔</h4>
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                {notif.message}
                            </p>
                        </div>
                        <button
                            onClick={() => handleDismiss(notif.id)}
                            className="text-muted-foreground hover:text-foreground shrink-0 transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <div className="mt-3 flex gap-2">
                        <button
                            onClick={() => handleView(notif.id)}
                            className="px-3 py-1.5 text-xs font-semibold bg-primary text-primary-foreground rounded-md hover:bg-primary-hover transition-colors"
                        >
                            View Inbox
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
