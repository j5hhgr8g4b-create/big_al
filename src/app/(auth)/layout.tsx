import type { ReactNode } from "react";

export default function AuthLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <main className="mx-auto flex min-h-screen max-w-md items-center px-5 py-10">
      <div className="w-full">{children}</div>
    </main>
  );
}
