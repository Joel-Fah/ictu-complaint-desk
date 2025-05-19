import { FC } from 'react';
import Button from "@/Usercomponents/Button";
import Image from "next/image";
import Arrow from "../public/icons/arrow-right-01.svg"

interface ComplaintBannerProps {
    smallText?: string;
    largeText?: string;
    largeTextHighlight?: string;
    buttonText?: string;
    sideText?: string;
    buttonWidth?: string;
    buttonHeight?: string;
    onButtonClick?: () => void;
    textSize?: string;
}

const ComplaintBanner: FC<ComplaintBannerProps> = ({
                                                       smallText = "You know what?",
                                                       largeText = "There's always a",
                                                       largeTextHighlight = "complaint",
                                                       sideText = "File in your complaints now",
                                                       buttonText = '',
                                                       buttonHeight = '',
                                                       buttonWidth = '',
                                                       textSize = '',
                                                   }) => {
    return (
        <div className="p-4 sm:p-6 md:p-8 rounded-lg w-full flex flex-col items-center max-w-screen-xl mx-auto">
        <div className="text-center font-heading">
                <p className="text-primary-950 text-h3 font-medium">{smallText}</p>
                <h2 className="text-[32px] sm:text-[40px] md:text-[48px] lg:text-[68px] font-bold text-primary-950 mb-4 leading-tight">
                {largeText} <span className="text-orange-500">{largeTextHighlight}</span>
                    <br /> <span className="text-primary-950">going</span> <span className="text-orange-500">around</span>
                    <span>.r'You concerned too?</span>
                </h2>

                <div className="flex flex-col md:flex-row items-center justify-center gap-3 mt-4 flex-wrap text-center md:text-left">
                <Button
                        type='button'
                        width= {buttonWidth}
                        text={buttonText}
                        bgColor='bg-primary-800 '
                        border='border-none'
                        textColor='text-whiteColor'
                        className={`gap-[10px]  ${buttonHeight}`}
                        borderRadius='rounded-[16px]'
                        fontSize={textSize}
                    />

                    <div className="flex items-center gap-2 font-sans text-body text-greyColor">
                        <span className='font-regular'>{sideText}</span>
                        <Image src={Arrow} alt="Arrow Right" width={24} height={24}/>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ComplaintBanner;