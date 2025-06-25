import React, { useState } from "react";
import Image from "next/image";
import Button from "./Button";
import {toast} from "sonner";
import ToastNotification from "@/Usercomponents/ToastNotifications";


type FileUploadPreviewProps = {
    onFilesChange: (files: File[]) => void;
};

const MAX_FILES = 2;
const MAX_SIZE_MB = 2;
const ACCEPTED_TYPES = [
    "image/jpeg",
    "image/jpg",
    "image/avif",
    "image/tiff",
    "image/png",
    "application/pdf"
];

export default function FileUploadPreview({ onFilesChange }: FileUploadPreviewProps) {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (!files.length) return;

        const newValidFiles: File[] = [];

        for (const file of files) {
            if (!ACCEPTED_TYPES.includes(file.type)) {
                toast.custom((t) => (
                    <ToastNotification
                        type="success"
                        title="File type not supported"
                        subtitle={`${file.name} is not a supported file type.`}
                        onClose={() => toast.dismiss(t)}
                        showClose
                    />
                ), { duration: 4000 });
                continue;
            }
            if (file.size > MAX_SIZE_MB * 1024 * 1024) {
                toast.custom((t) => (
                    <ToastNotification
                        type="success"
                        title="File size too large"
                        subtitle={`${file.name} is larger than ${MAX_SIZE_MB}MB.`}
                        onClose={() => toast.dismiss(t)}
                        showClose
                    />
                ), { duration: 4000 });
                toast.error(`${file.name} is larger than ${MAX_SIZE_MB}MB.`);
                continue;
            }
            if (selectedFiles.length + newValidFiles.length >= MAX_FILES) {
                toast.custom((t) => (
                    <ToastNotification
                        type="success"
                        title="File limit reached"
                        subtitle={`You can only upload up to ${MAX_FILES} files.`}
                        onClose={() => toast.dismiss(t)}
                        showClose
                    />
                ), { duration: 4000 });
                toast.error(`You can only upload up to ${MAX_FILES} files.`);
                break;
            }
            newValidFiles.push(file);
        }

        const combinedFiles = [...selectedFiles, ...newValidFiles].slice(0, MAX_FILES);
        setSelectedFiles(combinedFiles);
        onFilesChange(combinedFiles);
    };

    const handleRemoveFile = (index: number) => {
        const updatedFiles = selectedFiles.filter((_, i) => i !== index);
        setSelectedFiles(updatedFiles);
        onFilesChange(updatedFiles);
    };

    const openFileDialog = () => {
        if (selectedFiles.length >= MAX_FILES) return;

        const input = document.createElement("input");
        input.type = "file";
        input.accept = ACCEPTED_TYPES.join(",");
        input.multiple = true;
        input.onchange = (e: Event) => {
            const target = e.target as HTMLInputElement;
            const syntheticEvent = {
                target,
            } as React.ChangeEvent<HTMLInputElement>;
            handleFileChange(syntheticEvent);
        };
        input.click();
    };

    return (
        <div className="flex flex-col w-[329px]">
            {selectedFiles.map((file, index) => (
                <div
                    key={index}
                    className="border w-full border-gray-200 rounded-lg p-2 flex items-center space-x-4 bg-white shadow-sm mb-2"
                >
                    <div className="w-10 h-12 relative flex-shrink-0">
                        <div className="absolute z-[5] top-6 -left-2 bg-blue-600 text-white text-xs font-semibold px-1 rounded shadow">
                            {file.name.split(".").pop()?.toUpperCase()}
                        </div>
                        <div className="w-10 h-12 rounded flex items-center justify-center text-xl">
                            <Image
                                src={"/icons/file_line.svg"}
                                width={34}
                                height={40}
                                alt="File icon"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-medium text-gray-800 truncate">
                            {file.name.split('.')[0]}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                            {(file.size / 1024).toFixed(1)}KB
                        </p>
                    </div>

                    <button
                        onClick={() => handleRemoveFile(index)}
                        className="text-gray-400 hover:text-red-500 flex-shrink-0"
                        title="Remove file"
                    >
                        <Image
                            src={"/icons/cancel-circle.svg"}
                            width={24}
                            height={20}
                            alt="Remove file icon"
                            className="border-none"
                        />
                    </button>
                </div>
            ))}

            <Button
                type="button"
                border="border-none"
                leftImageSrc="/icons/attachment.svg"
                className="gap-2.5"
                bgColor="bg-primary-50"
                text="Add attachments"
                textColor="text-primary-950"
                borderRadius="rounded-xl"
                leftImageWidth={24}
                leftImageHeight={24}
                leftImageAlt="Attachment icon"
                onClick={openFileDialog}
                disabled={selectedFiles.length >= MAX_FILES}
            />
        </div>
    );
}
