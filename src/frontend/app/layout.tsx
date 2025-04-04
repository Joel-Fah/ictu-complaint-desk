import type { Metadata } from "next";
import { Belanosima } from "next/font/google";
import "./globals.css";

const belanosima = Belanosima({
  variable: "--font-belanosima",
  subsets: ["latin"],
  weight: ["400", "700"],
});

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
      <body className={`${belanosima.variable}`}>{children}</body>
    </html>
  );
}
