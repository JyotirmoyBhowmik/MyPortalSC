import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Jyotirmoy Bhowmik — Full-Stack Developer",
    template: "%s | Jyotirmoy Bhowmik",
  },
  description:
    "Portfolio of Jyotirmoy Bhowmik – Full-Stack Developer & Tech Enthusiast. Explore projects, skills, certifications, and achievements.",
  keywords: [
    "Jyotirmoy Bhowmik",
    "Full-Stack Developer",
    "Portfolio",
    "Next.js",
    "React",
    "TypeScript",
    "Supabase",
  ],
  authors: [{ name: "Jyotirmoy Bhowmik" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Jyotirmoy Bhowmik Portfolio",
    title: "Jyotirmoy Bhowmik — Full-Stack Developer",
    description:
      "Explore my projects, skills, and professional journey in software development.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jyotirmoy Bhowmik — Full-Stack Developer",
    description:
      "Explore my projects, skills, and professional journey in software development.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        <Navbar />
        <main className="min-h-screen pt-16">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
