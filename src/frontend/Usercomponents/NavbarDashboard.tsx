"use client";

import { useRouter } from "next/navigation";
import React from 'react';
import Link from "next/link";
import { Bell, Mail, Users, User, Home, MessageSquare, LayoutDashboard } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from "react";
import { ChevronDown, LogOut} from "lucide-react";


interface NavbarDashboardProps {}

const DropdownMenu = () => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !(dropdownRef.current as any).contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 transition"
      >
        <span className="font-medium"></span>
        <ChevronDown className="w-4 h-4" />
      </button>

      {/* Dropdown Menu */}
      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-md z-50">
          <a
            href="/profile"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <User className="w-4 h-4 inline mr-2" />
            Profile
          </a>
          <button
            onClick={() => alert("Logging out...")}
            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <LogOut className="w-4 h-4 inline mr-2" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
};
    

const NavbarDashboard: React.FC<NavbarDashboardProps> = () => {

  const router = useRouter();
  const pathname = usePathname();

  // Check which tab is active
  const isPersonalActive = pathname === '/personal';
  const isCommunityActive = pathname === '/community';

  const tabClass = (active: boolean) =>
  `flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
    active
      ? 'bg-blue-600 bg-opacity-50 border-blue-400 border-opacity-30'
      : 'hover:bg-white hover:bg-opacity-10 border-transparent'
  }`;


  return (
    <nav className="bg-gradient-to-r from-blue-900 via-blue-800 to-purple-900 px-6 py-3 flex items-center justify-between shadow-lg">
      {/* Left Section - Logo and Navigation */}
      <div className="flex items-center space-x-8">
        {/* Logo - Now clickable */}
        <Link href="/" className="flex items-center space-x-2 cursor-pointer">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
            <div className="w-6 h-6 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-full"></div>
            </div>
          </div>
          <span className="text-white font-medium text-sm">
            THE ICT<br />
            <span className="text-xs opacity-80">UNIVERSITY</span>
          </span>
        </Link>

        {/* Navigation Tabs */}
        <div className="flex items-center space-x-1">
          {/* Personal Tab */}
          <button
            onClick={() => router.push('/personal')}
            className={tabClass(isPersonalActive)}
          >
            <User className={`w-4 h-4 ${isPersonalActive ? 'text-white' : 'text-white opacity-70'}`} />
            <span>Personal</span>
          </button>

          {/* Community Tab */}
          <button
            onClick={() => router.push('/community')}
            className={tabClass(isCommunityActive)}
          >
            <Users className={`w-4 h-4 ${isCommunityActive ? 'text-white' : 'text-white opacity-70'}`} />
            <span>Community</span>
          </button>
        </div>
      </div>
      {/* Center - Quick Navigation Icons */}
      <div className="flex-1 flex justify-center space-x-6">
        <button 
          onClick={() => router.push('/')}
          className={`p-2 rounded-lg transition-colors ${pathname === '/' ? 'bg-white bg-opacity-20' : 'hover:bg-white hover:bg-opacity-10'}`}
          aria-label="Home"
        >
          <Home className="w-5 h-5 text-white" />
        </button>
        <button 
          onClick={() => router.push('/complaints')}
          className={`p-2 rounded-lg transition-colors ${pathname === '/complaints' ? 'bg-white bg-opacity-20' : 'hover:bg-white hover:bg-opacity-10'}`}
          aria-label="Complaints"
        >
          <MessageSquare className="w-5 h-5 text-white" />
        </button>
        <button 
          onClick={() => router.push('/dashboard')}
          className={`p-2 rounded-lg transition-colors ${pathname === '/dashboard' ? 'bg-white bg-opacity-20' : 'hover:bg-white hover:bg-opacity-10'}`}
          aria-label="Dashboard"
        >
          <LayoutDashboard className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Right Section - Icons and Profile */}
      <div className="flex items-center space-x-4">
        {/* Mail Icon */}
        <button 
          className="p-2 hover:bg-white hover:bg-opacity-10 rounded-lg transition-colors"
          onClick={() => router.push('/messages')}
          aria-label="Messages"
        >
          <Mail className="w-5 h-5 text-white" />
        </button>

        {/* Bell Icon with Notification */}
        <button 
          className="p-2 hover:bg-white hover:bg-opacity-10 rounded-lg transition-colors relative"
          onClick={() => router.push('/notifications')}
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5 text-white" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
        </button>

        {/* Profile Section */}
        <button 
          className="flex items-center space-x-3 hover:bg-white hover:bg-opacity-10 px-2 py-1 rounded-lg transition-colors"
          onClick={() => router.push('/profile')}
          aria-label="User profile"
        >
          <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-sm">JF</span>
          </div>
          <div className="text-right">
            <div className="text-white font-medium text-sm">Joël Fah</div>
            <div className="text-blue-200 text-xs">Student</div>
          </div>
        </button>
        <DropdownMenu/>
      </div>
    </nav>
  );
};

export default NavbarDashboard;


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
  { href: "/community", label: "Community", icon: "/icons/user-multiple-stroke-rounded-1.svg" },
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
                        className={`flex items-center space-x-1 w-[140px] h-[40px] px-4 py-2 rounded-[16px] text-sm transition gap-[10px] ${
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

