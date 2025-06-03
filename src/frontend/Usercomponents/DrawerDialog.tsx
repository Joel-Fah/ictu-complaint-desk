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
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function DrawerDialogDemo() {
    const [open, setOpen] = React.useState(false)

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <Button variant="outline" className="border-primary-950 rounded-[20px]">Enter Your ICTU Matricule</Button>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader className="text-left bg-primary-50 rounded-t-[20px]">
                    <DrawerTitle>Complete Profile</DrawerTitle>
                    <DrawerDescription>
                        This helps us track which complaints belong to you. Click Save changes when you&apos;re done.
                    </DrawerDescription>
                </DrawerHeader>
                <ProfileForm className="px-4 bg-primary-50" />
                <DrawerFooter className="pt-2 bg-primary-50 rounded-b-[20px]">
                    <DrawerClose asChild>
                        <Button variant="outline" className="border-primary-950 hover:bg-greyColor">Cancel</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    )
}

function ProfileForm({ className }: React.ComponentProps<"form">) {
    return (
        <form className={cn("grid items-start gap-6 bg-primary-50", className)}>
            <div className="grid gap-3">
                <Label htmlFor="student_number">Your Matricule</Label>
                <Input id="student_number" placeholder="ICTU20231414" className="bg-whiteColor"/>
            </div>
            <Button type="submit" className="bg-primary-800 text-whiteColor hover:bg-primary-400">Save changes</Button>
        </form>
    )
}
