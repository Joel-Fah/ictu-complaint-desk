"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { getNotifications, markNotificationAsRead } from "@/lib/api";
import { useUserStore } from "@/stores/userStore";
import { Notification } from "@/types/notifications";

export default function NotificationBell() {
    const [notifications, setNotifications] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [hasUnread, setHasUnread] = useState(false);
    const user = useUserStore((state) => state.user);

    // Initial load
    useEffect(() => {
        const fetchNotifications = async () => {
            if (!user) return;
            const data = await getNotifications();
            const unread = data.filter((n:Notification) => !n.is_read);
            setNotifications(unread);
            setHasUnread(unread.length > 0);
        };
        fetchNotifications();
    }, [user]);

    const handleClick = async () => {
        if (!user) return;

        if (isOpen) {
            // Closing: mark as read
            await Promise.all(
                notifications.map((n: Notification) => markNotificationAsRead(n.id))
            );
            setHasUnread(false);
            setNotifications([]);
        } else {
            // Opening: load unread
            const data = await getNotifications();
            const unread = data.filter((n: Notification) => !n.is_read && n.recipient === user.id);
            setNotifications(unread);
            setHasUnread(unread.length > 0);
        }

        setIsOpen(!isOpen);
    };


    return (
        <div className="relative mr-8">
            <button onClick={handleClick} className="relative">
                <Image
                    src="/icons/notification-03.svg"
                    alt="Notifications"
                    width={24}
                    height={24}
                    className="mr-7"
                />
                {hasUnread && (
                    <span className="absolute -top-0.5 right-7 block h-2 w-2 rounded-full bg-red-600"></span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white text-black border border-gray-200 shadow-lg rounded-lg max-h-80 overflow-y-auto z-50">
                    {notifications.length === 0 ? (
                        <p className="p-4 text-sm text-gray-500">No new notifications.</p>
                    ) : (
                        notifications.map((n:Notification) => (
                            <div key={n.id} className="p-3 border-b last:border-none text-sm">
                                {n.message}
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
