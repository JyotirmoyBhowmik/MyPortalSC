import Link from "next/link";

export default function NotFound() {
    return (
        <div className="min-h-[70vh] flex items-center justify-center px-4">
            <div className="text-center max-w-md">
                <div className="text-8xl font-black gradient-text mb-4">404</div>
                <h2 className="text-2xl font-bold mb-3">Page not found</h2>
                <p className="text-muted-foreground mb-8 text-sm">
                    The page you&apos;re looking for doesn&apos;t exist or has been moved.
                </p>
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-lg gradient-bg text-white font-medium shadow-lg shadow-primary/20"
                >
                    Go Home
                </Link>
            </div>
        </div>
    );
}
