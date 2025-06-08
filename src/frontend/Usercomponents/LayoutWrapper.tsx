// components/LayoutWrapper.tsx
"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Navbar from "@/Usercomponents/Navbar";
import NavbarDashboard from "@/Usercomponents/NavbarDashboard";

const LayoutWrapper = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname();

    const isRoot = pathname === "/";
    const isLogin = pathname === "/login";

    if (isLogin) {
        return <main>{children}</main>;
    }

    return (
        <>
            {isRoot ? <Navbar /> : <NavbarDashboard />}
            <main>{children}</main>
        </>
    );
};

export default LayoutWrapper;
