'use client';

import { logout } from '@/lib/auth';
import { withAuth } from '@/lib/withAuth';
import { useUserStore } from '@/stores/userStore';
import Image from "next/image";

function DashboardPage() {
    const user = useUserStore((state) => state.user);

    if (!user) {
        return <p className="text-error">User data not found.</p>;
    }

    return (
        <section className="min-h-screen flex flex-col items-center justify-center bg-primary-300 p-6">
            <h1 className="text-3xl font-bold mt-4 font-heading">Dashboard</h1>

            {/* Profile Image */}
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
                onClick={logout}
                className="mt-6 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
                Logout
            </button>
        </section>
    );
}

export default withAuth(DashboardPage);
