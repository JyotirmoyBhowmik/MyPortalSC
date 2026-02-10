"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/ui/Button";

export default function AdminLoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const { error: authError } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (authError) {
            setError(authError.message);
            setLoading(false);
            return;
        }

        router.push("/admin");
        router.refresh();
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-background">
            {/* Background effects */}
            <div className="absolute inset-0 dot-pattern opacity-10" />
            <div
                className="absolute inset-0"
                style={{ background: "var(--gradient-hero)" }}
            />

            <div className="relative z-10 w-full max-w-sm">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center text-white font-bold text-lg mx-auto mb-4">
                        JB
                    </div>
                    <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Sign in to manage your portfolio
                    </p>
                </div>

                {/* Login Form */}
                <form
                    onSubmit={handleLogin}
                    className="glass rounded-xl p-6 space-y-5"
                >
                    {error && (
                        <div className="p-3 rounded-lg bg-danger/10 border border-danger/20 text-danger text-sm">
                            {error}
                        </div>
                    )}

                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium mb-1.5"
                        >
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@example.com"
                            className="admin-input"
                            required
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium mb-1.5"
                        >
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="admin-input"
                            required
                        />
                    </div>

                    <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        isLoading={loading}
                        className="w-full"
                    >
                        Sign In
                    </Button>
                </form>
            </div>
        </div>
    );
}
