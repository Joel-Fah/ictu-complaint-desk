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

function DashboardPage() {
    const user = useUserStore((state) => state.user);
    const fetchCategories = useCategoryStore((state) => state.fetchCategories);
    const statusFilter = useFilterStore((state) => state.filter);
    const searchParams = useSearchParams();
    const router = useRouter();
    const fetchUser = useUserStore((state) => state.fetchUser);
    const isLoading = useUserStore((state) => state.isLoading);

    const [selectedItem, setSelectedItem] = useState<Complaint | null>(null);
    const [isMobile, setIsMobile] = useState(false);

    const hasStudent = user?.role === "Student";
    const hasLecturer = user?.role === "Lecturer" || user?.secondary_role === "Lecturer";
    const hasAdmin = user?.role === "Admin" || user?.secondary_role === "Admin";
    const hasComplaintCoordinator = user?.role === "Complaint Coordinator" || user?.secondary_role === "Complaint Coordinator";
    const hasMultipleRoles = user?.role && user?.secondary_role && user.role !== user.secondary_role;
    const studentProfile = user?.profiles?.find(p => p.type === "student");
    const studentNumber = studentProfile?.data?.student_number;

    const roles = [
        hasStudent ? "student" : null,
        hasLecturer ? "lecturer" : null,
        hasAdmin ? "admin" : null,
        hasComplaintCoordinator ? "complaint_coordinator" : null,
    ].filter(Boolean) as string[];

    const [activeRoleTab, setActiveRoleTab] = useState(roles[0] || "student");

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

    if (isMobile && hasStudent && !studentNumber && activeRoleTab === 'student') return null;

    if (isLoading || !user) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-black text-lg">Loading your dashboard...</p>
            </div>
        );
    }

    return (
        <section className='flex flex-col'>
            {/* Role Tabs */}
            {hasMultipleRoles && (
                <div className="flex gap-4 p-4 bg-white border-b border-primary-950 rounded-2xl">
                    {hasLecturer && (
                        <button
                            onClick={() => setActiveRoleTab("lecturer")}
                            className={`px-4 py-2 rounded-lg ${activeRoleTab === "lecturer" ? "bg-primary-600 text-white" : "bg-gray-200"}`}
                        >
                            Lecturer
                        </button>
                    )}
                    {hasAdmin && (
                        <button
                            onClick={() => setActiveRoleTab("admin")}
                            className={`px-4 py-2 rounded ${activeRoleTab === "admin" ? "bg-primary-600 text-white" : "bg-gray-200"}`}
                        >
                            Admin
                        </button>
                    )}
                    {hasComplaintCoordinator && (
                        <button
                            onClick={() => setActiveRoleTab("complaint_coordinator")}
                            className={`px-4 py-2 rounded ${activeRoleTab === "complaint_coordinator" ? "bg-primary-600 text-white" : "bg-gray-200"}`}
                        >
                            Admin
                        </button>
                    )}
                </div>
            )}

            <div className="flex flex-1">
                {activeRoleTab === "student" && (
                    <StudentPanel
                        hasStudent={hasStudent}
                        studentNumber={studentNumber}
                        selectedItem={selectedItem}
                        setSelectedItem={setSelectedItem}
                        statusFilter={statusFilter}
                        isMobile={isMobile}
                        user={user.id}
                        fetchUser={fetchUser}
                    />
                )}

                {activeRoleTab === "lecturer" && (
                    <RolePanel
                        role="lecturer"
                        selectedItem={selectedItem}
                        setSelectedItem={setSelectedItem}
                        statusFilter={statusFilter}
                        isMobile={isMobile}
                    />
                )}
                {activeRoleTab === "complaint_coordinator" && (
                    <RolePanel
                        role="complaint_coordinator"
                        selectedItem={selectedItem}
                        setSelectedItem={setSelectedItem}
                        statusFilter={statusFilter}
                        isMobile={isMobile}
                    />
                )}

                {activeRoleTab === "admin" && (
                    <RolePanel
                        role="admin"
                        selectedItem={selectedItem}
                        setSelectedItem={setSelectedItem}
                        statusFilter={statusFilter}
                        isMobile={isMobile}
                    />
                )}
            </div>
        </section>
    );
}

export default withAuth(DashboardPage);
