import React from 'react';
import { Complaint } from "@/types/complaint";
import ComplaintDetailSkeleton from "@/Usercomponents/ComplaintDetailSkeleton";

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
