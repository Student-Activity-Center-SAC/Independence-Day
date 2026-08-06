import type { Metadata } from "next";
import { Cinzel, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import SmoothScroll from "@/components/SmoothScroll";
import AuthProvider from "@/components/AuthProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "600", "700", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "80th Independence Day – KL University SAC",
  description:
    "Celebrate India's 80th Independence Day at KL University with competitions, cultural events, and patriotic pride. Register now!",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} ${cinzel.variable}`}>
      <head>
        {/* Establish connection to video host before the page renders */}
        <link rel="preconnect" href="https://nischalsingana.com" />
        <link rel="dns-prefetch" href="https://nischalsingana.com" />
        <link rel="preload" href="https://nischalsingana.com/0805.mp4" as="video" type="video/mp4" />
      </head>
      <body className="bg-[#07070E] text-[#F0EFE8] overflow-x-hidden">
        <AuthProvider>
          <SmoothScroll>
            <Navbar />
            <main>{children}</main>
          </SmoothScroll>
        </AuthProvider>
      </body>
    </html>
  );
}
