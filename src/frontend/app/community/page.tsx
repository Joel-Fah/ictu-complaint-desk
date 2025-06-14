<<<<<<< HEAD
"use client";  
import React from "react";

export default function CommunityPage() {
  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold mb-4">Community Page</h1>
      <p>Welcome to the Community tab content!</p>
    </main>
  );
=======
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
>>>>>>> 7b32ef82e65d2cafc28c764b5d04e1ff63c5d65d
}
