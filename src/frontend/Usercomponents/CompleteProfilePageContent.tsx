"use client";

import { useSearchParams } from "next/navigation";
import CompleteProfileForm from "@/Usercomponents/CompleteProfileForm";

export default function CompleteProfilePageContent() {
    const searchParams = useSearchParams();
    const redirect = searchParams.get("redirect") || "/dashboard";

    return (
        <CompleteProfileForm
            onSuccess={() => {
                window.location.href = redirect;
            }}
        />
    );
}
