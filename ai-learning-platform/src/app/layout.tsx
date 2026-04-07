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
  title: "AI Fluency Lab — Practical AI Training for Non-Technical Professionals",
  description:
    "Stop treating AI like a search bar. Join a 6-week cohort that turns non-technical professionals into confident AI users. Early-bird pricing available.",
  openGraph: {
    title: "AI Fluency Lab — Practical AI Training for Professionals",
    description:
      "6-week cohort-based AI training. Go from AI-curious to AI-confident.",
    type: "website",
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
