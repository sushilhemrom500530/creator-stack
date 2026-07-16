import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../styles/style.globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: "Creator Stack - track all social media in one place",
  description:
    "Track all your social media in one place. Creator Stack is a social media management tool that helps you track all your social media in one place.",
  keywords: [
    "social media management",
    "social media tracking",
    "social media analytics",
    "social media scheduling",
    "social media posting",
    "social media engagement",
    "social media growth",
    "social media marketing",
    "social media strategy",
    "social media tools",
  ],
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
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
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
