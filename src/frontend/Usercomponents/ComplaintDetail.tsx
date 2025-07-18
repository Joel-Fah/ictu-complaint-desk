import React, { useEffect, useMemo, useState } from "react";
import { Complaint } from "@/types/complaint";
import ComplaintDetailSkeleton from "@/Usercomponents/ComplaintDetailSkeleton";
import { useCategoryStore } from "@/stores/categoryStore";
import { getUserById } from "@/lib/api";
import Image from "next/image";
import { useUserStore } from "@/stores/userStore";
import { useResolutions } from "@/hooks/useResolution";


interface ComplaintDetailProps {
    complaint: Complaint | null;
    isLoading?: boolean;
    complaintCount?: number;
}

// Utility to validate HTML
function isValidHTML(html: string): boolean {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return !doc.querySelector("parsererror");
}

const ComplaintDetail: React.FC<ComplaintDetailProps> = ({ complaint, complaintCount, isLoading = false }) => {
    const { categories } = useCategoryStore();
    const [studentName, setStudentName] = useState("");
    const [studentNumber, setStudentNumber] = useState("");
    const { data: allResolutions = [],
        //isLoading,
        //isError,
        //error
    } = useResolutions();

    const role = useUserStore((state) => state.role);
    const secondaryRole = useUserStore((state) => state.secondary_role);

    const effectiveRole = useMemo(() => {
        if (role?.toLowerCase() === "student") return "student";
        return secondaryRole?.toLowerCase() || role?.toLowerCase() || "";
    }, [role, secondaryRole]);

    const categoryId = complaint?.category ? Number(complaint.category) : -1;
    const category = categories[categoryId] ?? `Category ${complaint?.category}`;
    const categoryName = category?.name ?? "";
    const studentId = complaint?.student;

    useEffect(() => {
        if (typeof studentId !== "number") {
            setStudentName("");
            return;
        }

        getUserById(studentId)
            .then((student) => {
                const name = `${student.firstName} ${student.lastName}`;
                const profile = student.profiles.find((p) => p.type === "student");
                const studentNumber = profile?.data?.student_number || "";
                setStudentNumber(studentNumber);
                setStudentName(name);
            })
            .catch((err) => {
                console.error("Error fetching student:", err);
                setStudentName("Unknown");
                setStudentNumber("");
            });
    }, [studentId]);


    const resolution = useMemo(() => {
        if (!complaint) return null;
        return allResolutions.find((r) => r.complaint === complaint.id) || null;
    }, [complaint, allResolutions]);

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

// Compute whether to show the resolution block
    const shouldShowResolution =
        resolution &&
        categoryName !== "Unsatisfied With Final Grade" &&
        (
            (effectiveRole === "student" && resolution.is_reviewed) ||
            (effectiveRole === "admin" || effectiveRole === "lecturer")
        );


    return (
        <div className="bg-white p-4 w-full max-w-4xl mx-auto space-y-6">
            {effectiveRole === "student" ? null : (
                <div>
                    <p className="text-lg sm:text-xl font-heading text-primary-950 font-medium">
                        Submitted by: {studentName}
                    </p>
                    <p className="text-lg sm:text-xl font-heading text-primary-950 font-medium">
                        with Student Number: {studentNumber}
                    </p>
                </div>
            )}

            <div>
                <h1 className="text-3xl sm:text-4xl lg:text-[48px] font-heading text-darkColor">
                    {(complaintCount ?? complaint.id) + "."} {complaint.title || "Untitled"}
                </h1>
            </div>

            <div>
                <h2 className="text-lg sm:text-xl font-heading text-greyColor font-medium">Details</h2>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
                <div className="bg-[#050041] bg-opacity-[5%] px-4 py-3 rounded-2xl flex-1">
                    <span className="font-sans text-sm text-darkColor">Category:</span>
                    <p className="font-sans text-base font-medium text-darkColor">{categoryName}</p>
                </div>
                <div className="bg-[#050041] bg-opacity-[5%] px-4 py-3 rounded-2xl flex-1">
                    <span className="font-sans text-sm text-darkColor">Semester:</span>
                    <p className="font-sans text-base font-medium text-darkColor">
                        {complaint.semester} {complaint.year}
                    </p>
                </div>
            </div>

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

            {complaint.attachments && complaint.attachments.length > 0 && (
                <div className="space-y-2">
                    <h2 className="text-lg sm:text-xl font-heading text-greyColor font-medium">
                        Attachments
                    </h2>
                    {complaint.attachments.map((attachment) => {
                        const fileName = attachment.file_url.split("/").pop() || "file";
                        const isImage = attachment.file_type.startsWith("image/");

                        return (
                            <div
                                key={attachment.id}
                                className="border w-full border-gray-200 rounded-lg p-2 flex items-center space-x-4 bg-white shadow-sm"
                            >
                                <div className="w-10 h-12 relative flex-shrink-0">
                                    <div className="w-10 h-12 rounded flex items-center justify-center text-xl bg-gray-50 border">
                                        {isImage ? (
                                            <Image
                                                src={attachment.file_url}
                                                alt="Attachment preview"
                                                width={34}
                                                height={40}
                                                className="object-contain"
                                            />
                                        ) : (
                                            <Image
                                                src="/icons/file_line.svg"
                                                alt="File icon"
                                                width={34}
                                                height={40}
                                            />
                                        )}
                                    </div>
                                </div>

                                <div className="flex-1 overflow-hidden">
                                    <p className="text-sm font-medium text-gray-800 truncate">
                                        {fileName.split(".")[0]}
                                    </p>
                                    <p className="text-sm text-gray-500 truncate">
                                        Uploaded:{" "}
                                        {new Date(attachment.uploaded_at).toLocaleDateString()}
                                    </p>
                                </div>

                                <a
                                    href={attachment.file_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline text-sm font-medium flex-shrink-0"
                                    title="View or download"
                                >
                                    Open
                                </a>
                            </div>
                        );
                    })}
                </div>
            )}
            <div>
                <h2 className="text-lg sm:text-xl font-heading text-greyColor font-medium">
                    Resolution Message
                </h2>
                {resolution?.comments}
            </div>

            {shouldShowResolution && (
                <div className="space-y-2 mt-4">
                    <h2 className="text-lg sm:text-xl font-heading text-greyColor font-medium">
                        Resolution Information
                    </h2>
                    <div className="bg-gray-50 border rounded-lg p-4">
                        {resolution.attendance_mark !== undefined && (
                            <p>Attendance Mark: {resolution.attendance_mark}</p>
                        )}
                        {resolution.assignment_mark !== undefined && (
                            <p>Assignment Mark: {resolution.assignment_mark}</p>
                        )}
                        {resolution.ca_mark !== undefined && (
                            <p>CA Mark: {resolution.ca_mark}</p>
                        )}
                        {resolution.final_mark !== undefined && (
                            <p>Final Mark: {resolution.final_mark}</p>
                        )}
                        {resolution.comments && (
                            <p>Comments: {resolution.comments}</p>
                        )}
                        <p>
                            Status:{" "}
                            {resolution.is_reviewed ? "Reviewed" : "Pending Review"}
                        </p>
                    </div>
                </div>
            )}


            <div className="pt-6 border-t border-gray-200 text-sm text-gray-500 flex flex-col sm:flex-row sm:justify-between gap-2">
        <span>
          Created:{" "}
            {complaint.created_at &&
                new Date(complaint.created_at).toLocaleString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                })}
        </span>
                <span>
          Deadline:{" "}
                    {complaint.deadline &&
                        new Date(complaint.deadline).toLocaleString("en-US", {
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
