"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";
import MenuIcon from '../public/icons/menu-11.svg';
import XIcon from '../public/icons/cancel-01.svg';
import {getBaseUrl} from "../app/utils/getBaseUrl";

const navLinks = [
    { href: "/", label: "Home", icon: "/icons/home-01.svg" },
    { href: "/wiki", label: "How it works?", icon: "/icons/help-circle.svg" },
];

export default function Navbar() {
    const pathname = usePathname();
    const [menuOpen, setMenuOpen] = useState(false);
    const toggleMenu = () => setMenuOpen((prev) => !prev);
    const googleLoginUrl = `${getBaseUrl()}/accounts/google/login/?process=login`;

    const isActive = (href: string) => pathname === href;

    return (
        <nav className="sticky top-0 left-0 right-0 z-20 w-full bg-primary-950 text-whiteColor px-6 md:px-[100px] py-[16px] flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-2">
                <Image
                    src="/images/logo-text-white.png"
                    alt="ICTU Logo"
                    width={92.94}
                    height={40}
                    className="w-[80px] md:w-[92.94px] h-auto"
                />
            </div>

            {/* Desktop Nav */}
            <div className="hidden sm:flex items-center justify-between w-full">
                <div className="flex items-center space-x-4 mx-auto">
                    {navLinks.map(({ href, label, icon }) => (
                        <Link
                            key={href}
                            href={href}
                            className={`flex items-center space-x-1 px-[16px] py-[8px] rounded-[16px] gap-[10px] transition font-sans text-[14px] ${
                                isActive(href)
                                    ? "bg-[#E4EDFF] bg-opacity-[20%] text-whiteColor"
                                    : "text-primary-50 hover:text-whiteColor"
                            }`}
                        >
                            <Image src={icon} alt={`${label} Icon`} width={24} height={24} />
                            <span>{label}</span>
                        </Link>
                    ))}
                </div>

                {/* Sign In */}
                <div className="flex items-center">
                    <Link
                        href={googleLoginUrl}
                        className={`flex items-center text-whiteColor px-[16px] py-[8px] rounded-[16px] bg-primary-800 hover:bg-blue-700 transition gap-[10px]
                        }`}
                    >
                        <Image src="/icons/login-03.svg" alt="Sign In Icon" width={24} height={24} />
                        <span className="text-neutral-50">Sign in</span>
                    </Link>
                </div>
            </div>

            {/* Mobile Menu Toggle */}
            <div className="sm:hidden">
                <button onClick={toggleMenu}>
                    <Image src={menuOpen ? XIcon : MenuIcon} alt="Menu Toggle" width={24} height={24} />
                </button>
            </div>

            {/* Mobile Sidebar */}
            {menuOpen && (
                <div className="sm:hidden fixed top-16 left-0 right-0 bg-primary-950 text-white flex flex-col space-y-4 px-6 py-4 shadow-md z-20 animate-slide-down">
                    {navLinks.map(({ href, label, icon }) => (
                        <Link
                            key={href}
                            href={href}
                            onClick={toggleMenu}
                            className={`flex items-center gap-2 px-4 py-2 rounded-[12px] ${
                                isActive(href) ? "bg-[#E4EDFF] bg-opacity-[20%]" : ""
                            }`}
                        >
                            <Image src={icon} alt={`${label} Icon`} width={24} height={24} />
                            <span>{label}</span>
                        </Link>
                    ))}

                    <Link
                        href={googleLoginUrl}
                        onClick={toggleMenu}
                        className={`flex items-center gap-2 px-4 py-2 rounded-[12px]
                        }`}
                    >
                        <Image src="/icons/login-03.svg" alt="Sign In Icon" width={24} height={24} />
                        <span>Sign in</span>
                    </Link>
                </div>
            )}
        </nav>
    );
}
