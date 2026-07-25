import { ReactNode } from "react";
import Link from "next/link";
import { getUserFromToken } from "@/lib/auth";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { redirect } from "next/navigation";

export default async function StaffShellLayout({ children }: { children: ReactNode }) {
  const user = await getUserFromToken();
  if (!user) redirect("/login");

  if (!["SPECIALIST", "DEPARTMENT_ADMIN", "SUPER_ADMIN", "PLATFORM_OWNER"].includes(user.role)) {
    redirect("/dashboard");
  }

  const isDirector =
    user.role === "DEPARTMENT_ADMIN" ||
    user.role === "SUPER_ADMIN" ||
    user.role === "PLATFORM_OWNER";

  const displayName =
    `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.email;

  const navItems = isDirector
    ? [
        { href: "/director", label: "Overview" },
        { href: "/applications", label: "Aplicații" },
        { href: "/specialist", label: "Specialiști" },
      ]
    : [
        { href: "/specialist", label: "Dashboard" },
        { href: "/cases", label: "Cazurile mele" },
        { href: "/calendar", label: "Calendar" },
      ];

  return (
    <div className="flex min-h-screen bg-[#F7F5F0]">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-20 w-64 flex flex-col bg-[#1F2622] border-r border-[#2A332E]">
        {/* Logo */}
        <div className="flex h-16 items-center border-b border-[#2A332E] px-6">
          <Link href={isDirector ? "/director" : "/specialist"} className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-[#2F6B57] flex items-center justify-center text-white font-bold text-xs">
              EM
            </div>
            <span className="text-sm font-semibold text-white tracking-tight">
              {isDirector ? "Portal Director" : "Portal Specialist"}
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <div className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-[#94A3B8] hover:bg-[#2A332E] hover:text-white transition-all duration-150 group"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#2F6B57] opacity-0 group-hover:opacity-100 transition-opacity" />
                {item.label}
              </Link>
            ))}
          </div>
        </nav>

        {/* User footer */}
        <div className="border-t border-[#2A332E] p-4 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#2F6B57] flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
              {(user.firstName?.[0] || user.email?.[0] || "U").toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white truncate">{displayName}</p>
              <p className="text-xs text-[#6B746F] capitalize">
                {user.role.toLowerCase().replace(/_/g, " ")}
              </p>
            </div>
          </div>
          <LogoutButton className="w-full rounded-lg border border-[#2A332E] text-xs text-[#6B746F] py-1.5 hover:border-[#B4453A] hover:text-[#B4453A] transition-colors text-center" />
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 pl-64 flex flex-col min-h-screen">
        <header className="flex h-16 items-center justify-between border-b border-[#E3DED3] bg-[#FFFDF8] px-8 shadow-[0_1px_2px_rgba(31,38,34,0.05)]">
          
          {/* Global Search */}
          <div className="flex-1 max-w-md relative">
            <form action="/search" method="GET">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-4 w-4 text-[#6B746F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  name="q"
                  placeholder="Caută dosar, email, părinte sau copil..."
                  className="block w-full pl-9 pr-3 py-2 border border-[#E3DED3] rounded-md leading-5 bg-[#F7F5F0] placeholder-[#94A3B8] focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#2F6B57] focus:border-[#2F6B57] sm:text-sm transition-colors"
                />
              </div>
            </form>
          </div>

          <p className="text-sm text-[#6B746F]">
            Autentificat ca{" "}
            <span className="font-medium text-[#1F2622]">{displayName}</span>
          </p>
        </header>
        <div className="flex-1 p-8">{children}</div>
      </main>
    </div>
  );
}
