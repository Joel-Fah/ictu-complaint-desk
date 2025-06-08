'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import ToastNotification from '@/Usercomponents/ToastNotifications';
import { useUserStore } from '@/stores/userStore';
import { withAuth } from "@/lib/withAuth";
import Sidebar from "@/Usercomponents/Sidebar";
import NavbarDashboard from "@/Usercomponents/NavbarDashboard";
import { DrawerDialogDemo } from "@/Usercomponents/DrawerDialog";
import Button from "@/Usercomponents/Button";
import { Complaint } from "@/types/complaint";
import ComplaintDetail from "@/Usercomponents/ComplaintDetail";
import StatusCard from "@/Usercomponents/StatusCard";
import { useCategoryStore } from "@/stores/categoryStore";
import Image from "next/image";

function DashboardPage() {
    const user = useUserStore((state) => state.user);
    const fetchCategories = useCategoryStore((state) => state.fetchCategories);
    const searchParams = useSearchParams();
    const router = useRouter();

    const [selectedItem, setSelectedItem] = useState<Complaint | null>(null);
    const [isMobile, setIsMobile] = useState(false);

    const studentProfile = user?.profiles?.find(p => p.type === "student");
    const studentNumber = studentProfile?.data?.student_number;

    // Media query listener for responsiveness
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile(); // Initial
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Fetch categories
    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    // Toast notification logic
    useEffect(() => {
        const loginSuccess = searchParams.get('login') === 'success';
        const toastShown = sessionStorage.getItem('loginToastShown');

        if (loginSuccess && !toastShown) {
            toast.custom((t) => (
                <ToastNotification
                    type="success"
                    title="Login successful!"
                    subtitle="Welcome to your dashboard."
                    onClose={() => toast.dismiss(t)}
                    showClose
                />
            ), { duration: 4000 });

            sessionStorage.setItem('loginToastShown', 'true');
            router.replace(window.location.pathname);
        }
    }, [searchParams, router]);

    if (!user) return <p className="text-error">User data not found.</p>;

    return (
        <section className='flex flex-col h-screen'>

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar (show on desktop OR when no chat selected on mobile) */}
                {(!isMobile || !selectedItem) && (
                    <div className={`w-full md:w-[320px] border-r overflow-y-auto`}>
                        <Sidebar onSelectItem={setSelectedItem} />
                    </div>
                )}

                {/* Complaint Detail (only show if item selected on mobile, always on desktop) */}
                {(!isMobile || selectedItem) && (
                    <div className="flex-1 overflow-y-auto bg-whiteColor p-4 relative">
                        {/* Mobile Back Button */}
                        {isMobile && selectedItem && (
                            <button
                                onClick={() => setSelectedItem(null)}
                                className="absolute top-4 left-4 flex items-center gap-2 text-primary-700 font-medium bg-primary-100 px-3 py-1.5 rounded hover:bg-primary-200"
                            >
                                <Image src="/icons/arrow-left-02.svg" alt="Back" width={12} height={12} />
                            </button>
                        )}

                        <div className={`${isMobile ? 'mt-12' : ''}`}>
                            <ComplaintDetail complaint={selectedItem} />

                            {/* Only show this on mobile (below complaint detail) */}
                            {isMobile && selectedItem && (
                                <div className="mt-4">
                                    <StatusCard status={selectedItem.status} assignedTo={[]} />
                                </div>
                            )}

                            {!studentNumber && (
                                <div className="mt-4 p-4 bg-secondary-100 border-l-4 border-secondary-500 text-primary-950 font-sans rounded">
                                    <p className="mb-2 font-medium">
                                        We need your student number to complete your profile.
                                    </p>
                                    <DrawerDialogDemo />
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Status card (only visible on desktop and when complaint is selected) */}
                {!isMobile && selectedItem && (
                    <div className="w-[300px] p-4 border-l overflow-y-auto mt-[64px]">
                        <StatusCard status={selectedItem.status} assignedTo={[]} />
                    </div>
                )}
            </div>

            <Button
                width="207px"
                type="button"
                className="fixed bottom-6 right-6 z-50 font-sans font-medium text-body h-[44px] gap-[10px] text-primary-50 shadow-xl/30"
                imageSrc="/icons/file-add.svg"
                bgColor="bg-primary-800"
                hoverBgColor="bg-primary-600"
                padding="px-[12px] py-[10px]"
                text="New Complaint"
                border="border-none"
                borderRadius="rounded-[12px]"
                onClick={() => { router.push("/new"); }}
            />
        </section>
    );
}

export default withAuth(DashboardPage);
