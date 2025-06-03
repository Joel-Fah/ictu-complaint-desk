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
    imageSrc?: string;
    imageAlt?: string;
    imageWidth?: number;
    imageHeight?: number;
    imageClassName?: string;
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
                                   hoverBgColor = " ",
                                   fontSize = "text-base",
                                   fontFamily = "font-sans",
                                   text = "Click Me",
                                   strongText,
                                   imageSrc,
                                   imageAlt = "",
                                   imageWidth = 24,
                                   imageHeight = 24,
                                   imageClassName = "",
                                   spanClassName = "",
                                   children,
                                   disabled = false,
                               }: ButtonProps) {
    return (
        <button
            type={type}
            onClick={onClick}
            className={`flex items-center justify-center ${width} ${padding} ${border} ${borderRadius} ${textColor} ${bgColor} ${hoverBgColor} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
        >
            {imageSrc && (
                <Image
                    src={imageSrc}
                    alt={imageAlt}
                    width={imageWidth}
                    height={imageHeight}
                    className={`${imageClassName}`}
                />
            )}
            <span className={`${fontSize} ${fontFamily} ${spanClassName}`}>
        {children ?? (
            <>
                {text}
                {strongText && <strong> {strongText}</strong>}
            </>
        )}
      </span>
        </button>
    );
}
