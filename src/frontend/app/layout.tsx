import type { Metadata } from "next";
import "./globals.css";
import UserProvider from '@/Usercomponents/userProvider';
import FaviconSwitcher from "@/Usercomponents/faviconSwitcher";
import React from "react";
import { Toaster } from "@/components/ui/sonner"

export const metadata: Metadata = {
  title: "ICTU Complaint Desk",
  description: "A platform for reporting and managing complaints",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
      <Toaster />
       <FaviconSwitcher />
       <UserProvider>{children}</UserProvider>
      </body>
    </html>
  );
}
