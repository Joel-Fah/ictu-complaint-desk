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

type AllowedField = 'attendance_mark' | 'assignment_mark' | 'ca_mark' | 'final_mark';
type FormData = Partial<Record<AllowedField, string>>;

export interface AdminResolutionFormProps {
    selectedItem: Complaint | undefined;
    user: User |  null;
    allStaff: User[] | undefined;
    adminOffice: string;
    existingResolution?: { id: number };
    createResolution: (data: CreateResolutionPayload) => Promise<Resolution>;
    updateResolution: (id: number, data: {
        resolved_by_id: number;
        attendance_mark?: number;
        assignment_mark?: number;
        ca_mark?: number;
        final_mark?: number;
        comments: string
    }) => Promise<Resolution>;
    createNotification: (data: CreateNotificationPayload) => Promise<Notification>;
    createAssignment: (data: CreateAssignmentPayload) => Promise<Assignment>;
    router: { push: (path: string) => void };
}

const getAllowedFields = (categoryName: string): AllowedField[] => {
    switch (categoryName) {
        case 'No CA Mark':
            return ['attendance_mark', 'assignment_mark', 'ca_mark'];
        case 'Missing Grade':
            return ['attendance_mark', 'assignment_mark', 'final_mark'];
        case 'No Exam Mark':
            return ['final_mark'];
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
                                                                     adminOffice,
                                                                     existingResolution,
                                                                     createResolution,
                                                                     updateResolution,
                                                                     createNotification,
                                                                     createAssignment,
                                                                     router,
                                                                 }) => {
    const [showResolutionForm, setShowResolutionForm] = useState(false);
    const [formData, setFormData] = useState<FormData>({});
    const [message, setMessage] = useState('');
    const [selectedStaffIds, setSelectedStaffIds] = useState<number[]>([]);
    const [allowedFields, setAllowedFields] = useState<AllowedField[]>([]);
    const formFilled = allowedFields.every((field) => !!formData[field]);

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

        try {
            if (formFilled) {
                // Convert string values to numbers for allowed fields
                const numericFields: Partial<Record<AllowedField, number>> = {};
                allowedFields.forEach((field) => {
                    const val = formData[field];
                    if (val !== undefined && val !== '') {
                        numericFields[field] = Number(val);
                    }
                });

                const resolutionPayload = {
                    resolved_by_id: user.id,
                    ...numericFields,
                    comments: message,
                };

                if (existingResolution) {
                    await updateResolution(existingResolution.id, resolutionPayload);
                    const admins = (allStaff ?? []).filter((s) => s.role === 'Admin');
                    await Promise.all(
                        admins.map((admin) =>
                            createNotification({
                                recipient_id: admin.id,
                                message: `Admin ${admin.fullName} updated resolution for complaint ${selectedItem.id}.`,
                            })
                        )
                    );
                } else {
                    await createResolution({
                        complaint_id: selectedItem.id,
                        ...resolutionPayload,
                    });
                }
            }

            await Promise.all(
                selectedStaffIds.map(async (id) => {
                    await createAssignment({ complaint_id: selectedItem.id, staff_id: id });
                    await createNotification({ recipient_id: id, message });
                })
            );

            if (typeof selectedItem.student === 'number') {
                await createNotification({
                    recipient_id: selectedItem.student,
                    message:
                        "Your complaint is currently at the Registrar's Office awaiting approval before the resolution can be sent to you",
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
                { duration: 2000 }
            );

            setTimeout(() => {
                router.push('/dashboard');
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
            <button
                className="w-full bg-primary-700 text-white rounded-lg py-2 font-medium"
                onClick={() => setShowResolutionForm(!showResolutionForm)}
            >
                {showResolutionForm ? 'Hide Resolution Form' : 'Fill Resolution Form'}
            </button>

            {showResolutionForm && (
                <>
                    {(['attendance_mark', 'assignment_mark', 'ca_mark', 'final_mark'] as AllowedField[]).map((field) => (
                        <input
                            key={field}
                            type="number"
                            placeholder={field.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                            className="w-full border rounded-lg p-2 text-sm"
                            value={formData[field] || ''}
                            onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                            disabled={!allowedFields.includes(field)}
                        />
                    ))}
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
                    const selected = Array.from(e.target.selectedOptions).map((opt) => Number(opt.value));
                    setSelectedStaffIds(selected);
                }}
            >
                {(allStaff ?? []).map((staff) => {
                    const staffAdminProfile = staff.profiles?.find((p) => p.type === 'admin');
                    const staffOffice = staffAdminProfile?.data?.office || adminOffice;
                    const isRegistrar = staffOffice === 'Registrar Office';
                    return (
                        <option key={staff.id} value={staff.id} disabled={!formFilled && isRegistrar}>
                            {staff.username} - {staff.role} - {staffOffice}
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
        </div>
    );
};

export default AdminResolutionForm;