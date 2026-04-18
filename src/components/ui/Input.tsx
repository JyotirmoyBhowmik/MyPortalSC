import React, { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className = "", label, error, ...props }, ref) => {
        return (
            <div className="space-y-1 w-full">
                {label && (
                    <label className="text-sm font-medium text-foreground">
                        {label} {props.required && <span className="text-red-500">*</span>}
                    </label>
                )}
                <input
                    ref={ref}
                    className={`
                        w-full bg-background border border-border rounded-lg px-3 py-2 text-sm
                        focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow
                        ${error ? "border-red-500" : ""}
                        ${className}
                    `}
                    {...props}
                />
                {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
            </div>
        );
    }
);

Input.displayName = "Input";

export default Input;
