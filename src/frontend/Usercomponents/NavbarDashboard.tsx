"use client";

import { useRouter } from "next/navigation";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Bell, Mail, Users, User, Home, MessageSquare, LayoutDashboard, ChevronDown, LogOut } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Image from "next/image";
import { useUserStore } from "../stores/userStore";
import { logout } from "../lib/auth";

const navLinks = [
  { href: "/personal", label: "Personal", icon: "/icons/user-lock-01.svg" },
  { href: "/community", label: "Community", icon: "/icons/user-multiple-stroke-rounded-1.svg" },
  { href: "/", label: "Home", icon: "/icons/home-01.svg" },
  { href: "/complaints", label: "Complaints", icon: "/icons/message-chat-circle.svg" },
  { href: "/dashboard", label: "Dashboard", icon: "/icons/layout-grid-01.svg" },
];

const DropdownMenu = ({ user }: { user: any }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

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
    <div className="relative inline-block text-left profile-dropdown" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 hover:bg-white hover:bg-opacity-10 px-2 py-1 rounded-lg transition-colors"
      >
        {user?.picture ? (
          <Image
            src={user.picture}
            alt="Profile"
            width={40}
            height={40}
            className="rounded-full shadow-md"
          />
        ) : (
          <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-sm">
              {user?.fullName ? user.fullName.split(" ").map(n => n[0]).join("") : "US"}
            </span>
          </div>
        )}
        <ChevronDown className="w-4 h-4 text-white" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-md z-50">
          <Link
            href="/profile"
            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <User className="w-4 h-4 mr-2" />
            Profile
          </Link>
          <button
            onClick={() => {
              sessionStorage.removeItem('loginToastShown');
              logout();
            }}
            className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

const NavbarDashboard = () => {
  const router = useRouter();
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
        </Link>

        {/* Desktop Navigation Tabs */}
        <div className="hidden sm:flex items-center space-x-1">
          {navLinks.slice(0, 2).map(({ href, label, icon }) => (
            <button
              key={href}
              onClick={() => router.push(href)}
              className={tabClass(isActive(href))}
            >
              {icon.endsWith('.svg') ? (
                <Image src={icon} alt={`${label} Icon`} width={16} height={16} />
              ) : (
                <User className={`w-4 h-4 ${isActive(href) ? 'text-white' : 'text-white opacity-70'}`} />
              )}
              <span>{label}</span>
            </button>
          ))}
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

          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              {user?.picture ? (
                <Image
                  src={user.picture}
                  alt="Profile"
                  width={40}
                  height={40}
                  className="rounded-full shadow-md"
                />
              ) : (
                <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {user?.fullName ? user.fullName.split(" ").map(n => n[0]).join("") : "US"}
                  </span>
                </div>
              )}
              <div className="text-left">
                <div className="text-white font-medium">
                  {user?.fullName ? user.fullName.split(" ").slice(0, 2).join(" ") : "User"}
                </div>
                <div className="text-blue-200 text-xs">{user?.role || "Student"}</div>
              </div>
            </div>
            <button
              onClick={() => {
                sessionStorage.removeItem('loginToastShown');
                logout();
              }}
              className="text-red-400 hover:text-red-300"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
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