import React from "react";

interface CardProps {
    children: React.ReactNode;
    className?: string;
    hover?: boolean;
    glow?: boolean;
    gradient?: boolean;
}

export default function Card({
    children,
    className = "",
    hover = true,
    glow = false,
    gradient = false,
}: CardProps) {
    return (
        <div
            className={`
        glass rounded-xl p-6
        ${hover ? "hover-lift cursor-pointer" : ""}
        ${glow ? "animate-glow" : ""}
        ${gradient ? "bg-gradient-to-br from-primary/5 to-accent/5" : ""}
        ${className}
      `}
        >
            {children}
        </div>
    );
}

export function CardHeader({
    children,
    className = "",
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return <div className={`mb-4 ${className}`}>{children}</div>;
}

export function CardTitle({
    children,
    className = "",
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <h3 className={`text-lg font-semibold text-foreground ${className}`}>
            {children}
        </h3>
    );
}

export function CardDescription({
    children,
    className = "",
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <p className={`text-sm text-muted-foreground mt-1 ${className}`}>
            {children}
        </p>
    );
}

export function CardContent({
    children,
    className = "",
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return <div className={className}>{children}</div>;
}

export function CardFooter({
    children,
    className = "",
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div className={`mt-4 pt-4 border-t border-border flex items-center gap-3 ${className}`}>
            {children}
        </div>
    );
}
