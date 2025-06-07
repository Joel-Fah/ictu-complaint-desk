"use client";

import Image from "next/image";
import React from "react";

type ButtonProps = {
    type?: "button" | "submit" | "reset";
    onClick?: () => void;
    width?: string;
    className?: string;
    padding?: string;
    border?: string;
    borderRadius?: string;
    textColor?: string;
    bgColor?: string;
    hoverBgColor?: string;
    fontSize?: string;
    fontFamily?: string;
    text?: string;
    strongText?: string;

    // Images on left and/or right
    leftImageSrc?: string;
    leftImageAlt?: string;
    leftImageWidth?: number;
    leftImageHeight?: number;
    leftImageClassName?: string;

    rightImageSrc?: string;
    rightImageAlt?: string;
    rightImageWidth?: number;
    rightImageHeight?: number;
    rightImageClassName?: string;

    // Separators flags
    showLeftSeparator?: boolean;
    showRightSeparator?: boolean;

    spanClassName?: string;
    children?: React.ReactNode;
    disabled?: boolean;
};

export default function Button({
                                   type = "button",
                                   onClick,
                                   width = "w-full",
                                   className = "",
                                   padding = "px-6 py-4",
                                   border = "border-2 border-black",
                                   borderRadius = "rounded-md",
                                   textColor = "text-black",
                                   bgColor = "bg-white",
                                   hoverBgColor = "",
                                   fontSize = "text-base",
                                   fontFamily = "font-sans",
                                   text = "Click Me",
                                   strongText,

                                   leftImageSrc,
                                   leftImageAlt = "",
                                   leftImageWidth = 24,
                                   leftImageHeight = 24,
                                   leftImageClassName = "",

                                   rightImageSrc,
                                   rightImageAlt = "",
                                   rightImageWidth = 24,
                                   rightImageHeight = 24,
                                   rightImageClassName = "",

                                   showLeftSeparator = false,
                                   showRightSeparator = false,

                                   spanClassName = "",
                                   children,
                                   disabled = false,
                               }: ButtonProps) {
    // Simple separator style, can be customized or moved to CSS file
    const separator = (
        <span className="mx-2 border-l border-gray-300 h-6" aria-hidden="true" />
    );

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`flex items-center justify-center ${width} ${padding} ${border} ${borderRadius} ${textColor} ${bgColor} ${hoverBgColor} ${
                disabled ? "opacity-50 cursor-not-allowed" : ""
            } ${className}`}
        >
            {/* Left image */}
            {leftImageSrc && (
                <>
                    <Image
                        src={leftImageSrc}
                        alt={leftImageAlt}
                        width={leftImageWidth}
                        height={leftImageHeight}
                        className={leftImageClassName}
                    />
                    {showLeftSeparator && separator}
                </>
            )}

            {/* Text */}
            <span className={`${fontSize} ${fontFamily} ${spanClassName}`}>
        {children ?? (
            <>
                {text}
                {strongText && <strong> {strongText}</strong>}
            </>
        )}
      </span>

            {/* Right separator and image */}
            {rightImageSrc && (
                <>
                    {showRightSeparator && separator}
                    <Image
                        src={rightImageSrc}
                        alt={rightImageAlt}
                        width={rightImageWidth}
                        height={rightImageHeight}
                        className={rightImageClassName}
                    />
                </>
            )}
        </button>
    );
}
