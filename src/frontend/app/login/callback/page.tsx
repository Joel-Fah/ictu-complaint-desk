import { Suspense } from 'react';
import LoginCallbackPage from './_components/LoginCallbackPage';

export default function Page() {
    return (
        <Suspense fallback={<div className="p-4">Processing login...</div>}>
            <LoginCallbackPage />
        </Suspense>
    );
}
