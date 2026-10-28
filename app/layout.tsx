import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Parth Lunagaria | Senior Software Engineer",
  description: "Official portfolio of Parth Lunagaria, a Senior Software Engineer with 5 years 8 months of experience building high-performance iOS and Android applications with React Native.",
  keywords: ["Parth Lunagaria", "Senior Software Engineer", "React Native", "iOS", "Android", "Mobile App Developer", "Ahmedabad", "Next.js Portfolio"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-50 transition-colors duration-300">
        {children}
      </body>
    </html>
  );
}
