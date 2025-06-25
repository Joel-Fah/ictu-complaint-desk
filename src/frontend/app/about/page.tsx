"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";

export default function TestDrawer() {
    return (
        <div className="p-10">
            <div >
                <p>
                    <Button>Open Drawer</Button>
                </p>
                <div className="bg-primary-800 p-4 rounded-t-lg">
                    <p>Hello world!</p>
                </div>
            </div>
        </div>
    );
}
