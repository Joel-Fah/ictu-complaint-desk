"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from 'sonner';
import {updateStudentProfile} from "@/lib/api";
import ToastNotification from "@/Usercomponents/ToastNotifications";
import {DialogTitle} from "@/components/ui/dialog";

export function DrawerDialogDemo({ onSuccess }: { onSuccess?: () => void }) {
    const [open, setOpen] = React.useState(false)

    return (
        <Drawer open={open} onOpenChange={setOpen} direction="bottom">
            <DrawerTrigger asChild>
                <Button variant="outline" className="border-primary-950 rounded-[20px]">Enter Your ICTU Matricule</Button>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader className="text-left bg-primary-50 rounded-t-[20px]">
                    <DialogTitle>Complete Profile</DialogTitle>
                    <DrawerDescription>
                        This helps us track which complaints belong to you. Click Save changes when you&apos;re done.
                    </DrawerDescription>
                </DrawerHeader>
                <ProfileForm className="px-4 bg-primary-50" onSuccess={onSuccess} />
                <DrawerFooter className="pt-2 bg-primary-50 rounded-b-[20px]">
                    <DrawerClose asChild>
                        <Button variant="outline" className="border-primary-950 hover:bg-greyColor">Cancel</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}

function ProfileForm({ className, onSuccess }: React.ComponentProps<"form"> & { onSuccess?: () => void }) {
    const [studentNumber, setStudentNumber] = React.useState("");
    const [loading, setLoading] = React.useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
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
        } catch (err) {
            toast.custom((t) => (
                <ToastNotification
                    type="error"
                    title="Failed to add student matricule"
                    subtitle="Something went wrong!."
                    onClose={() => toast.dismiss(t)}
                    showClose
                />
            ), { duration: 4000 });
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={cn("grid items-start gap-6 bg-primary-50", className)}>
            <div className="grid gap-3">
                <Label htmlFor="student_number">Your Matricule</Label>
                <Input id="student_number"
                       value={studentNumber}
                       onChange={(e) => setStudentNumber(e.target.value)}
                       placeholder="ICTU2023xxxx"
                       className="bg-whiteColor"
                />
            </div>
            <Button type="submit" className="bg-primary-800 text-whiteColor hover:bg-primary-400" disabled={loading}>
                {loading ? "Saving..." : "Save changes"}
            </Button>
        </form>
    )
}
