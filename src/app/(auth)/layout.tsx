import type { ReactNode } from "react";

export default function AuthLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <main className="app-shell">
      <div className="app-main flex min-h-[calc(100vh-104px)] items-center">
        <div className="w-full">{children}</div>
      </div>
    </main>
  );
}
