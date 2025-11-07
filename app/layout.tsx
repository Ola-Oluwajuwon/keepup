import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { Navbar } from "@/components/ui/Navbar";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "KeepUp | Habit tracking made consistent",
  description:
    "KeepUp helps you stay on top of your resolutions with habits, check-ins, and progress insights.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} bg-slate-50 font-sans text-slate-900 antialiased`}
      >
        <Navbar />
        {children}
      </body>
    </html>
  );
}
