import {useRouter} from "next/navigation";
import {Complaint} from "@/types/complaint";
import Sidebar from "@/Usercomponents/Sidebar";
import ComplaintDetail from "@/Usercomponents/ComplaintDetail";
import StatusCard from "@/Usercomponents/StatusCard";
import Image from "next/image";
import {DrawerDialogDemo} from "@/Usercomponents/DrawerDialog";
import Button from "@/Usercomponents/Button";



interface StudentPanelProps {
    hasStudent: boolean;
    studentNumber: string | undefined;
    selectedItem: Complaint | null;
    setSelectedItem: (item: Complaint | null) => void;
    statusFilter: string;
    isMobile: boolean;
    user: number;
    fetchUser: (id: number | string) => void;
}


const StudentPanel = ({
                          hasStudent,
                          studentNumber,
                          selectedItem,
                          setSelectedItem,
                          statusFilter,
                          isMobile,
                          user,
                          fetchUser,
                      }: StudentPanelProps) => {
    const router = useRouter(); // ✅ place it here

    return (
        <>
            {(!isMobile || !selectedItem) && (
                <div className="w-full md:w-[320px] border-r overflow-y-auto">
                    {hasStudent && !studentNumber ? (
                        <div className="p-4 text-center text-sm text-secondary-700 font-medium">
                            Save Student Number to begin complaints.
                        </div>
                    ) : (
                        <Sidebar onSelectItem={setSelectedItem} statusFilter={statusFilter} role="student" />
                    )}
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
                    <div className={isMobile ? "mt-12" : ""}>
                        <ComplaintDetail complaint={selectedItem} role="student" />
                        {isMobile && selectedItem && (
                            <div className="mt-4">
                                <StatusCard status={selectedItem.status} assignedTo={[]} role="student" />
                            </div>
                        )}
                    </div>
                </div>
            )}

            {!isMobile && selectedItem && (
                <div className="w-[300px] p-4 border-l overflow-y-auto mt-[64px]">
                    <StatusCard status={selectedItem.status} assignedTo={[]} role="student" />
                </div>
            )}

            {hasStudent && !studentNumber && (
                <div className="fixed mt-4 left-96 z-0 p-4 bg-secondary-100 border-l-4 border-secondary-500 text-primary-950 font-sans rounded">
                    <p className="mb-2 font-medium">
                        We need your student number to complete your profile.
                    </p>
                    <DrawerDialogDemo onSuccess={() => fetchUser(user)} />
                </div>
            )}

            <div className="fixed bottom-6 right-6 z-50">
                <Button
                    width="207px"
                    type="button"
                    className="font-sans font-medium text-body h-[44px] gap-[10px] text-primary-50 shadow-md"
                    leftImageSrc="/icons/file-add.svg"
                    bgColor="bg-primary-800"
                    hoverBgColor="bg-primary-600"
                    padding="px-[12px] py-[10px]"
                    text="New Complaint"
                    border="border-none"
                    borderRadius="rounded-[12px]"
                    disabled={hasStudent && !studentNumber}
                    onClick={() => router.push("/new")}
                />
            </div>
        </>
    );
};
export default StudentPanel;
