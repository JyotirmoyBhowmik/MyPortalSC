"use client";

import * as React from "react";
import { format } from "date-fns";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

interface DatePickerProps {
    date: Date | undefined;
    setDate: (date: Date | undefined) => void;
    className?: string;
}

export function DatePicker({ date, setDate, className }: DatePickerProps) {
    const [isOpen, setIsOpen] = React.useState(false);

    return (
        <div className={`relative ${className}`}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full text-left px-3 py-2 bg-surface rounded-lg border border-border text-sm flex items-center justify-between ${!date ? "text-muted-foreground" : "text-foreground"
                    }`}
            >
                {date ? format(date, "PPP") : <span>Pick a date</span>}
                <span className="opacity-50">📅</span>
            </button>
            {isOpen && (
                <div className="absolute z-50 mt-2 p-3 glass border border-border rounded-lg shadow-xl top-full left-0">
                    <DayPicker
                        mode="single"
                        selected={date}
                        onSelect={(d) => {
                            setDate(d);
                            setIsOpen(false);
                        }}
                        initialFocus
                        classNames={{
                            day_selected: "bg-primary text-primary-foreground hover:bg-primary-hover",
                            day_today: "font-bold text-primary",
                        }}
                    />
                </div>
            )}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </div>
    );
}
