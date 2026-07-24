import { ReactNode } from "react";

export default function PublicShellLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-ivory-background">
      <header className="sticky top-0 z-50 w-full border-b border-border bg-warm-surface shadow-[0_1px_2px_rgba(31,38,34,0.05)]">
        <div className="container flex h-16 items-center px-4">
          <span className="text-xl font-bold text-primary-ink">EduCarieră</span>
          <nav className="ml-auto flex gap-4">
            {/* Public Navigation */}
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-border bg-surface py-6">
        <div className="container px-4 text-center text-sm text-muted-text">
          © {new Date().getFullYear()} EduCarieră. Toate drepturile rezervate.
        </div>
      </footer>
    </div>
  );
}
