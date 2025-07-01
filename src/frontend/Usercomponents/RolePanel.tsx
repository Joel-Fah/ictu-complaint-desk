'use client';

import { useState } from "react";
import Image from "next/image";
import Sidebar from "@/Usercomponents/Sidebar";
import ComplaintDetail from "@/Usercomponents/ComplaintDetail";
import StatusCard from "@/Usercomponents/StatusCard";
import { withAuth } from "@/lib/withAuth";
import { Complaint } from "@/types/complaint";
import { useUserStore } from "@/stores/userStore";
import {useComplaintAssignments} from "@/hooks/useComplaintAssignments";
import {useAllStaff} from "@/hooks/useStaff";

interface RolePanelProps {
    selectedItem: Complaint | null;
    setSelectedItem: (item: Complaint | null, count?: number | null) => void;
    statusFilter: string;
    isMobile: boolean;
}

const RolePanel = ({
                       selectedItem,
                       setSelectedItem,
                       statusFilter,
                       isMobile,
                   }: RolePanelProps) => {
    const [selectedComplaintCount, setSelectedComplaintCount] = useState<number | null>(null);

    // 👇 Pull the activeRoleTab from the global store
    const activeRoleTab = useUserStore((s) => s.activeRoleTab);

    const { data: allStaff = [],
        //isLoading,
        //isError,
        refetch
    } = useAllStaff();
    refetch();

    const {
        data: assignedTo = [],
        //isLoading: isLoadingAssignments,
        //isError: isErrorAssignments,
        //error: errorAssignments,
    } = useComplaintAssignments(selectedItem?.id);

    const handleSelectItem = (item: Complaint | null, count?: number | null) => {
        setSelectedItem(item);
        setSelectedComplaintCount(count ?? null);
    };

    return (
        <>
            {(!isMobile || !selectedItem) && (
                <div className="w-full md:w-[320px] border-r overflow-y-auto">
                    <Sidebar
                        onSelectItem={(item, count) => handleSelectItem(item, count)}
                        statusFilter={statusFilter}
                    />
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

                    <div className={isMobile ? "mt-2" : ""}>
                        <ComplaintDetail
                            complaint={selectedItem}
                            complaintCount={selectedComplaintCount ?? undefined}
                        />
                        {isMobile && selectedItem && (
                            <div className="mt-4">
                                <StatusCard
                                    status={selectedItem.status}
                                    assignedTo={assignedTo}
                                    role={activeRoleTab} // 🔥 Use actual active role
                                    allStaff={allStaff}
                                    selectedItem={selectedItem}
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
                        role={activeRoleTab} // 🔥 Use actual active role
                        allStaff={allStaff}
                        selectedItem={selectedItem}
                    />
                </div>
            )}
        </>
    );
};

export default withAuth(RolePanel);
