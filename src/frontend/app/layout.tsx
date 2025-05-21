import type { Metadata } from "next";
import "./globals.css";
import UserProvider from '@/Usercomponents/userProvider';
import FaviconSwitcher from "@/Usercomponents/faviconSwitcher";
import React from "react";

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
      <body>
       <FaviconSwitcher />
       <UserProvider>{children}</UserProvider>
      </body>
    </html>
  );
}
