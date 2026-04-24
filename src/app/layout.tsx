import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { AuthSessionProvider } from "@/components/session-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Alfredo — Dinner for the group, booked.",
  description:
    "A Discord bot that reads your group chat, checks tagged friends' availability, and books the perfect restaurant. No app switching, no coordination.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-bg text-ink">
          <AuthSessionProvider>{children}</AuthSessionProvider>
        </body>
    </html>
  );
}
