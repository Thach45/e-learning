import type { Metadata } from "next";
import {manrope} from "@/utils/index";
import "./globals.css";

import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/mode/theme-provider";
import { Toaster } from "@/components/ui/toaster"

export const metadata: Metadata = {
  title: "E-LearnHub",
  description: "Nền tảng học trực tuyến hàng đầu",
  icons: {
    icon: "/favicon.png"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${manrope.className} ${manrope.className} antialiased h-screen  dark:bg-black`}>
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
