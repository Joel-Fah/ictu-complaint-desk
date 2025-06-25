import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { updateStudentProfile } from "@/lib/api";
import ToastNotification from "@/Usercomponents/ToastNotifications";

export function StudentMatriculeForm({ onSuccess }: { onSuccess?: () => void }) {
    const [studentNumber, setStudentNumber] = React.useState("");
    const [loading, setLoading] = React.useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!studentNumber) return;
        setLoading(true);
        try {
            await updateStudentProfile({ student_number: studentNumber });
            toast.custom((t) => (
                <ToastNotification
                    type="success"
                    title="Student matricule added successfully!"
                    subtitle="Now you can get on with your complaints."
                    onClose={() => toast.dismiss(t)}
                    showClose
                />
            ), { duration: 4000 });
            if (onSuccess) onSuccess();
        } catch{
            toast.custom((t) => (
                <ToastNotification
                    type="error"
                    title="Failed to add student matricule"
                    subtitle="Something went wrong!"
                    onClose={() => toast.dismiss(t)}
                    showClose
                />
            ), { duration: 4000 });
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="p-4 mt-4 w-full max-w-md mx-auto bg-secondary-100 border-l-4 border-secondary-500 text-primary-950 font-sans rounded shadow-sm"
        >
            <p className="mb-2 font-medium">We need your student number to complete your profile.</p>
            <div className="mb-3">
                <Label htmlFor="student_number">Your Matricule</Label>
                <Input
                    id="student_number"
                    placeholder="ICTU2023xxxx"
                    className="bg-whiteColor mt-1"
                    value={studentNumber}
                    onChange={(e) => setStudentNumber(e.target.value)}
                />
            </div>
            <Button
                type="submit"
                className="bg-primary-800 text-whiteColor hover:bg-primary-400"
                disabled={loading}
            >
                {loading ? "Saving..." : "Save changes"}
            </Button>
        </form>
    );
}
