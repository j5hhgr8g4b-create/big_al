import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

import { BottomNav } from "@/components/bottom-nav";

import "./globals.css";

export const metadata: Metadata = {
  title: "Big Al",
  description: "Your mobile-first cooking companion.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f7f3eb",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <div className="mx-auto min-h-screen max-w-md bg-[var(--surface)] shadow-sm">
          <main className="min-h-screen px-5 pb-28 pt-8">{children}</main>
          <BottomNav />
        </div>
      </body>
    </html>
  );
}
