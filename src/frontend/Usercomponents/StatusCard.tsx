import React, {useEffect, useState} from "react";
import Image from "next/image";
import {createAssignment, createNotification, createResolution, updateComplaint, updateResolution} from "@/lib/api";
import {toast} from "sonner";
import ToastNotification from "@/Usercomponents/ToastNotifications";
import {Complaint} from "@/types/complaint";
import {useUserStore} from "@/stores/userStore";
import {User} from "@/types/user";
import {useRouter} from "next/navigation";
import { useCategoryStore } from "@/stores/categoryStore";
import Button from "./Button";
import { getResolutions } from "@/lib/api";
import {Resolution} from "@/types/resolution";

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
    const adminOffice = adminProfile?.data?.office || "Registrar Office";
    const [selectedDeadline, setSelectedDeadline] = useState<string | undefined>(selectedItem?.deadline); // from selectedItem.deadline
    const { categories, fetchCategories } = useCategoryStore();
    const [selectedCategory, setSelectedCategory] = useState<number>(Number(selectedItem?.category)); // pull from selectedItem.category
    const router = useRouter();
    const [message, setMessage] = useState("");
    const [showResolutionForm, setShowResolutionForm] = useState(false);
    const [existingResolution, setExistingResolution] = useState<Resolution | null>(null);
    const [formData, setFormData] = useState({
        attendance_mark: "",
        assignment_mark: "",
        ca_mark: "",
        final_mark: ""
    });
    const [selectedStaffIds, setSelectedStaffIds] = useState<number[]>([]);
    const formFilled = Object.values(formData).some(value => value.trim() !== "");
    const hasResolution = async (complaintId: number) => {
        const resolutions = await getResolutions();
        return resolutions.find((res: Resolution) => res.complaint_id === complaintId);
    };

    useEffect(() => {
        const fetchResolution = async () => {
            if (selectedItem) {
                const res = await hasResolution(selectedItem.id);
                setExistingResolution(res || null);
            }
        };
        fetchResolution();
    }, [selectedItem]);

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
                    message: "The complaint coordinator updated the category and/or deadline of your complaint to better suit fast resolution"
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


    const handleSubmit = async () => {
        if (!selectedItem || !user) return;

        try {
            // ✅ REGISTRAR OFFICE: review resolution and mark complaint as resolved
            if (adminOffice === "Registrar Office") {
                if (existingResolution) {
                    // 1. Update resolution as reviewed
                    await updateResolution(existingResolution.id, {
                        reviewed_by_id: user.id,
                        is_reviewed: true,
                    });

                    // 2. Mark complaint as resolved
                    await updateComplaint({ id: selectedItem.id, status: "Resolved" });

                    // 3. Notify student
                    if (typeof selectedItem.student === "number") {
                        await createNotification({
                            recipient_id: selectedItem.student,
                            message: "Your complaint has been reviewed and resolved by the Registrar's Office.",
                        });
                    }
                    toast.custom(t => <ToastNotification type="success" title="Thank you!" subtitle="Resolution reviewed, complaint marked as resolved, and student notified" onClose={() => toast.dismiss(t)} showClose />, { duration: 2000 });
                    setTimeout(() => {
                        router.push("/dashboard"); // using Next.js router
                    }, 3000);
                } else {
                    toast.custom(t => <ToastNotification type="error" title="Oops!" subtitle="No resolution found to review." onClose={() => toast.dismiss(t)} showClose />, { duration: 2000 });
                }

                return; // ✅ Done for Registrar Office
            }

            // ✅ FINANCE & OTHER ADMIN OFFICES: handle resolution + assignment
            const resolutionPayload = {
                resolved_by_id: user.id,
                ...formData,
                comments: message,
            };

            if (existingResolution) {
                await updateResolution(existingResolution.id, resolutionPayload);
            } else {
                await createResolution({
                    complaint_id: selectedItem.id,
                    ...resolutionPayload,
                });
            }

            // Notify other admins
            const admins = (allStaff ?? []).filter(s => s.role === "Admin");
            await Promise.all(admins.map(admin =>
                createNotification({
                    recipient_id: admin.id,
                    message: `Admin ${admin.fullName} has resolved complaint #${selectedItem.id}.`,
                })
            ));

            // Assign and notify staff
            await Promise.all(selectedStaffIds.map(async (id) => {
                await createAssignment({ complaint_id: selectedItem.id, staff_id: id });
                await createNotification({ recipient_id: id, message });
            }));

            // Notify student
            if (typeof selectedItem.student === "number") {
                await createNotification({
                    recipient_id: selectedItem.student,
                    message: "Your complaint has received a resolution. It is now pending review at the Registrar's Office.",
                });
            }

            toast.custom(t => <ToastNotification type="success" title="Thank you!" subtitle="Resolution submitted, assignments made, and notifications sent." onClose={() => toast.dismiss(t)} showClose />, { duration: 2000 });
            setTimeout(() => {
                router.push("/dashboard"); // using Next.js router
            }, 3000);
        } catch (error) {
            console.error("Error in handleSubmit:", error);
            toast.custom(t => <ToastNotification type="error" title="Oops!" subtitle="Something went wrong while submiitting the resolution." onClose={() => toast.dismiss(t)} showClose />, { duration: 2000 });
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
                                <Image src={person.picture} alt={person.fullName} fill className="rounded-full object-cover" />
                            </div>
                            <div>
                                <div className="font-heading text-darkColor text-base font-medium">{person.fullName}</div>
                                <div className="text-darkColor font-sans text-[10px]">{person.role}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Extra for Lecturer */}
            {role === "lecturer" && (
                <div className="mt-6 space-y-4">
                    {/* Toggle Resolution Form */}
                    <button
                        className="w-full bg-primary-700 text-white rounded-lg py-2 font-medium"
                        onClick={() => setShowResolutionForm(!showResolutionForm)}
                    >
                        {showResolutionForm ? "Hide Resolution Form" : "Fill Resolution Form"}
                    </button>

                    {/* Resolution Form */}
                    {showResolutionForm && (
                        <>
                            <input
                                type="number"
                                placeholder="Attendance Mark"
                                className="w-full border rounded-lg p-2 text-sm"
                                value={formData.attendance_mark}
                                onChange={(e) => setFormData({ ...formData, attendance_mark: e.target.value })}
                            />
                            <input
                                type="number"
                                placeholder="Assignment Mark"
                                className="w-full border rounded-lg p-2 text-sm"
                                value={formData.assignment_mark}
                                onChange={(e) => setFormData({ ...formData, assignment_mark: e.target.value })}
                            />
                            <input
                                type="number"
                                placeholder="CA Mark"
                                className="w-full border rounded-lg p-2 text-sm"
                                value={formData.ca_mark}
                                onChange={(e) => setFormData({ ...formData, ca_mark: e.target.value })}
                            />
                            <input
                                type="number"
                                placeholder="Final Mark"
                                className="w-full border rounded-lg p-2 text-sm"
                                value={formData.final_mark}
                                onChange={(e) => setFormData({ ...formData, final_mark: e.target.value })}
                            />
                        </>
                    )}

                    {/* Message Textarea */}
                    <textarea
                        className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                        rows={3}
                        placeholder="Enter a message or commemnt..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />

                    {/* Dropdown for staff assignment */}
                    <select
                        multiple
                        className="w-full border rounded-lg p-2 text-sm"
                        onChange={(e) => {
                            const selected = Array.from(e.target.selectedOptions).map(opt => Number(opt.value));
                            setSelectedStaffIds(selected);
                        }}
                    >
                        {(allStaff ?? []).map((staff) => {
                            const staffAdminProfile = staff.profiles?.find(p => p.type === "admin");
                            const staffOffice = staffAdminProfile?.data?.office || adminOffice;
                            const isRegistrar = staffOffice === "Registrar Office";
                            return (
                                <option
                                    key={staff.id}
                                    value={staff.id}
                                    disabled={!formFilled && isRegistrar}
                                >
                                    {staff.fullName} - {staff.role} - {staffOffice}
                                </option>
                            );
                        })}
                    </select>

                    {/* Submit */}
                    <Button
                    type="submit"
                    onClick={ async () => {
                        if (!message.trim() || !selectedItem || !user) return;

                        try {
                            // Case: Resolution form was filled
                            if (formFilled) {
                                const existingResolution = await hasResolution(selectedItem.id);
                                if (existingResolution) {
                                    // Update existing resolution
                                    await updateResolution(existingResolution.id, {
                                        resolved_by_id: user.id,
                                        ...formData,
                                        comments: message
                                    });
                                } else {
                                    // Create new resolution
                                    await createResolution({
                                        complaint_id: selectedItem.id,
                                        resolved_by_id: user.id,
                                        ...formData,
                                        comments: message
                                    });
                                }
                                // Assign and notify staff
                                await Promise.all(selectedStaffIds.map(async (id) => {
                                    await createAssignment({ complaint_id: selectedItem.id, staff_id: id });
                                    await createNotification({ recipient_id: id, message });
                                }));

                                // Before sending notification to student
                                if (typeof selectedItem.student === "number") {
                                    await createNotification({
                                        recipient_id: selectedItem.student,
                                        message: "Your complaint is currently at the Registrar's Office awaiting approval before the resolution can be sent to you"
                                    });
                                }

                            } else {
                                // Case: Only message provided
                                // just use selectedStaffIds
                                await Promise.all(selectedStaffIds.map(async (id) => {
                                    await createNotification({ recipient_id: id, message });
                                }));

                                // Notify student
                                // Before sending notification to student
                                if (typeof selectedItem.student === "number") {
                                    await createNotification({
                                        recipient_id: selectedItem.student,
                                        message: "Your complaint is still in progress"
                                    });
                                }
                            }

                            toast.custom(t => <ToastNotification type="success" title="Thank you!" subtitle="" onClose={() => toast.dismiss(t)} showClose />, { duration: 2000 });
                            setTimeout(() => {
                                router.push("/dashboard"); // using Next.js router
                            }, 3000);

                        } catch (err) {
                            console.error("Error processing lecturer action:", err);
                            toast.custom(t => <ToastNotification type="error" title="Something went wrong!" subtitle="" onClose={() => toast.dismiss(t)} showClose />, { duration: 2000 });
                        }
                    }}
                    text="Send"
                    leftImageSrc="/icons/sent.svg"
                    leftImageWidth={24}
                    leftImageHeight={24}
                    leftImageAlt="send icon"
                    showLeftSeparator={true}
                    bgColor="bg-primary-950"
                    hoverBgColor={"bg-primary-800"}
                    textColor="text-white"
                    className={"w-full p-4"}
                    border={"border-none"}
                    borderRadius={"rounded-2xl"}
                    />
                </div>
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

            {/* Extra for Admin */}
            {role === "admin" && (
                <div className="mt-6 space-y-4">
                    {/* Case: Registrar Office — info + show button */}
                    {adminOffice === "Registrar Office" && (
                        <>
                            {existingResolution ? (
                                <div className="space-y-2 border border-gray-300 rounded-lg p-4 mb-4 bg-gray-50">
                                    <p className="text-sm text-gray-700"><strong>Attendance Mark:</strong> {existingResolution.attendance_mark ?? "N/A"}</p>
                                    <p className="text-sm text-gray-700"><strong>Assignment Mark:</strong> {existingResolution.assignment_mark ?? "N/A"}</p>
                                    <p className="text-sm text-gray-700"><strong>CA Mark:</strong> {existingResolution.ca_mark ?? "N/A"}</p>
                                    <p className="text-sm text-gray-700"><strong>Final Mark:</strong> {existingResolution.final_mark ?? "N/A"}</p>
                                    <p className="text-sm text-gray-700 whitespace-pre-wrap"><strong>Resolution Comment:</strong><br />{existingResolution.comments}</p>
                                </div>
                            ) : (
                                <p className="text-sm text-red-500 mb-2">No resolution has been submitted yet.</p>
                            )}

                            <button
                                className="w-full bg-primary-700 text-white rounded-lg py-2 font-medium"
                                onClick={handleSubmit}
                            >
                                Resolve Complaint
                            </button>
                        </>
                    )}

                    {/* Case: Finance Department */}
                    {adminOffice === "Finance Department" && (
                        <>
                           <textarea
                               className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                               rows={3}
                               placeholder="Enter resolution comment..."
                               value={message}
                               onChange={(e) => setMessage(e.target.value)}
                           />
                            <select
                                multiple
                                className="w-full border rounded-lg p-2 text-sm"
                                onChange={(e) => {
                                    const selected = Array.from(e.target.selectedOptions).map(opt => Number(opt.value));
                                    setSelectedStaffIds(selected);
                                }}
                            >
                                {(allStaff ?? []).map((staff) => {
                                    const staffAdminProfile = staff.profiles?.find(p => p.type === "admin");
                                    const staffOffice = staffAdminProfile?.data?.office || adminOffice;
                                    return (
                                        <option key={staff.id} value={staff.id}>
                                            {staff.fullName} - {staff.role} - {staffOffice}
                                        </option>
                                    );
                                })}
                            </select>

                            <button
                                className="w-full bg-yellow-600 text-white rounded-lg py-2 font-medium hover:bg-yellow-700"
                                onClick={handleSubmit}
                            >
                                Reply to Complaint
                            </button>
                        </>
                    )}

                    {/* Case: Other Admins */}
                    {adminOffice !== "Registrar Office" && adminOffice !== "Finance Department" && (
                        <>
                            <button
                                className="w-full bg-primary-700 text-white rounded-lg py-2 font-medium"
                                onClick={() => setShowResolutionForm(!showResolutionForm)}
                            >
                                {showResolutionForm ? "Hide Resolution Form" : "Fill Resolution Form"}
                            </button>

                            {showResolutionForm && (
                                <>
                                    <input
                                        type="number"
                                        placeholder="Attendance Mark"
                                        className="w-full border rounded-lg p-2 text-sm"
                                        value={formData.attendance_mark}
                                        onChange={(e) => setFormData({ ...formData, attendance_mark: e.target.value })}
                                    />
                                    <input
                                        type="number"
                                        placeholder="Assignment Mark"
                                        className="w-full border rounded-lg p-2 text-sm"
                                        value={formData.assignment_mark}
                                        onChange={(e) => setFormData({ ...formData, assignment_mark: e.target.value })}
                                    />
                                    <input
                                        type="number"
                                        placeholder="CA Mark"
                                        className="w-full border rounded-lg p-2 text-sm"
                                        value={formData.ca_mark}
                                        onChange={(e) => setFormData({ ...formData, ca_mark: e.target.value })}
                                    />
                                    <input
                                        type="number"
                                        placeholder="Final Mark"
                                        className="w-full border rounded-lg p-2 text-sm"
                                        value={formData.final_mark}
                                        onChange={(e) => setFormData({ ...formData, final_mark: e.target.value })}
                                    />
                                </>
                            )}

                            <textarea
                                className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                                rows={3}
                                placeholder="Enter a message..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                            />

                            <select
                                multiple
                                className="w-full border rounded-lg p-2 text-sm"
                                onChange={(e) => {
                                    const selected = Array.from(e.target.selectedOptions).map(opt => Number(opt.value));
                                    setSelectedStaffIds(selected);
                                }}
                            >
                                {(allStaff ?? []).map((staff) => {
                                    const staffAdminProfile = staff.profiles?.find(p => p.type === "admin");
                                    const staffOffice = staffAdminProfile?.data?.office || adminOffice;
                                    const isRegistrar = staffOffice === "Registrar Office";
                                    return (
                                        <option
                                            key={staff.id}
                                            value={staff.id}
                                            disabled={!formFilled && isRegistrar}
                                        >
                                            {staff.fullName} - {staff.role} - {staffOffice}
                                        </option>
                                    );
                                })}
                            </select>

                            <button
                                className="w-full bg-yellow-600 text-white rounded-lg py-2 font-medium hover:bg-yellow-700"
                                onClick={handleSubmit}
                            >
                                Send
                            </button>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default StatusCard;
