"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getUser } from "@/lib/api";
import { getAccessToken } from "@/lib/token";

type User = {
    id: number;
    email: string;
    username: string;
    first_name: string;
    last_name: string;
};


export default function DashboardPage() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const accessToken = getAccessToken();

        if (!accessToken) {
            // No token? Bounce to log in
            router.push("/login");
            return;
        }

        getUser(accessToken)
            .then((userData) => {
                setUser(userData);
                console.log(userData);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Failed to fetch user:", error);
                router.push("/login");
            });
    }, [router]); // run once on component mount

    if (loading) {
        return <p>Loading user data...</p>;
    }

    return (
        <section className="min-h-screen flex flex-col items-center justify-center bg-primary-300">
            <h1 className="text-3xl font-bold mt-4 font-heading">Dashboard</h1>
            {user ? (
                <>
                    <p className="text-md font-sans">Your email: {user.email}</p>
                    <p className="text-md font-sans">Your Username: {user.username}</p>
                </>
            ) : (
                <p className="text-error">User data not found.</p>
            )}
        </section>
    );
}
