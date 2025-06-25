"use client";

import { useRouter } from "next/navigation";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Bell, Mail, Users, User, Home, MessageSquare, LayoutDashboard, ChevronDown, LogOut } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Image from "next/image";
import Link from "next/link";
import Button from "@/Usercomponents/Button";
import { useUserStore } from "@/stores/userStore";
import MenuIcon from "/public/icons/menu-11.svg";
import XIcon from "/public/icons/cancel-01.svg";
import {logout} from "@/lib/auth";
import { useFilterStore } from "@/stores/filterStore";

//community removed
const navLinks = [
  { href: "/dashboard", label: "Personal", icon: "/icons/user-lock-01.svg" },
];

const NavbarDashboard = () => {
    const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
    const [statusFilter, setStatusFilter] = useState("All");
    const setFilter = useFilterStore((state) => state.setFilter);
    const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const user = useUserStore((state) => state.user);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const isActive = (href: string) => pathname === href;

  const tabClass = (active: boolean) =>
    `flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
      active
        ? 'bg-blue-600 bg-opacity-50 border-blue-400 border-opacity-30'
        : 'hover:bg-white hover:bg-opacity-10 border-transparent'
    }`;

  return (
    <nav className="sticky top-0 left-0 right-0 z-20 bg-gradient-to-r from-blue-900 via-blue-800 to-purple-900 h-[72px] px-6 py-4 flex items-center justify-between text-white w-full shadow-lg">
      {/* Left Section - Logo and Navigation */}
      <div className="flex items-center space-x-8">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2 cursor-pointer">
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


          {/* Filter Dropdowns */}
          <div className="flex gap-2">
              {/* Status Filter */}
              <div className="relative z-[5]">
                  <button
                      onClick={() => {
                          setStatusDropdownOpen(!statusDropdownOpen);
                      }}
                      className="flex items-center gap-[10px] px-[8px] py-[8px] w-[145px] h-[36px] text-sm border border-primary-950 rounded-[12px] bg-primary-950 hover:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                      <span className="text-white text-body font-sans">Status:</span>
                      <span className="text-white font-medium font-sans truncate text-ellipsis">{statusFilter}</span>
                      <Image
                          src="/icons/arrow-down-01.svg"
                          alt='Dropdown icon'
                          height={18}
                          width={18}
                      />
                  </button>

                  {statusDropdownOpen && (
                      <div className="absolute top-full left-0 mt-1 w-full bg-primary-950 border border-gray-200 rounded-md shadow-lg z-20">
                          {['All', 'Open', 'In Progress', 'Escalated', 'Resolved'].map((status) => (
                              <button
                                  key={status}
                                  onClick={() => {
                                      setStatusFilter(status);       // Update local display
                                      setFilter(status);            // ✅ Update Zustand store
                                      setStatusDropdownOpen(false); // Close dropdown
                                  }}
                                  className="w-full text-left px-3 py-2 text-sm hover:bg-primary-800 focus:outline-none focus:bg-primary-800"
                              >
                                  {status}
                              </button>
                          ))}
                      </div>
                  )}
              </div>

          </div>

      {/* Center - Quick Navigation Icons (Desktop) */}
      <div className="hidden sm:flex flex-1 justify-center space-x-6">
        {navLinks.slice(2).map(({ href, label, icon }) => (
          <button
            key={href}
            onClick={() => router.push(href)}
            className={`p-2 rounded-lg transition-colors ${isActive(href) ? 'bg-white bg-opacity-20' : 'hover:bg-white hover:bg-opacity-10'}`}
            aria-label={label}
          >
            {icon.endsWith('.svg') ? (
              <Image src={icon} alt={`${label} Icon`} width={20} height={20} />
            ) : (
              <Home className="w-5 h-5 text-white" />
            )}
          </button>
        ))}
      </div>

      {/* Right Section - Icons and Profile */}
      <div className="flex items-center space-x-4">
        {/* Mail Icon */}
        <button
          className="p-2 hover:bg-white hover:bg-opacity-10 rounded-lg transition-colors hidden sm:block"
          onClick={() => router.push('/messages')}
          aria-label="Messages"
        >
          <Mail className="w-5 h-5 text-white" />
        </button>

        {/* Notification Icon */}
        <button
          className="p-2 hover:bg-white hover:bg-opacity-10 rounded-lg transition-colors relative hidden sm:block"
          onClick={() => router.push('/notifications')}
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5 text-white" />
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
        </button>

        {/* Profile Section - Desktop */}
        <div className="hidden sm:flex items-center space-x-2">
          <DropdownMenu user={user} />
          <div className="text-right hidden md:block">
            <div className="text-white font-medium text-sm">
              {user?.fullName ? user.fullName.split(" ").slice(0, 2).join(" ") : "User"}
            </div>
            <div className="text-blue-200 text-xs">{user?.role || "Student"}</div>
          </div>
        </div>

        {/* Mobile Toggle Button */}
        <div className="sm:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? (
              <XIcon className="w-6 h-6 text-white" />
            ) : (
              <MenuIcon className="w-6 h-6 text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Sidebar */}
      {menuOpen && (
        <div className="sm:hidden fixed top-[72px] left-0 right-0 bg-gradient-to-b from-blue-900 to-purple-900 px-6 py-4 z-30 flex flex-col space-y-4 animate-slide-down shadow-md">
          {navLinks.map(({ href, label, icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-[12px] ${
                isActive(href) ? "bg-white bg-opacity-20" : ""
              }`}
            >
              {icon.endsWith('.svg') ? (
                <Image src={icon} alt={`${label} Icon`} width={24} height={24} />
              ) : (
                <User className="w-5 h-5" />
              )}
              <span className="text-white">{label}</span>
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
                {/* Mobile Logout Button */}
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
      </nav>
  );
};

export default NavbarDashboard;

// Icons for mobile menu
const MenuIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const XIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);