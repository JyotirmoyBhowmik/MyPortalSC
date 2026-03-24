"use client";

import { useState, useEffect, useCallback } from "react";

interface TypewriterTextProps {
    texts: string[];
    typingSpeed?: number;
    deletingSpeed?: number;
    pauseDuration?: number;
    className?: string;
}

export default function TypewriterText({
    texts,
    typingSpeed = 80,
    deletingSpeed = 40,
    pauseDuration = 2000,
    className = "",
}: TypewriterTextProps) {
    const [displayText, setDisplayText] = useState("");
    const [textIndex, setTextIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isPaused, setIsPaused] = useState(false);

    const tick = useCallback(() => {
        const currentFullText = texts[textIndex];

        if (isPaused) return;

        if (!isDeleting) {
            // Typing
            setDisplayText(currentFullText.substring(0, displayText.length + 1));

            if (displayText.length === currentFullText.length) {
                setIsPaused(true);
                setTimeout(() => {
                    setIsPaused(false);
                    setIsDeleting(true);
                }, pauseDuration);
            }
        } else {
            // Deleting
            setDisplayText(currentFullText.substring(0, displayText.length - 1));

            if (displayText.length === 0) {
                setIsDeleting(false);
                setTextIndex((prev) => (prev + 1) % texts.length);
            }
        }
    }, [displayText, isDeleting, isPaused, textIndex, texts, pauseDuration]);

    useEffect(() => {
        const speed = isDeleting ? deletingSpeed : typingSpeed;
        const timer = setTimeout(tick, speed);
        return () => clearTimeout(timer);
    }, [tick, isDeleting, deletingSpeed, typingSpeed]);

    return (
        <span className={className}>
            {displayText}
            <span className="inline-block w-[3px] h-[1em] bg-primary ml-0.5 animate-pulse align-middle" />
        </span>
    );
}
