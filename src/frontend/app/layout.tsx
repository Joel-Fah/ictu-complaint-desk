import type { Metadata } from "next";
import "./globals.css";
import UserProvider from '../Usercomponents/userProvider';
import React from "react";
import { Toaster } from "../components/ui/sonner";
import LayoutWrapper from "../Usercomponents/LayoutWrapper";

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
       <UserProvider>
           <LayoutWrapper>{children}</LayoutWrapper>
       </UserProvider>
      </body>
    </html>
  );
}
