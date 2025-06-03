'use client';

import {useEffect} from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import ToastNotification from '@/Usercomponents/ToastNotifications';
import { useUserStore } from '@/stores/userStore';
import { logout } from '@/lib/auth';
import {withAuth} from "@/lib/withAuth";
import Sidebar from "@/Usercomponents/Sidebar";
import NavbarDashboard from "@/Usercomponents/NavbarDashboard";
import {DrawerDialogDemo} from "@/Usercomponents/DrawerDialog";

function DashboardPage() {
    const user = useUserStore((state) => state.user);
    const searchParams = useSearchParams();
    const router = useRouter();
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

            sessionStorage.setItem('loginToastShown', 'true'); // prevent future toasts this session

            // Remove the query param so toast doesn't show again on refresh
            const newUrl = window.location.pathname; // '/dashboard'
            router.replace(newUrl);

        }
    }, [searchParams, router, user]);

    if (!user) {
        return <p className="text-error">User data not found.</p>;
    }

    const dummy_number = 1;
    return (
        <section className='flex flex-col justify-center'>
                {/* Sticky Top Navbar */}
                    <NavbarDashboard />
                {/* Fixed Sidebar */}
                    <Sidebar />

                <div className="ml-[340px]">
                    {/* Main Content Scrollable */}
                    <div className="flex-1 h-[calc(100vh-72px)] overflow-y-auto bg-whiteColor p-4 flex gap-4">
                        {/* Center (Complaint Detail) */}
                        <div className="flex-1 border-r">
                            {/* Conditional prompt if student_number is missing */}
                            {!dummy_number && (
                                <div className="mb-4 p-4 bg-secondary-100 border-l-4 border-secondary-500 text-primary-950 font-sans rounded">
                                    <p className="mb-2 font-medium">We need your student number to complete your profile.</p>
                                    <DrawerDialogDemo />
                                </div>
                            )}

                            {/* Logout button */}
                            <button
                                onClick={() => {
                                    sessionStorage.removeItem('loginToastShown'); // reset on logout
                                    logout();
                                }}
                                className="mt-6 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                            >
                                Logout
                            </button>
                        </div>

                        {/* Right (Status Card) */}
                        <div className="w-[300px] p-4 ">
                            StatusCard
                        </div>
                    </div>
                </div>
        </section>
    );
}

export default withAuth(DashboardPage);
