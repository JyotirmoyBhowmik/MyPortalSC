"use client";

import { useState } from "react";
import ImageLightbox from "@/components/ui/ImageLightbox";
import Image from "next/image";

interface ProjectImageWithLightboxProps {
    src: string;
    alt: string;
    className?: string;
}

export default function ProjectImageWithLightbox({ src, alt, className = "" }: ProjectImageWithLightboxProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <Image
                src={src}
                alt={alt}
                width={0}
                height={0}
                sizes="100vw"
                unoptimized={true}
                className={`w-full h-auto object-cover cursor-zoom-in hover:brightness-110 transition-all duration-300 ${className}`}
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
