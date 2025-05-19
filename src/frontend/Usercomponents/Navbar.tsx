"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import MenuIcon from '../public/icons/menu-11.svg';
import XIcon from '../public/icons/cancel-01.svg';

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => setMenuOpen((prev) => !prev);

    return (
        <nav className="sticky top-0 left-0 right-0 z-50 w-full bg-primary-950 text-whiteColor px-6 md:px-[100px] py-[16px] flex items-center justify-between">
            {/* Logo - always visible */}
            <div className="flex items-center space-x-2">
                <Image
                    src="/images/logo-text-white.png"
                    alt="ICTU Logo"
                    width={92.94}
                    height={40}
                    className="w-[80px] md:w-[92.94px] h-auto"
                />
            </div>

            {/* Desktop Layout */}
            <div className="hidden sm:flex items-center justify-between w-full">
                {/* Middle - Home + How it works */}
                <div className="flex items-center space-x-4 mx-auto">
                    <Link
                        href="/"
                        className="flex items-center space-x-1 text-primary-50 hover:text-whiteColor transition px-[16px] py-[8px] rounded-[16px] gap-[10px] bg-[#E4EDFF] bg-opacity-[20%]"
                    >
                        <Image src="/icons/home-01.svg" alt="Home Icon" width={24} height={24} />
                        <span className="font-sans text-[14px]">Home</span>
                    </Link>
                    <Link
                        href="/"
                        className="flex items-center space-x-1 text-primary-100 hover:text-whiteColor transition gap-[10px]"
                    >
                        <Image src="/icons/help-circle.svg" alt="Help Icon" width={24} height={24} />
                        <span className="font-sans text-[14px]">How it works?</span>
                    </Link>
                </div>

                {/* Right - Sign In Button */}
                <div className="flex items-center">
                    <Link
                        href="/login"
                        className="flex items-center text-whiteColor px-[16px] py-[8px] rounded-[16px] bg-primary-800 hover:bg-blue-700 transition gap-[10px]"
                    >
                        <Image src="/icons/login-03.svg" alt="Sign In Icon" width={24} height={24} />
                        <span className="text-neutral-50">Sign in</span>
                    </Link>
                </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="sm:hidden">
                <button onClick={toggleMenu} className="text-white">
                    <Image src={menuOpen ? XIcon : MenuIcon} alt={menuOpen ? "Close Menu" : "Open Menu"} width={24} height={24} />
                </button>
            </div>

            {/* Sidebar Overlay for Mobile */}
            {menuOpen && (
                <div className="sm:hidden fixed top-16 left-0 right-0 bg-primary-950 text-white flex flex-col space-y-4 px-6 py-4 shadow-md z-40 animate-slide-down">
                    <Link href="/" onClick={toggleMenu} className="flex items-center gap-2">
                        <Image src="/icons/home-01.svg" alt="Home Icon" width={24} height={24} />
                        <span>Home</span>
                    </Link>
                    <Link href="/" onClick={toggleMenu} className="flex items-center gap-2">
                        <Image src="/icons/help-circle.svg" alt="Help Icon" width={24} height={24} />
                        <span>How it works?</span>
                    </Link>
                    <Link href="/login" onClick={toggleMenu} className="flex items-center gap-2">
                        <Image src="/icons/login-03.svg" alt="Sign In Icon" width={24} height={24} />
                        <span>Sign in</span>
                    </Link>
                </div>
            )}
        </nav>
    );
}
