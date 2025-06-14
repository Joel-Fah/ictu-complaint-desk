import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { updateStudentProfile } from "@/lib/api";
import ToastNotification from "@/Usercomponents/ToastNotifications";
import { useUserStore } from "@/stores/userStore";

export default function CompleteProfileForm({
                                                onSuccess,
                                                className,
                                            }: {
    onSuccess?: () => void;
    className?: string;
}) {
    const [studentNumber, setStudentNumber] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    const fetchUser = useUserStore((state) => state.fetchUser);
    const userId = useUserStore((state) => state.user?.id);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (!userId) return;
            await updateStudentProfile({ student_number: studentNumber });
            if (userId) {
                await fetchUser(userId); // Refresh user state
            }
            toast.custom(
                (t) => (
                    <ToastNotification
                        type="success"
                        title="Student matricule added successfully!"
                        subtitle="Now you can get on with your complaints."
                        onClose={() => toast.dismiss(t)}
                        showClose
                    />
                ),
                { duration: 4000 }
            );

            if (onSuccess) onSuccess();
        } catch (err) {
            toast.custom(
                (t) => (
                    <ToastNotification
                        type="error"
                        title="Failed to add student matricule"
                        subtitle="Something went wrong!."
                        onClose={() => toast.dismiss(t)}
                        showClose
                    />
                ),
                { duration: 4000 }
            );
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className={cn("max-w-md mx-auto mt-16 p-8 bg-primary-50 rounded-xl shadow", className)}
        >
            <h1 className="text-2xl font-heading mb-4 text-primary-900">Complete Your Profile</h1>
            <div className="grid gap-3 mb-6">
                <Label htmlFor="student_number">Your Matricule</Label>
                <Input
                    id="student_number"
                    value={studentNumber}
                    onChange={(e) => setStudentNumber(e.target.value)}
                    placeholder="ICTU2023xxxx"
                    className="bg-whiteColor"
                />
            </div>
            <Button
                type="submit"
                className="bg-primary-800 text-whiteColor hover:bg-primary-400 w-full"
                disabled={loading}
            >
                {loading ? "Saving..." : "Save changes"}
            </Button>
        </form>
    );
}
