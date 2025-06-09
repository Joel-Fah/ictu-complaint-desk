import React, { useState } from "react";
import Image from "next/image";
import Button from "./Button";

export default function FileUploadPreview() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
        }
    };

    const handleRemoveFile = () => {
        setSelectedFile(null);
    };

    const openFileDialog = () => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "*/*";
        input.onchange = (e: Event) => {
            const target = e.target as HTMLInputElement;
            if (target.files && target.files.length > 0) {
                const syntheticEvent = {
                    target,
                } as React.ChangeEvent<HTMLInputElement>;
                handleFileChange(syntheticEvent);
            }
        };
        input.click();
    };


    return (
        <div className="flex flex-col w-[329px]">
            {/* File preview area with fixed height */}
            <div
                className={`overflow-hidden transition-all duration-300 ${
                    selectedFile ? "h-24 mb-2" : "h-0 mb-0"
                }`}
            >
                {selectedFile && (
                    <div className="border w-full border-gray-200 rounded-lg p-2 flex items-center space-x-4 bg-white shadow-sm">
                        {/* File Type Badge */}
                        <div className="w-10 h-12 relative flex-shrink-0">
                            <div className="absolute z-[5] top-6 -left-2 bg-blue-600 text-white text-xs font-semibold px-1 rounded shadow">
                                {selectedFile.name.split(".").pop()?.toUpperCase()}
                            </div>
                            <div className="w-10 h-12 rounded flex items-center justify-center text-xl">
                                <Image
                                    src={"/icons/file_line.svg"}
                                    width={34}
                                    height={40}
                                    alt={"File icon"}
                                />
                            </div>
                        </div>

                        {/* File Info */}
                        <div className="flex-1 overflow-hidden">
                            <p className="text-sm font-medium text-gray-800 truncate">
                                {selectedFile.name.split(".")[0]}
                            </p>
                            <p className="text-sm text-gray-500 truncate">
                                {(selectedFile.size / 1024).toFixed(1)}KB of{" "}
                                {(selectedFile.size / 1024).toFixed(1)}KB
                            </p>
                        </div>

                        {/* Remove Button */}
                        <button
                            onClick={handleRemoveFile}
                            className="text-gray-400 hover:text-red-500 flex-shrink-0"
                            title="Remove file"
                        >
                            <Image
                                src={"/icons/cancel-circle.svg"}
                                width={24}
                                height={20}
                                alt={"Remove file icon"}
                                className={"border-none"}
                            />
                        </button>
                    </div>
                )}
            </div>

            {/* The button always stays the same size */}
            <Button
                type="button"
                border={"border-none"}
                leftImageSrc={"/icons/attachment.svg"}
                className="gap-2.5"
                bgColor={"bg-primary-50"}
                text={"Add attachments"}
                textColor={"text-primary-950"}
                borderRadius={"rounded-xl"}
                leftImageWidth={24}
                leftImageHeight={24}
                leftImageAlt="Attachment icon"
                onClick={openFileDialog}
                disabled={!!selectedFile}
            />
        </div>
    );
}
