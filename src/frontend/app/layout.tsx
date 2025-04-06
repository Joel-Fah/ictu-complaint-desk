import type { Metadata } from "next";
import "./globals.css";

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
      <body>{children}</body>
    </html>
  );
}
