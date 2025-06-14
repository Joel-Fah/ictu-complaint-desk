import { Suspense } from 'react';
import DashboardPage from "./_components/DashboardPage";

export default function Dashboard() {
    return (
        <Suspense fallback={<div className="p-4">Loading dashboard...</div>}>
            <DashboardPage />
        </Suspense>
    );
}
