//Prevents unauthorised/users who have not logged in from accessing paths like dashboard
import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAccessToken } from '@/lib/token';

export function withAuth<P extends object>(Component: React.ComponentType<P>) {
    const AuthenticatedComponent = (props: P) => {
        const router = useRouter();

        useEffect(() => {
            const token = getAccessToken();
            if (!token) {
                router.push('/login');
            }
        }, [router]);

        return <Component {...props} />;
    };

    AuthenticatedComponent.displayName = `WithAuth(${Component.displayName || Component.name || 'Component'})`;

    return AuthenticatedComponent;
}
