import { ReactNode } from "react";

export default function ControlCenterShellLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-ivory-background">
      <aside className="fixed inset-y-0 left-0 z-20 w-64 border-r border-border bg-primary-ink text-warm-surface">
        <div className="flex h-16 items-center border-b border-deep-graphite px-6">
          <span className="text-lg font-bold">Control Center</span>
        </div>
        <nav className="flex flex-col gap-1 p-4">
          {[
            "Overview", "Cases", "Users", "Catalog", "Workflows", "CMS", "Payments", "Analytics", "Integrations", "Security", "System"
          ].map(item => (
            <div key={item} className="rounded-md px-3 py-2 text-sm font-medium text-muted-surface hover:bg-deep-graphite hover:text-warm-surface">
              {item}
            </div>
          ))}
        </nav>
      </aside>
      <main className="flex-1 pl-64">
        <header className="flex h-16 items-center border-b border-border bg-warm-surface px-8 shadow-[0_1px_2px_rgba(31,38,34,0.05)]">
          <span className="text-sm font-medium text-muted-text">Super Admin / Platform Owner</span>
        </header>
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
