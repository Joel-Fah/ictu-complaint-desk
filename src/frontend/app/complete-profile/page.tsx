// app/complete-profile/page.tsx
import { Suspense } from "react";
import CompleteProfilePageContent from "@/Usercomponents/CompleteProfilePageContent";

export const dynamic = "force-dynamic"; // Ensure this page is not statically rendered

export default function CompleteProfilePage() {
    return (
        <Suspense fallback={<div className="p-4">Loading profile...</div>}>
            <CompleteProfilePageContent />
        </Suspense>
    );
}
