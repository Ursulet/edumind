import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CookieBanner } from "../components/cookie-banner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "EduMind",
  description: "Platforma integrată de orientare profesională",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ro"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        {children}
        <CookieBanner />
      </body>
    </html>
  );
}
