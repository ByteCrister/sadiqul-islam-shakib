// components/FullscreenImage.tsx
'use client';

import { useRef } from 'react';
import Image from 'next/image';
import screenfull from 'screenfull';

interface FullscreenImageProps {
    src: string;
    alt: string;
    width?: number;
    height?: number;
}

export function FullscreenImage({
    src,
    alt,
    width = 600,
    height = 400,
}: FullscreenImageProps) {
    const imgRef = useRef<HTMLImageElement>(null);

    const openFullscreen = async () => {
        if (screenfull.isEnabled && imgRef.current) {
            try {
                await screenfull.request(imgRef.current);
            } catch (error) {
                console.error('Failed to open fullscreen', error);
            }
        }
    };

    return (
        <div className="relative group">
            <Image
                ref={imgRef}
                src={src}
                alt={alt}
                width={width}
                height={height}
                className="w-full rounded-2xl object-cover cursor-pointer transition-transform duration-300 group-hover:scale-105"
                onClick={openFullscreen}
            />
            <button
                onClick={openFullscreen}
                className="absolute inset-0 flex items-center justify-center text-white bg-black/30 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity"
            >
                Fullscreen
            </button>
        </div>
    );
}
