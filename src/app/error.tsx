"use client";

import Button from "@/components/ui/Button";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <div className="min-h-[70vh] flex items-center justify-center px-4">
            <div className="text-center max-w-md">
                <div className="text-6xl mb-6">⚠️</div>
                <h2 className="text-2xl font-bold mb-3">Something went wrong</h2>
                <p className="text-muted-foreground mb-6 text-sm">
                    {error.message || "An unexpected error occurred. Please try again."}
                </p>
                <Button onClick={reset} variant="primary">
                    Try again
                </Button>
            </div>
        </div>
    );
}
