"use client";

/**
 * CredlyBadge — Renders a Credly embeddable badge using the official embed script.
 * Supports both the iframe embed and a styled link fallback.
 *
 * Usage:
 *   <CredlyBadge badgeId="a2220b94-78b5-40ec-903a-4df93599bff4" />
 */

import Script from "next/script";

interface CredlyBadgeProps {
    badgeId: string;
    width?: number;
    height?: number;
    className?: string;
    showPublicLink?: boolean;
}

export default function CredlyBadge({
    badgeId,
    width = 150,
    height = 270,
    className = "",
    showPublicLink = true,
}: CredlyBadgeProps) {
    const publicUrl = `https://www.credly.com/badges/${badgeId}/public_url`;

    return (
        <div className={`flex flex-col items-center gap-3 ${className}`}>
            {/* Credly embed */}
            <div
                data-iframe-width={width}
                data-iframe-height={height}
                data-share-badge-id={badgeId}
                data-share-badge-host="https://www.credly.com"
                className="credly-badge-embed"
            />
            <Script
                src="//cdn.credly.com/assets/utilities/embed.js"
                strategy="lazyOnload"
                async
            />

            {/* Public link */}
            {showPublicLink && (
                <a
                    href={publicUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary-hover transition-colors"
                >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                    Verify on Credly
                </a>
            )}
        </div>
    );
}
