import React from "react";

type BadgeVariant = "default" | "primary" | "success" | "warning" | "danger" | "outline";

interface BadgeProps {
    children: React.ReactNode;
    variant?: BadgeVariant;
    className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
    default: "bg-muted text-muted-foreground",
    primary: "bg-primary/15 text-primary border border-primary/20",
    success: "bg-success/15 text-success border border-success/20",
    warning: "bg-warning/15 text-warning border border-warning/20",
    danger: "bg-danger/15 text-danger border border-danger/20",
    outline: "border border-border text-muted-foreground",
};

export default function Badge({
    children,
    variant = "default",
    className = "",
}: BadgeProps) {
    return (
        <span
            className={`
        inline-flex items-center px-2.5 py-0.5 rounded-full
        text-xs font-medium transition-colors
        ${variantStyles[variant]}
        ${className}
      `}
        >
            {children}
        </span>
    );
}
