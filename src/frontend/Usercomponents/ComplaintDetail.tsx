import React, {useEffect, useMemo, useState} from "react";
import { Complaint } from "@/types/complaint";
import ComplaintDetailSkeleton from "@/Usercomponents/ComplaintDetailSkeleton";
import { useCategoryStore } from "@/stores/categoryStore";
import {getUserById} from "@/lib/api";

interface ComplaintDetailProps {
    complaint: Complaint | null;
    isLoading?: boolean;
    role?: string; // Optional, if you need to handle role-specific logic
}

// Move this out of the component to avoid redefining it on every render
function isValidHTML(html: string): boolean {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return !doc.querySelector("parsererror");
}

const ComplaintDetail: React.FC<ComplaintDetailProps> = ({ complaint, isLoading = false, role }) => {
    const { categories } = useCategoryStore();
    const [studentName, setStudentName] = useState("");
    const [studentNumber, setStudentNumber] = useState("");
    const categoryId = complaint?.category ? Number(complaint.category) : -1;
    const category = categories[categoryId] ?? `Category ${complaint?.category}`;
    const categoryName = category?.name ?? "";
    const studentId = complaint?.student


    useEffect(() => {
        if (typeof studentId !== 'number') {
            setStudentName("");
            return;
        }

        getUserById(studentId)
            .then((student) => {
                const name = `${student.firstName} ${student.lastName}`;
                const profile = student.profiles.find(p=> p.type === "student");
                const studentNumber = profile?.data?.student_number || "";
                setStudentNumber(studentNumber);
                setStudentName(name);
            })
            .catch((err) => {
                console.error("Error fetching student:", err);
                setStudentName('Unknown');
                setStudentNumber('');
            });
    }, [studentId]);



    const safeHtml = useMemo(() => {
        if (!complaint?.description) return null;
        return isValidHTML(complaint.description) ? complaint.description : null;
    }, [complaint?.description]);

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
            {role != "student" && (
                <div>
                    <p className="text-lg sm:text-xl font-heading text-primary-950 font-medium" >Submitted by: {studentName}</p>
                    <p className="text-lg sm:text-xl font-heading text-primary-950 font-medium" >with Student Number: {studentNumber}</p>
                </div>
            )}
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
                {safeHtml ? (
                    <div
                        className="font-sans text-darkColor text-base whitespace-pre-wrap"
                        dangerouslySetInnerHTML={{ __html: safeHtml }}
                    />
                ) : (
                    <p className="font-sans text-darkColor text-base whitespace-pre-wrap">
                        {complaint.description || "No description provided."}
                    </p>
                )}
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
