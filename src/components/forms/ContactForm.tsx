"use client";

import { useState } from "react";
import { submitContactForm } from "@/app/admin/actions/contact";

export default function ContactForm() {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<{ success?: boolean; message?: string } | null>(null);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setStatus(null);

        const formData = new FormData(e.currentTarget);

        try {
            const result = await submitContactForm(formData);

            setStatus(result);

            if (result.success) {
                (e.target as HTMLFormElement).reset();
            }
        } catch (error) {
            setStatus({ success: false, message: "An unexpected error occurred." });
        } finally {
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div>
                <label
                    htmlFor="name"
                    className="block text-sm font-medium mb-1.5"
                >
                    Name
                </label>
                <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    placeholder="Your name"
                    className="admin-input w-full"
                />
            </div>
            <div>
                <label
                    htmlFor="email"
                    className="block text-sm font-medium mb-1.5"
                >
                    Email
                </label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="you@example.com"
                    className="admin-input w-full"
                />
            </div>
            <div>
                <label
                    htmlFor="subject"
                    className="block text-sm font-medium mb-1.5"
                >
                    Subject
                </label>
                <input
                    id="subject"
                    name="subject"
                    type="text"
                    placeholder="Project collaboration"
                    className="admin-input w-full"
                />
            </div>
            <div>
                <label
                    htmlFor="message"
                    className="block text-sm font-medium mb-1.5"
                >
                    Message
                </label>
                <textarea
                    id="message"
                    name="message"
                    rows={5}
                    required
                    placeholder="Tell me about your project…"
                    className="admin-input w-full resize-none"
                />
            </div>

            {status && (
                <div className={`p-4 rounded-lg text-sm ${status.success ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}`}>
                    {status.message}
                </div>
            )}

            <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg gradient-bg text-white font-medium shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-shadow disabled:opacity-70 disabled:cursor-not-allowed"
            >
                {loading ? "Sending..." : "Send Message"}
            </button>
            <p className="text-xs text-muted-foreground text-center">
                I&apos;ll get back to you within 24-48 hours.
            </p>
        </form>
    );
}
