"use client";

import { useState, useTransition } from "react";
import { replyToContact } from "@/app/admin/actions/contact";

export default function ContactsManager({ contacts }: { contacts: any[] }) {
    const [selectedContact, setSelectedContact] = useState<any | null>(null);
    const [isPending, startTransition] = useTransition();
    const [message, setMessage] = useState<{ type: string; text: string } | null>(null);

    const statusColors: Record<string, string> = {
        new: "bg-blue-500/15 text-blue-400",
        read: "bg-amber-500/15 text-amber-400",
        replied: "bg-green-500/15 text-green-400",
        archived: "bg-gray-500/15 text-gray-400",
    };

    function handleReply(formData: FormData) {
        if (!selectedContact) return;
        const replyMessage = formData.get("replyMessage") as string;

        startTransition(async () => {
            const result = await replyToContact(
                selectedContact.id,
                selectedContact.email,
                selectedContact.name,
                replyMessage
            );
            if (result.success) {
                setMessage({ type: "success", text: "Reply sent successfully!" });
                setSelectedContact(null);
            } else {
                setMessage({ type: "error", text: result.error || "Failed to send reply" });
            }
            setTimeout(() => setMessage(null), 3000);
        });
    }

    return (
        <div>
            {message && (
                <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg text-sm font-medium shadow-lg ${message.type === "success" ? "bg-green-500/20 text-green-400 border border-green-500/30" : "bg-red-500/20 text-red-400 border border-red-500/30"}`}>
                    {message.text}
                </div>
            )}

            <div className="glass rounded-xl overflow-hidden">
                <table className="w-full">
                    <thead className="bg-surface/50">
                        <tr>
                            <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">Name</th>
                            <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3 hidden md:table-cell">Email</th>
                            <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3 hidden lg:table-cell">Message</th>
                            <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">Status</th>
                            <th className="text-left text-xs font-semibold text-muted-foreground px-4 py-3">Date</th>
                            <th className="text-right text-xs font-semibold text-muted-foreground px-4 py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/50">
                        {contacts?.map((c) => (
                            <tr key={c.id} className="hover:bg-surface/30 transition-colors">
                                <td className="px-4 py-3 text-sm font-medium">{c.name}</td>
                                <td className="px-4 py-3 text-sm text-muted-foreground hidden md:table-cell">{c.email}</td>
                                <td className="px-4 py-3 text-sm text-muted-foreground hidden lg:table-cell truncate max-w-xs">{c.message}</td>
                                <td className="px-4 py-3">
                                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${statusColors[c.status] || statusColors.new}`}>
                                        {c.status}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-xs text-muted-foreground">
                                    {new Date(c.created_at).toLocaleDateString()}
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <button
                                        onClick={() => setSelectedContact(c)}
                                        className="text-xs text-primary hover:underline font-medium"
                                    >
                                        Reply
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {(!contacts || contacts.length === 0) && (
                    <p className="text-sm text-muted-foreground text-center py-8">No contact submissions yet.</p>
                )}
            </div>

            {selectedContact && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="glass rounded-2xl p-6 w-full max-w-lg shadow-2xl">
                        <h2 className="text-lg font-bold mb-2">Reply to {selectedContact.name}</h2>
                        <p className="text-sm text-muted-foreground mb-4 font-mono">{selectedContact.email}</p>

                        <div className="bg-surface/50 p-3 rounded-lg border border-border mb-4 max-h-40 overflow-y-auto">
                            <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider font-semibold">Original Message:</p>
                            <p className="text-sm">{selectedContact.message}</p>
                        </div>

                        <form action={handleReply} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1 text-muted-foreground">Your Reply</label>
                                <textarea
                                    name="replyMessage"
                                    rows={5}
                                    required
                                    placeholder="Type your response here..."
                                    className="w-full px-3 py-2 bg-surface rounded-lg border border-border text-sm text-foreground focus:ring-1 focus:ring-primary outline-none"
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setSelectedContact(null)}
                                    className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isPending}
                                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary-hover disabled:opacity-50 transition-colors flex items-center gap-2"
                                >
                                    {isPending ? "Sending..." : (
                                        <>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
                                            Send Reply
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
