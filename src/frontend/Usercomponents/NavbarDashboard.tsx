"use client";

import { usePathname } from "next/navigation";
import React, {useEffect, useState} from "react";
import Image from "next/image";
import Link from "next/link";
import Button from "@/Usercomponents/Button";
import { useUserStore } from "@/stores/userStore";
import MenuIcon from "/public/icons/menu-11.svg";
import XIcon from "/public/icons/cancel-01.svg";
import {logout} from "@/lib/auth";

const navLinks = [
  { href: "/dashboard", label: "Personal", icon: "/icons/user-lock-01.svg" },
  { href: "/dashboard/community", label: "Community", icon: "/icons/user-multiple-stroke-rounded-1.svg" },
];

const NavbarDashboard = () => {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const user = useUserStore((state) => state.user);
  const [dropdownOpen, setDropdownOpen] = useState(false);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (!target.closest(".profile-dropdown")) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);



    const isActive = (href: string) => pathname === href;

  return (
      <nav className="sticky top-0 left-0 right-0 z-20 bg-primary-950 h-[72px] px-6 py-4 flex items-center justify-between text-white w-full">
        {/* Left: Logo */}
        <div className="flex items-center space-x-8">
          <Image
              src="/images/logo-text-white.png"
              alt="ICTU Logo"
              width={92.94}
              height={40}
              className="w-[80px] md:w-[92.94px] h-auto"
          />
            {/* Desktop Nav */}
            <div className="hidden sm:flex justify-start space-x-4">
                {navLinks.map(({ href, label, icon }) => (
                    <Link
                        key={href}
                        href={href}
                        className={`flex items-center space-x-1 w-[123px] h-[40px] px-4 py-2 rounded-[16px] text-sm transition gap-[10px] ${
                            isActive(href) ? "bg-primary-800 text-white" : "text-primary-50 hover:text-whiteColor"
                        }`}
                    >
                        <Image src={icon} alt={`${label} Icon`} width={24} height={24} />
                        <span>{label}</span>
                    </Link>
                ))}
            </div>
        </div>


        {/* Right: Profile and Icons (Desktop) */}
        <div className="hidden sm:flex items-center space-x-[-30px]">
          <Button
              onClick={() => {}}
              width={"26px"}
              leftImageSrc={"/icons/mail-02.svg"}
              leftImageAlt={"Mail Icon"}
              leftImageWidth={24}
              leftImageHeight={24}
              bgColor={"bg-transparent"}
              borderRadius={"rounded-full"}
              text={""}
              border={"border-none"}
          />

          <Button
              onClick={() => {}}
              width={"26px"}
              leftImageSrc={"/icons/notification-03.svg"}
              leftImageAlt={"Notification Icon"}
              leftImageWidth={24}
              leftImageHeight={24}
              bgColor={"bg-transparent"}
              borderRadius={"rounded-full"}
              text={""}
              border={"border-none"}
              leftImageClassName={"mr-7"}
          />

          {user?.picture && (
              <div className="relative profile-dropdown">
                  <button onClick={() => setDropdownOpen(!dropdownOpen)}>
                      <Image
                          src={user.picture}
                          alt="Profile"
                          width={40}
                          height={40}
                          className="rounded-full shadow-md mr-9"
                      />
                  </button>
                  {dropdownOpen && (
                      <div className="absolute z-40 bg-white border rounded-md shadow-md">
                          {/* Logout button */}
                          <button
                              onClick={() => {
                                  sessionStorage.removeItem('loginToastShown');
                                  logout();
                              }}
                              className="px-4 py-2 bg-error text-white rounded hover:bg-red-700"
                          >
                              Logout
                          </button>
                      </div>
                  )}
              </div>

          )}
          <div className="text-right">
            <div className="text-primary-100 font-heading text-[18.77px] font-semibold">{user?.fullName ? user.fullName.split(" ").slice(0, 2).join(" ") : "User"}</div>
            <div className="text-primary-100 text-[9.38px] font-sans">{user?.role || "student"}</div>
          </div>
        </div>

        {/* Mobile Toggle Button */}
        <div className="sm:hidden">
          <button onClick={toggleMenu}>
            <Image src={menuOpen ? XIcon : MenuIcon} alt="Menu Toggle" width={24} height={24} />
          </button>
        </div>

        {/* Mobile Sidebar */}
        {menuOpen && (
            <div className="sm:hidden fixed top-[64px] left-0 right-0 bg-primary-950 px-6 py-4 z-30 flex flex-col space-y-4 animate-slide-down shadow-md">
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

              <div className="flex items-center gap-2 px-4 py-2 truncate text-ellipsis">
                {user?.picture && (
                    <Image
                        src={user.picture}
                        alt="Profile"
                        width={32}
                        height={32}
                        className="rounded-full shadow-md"
                    />
                )}
                  <div className="text-left">
                      <div className="font-medium text-sm truncate text-ellipsis">
                          {user?.fullName ? user.fullName.split(" ").slice(0, 2).join(" ") : "User"}
                      </div>
                      <div className="text-blue-200 text-xs">{user?.role || "Student"}</div>
                  </div>
              </div>
            </div>
        )}
      </nav>
  );
};

export default NavbarDashboard;
