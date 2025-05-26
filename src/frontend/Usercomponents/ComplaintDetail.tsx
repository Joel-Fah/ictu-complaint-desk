import React from 'react';
import { Complaint, Attachment } from "@/types/complaint";
import ComplaintDetailSkeleton from "@/Usercomponents/ComplaintDetailSkeleton";
import Image from "next/image";

interface ComplaintDetailProps {
    complaint: Complaint;
    isLoading?: boolean;
}

const ComplaintDetail: React.FC<ComplaintDetailProps> = ({
                                                             complaint,
                                                             isLoading = false,
                                                         }) => {
    if (isLoading) {
        return <ComplaintDetailSkeleton />;
    }

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const handleFileDownload = async (attachment: Attachment) => {
        try {
            const response = await fetch(`/api/complaints/attachments/${attachment.id}/download`);
            if (response.ok) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = attachment.file_name;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            }
        } catch (error) {
            console.error('Error downloading file:', error);
        }
    };

    return (
        <div className="bg-white p-4 max-w-[590px] mx-auto space-y-4">
            {/* Header */}
            <div className="mb-12">
                <h1 className="text-[48px] font-heading text-darkColor">
                    {complaint.id}. {complaint.title || "Untitled"}
                </h1>
            </div>
            <div>
                <h1 className="text-h3 font-heading text-greyColor font-medium">Details</h1>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-[16px]">
                <div className="bg-[#050041] bg-opacity-[5%] px-[16px] py-[10px] rounded-[16px] w-[186px] h-[58px]">
                    <span className="font-sans text-small text-darkColor">Category:</span> <br/><p className="font-sans text-body font-medium text-darkColor">{complaint.category}</p>
                </div>
                <div className="bg-[#050041] bg-opacity-[5%] px-[16px] py-[10px] rounded-[16px] w-[186px] h-[58px]">
                    <span className="font-sans text-small text-darkColor">Semester:</span><br/><p className="font-sans text-body font-medium text-darkColor">{complaint.semester}</p>
                </div>
            </div>

            {/* Description */}
            <div className="prose max-w-none">
                <p className="font-sans text-darkColor text-body whitespace-pre-wrap">
                    {complaint.description}
                </p>
            </div><br/><br/>

            {/* Attachments */}
            {complaint.attachments.length > 0 && (
                <div className="space-y-2">
                    <h2 className="text-h3 font-heading text-greyColor font-medium">Attachments</h2>
                    <div className="space-y-3">
                        {complaint.attachments.map((attachment) => (
                            <div
                                key={attachment.id}
                                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                            >
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 text-lg">
                                        <Image
                                            src="/icons/files-01.svg"
                                            alt="File Icon"
                                            width={34.29}
                                            height={40}
                                        />
                                    </div>
                                    <div>
                                        <p className="font-sans text-body font-medium text-[#454A53] text-opacity-[100%]">
                                            {attachment.file_name}
                                        </p>
                                        <p className="text-button-secondary text-[#9EA2AD] text-opacity-[100%]">
                                            {formatFileSize(attachment.file_size)} of {formatFileSize(attachment.file_size)}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleFileDownload(attachment)}
                                    className="inline-flex items-center px-3 py-2 text-body font-medium text-primary-950 bg-primary-100 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                                >
                                    Download
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Metadata */}
            <div className="pt-6 border-t border-gray-200 text-sm text-gray-500 flex flex-col sm:flex-row sm:justify-between space-y-2 sm:space-y-0">
        <span>
          Created:{' '}
            {new Date(complaint.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            })}
        </span>
                <span>
          Updated:{' '}
                    {new Date(complaint.updated_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                    })}
        </span>
            </div>
        </div>
    );
};

export default ComplaintDetail;
