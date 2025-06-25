"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import { Complaint } from "@/types/complaint";
import { User } from "@/types/user";
import type { AssignedPerson } from "@/Usercomponents/StatusCard";

import Sidebar from "@/Usercomponents/Sidebar";
import ComplaintDetail from "@/Usercomponents/ComplaintDetail";
import StatusCard from "@/Usercomponents/StatusCard";

import { getAssignmentFromComplaint, getUserById, getAllStaff } from "@/lib/api";
import { useUserStore } from "@/stores/userStore";
import { StudentMatriculeForm } from "./DrawerDialog";

interface StudentPanelProps {
    selectedItem: Complaint | null;
    setSelectedItem: (item: Complaint | null, count?: number | null) => void;
    statusFilter: string;
    isMobile: boolean;
    fetchUser: (id: number | string) => void;
}

const StudentPanel = ({
                          selectedItem,
                          setSelectedItem,
                          statusFilter,
                          isMobile,
                          fetchUser,
                      }: StudentPanelProps) => {
    const user = useUserStore((s) => s.user);
    const role = useUserStore((s) => s.role);

    const isStudent = role?.toLowerCase() === "student";

    const studentProfile = user?.profiles?.find((p) => p.type === "student");
    const studentNumber = studentProfile?.data?.student_number;

    const [assignedTo, setAssignedTo] = useState<AssignedPerson[]>([]);
    const [allStaff, setAllStaff] = useState<User[]>([]);

    // New state to track the display count of the selected complaint
    const [selectedComplaintCount, setSelectedComplaintCount] = useState<number | null>(null);

    useEffect(() => {
        getAllStaff().then(setAllStaff).catch(() => setAllStaff([]));
    }, []);

    useEffect(() => {
        if (!selectedItem?.id) {
            setAssignedTo([]);
            return;
        }

        getAssignmentFromComplaint(selectedItem.id)
            .then((assignments) =>
                Promise.all(
                    assignments.map(async (a) => {
                        const staff = await getUserById(a.staff);
                        return {
                            user: staff,
                            fullName: `${staff.firstName} ${staff.lastName}`,
                            picture: staff.picture || " ",
                            role: staff.role || "Staff",
                            complaintId: selectedItem.id,
                        };
                    })
                )
            )
            .then(setAssignedTo)
            .catch(() => setAssignedTo([]));
    }, [selectedItem?.id]);

    // New handler to set both selected complaint and complaint count
    const handleSelectItem = (item: Complaint | null, count?: number | null) => {
        setSelectedItem(item);
        setSelectedComplaintCount(count ?? null);
    };

    return (
        <>
            {(!isMobile || !selectedItem) && (
                <div className="w-full md:w-[320px] border-r overflow-y-auto">
                    {isStudent && !studentNumber ? (
                        <div className="p-4 text-center text-sm text-secondary-700 font-medium">
                            Save Student Number to begin complaints.
                        </div>
                    ) : (
                        // Pass the new handler that takes count as second param
                        <Sidebar
                            onSelectItem={(item, count) => handleSelectItem(item, count)}
                            statusFilter={statusFilter}
                        />
                    )}
                </div>
            )}

            {(!isMobile || selectedItem) && (
                <div className="flex-1 overflow-y-auto bg-whiteColor p-4 relative">
                    {isMobile && selectedItem && (
                        <button
                            onClick={() => handleSelectItem(null, null)}
                            className="absolute top-4 left-4 flex items-center gap-2 text-primary-700 font-medium bg-primary-100 px-3 py-1.5 rounded hover:bg-primary-200"
                        >
                            <Image src="/icons/arrow-left-02.svg" alt="Back" width={12} height={12} />
                        </button>
                    )}
                    <div className={isMobile ? "mt-12" : ""}>
                        <ComplaintDetail
                            complaint={selectedItem}
                            complaintCount={selectedComplaintCount ?? undefined} // pass count here
                        />
                        {isMobile && selectedItem && (
                            <div className="mt-4">
                                <StatusCard
                                    status={selectedItem.status}
                                    assignedTo={assignedTo}
                                    role="student"
                                    selectedItem={selectedItem}
                                    allStaff={allStaff}
                                />
                            </div>
                        )}
                    </div>
                </div>
            )}

            {!isMobile && selectedItem && (
                <div className="w-[300px] p-4 border-l overflow-y-auto mt-[64px]">
                    <StatusCard
                        status={selectedItem.status}
                        assignedTo={assignedTo}
                        role="student"
                        selectedItem={selectedItem}
                        allStaff={allStaff}
                    />
                </div>
            )}

            {isStudent && !studentNumber && (
                <div className="fixed mt-4 left-96 z-0 p-4 bg-secondary-100 border-l-4 border-secondary-500 text-primary-950 font-sans rounded">
                    <p className="mb-2 font-medium">
                        We need your student number to complete your profile.
                    </p>
                    <StudentMatriculeForm onSuccess={() => user?.id && fetchUser(user.id)} />
                </div>
            )}
        </>
    );
};

export default StudentPanel;
