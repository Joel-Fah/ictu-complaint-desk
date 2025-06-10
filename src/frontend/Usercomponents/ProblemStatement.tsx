import React, { FC } from 'react';

// The actual reusable component with all props being customizable
interface ProblemStatementProps {
    // Text content props
    labelText: string;
    titleText: string;
    descriptionText: string;

    // Styling props
    backgroundColor?: string;
    labelColor?: string;
    titleColor?: string;
    descriptionColor?: string;
    rightColumnContent?: React.ReactNode;

    // Layout props
    padding?: string;
    titleSize?: string;
    labelSize?: string;
    containerClassName?: string;
    rightColumnClassName?: string;

    // Responsive behavior
    stackOnMobile?: boolean;
    rightColumnRatio?: "small" | "medium" | "large";
}

const ProblemStatement: FC<ProblemStatementProps> = ({
                                                         // Text content
                                                         labelText,
                                                         titleText,
                                                         descriptionText,

                                                         // Styling with defaults
                                                         backgroundColor = " ",

                                                         labelColor = "text-secondary-500",
                                                         titleColor = "text-primary-950",
                                                         descriptionColor = "text-greyColor",



                                                         rightColumnContent,

                                                         // Layout with defaults
                                                         padding = "p-4 sm:p-6 md:p-8 lg:p-10",
                                                         titleSize = "text-xl sm:text-2xl md:text-3xl lg:text-4xl",
                                                         labelSize = "text-xs sm:text-sm",
                                                         containerClassName = "",
                                                         rightColumnClassName = "bg-gray-200",

                                                         // Responsive behavior
                                                         stackOnMobile = true,
                                                         rightColumnRatio = "medium",
                                                     }) => {
    // Determine the right column width based on the ratio prop
    const rightColumnWidthClass = {
        small: "md:w-4/12 lg:w-3/12",
        medium: "md:w-5/12 lg:w-5/12",
        large: "md:w-6/12 lg:w-1/2"
    }[rightColumnRatio];

    return (
        <div className={`${backgroundColor} ${padding} w-full ${containerClassName} font-sans`}>
            <div className={`flex ${stackOnMobile ? 'flex-col md:flex-row' : 'flex-row'} gap-4 sm:gap-6 md:gap-8`}>
                {/* Left column with text content */}
                <div className="flex-1">
                    <p className={`${labelColor} ${labelSize} font-medium mb-1 sm:mb-2`}>
                        {labelText}
                    </p>

                    <h2 className={`${titleColor} ${titleSize} font-bold mb-2 sm:mb-3 md:mb-4 leading-tight`}>
                        {titleText}
                    </h2>

                    <p className={`${descriptionColor} text-body max-w-2xl`}>
                        {descriptionText}
                    </p>
                </div>

                {/* Right column for image or any content */}
                <div className={`${stackOnMobile ? rightColumnWidthClass : 'w-5/12'} ${rightColumnClassName} rounded-lg overflow-hidden`}>
                    {rightColumnContent || <div className="w-full h-full min-h-[150px] sm:min-h-[180px] md:min-h-[200px] lg:min-h-[240px]" />}
                </div>
            </div>
        </div>
    );
};

export default ProblemStatement;