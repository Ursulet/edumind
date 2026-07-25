import { ReactNode } from "react";
import Link from "next/link";
import { getUserFromToken, getHomeForRole } from "@/lib/auth";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { NotificationBell } from "@/components/notification-bell";
import { redirect } from "next/navigation";

export default async function ParentShellLayout({ children }: { children: ReactNode }) {
  const user = await getUserFromToken();
  if (!user) redirect("/login");

  // Redirect non-parent roles to their correct portal (unless they are Super Admin in God Mode)
  if (user.role && user.role !== "PARENT" && user.role !== "SUPER_ADMIN" && user.role !== "PLATFORM_OWNER") {
    redirect(getHomeForRole(user.role));
  }

  const displayName = user
    ? `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.email
    : "Contul meu";

  return (
    <div className="flex min-h-screen flex-col bg-[#F7F5F0]">
      {/* Top Bar */}
      <header className="sticky top-0 z-40 w-full border-b border-[#E3DED3] bg-[#1F2622] text-white">
        <div className="container flex h-16 items-center px-4 max-w-5xl mx-auto">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-[#2F6B57] flex items-center justify-center text-white font-bold text-xs">
              EM
            </div>
            <span className="font-semibold text-sm tracking-tight text-white hidden sm:block">
              EduMind · Portal Părinți
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1 ml-8">
            <Link
              href="/"
              className="px-3 py-1.5 rounded-md text-sm text-[#DCE8E1] hover:text-white hover:bg-[#2A332E] transition-all duration-150"
            >
              Dashboard
            </Link>
            <Link
              href="/dosar"
              className="px-3 py-1.5 rounded-md text-sm text-[#DCE8E1] hover:text-white hover:bg-[#2A332E] transition-all duration-150"
            >
              Dosar
            </Link>
            <Link
              href="/evaluari"
              className="px-3 py-1.5 rounded-md text-sm text-[#DCE8E1] hover:text-white hover:bg-[#2A332E] transition-all duration-150"
            >
              Evaluări
            </Link>
            <Link
              href="/programari"
              className="px-3 py-1.5 rounded-md text-sm text-[#DCE8E1] hover:text-white hover:bg-[#2A332E] transition-all duration-150"
            >
              Ședințe
            </Link>
            <Link
              href="/rapoarte"
              className="px-3 py-1.5 rounded-md text-sm text-[#DCE8E1] hover:text-white hover:bg-[#2A332E] transition-all duration-150"
            >
              Rapoarte
            </Link>
            <Link
              href="/recomandari"
              className="px-3 py-1.5 rounded-md text-sm text-[#DCE8E1] hover:text-white hover:bg-[#2A332E] transition-all duration-150"
            >
              Recomandări
            </Link>
            <Link
              href="/plati"
              className="px-3 py-1.5 rounded-md text-sm text-[#DCE8E1] hover:text-white hover:bg-[#2A332E] transition-all duration-150"
            >
              Plăți
            </Link>
          </nav>

          <div className="ml-auto flex items-center gap-3">
            <NotificationBell />
            <div className="flex items-center gap-2 pl-3 border-l border-[#2A332E]">
              <div className="w-7 h-7 rounded-full bg-[#2F6B57] flex items-center justify-center text-white text-xs font-semibold">
                {(user?.firstName?.[0] || user?.email?.[0] || "U").toUpperCase()}
              </div>
              <span className="text-sm text-[#DCE8E1] hidden lg:block max-w-[120px] truncate">
                {displayName}
              </span>
              <LogoutButton className="text-xs text-[#6B746F] hover:text-[#DCE8E1] transition-colors ml-1" />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 p-4 md:p-8">{children}</main>
    </div>
  );
}
