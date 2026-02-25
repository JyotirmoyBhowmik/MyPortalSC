"use client";

import { useState, useCallback, type ReactNode } from "react";

interface ConfirmDialogProps {
    open: boolean;
    title?: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: "danger" | "warning" | "default";
    onConfirm: () => void | Promise<void>;
    onCancel: () => void;
}

const variantStyles = {
    danger: {
        icon: "🗑️",
        button: "bg-red-600 hover:bg-red-700 text-white",
        ring: "ring-red-500/20",
    },
    warning: {
        icon: "⚠️",
        button: "bg-amber-600 hover:bg-amber-700 text-white",
        ring: "ring-amber-500/20",
    },
    default: {
        icon: "❓",
        button: "bg-primary hover:bg-primary-hover text-primary-foreground",
        ring: "ring-primary/20",
    },
};

export default function ConfirmDialog({
    open,
    title = "Are you sure?",
    message,
    confirmLabel = "Confirm",
    cancelLabel = "Cancel",
    variant = "danger",
    onConfirm,
    onCancel,
}: ConfirmDialogProps) {
    const [loading, setLoading] = useState(false);
    const style = variantStyles[variant];

    const handleConfirm = useCallback(async () => {
        setLoading(true);
        try {
            await onConfirm();
        } finally {
            setLoading(false);
        }
    }, [onConfirm]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
                onClick={onCancel}
            />

            {/* Dialog */}
            <div className={`relative glass rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl ring-1 ${style.ring} animate-slide-up`}>
                <div className="text-center">
                    <div className="text-4xl mb-4">{style.icon}</div>
                    <h3 className="text-lg font-bold mb-2">{title}</h3>
                    <p className="text-sm text-muted-foreground mb-6">{message}</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={onCancel}
                        disabled={loading}
                        className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium bg-surface hover:bg-surface-hover text-foreground transition-all disabled:opacity-50"
                    >
                        {cancelLabel}
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={loading}
                        className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-medium transition-all disabled:opacity-50 ${style.button}`}
                    >
                        {loading ? (
                            <span className="inline-flex items-center gap-2">
                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Processing…
                            </span>
                        ) : (
                            confirmLabel
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

/**
 * Hook to manage confirm dialog state. Usage:
 *   const { dialog, confirm } = useConfirmDialog();
 *   // Trigger: await confirm("Delete this project?", () => deleteProject(id));
 *   // Render: {dialog}
 */
export function useConfirmDialog() {
    const [state, setState] = useState<{
        open: boolean;
        message: string;
        title?: string;
        variant?: "danger" | "warning" | "default";
        onConfirm: () => void | Promise<void>;
    }>({ open: false, message: "", onConfirm: () => { } });

    const confirm = useCallback(
        (
            message: string,
            onConfirm: () => void | Promise<void>,
            options?: { title?: string; variant?: "danger" | "warning" | "default" }
        ) => {
            setState({
                open: true,
                message,
                title: options?.title,
                variant: options?.variant ?? "danger",
                onConfirm: async () => {
                    await onConfirm();
                    setState((s) => ({ ...s, open: false }));
                },
            });
        },
        []
    );

    const dialog = (
        <ConfirmDialog
            open={state.open}
            message={state.message}
            title={state.title}
            variant={state.variant}
            onConfirm={state.onConfirm}
            onCancel={() => setState((s) => ({ ...s, open: false }))}
        />
    );

    return { dialog, confirm };
}
