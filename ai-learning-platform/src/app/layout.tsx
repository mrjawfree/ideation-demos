import type { Metadata } from "next";
import { Playfair_Display, DM_Sans } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
});

const dmSans = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "AI Fluency Lab — Learn AI That Actually Works at Work",
  description:
    "A 6-week cohort course that turns non-technical professionals into confident AI users. Practical, not theoretical.",
  openGraph: {
    title: "AI Fluency Lab — Learn AI That Actually Works at Work",
    description:
      "A 6-week cohort course that turns non-technical professionals into confident AI users.",
    url: "https://ai-learning-platform-isle88.vercel.app",
    siteName: "AI Fluency Lab",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Fluency Lab",
    description:
      "A 6-week cohort course that turns non-technical professionals into confident AI users.",
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
      className={`${playfair.variable} ${dmSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
