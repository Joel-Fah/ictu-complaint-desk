'use client';
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function LoginCallbackPage() {
    const searchParams = useSearchParams();
    const router = useRouter();

    useEffect(() => {
        const token = searchParams.get('access_token');

        if (token) {
            localStorage.setItem('access_token', token);
            router.push('/dashboard'); // or wherever your user should go next
        } else {
            router.push('/login?error=missing_token');
        }
    }, [router, searchParams]);

    return <p>Logging you in...</p>;
}
