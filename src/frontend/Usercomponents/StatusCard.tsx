import React, {useEffect, useState} from "react";
import Image from "next/image";
import {createAssignment, createNotification, createResolution, updateComplaint, updateResolution, allResolutions} from "@/lib/api";
import {toast} from "sonner";
import ToastNotification from "@/Usercomponents/ToastNotifications";
import {Complaint} from "@/types/complaint";
import {useUserStore} from "@/stores/userStore";
import {User} from "@/types/user";
import {useRouter} from "next/navigation";
import { useCategoryStore } from "@/stores/categoryStore";
import type { Resolution } from "@/types/resolution";
import AdminResolutionForm from "@/Usercomponents/AdminResolutionForm";
import LecturerResolutionForm from "@/Usercomponents/LecturerResolutionForm";

export interface AssignedPerson {
    user: User;
    fullName: string;
    picture: string;
    role: string;
    complaintId?: number;
}

interface StatusCardProps {
    status: string;
    assignedTo: AssignedPerson[];
    role?: string;
    selectedItem?: Complaint;
    allStaff?: User[];
}


const StatusCard: React.FC<StatusCardProps> = ({ status, assignedTo, role, selectedItem, allStaff }) => {
    const user = useUserStore((state) => state.user);
    const adminProfile = user?.profiles?.find(p => p.type === "admin");
    const adminOffice = adminProfile?.data?.office || "Registrar's Office";
    const [selectedDeadline, setSelectedDeadline] = useState<string | undefined>(selectedItem?.deadline); // from selectedItem.deadline
    const { categories, fetchCategories } = useCategoryStore();
    const [selectedCategory, setSelectedCategory] = useState<number>(Number(selectedItem?.category)); // pull from selectedItem.category
    const router = useRouter();
    const [message, setMessage] = useState("");
    const [resolutions, setResolutions] = useState<Resolution[]>([]);
    const existingResolution = resolutions.find(res => res.complaint_id === selectedItem?.id);

    useEffect(() => {
        // Fetch resolutions on mount
        allResolutions().then((data: Resolution[]) => setResolutions(data));
    }, []);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    const getStatusStyles = () => {
        switch (status.toLowerCase()) {
            case "escalated":
                return "bg-red-100 border-error text-error";
            case "in progress":
                return "bg-yellow-50 border-warning text-warning";
            case "resolved":
                return "bg-green-50 border-success text-success";
            default:
                return "bg-primary-50 border-info text-info";
        }
    };

    const handleComplaintUpdate = async () => {
        if (!selectedItem || !selectedCategory || !selectedDeadline || !message.trim()) return;

        try {
            await updateComplaint({
                id: selectedItem.id,
                category: selectedCategory,
                deadline: selectedDeadline,
            });

            // Example for sending notification to student
            if (typeof selectedItem.student === "number") {
                await createNotification({
                    recipient_id: selectedItem.student,
                    message: "The complaint coordinator update the category and/or deadline of your complaint to better suit fast resolution"
                });
            }

            toast.custom(t => <ToastNotification type="success" title="Thank you!" subtitle="Complaint Updated" onClose={() => toast.dismiss(t)} showClose />, { duration: 2000 });
            setTimeout(() => {
                router.push("/dashboard"); // using Next.js router
            }, 3000);
        } catch (error) {
            console.error("Error updating complaint:", error);
            toast.custom(t => <ToastNotification type="error" title="Something went wrong!" subtitle="" onClose={() => toast.dismiss(t)} showClose />, { duration: 2000 });
        }
    };

    const uniqueAssignedTo = assignedTo.filter(
        (person, index, self) =>
            index === self.findIndex((p) => p.user.id === person.user.id && p.fullName === person.fullName)
    );

    function getSafeImageUrl(picture: unknown): string {
        if (
            typeof picture === 'string' &&
            picture.trim().length > 0 &&
            (picture.startsWith('http') || picture.startsWith('/'))
        ) {
            return picture.trim();
        }

        return '/images/dummy.png'; // Fallback to local image
    }



    const getStatusIcon = () => {
        switch (status.toLowerCase()) {
            case "escalated":
                return "/icons/help-circle-red.svg";
            case "in progress":
                return "/icons/loading-02.svg";
            case "resolved":
                return "/icons/target-02.svg";
            default:
                return "/icons/status.svg";
        }
    };

    const getDescription = () => {
        switch (status.toLowerCase()) {
            case "escalated":
                return "You are seeing this because the deadline for complaints has passed and this has still not been reviewed.";
            case "in progress":
                return "Your complaint is currently being handled by those involved. Please be patient.";
            case "resolved":
                return "Congratulations on getting your complaint resolved.";
            default:
                return "This complaint has been filed but the concerned parties have not reviewed it yet. Please be patient.";
        }
    };

    return (
        <div className="w-full max-w-md sm:max-w-sm lg:max-w-xs mx-auto px-4 overflow-y-auto">
            {/* Status Section */}
            <div className="mb-6">
                <h2 className="text-lg sm:text-xl font-heading text-greyColor mb-4">Status</h2>
                <div className={`border border-dashed rounded-2xl p-3 ${getStatusStyles()} w-full`}>
                    <div className="flex items-center justify-center gap-2">
                        <Image src={getStatusIcon()} alt={`${status} icon`} width={24} height={24} />
                        <span className={`text-base sm:text-lg font-medium capitalize font-heading ${getStatusStyles()}`}>
                            {status}
                        </span>
                    </div>
                </div>
                <p className="text-greyColor text-sm mt-2 leading-relaxed">{getDescription()}</p>
            </div>

            <hr className="border-gray-200 mb-6" />

            {/* Assigned To */}
            <div>
                <h2 className="text-lg font-heading font-medium text-greyColor mb-2">Assigned to:</h2>
                <p className="text-greyColor text-sm mb-4">
                    This complaint was assigned to the following administrative entities:
                </p>

                <div className="space-y-4">
                    {uniqueAssignedTo.map((person, index) => (
                        <div key={index} className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 relative">
                                <Image
                                    src={getSafeImageUrl(person.picture)}
                                    alt={person.fullName || 'User'}
                                    fill
                                    className="rounded-full object-cover"
                                />

                            </div>
                            <div>
                                <div className="font-heading text-darkColor text-base font-medium">{person.fullName}</div>
                                <div className="text-darkColor font-sans text-[10px]">{person.role}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {role === "lecturer" && (
                <LecturerResolutionForm
                    selectedItem={selectedItem}
                    user={user}
                    allStaff={allStaff}
                    adminOffice={adminOffice}
                    existingResolution={existingResolution}
                    createResolution={createResolution}
                    updateResolution={updateResolution}
                    createNotification={createNotification}
                    createAssignment={createAssignment}
                    router={router}
                />
            )}

            {role === "complaint_coordinator" && (
                <div className="mt-6 space-y-4">
                    <h3 className="font-heading text-md text-greyColor">Update Complaint Details</h3>

                    <div>
                        <label className="block mb-1 text-sm font-medium text-greyColor">Category</label>
                        <select
                            className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(Number(e.target.value))}
                        >
                            {Object.values(categories).map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block mb-1 text-sm font-medium text-greyColor">Deadline</label>
                        <input
                            type="date"
                            className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                            value={selectedDeadline}
                            onChange={(e) => setSelectedDeadline(e.target.value)}
                        />
                    </div>

                    <textarea
                        className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                        rows={3}
                        placeholder="Enter a message to notify the student..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />

                    <button
                        className="w-full bg-blue-600 text-white rounded-lg py-2 font-medium hover:bg-blue-700"
                        onClick={handleComplaintUpdate}
                    >
                        Update Complaint
                    </button>
                </div>
            )}

            {role === "admin" && (
                <AdminResolutionForm
                    selectedItem={selectedItem}
                    user={user}
                    allStaff={allStaff}
                    adminOffice={adminOffice}
                    existingResolution={existingResolution}
                    createResolution={createResolution}
                    updateResolution={updateResolution}
                    createNotification={createNotification}
                    createAssignment={createAssignment}
                    router={router}
                />
            )}


        </div>
    );
};

export default StatusCard;
