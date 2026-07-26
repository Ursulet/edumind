import { ReactNode } from "react";
import Link from "next/link";
import { getUserFromToken, getHomeForRole } from "@/lib/auth";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { NotificationBell } from "@/components/notification-bell";
import { redirect } from "next/navigation";
import { 
  Home, Activity, User as UserIcon, CheckSquare, FileText, 
  Map, Calendar, Video, PlayCircle, Folder, CreditCard, 
  Gift, Settings, Bell, Shield, Lock, Monitor, HelpCircle, LogOut, Trash2
} from "lucide-react";
import { MobileSidebarToggle } from "./MobileSidebarToggle";

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

  const sidebarGroups = [
    {
      label: "OVERVIEW",
      items: [
        { href: "/dashboard", icon: <Home size={18} />, text: "Acasă" },
        { href: "/parcurs", icon: <Map size={18} />, text: "Parcurs" },
      ]
    },
    {
      label: "COPIL",
      items: [
        { href: "/profil-copil", icon: <UserIcon size={18} />, text: "Profil copil" },
        { href: "/evaluare", icon: <CheckSquare size={18} />, text: "Evaluare" },
        { href: "/rapoarte", icon: <FileText size={18} />, text: "Rapoarte" },
        { href: "/plan-cariera", icon: <Activity size={18} />, text: "Plan de carieră" },
      ]
    },
    {
      label: "ȘEDINȚE",
      items: [
        { href: "/programari", icon: <Calendar size={18} />, text: "Programări" },
        { href: "/sedinte", icon: <Video size={18} />, text: "Ședințe" },
        { href: "/program-activ", icon: <PlayCircle size={18} />, text: "Program activ" },
      ]
    },
    {
      label: "DOCUMENTE & PLĂȚI",
      items: [
        { href: "/documente", icon: <Folder size={18} />, text: "Documente" },
        { href: "/plati", icon: <CreditCard size={18} />, text: "Plăți" },
        { href: "/recomandari", icon: <Gift size={18} />, text: "Recomandări" },
      ]
    },
    {
      label: "CONT",
      items: [
        { href: "/cont/profil", icon: <Settings size={18} />, text: "Profilul meu" },
        { href: "/cont/notificari", icon: <Bell size={18} />, text: "Notificări" },
        { href: "/cont/securitate", icon: <Shield size={18} />, text: "Securitate" },
        { href: "/cont/parola", icon: <Lock size={18} />, text: "Schimbă parola" },
        { href: "/cont/sesiuni", icon: <Monitor size={18} />, text: "Sesiuni active" },
        { href: "/cont/ajutor", icon: <HelpCircle size={18} />, text: "Ajutor" },
      ]
    }
  ];

  return (
    <div className="flex min-h-screen bg-[#F7F5F0] text-[#1F2622] font-sans">
      
      {/* Mobile Sidebar Overlay (controlled by Client Component if needed, but we'll use a pure CSS or lightweight hook approach) */}
      <MobileSidebarToggle sidebarGroups={sidebarGroups} />

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex fixed inset-y-0 left-0 z-20 w-[240px] flex-col border-r border-[#E3DED3] bg-[#FFFDF8]">
        {/* Logo */}
        <div className="flex h-16 items-center px-5 shrink-0 border-b border-[#E3DED3]/50">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#2F6B57] flex items-center justify-center text-white font-bold">EM</div>
            <span className="text-[17px] font-bold tracking-tight text-[#1F2622]">EduCarieră</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-5 px-3 space-y-7 scrollbar-hide">
          {sidebarGroups.map((group, index) => (
            <div key={index}>
              <h3 className="px-3 text-[10px] font-bold uppercase tracking-[0.15em] text-[#6B746F] mb-3">
                {group.label}
              </h3>
              <div className="space-y-1">
                {group.items.map((item, idx) => (
                  <Link
                    key={idx}
                    href={item.href}
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-[14px] font-medium text-[#1F2622] hover:bg-[#EDF4F0] hover:text-[#2F6B57] transition-colors group"
                  >
                    <span className="text-[#6B746F] group-hover:text-[#2F6B57]">{item.icon}</span>
                    {item.text}
                  </Link>
                ))}
              </div>
            </div>
          ))}
          
          <div className="pt-4 mt-4 border-t border-[#E3DED3]">
             <LogoutButton className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-[14px] font-medium text-[#6B746F] hover:bg-[#FEF2F2] hover:text-[#B4453A] transition-colors" />
             <Link href="/cont/stergere" className="flex items-center gap-3 rounded-lg px-3 py-2 text-[14px] font-medium text-[#6B746F] hover:bg-[#FEF2F2] hover:text-[#B4453A] transition-colors mt-1">
               <Trash2 size={18} /> Șterge contul
             </Link>
          </div>
        </nav>
      </aside>
      
      {/* Main Container */}
      <main className="flex-1 md:pl-[240px] flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="flex h-16 items-center justify-between border-b border-[#E3DED3] bg-[#FFFDF8] px-4 md:px-8 shrink-0 z-10 sticky top-0">
          
          {/* Mobile hamburger placeholder (actual button is in MobileSidebarToggle) */}
          <div className="md:hidden w-10"></div> 

          {/* Child Selector */}
          <div className="flex-1 max-w-sm flex items-center gap-3">
             <label className="hidden sm:block text-xs font-semibold text-[#6B746F]">Copil:</label>
             <select className="text-[13px] font-bold border-[#E3DED3] bg-[#F7F5F0] rounded-md px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#2F6B57] text-[#1F2622] w-full max-w-[200px]">
                <option value="1">Andrei Popescu</option>
                <option value="2">Maria Popescu</option>
             </select>
          </div>

          {/* Right Header Menu */}
          <div className="flex items-center gap-4 shrink-0">
            <Link href="/cont/ajutor" className="hidden sm:flex text-[#6B746F] hover:text-[#1F2622] transition-colors items-center gap-1.5 text-sm font-medium">
              <HelpCircle size={18} />
              <span className="hidden lg:inline">Ajutor</span>
            </Link>
            
            <div className="relative flex items-center h-full">
              <NotificationBell />
            </div>

            <div className="flex items-center gap-3 border-l border-[#E3DED3] pl-4">
              <div className="text-right hidden lg:block">
                <p className="text-sm font-bold text-[#1F2622] leading-tight">{displayName}</p>
                <p className="text-[11px] font-medium text-[#6B746F]">Părinte</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-[#2F6B57] text-white flex items-center justify-center font-bold text-xs shadow-sm cursor-pointer">
                {(user.firstName?.[0] || user.email?.[0] || "P").toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <div className="flex-1 bg-[#F7F5F0]">
          {children}
        </div>
      </main>
    </div>
  );
}
