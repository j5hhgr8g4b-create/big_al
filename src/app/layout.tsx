import type { Metadata } from 'next';
import './globals.css';
import { BottomNav } from '@/components/bottom-nav';

export const metadata: Metadata = {
  title: 'Big Al',
  description: 'A living cookbook designed to make cooking easy and enjoyable.'
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-GB">
      <body>
        <main className="mx-auto min-h-screen max-w-md bg-cream shadow-2xl shadow-gravy/10">
          {children}
          <BottomNav />
        </main>
      </body>
    </html>
  );
}
