import * as React from "react";
import Button  from "@/Usercomponents/Button";
import { toast } from "sonner";
import ToastNotification from "./ToastNotifications";
import {updateStudentProfile} from "@/lib/api";

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
                <label htmlFor="student_number">Your Matricule</label>
                <input id="student_number"
                       value={studentNumber}
                       onChange={(e) => setStudentNumber(e.target.value)}
                       placeholder="ICTU2023xxxx"
                       className="bg-whiteColor"
                       maxLength={12}
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
