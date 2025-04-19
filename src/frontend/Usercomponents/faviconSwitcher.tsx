'use client';

import { useEffect } from 'react';

const FaviconSwitcher = () => {
    const setFavicon = (src: string) => {
        let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
        if (!link) {
            link = document.createElement('link');
            link.rel = 'icon';
            document.head.appendChild(link);
        }
        link.href = src;
    };

    useEffect(() => {
        const updateFavicon = () => {
            if (navigator.onLine) {
                setFavicon('/icons/ictucd-online.ico');
            } else {
                setFavicon('/icons/ictucd-offline.ico');
            }
        };

        updateFavicon(); // initial check

        window.addEventListener('online', updateFavicon);
        window.addEventListener('offline', updateFavicon);

        return () => {
            window.removeEventListener('online', updateFavicon);
            window.removeEventListener('offline', updateFavicon);
        };
    }, []);

    return null; // this component only manipulates the DOM
};

export default FaviconSwitcher;
