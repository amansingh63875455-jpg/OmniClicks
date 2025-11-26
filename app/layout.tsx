import type { Metadata, Viewport } from "next";
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
  title: "OmniClicks - Daily Intelligence",
  description: "Aggregated news, history, hackathons, and jobs for finance professionals. Your daily dashboard for the fintech world.",
  openGraph: {
    title: "OmniClicks - Daily Intelligence",
    description: "Aggregated news, history, hackathons, and jobs for finance professionals.",
    type: "website",
    locale: "en_US",
    siteName: "OmniClicks",
  },
  twitter: {
    card: "summary_large_image",
    title: "OmniClicks - Daily Intelligence",
    description: "Aggregated news, history, hackathons, and jobs for finance professionals.",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
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
        {children}
      </body>
    </html>
  );
}
