'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import ToastNotification from '@/Usercomponents/ToastNotifications';
import { useUserStore } from '@/stores/userStore';
import { withAuth } from "@/lib/withAuth";
import { Complaint } from "@/types/complaint";
import { useCategoryStore } from "@/stores/categoryStore";
import { useFilterStore } from "@/stores/filterStore";
import RolePanel from "@/Usercomponents/RolePanel";
import StudentPanel from "@/Usercomponents/StudentPanel";
import Button from "@/Usercomponents/Button";

function DashboardPage() {
    const user = useUserStore((state) => state.user);
    const role = useUserStore((state) => state.role);
    const secondary_role = useUserStore((state) => state.secondary_role);
    const activeRoleTab = useUserStore((state) => state.activeRoleTab);
    const setActiveRoleTab = useUserStore((state) => state.setActiveRoleTab);

    const fetchCategories = useCategoryStore((state) => state.fetchCategories);
    const statusFilter = useFilterStore((state) => state.filter);
    const searchParams = useSearchParams();
    const router = useRouter();
    const fetchUser = useUserStore((state) => state.fetchUser);
    const isLoading = useUserStore((state) => state.isLoading);

    const [selectedItem, setSelectedItem] = useState<Complaint | null>(null);
    const [isMobile, setIsMobile] = useState(false);

    const hasStudent = role?.toLowerCase() === "student";
    const hasLecturer = role?.toLowerCase() === "lecturer" || secondary_role?.toLowerCase() === "lecturer";
    const hasAdmin = role?.toLowerCase() === "admin" || secondary_role?.toLowerCase() === "admin";
    const hasComplaintCoordinator =
        role?.toLowerCase() === "complaint_coordinator" || secondary_role?.toLowerCase() === "complaint_coordinator";
    //const hasMultipleRoles = !!user?.role || !!user?.secondary_role;
    //const hasMultipleRoles = user?.role.toLowerCase() && user?.secondary_role?.toLowerCase() && user.role.toLowerCase() !== user.secondary_role.toLowerCase();
    const studentProfile = user?.profiles?.find(p => p.type === "student");
    const studentNumber = studentProfile?.data?.student_number;


    console.log("Role:", role);
    console.log("Secondary Role:", secondary_role);

    const isStudent = role?.toLowerCase() === "student";
    const allRoles = [role, secondary_role]
        .map((r) => r?.toLowerCase())
        .filter((r) => r && r !== "student");
    const roles = Array.from(new Set(allRoles));
    const hasMultipleRoles = !isStudent && roles.length > 0;


    useEffect(() => {
        if (typeof window === "undefined") return;
        if (isMobile && hasStudent && !studentNumber && activeRoleTab === 'student') {
            router.replace("/complete-profile?redirect=/dashboard");
        }
    }, [isMobile, hasStudent, studentNumber, activeRoleTab, router]);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        if (!user?.id) return;
        fetchUser(user.id);
    }, [user?.id, fetchUser]);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

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

    //if (isMobile && hasStudent && !studentNumber && activeRoleTab === 'student') return null;

    if (isLoading || !user) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-black text-lg">Loading your dashboard...</p>
            </div>
        );
    }

    return (
        <section className='flex flex-col min-h-screen'>
            {/* Role Tabs */}
            {hasMultipleRoles && (
                <div className="ml-0 md:ml-[380px] mt-2 w-full md:w-[800px] flex gap-2 md:gap-4 p-2 md:p-4 rounded-2xl z-[1] backdrop-blur-md border border-opacity-20 shadow-lg
  bg-gradient-to-br from-blue-800/30 to-white/60 overflow-x-auto">
                    {hasLecturer && (
                        <button
                            onClick={() => setActiveRoleTab("lecturer")}
                            className={`px-3 py-2 md:px-4 md:py-2 rounded-lg text-sm md:text-base ${activeRoleTab === "lecturer" ? "bg-primary-600 text-white" : "bg-gray-200"}`}
                        >
                            Lecturer
                        </button>
                    )}
                    {hasAdmin && (
                        <button
                            onClick={() => setActiveRoleTab("admin")}
                            className={`px-3 py-2 md:px-4 md:py-2 rounded text-sm md:text-base ${activeRoleTab === "admin" ? "bg-primary-600 text-white" : "bg-gray-200"}`}
                        >
                            Admin
                        </button>
                    )}
                    {hasComplaintCoordinator && (
                        <button
                            onClick={() => setActiveRoleTab("complaint_coordinator")}
                            className={`px-3 py-2 md:px-4 md:py-2 rounded text-sm md:text-base ${activeRoleTab === "complaint_coordinator" ? "bg-primary-600 text-white" : "bg-gray-200"}`}
                        >
                            Coordinator
                        </button>
                    )}
                </div>
            )}

            <div className="flex flex-1">
                {activeRoleTab === "student" && (
                    <StudentPanel
                        selectedItem={selectedItem}
                        setSelectedItem={setSelectedItem}
                        statusFilter={statusFilter}
                        isMobile={isMobile}
                        fetchUser={fetchUser}
                    />
                )}

                {["lecturer", "admin", "complaint_coordinator"].includes(activeRoleTab) && (
                    <RolePanel
                        selectedItem={selectedItem}
                        setSelectedItem={setSelectedItem}
                        statusFilter={statusFilter}
                        isMobile={isMobile}
                    />
                )}
            </div>
            {role?.toLowerCase() === "student" && (
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
                        disabled={!studentNumber}
                        onClick={() => router.push("/new")}
                    />
                </div>
            )}
        </section>
    );
}

export default withAuth(DashboardPage);
