'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import ToastNotification from '@/Usercomponents/ToastNotifications';
import { useUserStore } from '@/stores/userStore';
import Image from 'next/image';
import { logout } from '@/lib/auth';

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
    }, [searchParams, router]);

    if (!user) {
        return <p className="text-error">User data not found.</p>;
    }

    return (
        <section className="min-h-screen flex flex-col items-center justify-center bg-primary-300 p-6">
            <h1 className="text-3xl font-bold mt-4 font-heading">Dashboard</h1>

            {user.picture && (
                <Image
                    src={user.picture}
                    alt="Profile"
                    width={24}
                    height={24}
                    className="rounded-full mt-4 shadow-md"
                />
            )}

            <div className="mt-6 space-y-2 text-center">
                <p className="text-lg font-medium">Full Name: {user.fullName}</p>
                <p className="text-md">First Name: {user.firstName}</p>
                <p className="text-md">Last Name: {user.lastName}</p>
                <p className="text-md">Email: {user.email}</p>
                <p className="text-md">Username: {user.username}</p>
            </div>

            <button
                onClick={() => {
                    sessionStorage.removeItem('loginToastShown'); // reset on logout
                    logout();
                }}
                className="mt-6 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
                Logout
            </button>
        </section>
    );
}

export default DashboardPage;
