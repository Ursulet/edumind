import { ReactNode } from "react";
import { NotificationBell } from "@/components/notification-bell";

export default function ParentShellLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-ivory-background">
      <header className="sticky top-0 z-40 w-full border-b border-border bg-primary-ink text-warm-surface shadow-[0_1px_2px_rgba(31,38,34,0.05)]">
        <div className="container flex h-16 items-center px-4">
          <span className="text-xl font-bold">EduCarieră | Portal Părinți</span>
          <nav className="ml-auto flex items-center gap-4">
            <NotificationBell />
          </nav>
        </div>
      </header>
      <main className="flex-1 p-4 md:p-8">{children}</main>
    </div>
  );
}
