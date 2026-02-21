"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Button from "@/components/ui/Button";

export default function AdminLoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [mfaCode, setMfaCode] = useState("");
    const [needsMfa, setNeedsMfa] = useState(false);
    const [factorId, setFactorId] = useState<string | null>(null);
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

        // Check feature flag for 2FA requirement
        const { data: settingData } = await supabase
            .from("site_settings")
            .select("value")
            .eq("key", "feature_2fa")
            .single();

        const require2FA = settingData?.value === true || settingData?.value === "true";

        if (require2FA) {
            // Check if user has enrolled factors
            const { data, error: factorsError } = await supabase.auth.mfa.listFactors();
            if (factorsError) {
                console.error("MFA Error:", factorsError);
                router.push("/admin"); // Fail open if error for demo
                router.refresh();
                return;
            }

            const totpFactor = data.totp[0];
            if (totpFactor) {
                // User has MFA enrolled, challenge them
                setFactorId(totpFactor.id);
                setNeedsMfa(true);
                setLoading(false);
                return;
            } else {
                // Feature is ON, but user hasn't enrolled. 
                // For a real app, redirect to an "Enroll MFA" page. For this demo, we allow them in.
                console.warn("2FA is enabled but user has no enrolled factors.");
            }
        }

        // No MFA needed or enrolled, proceed to dashboard
        router.push("/admin");
        router.refresh();
    }

    async function handleVerifySubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setLoading(true);

        if (!factorId) {
            setError("MFA Factor ID missing");
            setLoading(false);
            return;
        }

        const challenge = await supabase.auth.mfa.challenge({ factorId });
        if (challenge.error) {
            setError(challenge.error.message);
            setLoading(false);
            return;
        }

        const verify = await supabase.auth.mfa.verify({
            factorId,
            challengeId: challenge.data.id,
            code: mfaCode,
        });

        if (verify.error) {
            setError("Invalid Authenticator code");
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
                    <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center text-white font-bold text-lg mx-auto mb-4 shadow-lg shadow-primary/20">
                        JB
                    </div>
                    <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                        Sign in to manage your portfolio
                    </p>
                </div>

                {/* Login Form */}
                {!needsMfa ? (
                    <form
                        onSubmit={handleLogin}
                        className="glass rounded-xl p-6 space-y-5 shadow-xl border border-border/50"
                    >
                        {error && (
                            <div className="p-3 rounded-lg bg-danger/10 border border-danger/20 text-danger text-sm text-center">
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
                                placeholder="admin@jyotirmoyb.com"
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
                ) : (
                    <form
                        onSubmit={handleVerifySubmit}
                        className="glass rounded-xl p-6 space-y-5 shadow-xl border border-border/50"
                    >
                        <div className="text-center mb-2">
                            <h2 className="text-lg font-bold">Two-Factor Authentication</h2>
                            <p className="text-xs text-muted-foreground mt-1">Enter the 6-digit code from your authenticator app.</p>
                        </div>

                        {error && (
                            <div className="p-3 rounded-lg bg-danger/10 border border-danger/20 text-danger text-sm text-center">
                                {error}
                            </div>
                        )}

                        <div>
                            <label
                                htmlFor="mfaCode"
                                className="block text-sm font-medium mb-1.5"
                            >
                                Authentication Code
                            </label>
                            <input
                                id="mfaCode"
                                type="text"
                                pattern="\d{6}"
                                maxLength={6}
                                value={mfaCode}
                                onChange={(e) => setMfaCode(e.target.value)}
                                placeholder="123456"
                                className="admin-input text-center text-xl tracking-widest font-mono"
                                required
                                autoComplete="one-time-code"
                            />
                        </div>

                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            isLoading={loading}
                            className="w-full"
                        >
                            Verify & Continue
                        </Button>
                        <button
                            type="button"
                            onClick={() => { setNeedsMfa(false); supabase.auth.signOut(); }}
                            className="w-full text-xs text-muted-foreground hover:text-foreground text-center"
                        >
                            Back to Login
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
