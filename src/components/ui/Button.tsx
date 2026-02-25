"use client";

import React, { useRef } from "react";
import { useSettings } from "@/components/SettingsProvider";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "outline";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    isLoading?: boolean;
    children: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
    primary:
        "bg-primary text-primary-foreground hover:bg-primary-hover shadow-lg shadow-primary/20",
    secondary:
        "bg-surface text-foreground border border-border hover:bg-surface-hover hover:border-border-hover",
    ghost: "text-muted-foreground hover:text-foreground hover:bg-surface",
    danger: "bg-danger text-white hover:bg-red-500 shadow-lg shadow-danger/20",
    outline:
        "border border-primary text-primary hover:bg-primary hover:text-primary-foreground",
};

const sizeStyles: Record<ButtonSize, string> = {
    sm: "px-3 py-1.5 text-xs rounded-md",
    md: "px-4 py-2 text-sm rounded-lg",
    lg: "px-6 py-3 text-base rounded-lg",
};

export default function Button({
    variant = "primary",
    size = "md",
    isLoading = false,
    children,
    className = "",
    disabled,
    ...props
}: ButtonProps) {
    const settings = useSettings();
    const isMagnetic = settings?.feature_magnetic_buttons;
    const buttonRef = useRef<HTMLButtonElement>(null);

    const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!isMagnetic || !buttonRef.current) return;
        const rect = buttonRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        // Limit the transform to prevent moving too far away from the cursor
        buttonRef.current.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    };

    const handleMouseLeave = () => {
        if (!isMagnetic || !buttonRef.current) return;
        buttonRef.current.style.transform = "translate(0px, 0px)";
    };

    return (
        <button
            ref={buttonRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className={`
        inline-flex items-center justify-center gap-2
        font-medium transition-all duration-200
        focus-ring disabled:opacity-50 disabled:cursor-not-allowed
        ${isMagnetic ? "transition-[transform,background-color] ease-out" : ""}
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading && (
                <svg
                    className="animate-spin h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                >
                    <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                    />
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                </svg>
            )}
            {children}
        </button>
    );
}
