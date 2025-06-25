'use client';

import React, { useEffect } from 'react';
import { getUser } from '../lib/api';
import { getAccessToken } from '../lib/token';
import { useUserStore } from '../stores/userStore';
import FaviconSwitcher from "../Usercomponents/faviconSwitcher";

export default function UserProvider({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        (async () => {
            const token = getAccessToken();
            if (!token) return;

            try {
                const user = await getUser(token);
                useUserStore.getState().setUser(user);
            } catch (err) {
                console.error('User fetch failed:', err);
            }
        })();
    }, []);

    return <><FaviconSwitcher/>{children}</>;
}
