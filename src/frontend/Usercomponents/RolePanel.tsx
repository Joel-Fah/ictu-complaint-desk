import Sidebar from "@/Usercomponents/Sidebar";
import ComplaintDetail from "@/Usercomponents/ComplaintDetail";
import StatusCard from "@/Usercomponents/StatusCard";
import {withAuth} from "@/lib/withAuth";
import Image from "next/image";
import {Complaint} from "@/types/complaint";

type Role = "student" | "lecturer" | "admin" | "complaint_coordinator";

interface RolePanelProps {
    role: Role;
    selectedItem: Complaint | null;
    setSelectedItem: (item: Complaint | null) => void;
    statusFilter: string;
    isMobile: boolean;
}

const RolePanel = ({
                       role,
                       selectedItem,
                       setSelectedItem,
                       statusFilter,
                       isMobile,
                   }: RolePanelProps) => (
    <>
        {(!isMobile || !selectedItem) && (
            <div className={`w-full md:w-[320px] border-r overflow-y-auto`}>
                <Sidebar onSelectItem={setSelectedItem} statusFilter={statusFilter} role={role} />
            </div>
        )}

        {(!isMobile || selectedItem) && (
            <div className="flex-1 overflow-y-auto bg-whiteColor p-4 relative">
                {isMobile && selectedItem && (
                    <button
                        onClick={() => setSelectedItem(null)}
                        className="absolute top-4 left-4 flex items-center gap-2 text-primary-700 font-medium bg-primary-100 px-3 py-1.5 rounded hover:bg-primary-200"
                    >
                        <Image src="/icons/arrow-left-02.svg" alt="Back" width={12} height={12} />
                    </button>
                )}
                <div className={`${isMobile ? 'mt-12' : ''}`}>
                    <ComplaintDetail complaint={selectedItem} role={role} />
                    {isMobile && selectedItem && (
                        <div className="mt-4">
                            <StatusCard status={selectedItem.status} assignedTo={[]} role={role} />
                        </div>
                    )}
                </div>
            </div>
        )}

        {!isMobile && selectedItem && (
            <div className="w-[300px] p-4 border-l overflow-y-auto mt-[64px]">
                <StatusCard status={selectedItem.status} assignedTo={[]} role={role} />
            </div>
        )}
    </>
);

export default withAuth(RolePanel);
