"use client";

import { useState } from "react";
import ImageLightbox from "@/components/ui/ImageLightbox";

interface ProjectImageWithLightboxProps {
    src: string;
    alt: string;
    className?: string;
}

export default function ProjectImageWithLightbox({ src, alt, className = "" }: ProjectImageWithLightboxProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src={src}
                alt={alt}
                className={`${className} cursor-zoom-in hover:brightness-110 transition-all duration-300`}
                onClick={() => setIsOpen(true)}
            />
            <ImageLightbox
                images={[{ src, alt }]}
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
            />
        </>
    );
}
