export default function Skeleton({
    className = "",
    width,
    height,
}: {
    className?: string;
    width?: string;
    height?: string;
}) {
    return (
        <div
            className={`bg-muted rounded-lg animate-shimmer ${className}`}
            style={{
                width,
                height,
                backgroundImage:
                    "linear-gradient(90deg, transparent 0%, rgba(99,102,241,0.05) 50%, transparent 100%)",
                backgroundSize: "200% 100%",
            }}
        />
    );
}
