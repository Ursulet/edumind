import { ReactNode } from "react";
import Link from "next/link";
import { getUserFromToken } from "@/lib/auth";
import { redirect } from "next/navigation";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { 
  BarChart3, Settings, Users, LayoutDashboard, Briefcase, Calendar, 
  Search, Bell, FileText, UserPlus, FileSearch, ShieldCheck, CheckCircle, Clock, AlertTriangle, Activity
} from "lucide-react";

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

  const displayName = `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.email;

  // DIRECTOR LAYOUT (PROMPT 02)
  const directorSidebarGroups = [
    {
      label: "OVERVIEW",
      items: [
        { href: "/director", icon: <LayoutDashboard size={16} />, text: "Dashboard" }
      ]
    },
    {
      label: "APPLICATIONS",
      items: [
        { href: "/director/applications/new", icon: <FileText size={16} />, text: "New Applications" },
        { href: "/director/applications/review", icon: <FileSearch size={16} />, text: "Under Review" },
        { href: "/director/applications/more-info", icon: <AlertTriangle size={16} />, text: "More Info Required" },
        { href: "/director/applications/completed", icon: <CheckCircle size={16} />, text: "Approved / Rejected" },
      ]
    },
    {
      label: "CASE MANAGEMENT",
      items: [
        { href: "/director/cases/all", icon: <Briefcase size={16} />, text: "All Department Cases" },
        { href: "/director/cases/unassigned", icon: <UserPlus size={16} />, text: "Unassigned Cases" },
        { href: "/director/cases/by-stage", icon: <BarChart3 size={16} />, text: "Cases by Stage" },
        { href: "/director/cases/overdue", icon: <Clock size={16} />, text: "Overdue / At Risk" },
        { href: "/director/cases/reassignment", icon: <Users size={16} />, text: "Reassignment Requests" },
      ]
    },
    {
      label: "TEAM",
      items: [
        { href: "/director/team/specialists", icon: <Users size={16} />, text: "Specialists" },
        { href: "/director/team/workload", icon: <Activity size={16} />, text: "Specialist Workload" },
        { href: "/director/team/calendar", icon: <Calendar size={16} />, text: "Team Calendar" },
        { href: "/director/team/availability", icon: <Clock size={16} />, text: "Availability" },
      ]
    },
    {
      label: "SESSIONS",
      items: [
        { href: "/director/sessions/today", icon: <Calendar size={16} />, text: "Today" },
        { href: "/director/sessions/upcoming", icon: <Calendar size={16} />, text: "Upcoming" },
        { href: "/director/sessions/cancelled", icon: <AlertTriangle size={16} />, text: "Cancelled / No-show" },
      ]
    },
    {
      label: "REPORTING",
      items: [
        { href: "/director/reporting/operational", icon: <BarChart3 size={16} />, text: "Operational Reports" },
        { href: "/director/reporting/department", icon: <BarChart3 size={16} />, text: "Department Activity" },
      ]
    },
    {
      label: "ACCOUNT",
      items: [
        { href: "/director/account/profile", icon: <Settings size={16} />, text: "My Profile" },
        { href: "/director/account/security", icon: <ShieldCheck size={16} />, text: "Security" },
        { href: "/director/account/password", icon: <Settings size={16} />, text: "Change Password" },
        { href: "/director/account/sessions", icon: <Settings size={16} />, text: "Active Sessions" },
        { href: "/api/auth/logout", icon: <Settings size={16} />, text: "Logout" },
        { href: "/director/account/deactivate", icon: <Settings size={16} />, text: "Delete / Deactivate Account" },
      ]
    }
  ];

  // SPECIALIST LAYOUT (PROMPT 03)
  const specialistSidebarGroups = [
    {
      label: "OVERVIEW",
      items: [
        { href: "/specialist", icon: <LayoutDashboard size={16} />, text: "Dashboard" }
      ]
    },
    {
      label: "MY WORK",
      items: [
        { href: "/specialist/work/cases", icon: <Briefcase size={16} />, text: "My Cases" },
        { href: "/specialist/work/requires-action", icon: <AlertTriangle size={16} />, text: "Requires Action" },
        { href: "/specialist/work/assessments", icon: <FileSearch size={16} />, text: "Assessments" },
        { href: "/specialist/work/reports", icon: <FileText size={16} />, text: "Reports" },
        { href: "/specialist/work/career-plans", icon: <BarChart3 size={16} />, text: "Career Plans" },
      ]
    },
    {
      label: "SESSIONS",
      items: [
        { href: "/specialist/sessions/calendar", icon: <Calendar size={16} />, text: "Calendar" },
        { href: "/specialist/sessions/today", icon: <Clock size={16} />, text: "Today's Sessions" },
        { href: "/specialist/sessions/upcoming", icon: <Calendar size={16} />, text: "Upcoming" },
        { href: "/specialist/sessions/notes", icon: <FileText size={16} />, text: "Session Notes" },
      ]
    },
    {
      label: "CLIENT CONTINUATION",
      items: [
        { href: "/specialist/clients/recommendations", icon: <CheckCircle size={16} />, text: "Recommendations" },
        { href: "/specialist/clients/programs", icon: <Activity size={16} />, text: "Active Programs" },
      ]
    },
    {
      label: "FILES",
      items: [
        { href: "/specialist/files/documents", icon: <FileText size={16} />, text: "Documents" },
      ]
    },
    {
      label: "ACCOUNT",
      items: [
        { href: "/specialist/account/profile", icon: <Settings size={16} />, text: "My Profile" },
        { href: "/specialist/account/availability", icon: <Clock size={16} />, text: "Availability" },
        { href: "/specialist/account/notifications", icon: <Bell size={16} />, text: "Notifications" },
        { href: "/specialist/account/security", icon: <ShieldCheck size={16} />, text: "Security" },
        { href: "/specialist/account/password", icon: <Settings size={16} />, text: "Change Password" },
        { href: "/specialist/account/sessions", icon: <Settings size={16} />, text: "Active Sessions" },
        { href: "/api/auth/logout", icon: <Settings size={16} />, text: "Logout" },
        { href: "/specialist/account/deactivate", icon: <Settings size={16} />, text: "Delete / Deactivate Account" },
      ]
    }
  ];

  const sidebarGroups = isDirector ? directorSidebarGroups : specialistSidebarGroups;
  const homeLink = isDirector ? "/director" : "/specialist";

  // Get current date string for topbar
  const todayDateStr = new Date().toLocaleDateString('ro-RO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="flex min-h-screen bg-[#FDFCF8] text-[#1F2622] font-sans">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-20 w-[272px] flex flex-col border-r border-[#E3DED3] bg-[#FDFCF8]">
        {/* Logo */}
        <div className="flex h-16 items-center px-6 shrink-0 border-b border-[#E3DED3]/50">
          <Link href={homeLink} className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#2F6B57] flex items-center justify-center text-white font-bold">EC</div>
            <span className="text-xl font-bold tracking-tight text-[#1F2622]">EduCarieră</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-4 space-y-6 scrollbar-hide">
          {sidebarGroups.map((group, index) => (
            <div key={index}>
              <h3 className="px-2 text-[10px] font-bold uppercase tracking-[0.15em] text-[#6B746F] mb-3">
                {group.label}
              </h3>
              <div className="space-y-0.5">
                {group.items.map((item, idx) => (
                  <Link
                    key={idx}
                    href={item.href}
                    className="flex items-center gap-3 rounded-lg px-2 py-2 text-[13px] font-medium text-[#1F2622] hover:bg-[#EDF4F0] hover:text-[#2F6B57] transition-colors group"
                  >
                    <span className="text-[#6B746F] group-hover:text-[#2F6B57]">{item.icon}</span>
                    {item.text}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </aside>
      
      {/* Main Container */}
      <main className="flex-1 pl-[272px] flex flex-col min-h-screen bg-[#FDFCF8]">
        {/* Top Header */}
        <header className="flex h-16 items-center justify-between border-b border-[#E3DED3] bg-[#FDFCF8] px-6 shrink-0 z-10 sticky top-0">
          
          <div className="flex items-center gap-6 w-full max-w-4xl">
            {/* Date Context */}
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-sm font-semibold text-[#6B746F] px-3 py-1.5 bg-white border border-[#E3DED3] rounded-md shadow-sm capitalize">
                {todayDateStr}
              </span>
            </div>

            {/* Global Search */}
            <div className="flex-1 max-w-2xl relative flex items-center bg-white border border-[#E3DED3] rounded-lg px-3 py-1.5 shadow-sm">
              <Search className="w-4 h-4 text-[#6B746F] mr-2 shrink-0" />
              <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide text-[11px] font-semibold text-[#6B746F] mr-2 whitespace-nowrap shrink-0">
                <span className="cursor-pointer hover:text-[#1F2622] flex items-center gap-1">Child</span>
                <span className="cursor-pointer hover:text-[#1F2622] flex items-center gap-1">Parent</span>
                <span className="cursor-pointer hover:text-[#1F2622] flex items-center gap-1">Case</span>
              </div>
              <input type="text" placeholder="Search..." className="flex-1 bg-transparent border-none text-sm focus:outline-none placeholder:text-[#94A3B8] min-w-[50px]" />
            </div>
          </div>

          {/* Right Header Menu */}
          <div className="flex items-center gap-5 shrink-0 ml-4">
            <button className="relative text-[#6B746F] hover:text-[#1F2622] transition-colors">
              <Bell size={20} />
              <span className="absolute top-0 right-0 w-2 h-2 bg-[#B4453A] rounded-full border border-white"></span>
            </button>
            <div className="flex items-center gap-3 border-l border-[#E3DED3] pl-5">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-[#1F2622] leading-tight">{displayName}</p>
                <p className="text-[11px] font-medium text-[#6B746F] capitalize">
                  {user.role.replace(/_/g, " ").toLowerCase()}
                </p>
              </div>
              <div className="w-9 h-9 rounded-full bg-[#1F2622] text-white flex items-center justify-center font-bold text-sm shadow-sm cursor-pointer hover:bg-[#2A332E]">
                {(user.firstName?.[0] || user.email?.[0] || "U").toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <div className="flex-1 p-6 overflow-x-hidden">
          {children}
        </div>
      </main>
    </div>
  );
}
