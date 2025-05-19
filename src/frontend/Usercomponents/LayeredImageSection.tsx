'use client';
import { FC } from 'react';
import Image from 'next/image';



interface LayeredImageSectionProps {
    mainImageSrc: string;    // Pass string path like "/images/Lines.png"
    mainImageAlt: string;
    height?: string;
}

const LayeredImageSection: FC<LayeredImageSectionProps> = ({
                                                               mainImageSrc,
                                                               mainImageAlt,
                                                               height = 'h-[300px] sm:h-[380px] md:h-[450px] lg:h-[550px] xl:h-[650px]',
                                                           }) => {
    return (
        <div className={`relative w-full ${height} overflow-hidden`}>
            {/* Top light section */}
            <div className="absolute top-0 left-0 right-0 h-1/2 z-0"></div>

            {/* Main content image */}
            <div className="absolute inset-0 flex items-center justify-center z-10">
                <Image
                    src={mainImageSrc}
                    alt={mainImageAlt}
                    width={1366}
                    height={758}
                    className=" md:max-w-[750px] lg:max-w-[1366px] xl:max-w-[1100px] object-contain "
                />
            </div>

        </div>
    );
};

export default LayeredImageSection;
