"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { getNotifications, markNotificationAsRead } from "@/lib/api";
import { useUserStore } from "@/stores/userStore";
import { Notification } from "@/types/notifications";

export default function NotificationBell() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const user = useUserStore((state) => state.user);

    // Load unread notifications on mount
    useEffect(() => {
        if (!user) return;

        const fetchUnread = async () => {
            const data = await getNotifications();
            const unread = data.filter(
                (n: Notification) => !n.is_read && n.recipient === user.id
            );
            setNotifications(unread);
        };

        fetchUnread();
    }, [user]);

    const handleClick = async () => {
        if (!user) return;

        if (isOpen) {
            // When closing: mark all as read
            await Promise.allSettled(
                notifications.map((n) => markNotificationAsRead(n.id))
            );
            setNotifications([]);
        } else {
            // When opening: fetch latest unread
            const data = await getNotifications();
            const unread = data.filter(
                (n: Notification) => !n.is_read && n.recipient === user.id
            );
            setNotifications(unread);
        }

        setIsOpen(!isOpen);
    };

    const unreadCount = notifications.length;

    return (
        <div className="relative mr-8">
            <button
                onClick={handleClick}
                className="relative focus:outline-none focus:ring-primary-500"
            >
                <Image
                    src="/icons/notification-03.svg"
                    alt="Notifications"
                    width={24}
                    height={24}
                    className="mr-7"
                />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 right-6 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-semibold leading-none text-white bg-red-600 rounded-full">
            {unreadCount}
          </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white text-black border border-gray-200 shadow-xl rounded-lg max-h-80 overflow-y-auto z-50">
                    {unreadCount === 0 ? (
                        <p className="p-4 text-sm text-gray-500">No new notifications.</p>
                    ) : (
                        notifications.map((n) => (
                            <div
                                key={n.id}
                                className="p-3 border-b last:border-none text-sm hover:bg-gray-50 transition"
                            >
                                {n.message}
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
