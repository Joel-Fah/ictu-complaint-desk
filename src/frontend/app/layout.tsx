import type { Metadata } from "next";
import "./globals.css";
import UserProvider from '@/Usercomponents/userProvider';
import React from "react";
import { Toaster } from "@/components/ui/sonner";
import LayoutWrapper from "@/Usercomponents/LayoutWrapper";
import ReactQueryProvider from "@/providers/ReactQueryProvider";


export const metadata: Metadata = {
  title: "The ICTU Complaint Desk: A CRS for the ICT University",
  description:
    "Enter our Complaint Resolution System (CRS), The ICTU Complaint Desk – a simple, structured way for students to submit, track, and resolve issues with real-time updates.",
  metadataBase: new URL("https://ictucd.live"),
  openGraph: {
    type: "website",
    url: "https://ictucd.live",
    title: "The ICTU Complaint Desk: A CRS for the ICT University",
    description:
      "Enter our Complaint Resolution System (CRS), The ICTU Complaint Desk – a simple, structured way for students to submit, track, and resolve issues with real-time updates.",
    images: [
      {
        url: "https://raw.githubusercontent.com/Joel-Fah/images/refs/heads/main/ictucd-meta-img.png",
        width: 1200,
        height: 630,
        alt: "ICTU Complaint Desk Preview Image",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The ICTU Complaint Desk: A CRS for the ICT University",
    description:
      "Enter our Complaint Resolution System (CRS), The ICTU Complaint Desk – a simple, structured way for students to submit, track, and resolve issues with real-time updates.",
    images: [
      "https://raw.githubusercontent.com/Joel-Fah/images/refs/heads/main/ictucd-meta-img.png",
    ],
  },
  themeColor: "#050041",
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://ictucd.live",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>
        <Toaster />
        <UserProvider>
          <ReactQueryProvider>
            <LayoutWrapper>{children}</LayoutWrapper>
          </ReactQueryProvider>
        </UserProvider>
      </body>
    </html>
  );
}
