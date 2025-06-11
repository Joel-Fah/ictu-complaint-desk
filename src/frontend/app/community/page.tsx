"use client";
import * as React from "react";
import { Drawer, DrawerTrigger, DrawerContent } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

export default function TestDrawer() {
    const [open, setOpen] = React.useState(false);
    return (
        <div className="p-10">
            <Drawer open={open} onOpenChange={setOpen} direction="bottom">
                <DrawerTrigger asChild>
                    <Button onClick={() => setOpen(true)}>Open Drawer</Button>
                </DrawerTrigger>
                <DrawerContent className="bg-primary-800 p-4 rounded-t-lg">
                    <p>Hello world!</p>
                </DrawerContent>
            </Drawer>
        </div>
    );
}
