import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "../lib/assets/css/loader.css";
import "../lib/assets/css/scroll.css";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { AuthProvider } from "@/lib/context/AuthContext";
import { NotificationProvider } from "@/lib/context/NotificationContext";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Automated Workflow Builder",
  description: "Build and automate workflows with ease.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Toaster />
        <AuthProvider>
          <NotificationProvider>
            <NuqsAdapter>{children}</NuqsAdapter>
          </NotificationProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
