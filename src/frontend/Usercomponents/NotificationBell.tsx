"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useUserStore } from "@/stores/userStore";
import { useNotifications, useMarkNotificationAsRead } from "@/hooks/useNotifications";
import {Notification} from "@/lib/api";

export default function NotificationBell() {
    const [isOpen, setIsOpen] = useState(false);
    const user = useUserStore((state) => state.user);
    const { data: allNotifications = [], refetch } = useNotifications(user?.id);
    const markAsReadMutation = useMarkNotificationAsRead();

    // Only show unread
    const unread = allNotifications.filter((n:Notification) => !n.is_read);
    const unreadCount = unread.length;

    // Play a sound when there are new unread notifications
    useEffect(() => {
        if (unreadCount > 0) {
            const audio = new Audio("/sounds/notification.mp3");
            audio.play().catch(() => {
                // Ignore play errors (e.g., if user hasn't interacted yet)
            });
        }
    }, [unreadCount]);

    const handleClick = async () => {
        if (!user) return;

        if (isOpen) {
            // When closing: mark all as read
            await Promise.allSettled(unread.map((n:Notification) => markAsReadMutation.mutateAsync(n.id)));
            await refetch();
        } else {
            // When opening: fetch latest
            await refetch();
        }

        setIsOpen(!isOpen);
    };

    return (
        <div className="relative mr-8">
            <button
                onClick={handleClick}
                className="relative focus:outline-none focus:ring-primary-500"
            >
                <Image
                    src="/icons/notification-03.svg"
                    alt="Notifications"
                    width={32}
                    height={32}
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
                        unread.map((n:Notification) => (
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
