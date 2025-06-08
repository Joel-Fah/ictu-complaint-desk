import React from "react";
import { Complaint } from "@/types/complaint";
import ComplaintDetailSkeleton from "@/Usercomponents/ComplaintDetailSkeleton";
import { useCategoryStore } from "@/stores/categoryStore";

interface ComplaintDetailProps {
    complaint: Complaint | null;
    isLoading?: boolean;
}

const ComplaintDetail: React.FC<ComplaintDetailProps> = ({ complaint, isLoading = false }) => {
    const { categories } = useCategoryStore();
    const categoryId = complaint?.category ? Number(complaint.category) : -1;
    const category = categories[categoryId] ?? `Category ${complaint?.category}`;
    const categoryName = category?.name ?? "";

    if (isLoading) return <ComplaintDetailSkeleton />;

    if (!complaint) {
        return (
            <div className="text-center text-gray-500 italic mt-4" role="status" aria-live="polite">
                Select a complaint to view its details.
            </div>
        );
    }

    return (
        <div className="bg-white p-4 w-full max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl sm:text-4xl lg:text-[48px] font-heading text-darkColor">
                    {complaint.id}. {complaint.title || "Untitled"}
                </h1>
            </div>

            <div>
                <h2 className="text-lg sm:text-xl font-heading text-greyColor font-medium">Details</h2>
            </div>

            {/* Badges */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="bg-[#050041] bg-opacity-[5%] px-4 py-3 rounded-2xl flex-1">
                    <span className="font-sans text-sm text-darkColor">Category:</span><br />
                    <p className="font-sans text-base font-medium text-darkColor">{categoryName}</p>
                </div>
                <div className="bg-[#050041] bg-opacity-[5%] px-4 py-3 rounded-2xl flex-1">
                    <span className="font-sans text-sm text-darkColor">Semester:</span><br />
                    <p className="font-sans text-base font-medium text-darkColor">
                        {complaint.semester} {complaint.year}
                    </p>
                </div>
            </div>

            {/* Description */}
            <div className="prose max-w-none">
                <p className="font-sans text-darkColor text-base whitespace-pre-wrap">
                    {complaint.description || "No description provided."}
                </p>
            </div>

            {/* Metadata */}
            <div className="pt-6 border-t border-gray-200 text-sm text-gray-500 flex flex-col sm:flex-row sm:justify-between gap-2">
        <span>
          Created:{" "}
            {complaint.created_at && new Date(complaint.created_at).toLocaleString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            })}
        </span>
                <span>
          Updated:{" "}
                    {complaint.updated_at && new Date(complaint.updated_at).toLocaleString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                    })}
        </span>
            </div>
        </div>
    );
};

export default ComplaintDetail;