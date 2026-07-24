import { ReactNode } from "react";

export default function StaffShellLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-ivory-background">
      <aside className="fixed inset-y-0 left-0 z-20 w-64 border-r border-border bg-warm-surface">
        <div className="flex h-16 items-center border-b border-border px-6">
          <span className="text-lg font-bold text-primary-ink">Portal Consilieri</span>
        </div>
        <nav className="flex flex-col gap-2 p-4">
          {/* Sidebar optimized for cases and calendar */}
          <div className="rounded-md bg-muted-surface px-3 py-2 text-sm font-medium text-primary-text">Cazuri</div>
          <div className="rounded-md px-3 py-2 text-sm font-medium text-muted-text hover:bg-muted-surface">Calendar</div>
        </nav>
      </aside>
      <main className="flex-1 pl-64">
        <header className="flex h-16 items-center border-b border-border bg-warm-surface px-8 shadow-[0_1px_2px_rgba(31,38,34,0.05)]">
          {/* Top header for Staff */}
        </header>
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
