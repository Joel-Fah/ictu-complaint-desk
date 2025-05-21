//Prevents authorised/users who have logged in from accessing paths like login
"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAccessToken } from "./token";

export function withPublic<P extends object>(Component: React.ComponentType<P>) {
    return function PublicComponent(props: P) {
        const router = useRouter();

        useEffect(() => {
            const token = getAccessToken();
            if (token) {
                router.push("/dashboard"); // Redirect logged-in users
            }
        }, [router]);

        return <Component {...props} />;
    };
}
