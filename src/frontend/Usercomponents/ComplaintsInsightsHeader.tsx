import { FC } from 'react';

interface ComplaintsInsightsHeaderProps {
    // Text content
    labelText?: string;
    headingText?: string;
    descriptionText?: string;
    labelSize?: string;

    // Styling
    backgroundColor?: string;
    labelColor?: string;
    headingColor?: string;
    descriptionColor?: string;

    // Layout and responsive options
    padding?: string;
    textAlignment?: string;
    maxWidth?: string;
    containerClassName?: string;
}

const ComplaintsInsightsHeader: FC<ComplaintsInsightsHeaderProps> = ({
                                                                         // Text defaults
                                                                         labelText = "Complaints Insights",
                                                                         headingText = "What the numbers say!",
                                                                         descriptionText = "We carried out a qualitative and quantitative survey on students and the administration of the ICT University to have a clearly understanding of how tough it is for them to handle their complaints from each one's perspective.",

                                                                         // Styling defaults
                                                                         backgroundColor = " ",
                                                                         labelColor = "text-orange-500",
                                                                         headingColor = "text-navy-900",
                                                                         descriptionColor = "text-gray-700",
                                                                         labelSize = 'text-sm sm:text-base ',

                                                                         // Layout defaults
                                                                         padding = "py-8 px-4 sm:px-6 md:py-12 lg:py-16",
                                                                         textAlignment = "text-center",
                                                                         maxWidth = "max-w-3xl",
                                                                         containerClassName = "",
                                                                     }) => {
    return (
        <div className={`${backgroundColor} ${padding} w-full ${containerClassName}`}>
            <div className={`${textAlignment} mx-auto ${maxWidth} font-sans`}>
                {/* Label text */}
                <p className={`${labelColor} ${labelSize} font-medium mb-3`}>
                    {labelText}
                </p>

                {/* Main heading */}
                <h1 className={`${headingColor} text-3xl sm:text-4xl md:text-5xl font-bold mb-4 md:mb-6`}>
                    {headingText}
                </h1>

                {/* Description text */}
                <p className={`${descriptionColor} text-body sm:text-base md:text-lg mx-auto max-w-2xl`}>
                    {descriptionText}
                </p>
            </div>
        </div>
    );
};

export default ComplaintsInsightsHeader;