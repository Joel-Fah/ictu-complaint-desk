import React, { useEffect, useState } from 'react';
import { getCategory } from '@/lib/api';
import { toast } from 'sonner';
import ToastNotification from '@/Usercomponents/ToastNotifications';
import { User } from "@/types/user";
import { Complaint } from "@/types/complaint";
import { Resolution, CreateResolutionPayload } from "@/types/resolution";
import {
    CreateAssignmentPayload,
    CreateNotificationPayload,
    Assignment,
    Notification
} from "@/lib/api";
import {useUpdateComp, useUpdateComplaint} from "@/hooks/useUpdateComplaint";

type AllowedField = 'attendance_mark' | 'assignment_mark' | 'ca_mark' | 'final_mark';
type FormData = Partial<Record<AllowedField, string>>;

export interface AdminResolutionFormProps {
    selectedItem: Complaint | undefined;
    user: User | null;
    allStaff: User[] | undefined;
    existingResolution?: { id: number, is_reviewed: boolean };
    createResolution: (data: CreateResolutionPayload) => Promise<Resolution>;
    updateResolution: (id: number, data: CreateResolutionPayload) => Promise<Resolution>;
    createNotification: (data: CreateNotificationPayload) => Promise<Notification>;
    createAssignment: (data: CreateAssignmentPayload) => Promise<Assignment>;
    router: { push: (path: string) => void };
}

const getAllowedFields = (categoryName: string): AllowedField[] => {
    switch (categoryName) {
        case 'No CA Mark':
            return ['attendance_mark', 'assignment_mark', 'ca_mark', 'final_mark'];
        case 'Missing Grade':
            return ['attendance_mark', 'assignment_mark', 'final_mark', 'ca_mark'];
        case 'No Exam Mark':
            return ['final_mark', 'attendance_mark', 'assignment_mark', 'ca_mark'];
        case 'Not Satisfied With Final Grade':
            return [];
        default:
            return [];
    }
};

