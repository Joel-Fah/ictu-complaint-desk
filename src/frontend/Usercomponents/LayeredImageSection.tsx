'use client';
import { FC } from 'react';
import Image from 'next/image';

interface OverlayImage {
    src: string;         // Must be a string path, e.g., "/images/star.png"
    alt: string;
    position: string;    // Tailwind positioning, e.g., "top-10 left-5"
    rotate?: string;     // e.g., "rotate-12"
    flip?: string;
}

interface LayeredImageSectionProps {
    mainImageSrc: string;    // Pass string path like "/images/Lines.png"
    mainImageAlt: string;
    overlayImages: OverlayImage[];
    height?: string;
}

const LayeredImageSection: FC<LayeredImageSectionProps> = ({
                                                               mainImageSrc,
                                                               mainImageAlt,
                                                               overlayImages,
                                                               height = 'h-[300px] sm:h-[380px] md:h-[450px] lg:h-[550px] xl:h-[650px]',
                                                           }) => {
    return (
        <div className={`relative w-full ${height} overflow-hidden`}>
            {/* Top light section */}
            <div className="absolute top-0 left-0 right-0 h-1/2 z-0"></div>

            {/* Diagonal blue section */}
            <div
                className="absolute top-[20%] -left-10 right-0 h-full z-0
             bg-gradient-to-t from-primary-950 to-primary-800
             [clip-path:polygon(0%_40%,100%_20%,100%_60%,0%_82%)]">
            </div>


            {/* Main content image */}
            <div className="absolute inset-0 flex items-center justify-center z-10">
                <Image
                    src={mainImageSrc}
                    alt={mainImageAlt}
                    width={1538}
                    height={675}
                    className="h-auto w-[90%] max-w-[600px] md:max-w-[750px] lg:max-w-[900px] xl:max-w-[1100px] object-contain "
                />
            </div>

            {/* Overlay decorative images */}
            {overlayImages.map((image, index) => (
                <Image
                    key={index}
                    src={image.src}
                    alt={image.alt}
                    width={152.1}
                    height={227.85}
                    className={`absolute ${image.position} ${image.flip}  ${image.rotate || ''} object-contain z-20 `}
                />
            ))}
        </div>
    );
};

export default LayeredImageSection;
