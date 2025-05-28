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