const AdminResolutionForm: React.FC<AdminResolutionFormProps> = ({
                                                                     selectedItem,
                                                                     user,
                                                                     allStaff,
                                                                     existingResolution,
                                                                     createResolution,
                                                                     updateResolution,
                                                                     createNotification,
                                                                     createAssignment,
                                                                 }) => {
    const [showResolutionForm, setShowResolutionForm] = useState(false);
    const [formData, setFormData] = useState<FormData>({});
    const [message, setMessage] = useState('');
    const [selectedStaffIds, setSelectedStaffIds] = useState<number[]>([]);
    const [allowedFields, setAllowedFields] = useState<AllowedField[]>([]);
    const formFilled = allowedFields.every((field) => {
        const val = formData[field];
        return val !== undefined && val !== "";
    });
    const isResolved = selectedItem?.status === "Resolved";
    const updateComplaintMutation = useUpdateComplaint();
    const updateCompMutation = useUpdateComp();
    const [errors, setErrors] = useState<{ [key in AllowedField]?: string }>({});

    const hasValidationErrors = Object.values(errors).some((v) => v !== undefined);
    const requiredFieldsFilled = allowedFields.every(
        (field) => formData[field] !== undefined && formData[field] !== ""
    );

    const markRanges: Record<AllowedField, [number, number]> = {
        attendance_mark: [0, 10],
        assignment_mark: [0, 20],
        ca_mark: [0, 30],
        final_mark: [0, 70],
    };

    const handleMarkChange = (field: AllowedField, value: string) => {
        const num = parseFloat(value);

        if (value === "") {
            setFormData({ ...formData, [field]: "" });
            setErrors((prev) => ({ ...prev, [field]: undefined }));
            return;
        }

        if (isNaN(num)) {
            setErrors((prev) => ({ ...prev, [field]: "Must be a valid number" }));
            return;
        }

        const [min, max] = markRanges[field];
        if (num < min || num > max) {
            setErrors((prev) => ({ ...prev, [field]: `Must be between ${min} and ${max}` }));
            return;
        }

        setErrors((prev) => ({ ...prev, [field]: undefined }));
        setFormData({ ...formData, [field]: num });
    };


    const isRegistrar = (() => {
        if (!user) return false;
        const adminProfile = user.profiles?.find((p) => p.type === 'admin');
        return adminProfile?.data?.office?.toLowerCase() === 'registrar_office';
    })();

    const handleRegistrarSubmit = async () => {
        if (!selectedItem || !user || !existingResolution) return;
        try {
            await updateCompMutation.mutateAsync({data: {status: "Resolved"}, id: selectedItem.id });
            await updateResolution(existingResolution.id, { is_reviewed: true });

            if (allStaff) {
                await Promise.all(
                    allStaff.map((staff) =>
                        createNotification({
                            recipient_id: staff.id,
                            message: `Complaint ${selectedItem.id} with title ${selectedItem.title} has been resolved by the Registrar's Office.`,
                        })
                    )
                );
            }

            // Always notify the student
            if (typeof selectedItem.student === 'number') {
                await createNotification({
                    recipient_id: selectedItem.student,
                    message: `Your complaint ${selectedItem.title} with id ${selectedItem.id} has been resolved by the Registrar's Office.`,
                });
            }

            toast.custom(
                (t) => (
                    <ToastNotification
                        type="success"
                        title="Resolved!"
                        subtitle="Complaint marked as resolved."
                        onClose={() => toast.dismiss(t)}
                        showClose
                    />
                ),
                { duration: 2000 }
            );

            setTimeout(() => {
                //router.push('/dashboard');
            }, 3000);
        } catch (error) {
            console.error("Registrar processing failed:", error);
            toast.custom(
                (t) => (
                    <ToastNotification
                        type="error"
                        title="Something went wrong!"
                        subtitle="Could not mark as resolved."
                        onClose={() => toast.dismiss(t)}
                        showClose
                    />
                ),
                { duration: 2000 }
            );
        }
    };

    useEffect(() => {
        const fetchCategory = async () => {
            if (selectedItem?.category) {
                try {
                    const category = await getCategory(selectedItem.category);
                    setAllowedFields(getAllowedFields(category.name));
                } catch {
                    toast.error("Failed to load category information");
                }
            }
        };
        fetchCategory();
    }, [selectedItem]);

    const handleSubmit = async () => {
        if (!message.trim() || !selectedItem || !user) return;

        // Validate all fields before submit
        const invalidFields: string[] = [];
        allowedFields.forEach((field) => {
            const val = formData[field];
            if (val === undefined || val === "") {
                invalidFields.push(`${field.replace("_", " ")} is required.`);
            } else {
                const num = Number(val);
                const [min, max] = markRanges[field];
                if (isNaN(num) || num < min || num > max) {
                    invalidFields.push(`${field.replace("_", " ")} must be between ${min} and ${max}.`);
                }
            }
        });

        if (invalidFields.length > 0) {
            toast.custom(
                (t) => (
                    <ToastNotification
                        type="error"
                        title="Validation Error!"
                        subtitle={`Please fix the following:\n\n${invalidFields.join("\n")}`}
                        onClose={() => toast.dismiss(t)}
                        showClose
                    />
                ),
                { duration: 4000 }
            );
            return;
        }

        try {
            if (formFilled) {
                const numericFields: Partial<Record<AllowedField, number>> = {};
                allowedFields.forEach((field) => {
                    numericFields[field] = Number(formData[field]);
                });

                const resolutionPayload: CreateResolutionPayload = {
                    complaint: selectedItem.id,
                    ...numericFields,
                    comments: message,
                };

                const admins = (allStaff ?? []).filter((s) => s.role === "Admin");

                if (existingResolution) {
                    await updateResolution(existingResolution.id, resolutionPayload);

                    await Promise.all(
                        admins.map((admin) =>
                            createNotification({
                                recipient_id: admin.id,
                                message:
                                    admin.id === user.id
                                        ? `You updated the resolution for complaint ${selectedItem.id}.`
                                        : `Admin ${admin.fullName} updated the resolution for complaint ${selectedItem.id}.`,
                            })
                        )
                    );

                    setFormData({});
                    setMessage("");
                    setSelectedStaffIds([]);
                } else {
                    await createResolution(resolutionPayload);

                    await Promise.all([
                        ...admins.map((admin) =>
                            createNotification({
                                recipient_id: admin.id,
                                message:
                                    admin.id === user.id
                                        ? `You provided a resolution for complaint ${selectedItem.id}.`
                                        : `Mr/Mrs/Engr./Dr. ${admin.fullName} provided a resolution for complaint ${selectedItem.id}.`,
                            })
                        ),
                        createNotification({
                            recipient_id: selectedItem.student,
                            message: `Your complaint "${selectedItem.title}" is currently at the Registrar's Office for approval. Please be patient.`,
                        }),
                    ]);

                    setFormData({});
                    setMessage("");
                    setSelectedStaffIds([]);
                }
            }

            await Promise.all(
                selectedStaffIds.map(async (id) => {
                    try {
                        await createAssignment({ complaint: selectedItem.id, staff: id });
                        await updateComplaintMutation.mutateAsync({
                            id: selectedItem.id,
                            status: "In Progress",
                        });
                        await createNotification({
                            recipient_id: id,
                            message,
                        });
                        setFormData({});
                        setMessage("");
                        setSelectedStaffIds([]);
                    } catch (err) {
                        console.error("Failed to create assignment for staff_id:", id, err);
                    }
                })
            );

            if (typeof selectedItem.student === "number") {
                await createNotification({
                    recipient_id: selectedItem.student,
                    message: `Your complaint "${selectedItem.title}" is currently at the Finance Department.`,
                });
            }

            toast.custom(
                (t) => (
                    <ToastNotification
                        type="success"
                        title="Thank you!"
                        subtitle="Resolution submitted successfully."
                        onClose={() => toast.dismiss(t)}
                        showClose
                    />
                ),
                { duration: 3000 }
            );

            setTimeout(() => {
                //router.push("/dashboard");
            }, 3000);
        } catch (error) {
            console.error("Admin processing failed:", error);
            toast.custom(
                (t) => (
                    <ToastNotification
                        type="error"
                        title="Something went wrong!"
                        subtitle="Could not process resolution."
                        onClose={() => toast.dismiss(t)}
                        showClose
                    />
                ),
                { duration: 2000 }
            );
        }
    };

    return (
        <div className="mt-6 space-y-4">
            {!isResolved && (
                <>
                    {!isRegistrar && (
                        <>
                            {!existingResolution && (
                                <button
                                    className="w-full bg-primary-700 text-white rounded-lg py-2 font-medium"
                                    onClick={() => setShowResolutionForm(!showResolutionForm)}
                                >
                                    {showResolutionForm ? "Hide Resolution Form" : "Fill Resolution Form"}
                                </button>
                            )}

                            {showResolutionForm && (
                                <>
                                    {(
                                        ["attendance_mark", "assignment_mark", "ca_mark", "final_mark"] as AllowedField[]
                                    ).map((field) => (
                                        <div key={field} className="mb-2">
                                            <input
                                                type="number"
                                                placeholder={field.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                                                className={`w-full border rounded-lg p-2 text-sm ${
                                                    errors[field] ? "border-red-500" : "border-gray-300"
                                                }`}
                                                value={formData[field] ?? ""}
                                                onChange={(e) => handleMarkChange(field, e.target.value)}
                                                disabled={!allowedFields.includes(field)}
                                            />
                                            {errors[field] && (
                                                <p className="text-red-500 text-xs mt-1">{errors[field]}</p>
                                            )}
                                        </div>
                                    ))}
                                </>
                            )}

                            <select
                                multiple
                                className="w-full border rounded-lg p-2 text-sm"
                                onChange={(e) => {
                                    const selected = Array.from(e.target.selectedOptions).map((opt) => Number(opt.value));
                                    setSelectedStaffIds(selected);
                                }}
                            >
                                {(allStaff ?? [])
                                    .filter((staff) => staff.id !== user?.id || staff.username !== "system")
                                    .map((staff) => {
                                        const staffAdminProfile = staff.profiles?.find((p) => p.type === "admin");
                                        const staffOfficeRaw = staffAdminProfile?.data?.office ?? "";
                                        const staffOffice = staffOfficeRaw.toLowerCase();
                                        const isRegistrarStaff = staffOffice === "registrar_office";

                                        return (
                                            <option
                                                key={staff.id}
                                                value={staff.id}
                                                disabled={!formFilled && isRegistrarStaff}
                                            >
                                                {staff.username} - {staff.role} - {staffOfficeRaw || "Unknown"}
                                            </option>
                                        );
                                    })}
                            </select>

                            <textarea
                                className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                                rows={3}
                                placeholder="Enter a message..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                            />

                            <button
                                className="w-full bg-primary-950 text-white rounded-lg py-2 font-medium hover:bg-primary-800"
                                onClick={handleSubmit}
                                disabled={hasValidationErrors || !requiredFieldsFilled}
                            >
                                Send
                            </button>
                        </>
                    )}

                    {isRegistrar && (
                        <button
                            className="w-full bg-success text-white rounded-lg py-2 font-medium hover:bg-green-700"
                            onClick={handleRegistrarSubmit}
                            disabled={!!existingResolution && existingResolution.is_reviewed}
                        >
                            Mark as Resolved
                        </button>
                    )}
                </>
            )}
        </div>
    );

};

export default AdminResolutionForm;