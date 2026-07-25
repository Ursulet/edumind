import { ReactNode } from "react";
import Link from "next/link";
import { getUserFromToken } from "@/lib/auth";
import { redirect } from "next/navigation";
import { 
  BarChart3, Settings, Users, LayoutDashboard, Briefcase, Calendar, 
  CreditCard, Package, Tag, Layers, Search, Bell, Activity, ShieldCheck, 
  Database, Server, Workflow, Key
} from "lucide-react";

import { AdminSidebarAccordion } from "@/components/admin/AdminSidebarAccordion";

export default async function ControlCenterShellLayout({ children }: { children: ReactNode }) {
  const user = await getUserFromToken();
  if (!user) redirect("/login");

  // Only allow SUPER_ADMIN or PLATFORM_OWNER
  if (user.role !== "SUPER_ADMIN" && user.role !== "PLATFORM_OWNER") {
    redirect("/dashboard");
  }

  const displayName = `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.email;

  const sidebarGroups = [
    {
      label: "OVERVIEW",
      items: [
        { href: "/admin", icon: <LayoutDashboard size={16} />, text: "Dashboard" }
      ]
    },
    {
      label: "OPERATIONS",
      items: [
        { href: "/admin/applications", icon: <Briefcase size={16} />, text: "Applications" },
        { href: "/admin/cases", icon: <Layers size={16} />, text: "Cases" },
        { href: "/admin/sessions", icon: <Calendar size={16} />, text: "Sessions" },
        { href: "/admin/appointments", icon: <Calendar size={16} />, text: "Appointments" },
        { href: "/admin/payments", icon: <CreditCard size={16} />, text: "Payments" },
      ]
    },
    {
      label: "BUSINESS",
      items: [
        { href: "/admin/products", icon: <Package size={16} />, text: "Products" },
        { href: "/admin/product-versions", icon: <Layers size={16} />, text: "Product Versions" },
        { href: "/admin/prices", icon: <Tag size={16} />, text: "Prices" },
        { href: "/admin/offers", icon: <Tag size={16} />, text: "Offers" },
        { href: "/admin/entitlements", icon: <Key size={16} />, text: "Entitlements" },
        { href: "/admin/recommendations", icon: <Activity size={16} />, text: "Recommendations" },
        { href: "/admin/analytics", icon: <BarChart3 size={16} />, text: "Analytics" },
      ]
    },
    {
      label: "CONFIGURATION",
      items: [
        { href: "/admin/workflows", icon: <Workflow size={16} />, text: "Workflows" },
        { href: "/admin/workflow-versions", icon: <Layers size={16} />, text: "Workflow Versions" },
        { href: "/admin/session-types", icon: <Settings size={16} />, text: "Session Types" },
        { href: "/admin/appointment-types", icon: <Settings size={16} />, text: "Appointment Types" },
        { href: "/admin/report-templates", icon: <Settings size={16} />, text: "Report Templates" },
        { href: "/admin/cms", icon: <Settings size={16} />, text: "CMS" },
        { href: "/admin/notifications", icon: <Bell size={16} />, text: "Notifications" },
        { href: "/admin/email-templates", icon: <Settings size={16} />, text: "Email Templates" },
      ]
    },
    {
      label: "PEOPLE",
      items: [
        { href: "/admin/users", icon: <Users size={16} />, text: "Users" },
        { href: "/admin/parents", icon: <Users size={16} />, text: "Parents" },
        { href: "/admin/children", icon: <Users size={16} />, text: "Children" },
        { href: "/admin/specialists", icon: <Users size={16} />, text: "Specialists" },
        { href: "/admin/directors", icon: <Users size={16} />, text: "Directors" },
        { href: "/admin/departments", icon: <Layers size={16} />, text: "Departments" },
        { href: "/admin/roles-permissions", icon: <ShieldCheck size={16} />, text: "Roles & Permissions" },
      ]
    },
    {
      label: "SYSTEM",
      items: [
        { href: "/admin/integrations", icon: <Server size={16} />, text: "Integrations" },
        { href: "/admin/feature-flags", icon: <Settings size={16} />, text: "Feature Flags" },
        { href: "/admin/audit", icon: <Database size={16} />, text: "Audit Logs" },
        { href: "/admin/security", icon: <ShieldCheck size={16} />, text: "Security" },
        { href: "/admin/health", icon: <Activity size={16} />, text: "System Health" },
        { href: "/admin/organizations", icon: <Layers size={16} />, text: "Organizations" },
      ]
    },
    {
      label: "ACCOUNT",
      items: [
        { href: "/admin/profile", icon: <Settings size={16} />, text: "My Profile" },
        { href: "/admin/account-security", icon: <ShieldCheck size={16} />, text: "Security" },
        { href: "/admin/password", icon: <Key size={16} />, text: "Change Password" },
        { href: "/admin/active-sessions", icon: <Activity size={16} />, text: "Active Sessions" },
        { href: "/api/auth/logout", icon: <Settings size={16} />, text: "Logout" },
        { href: "/admin/deactivate", icon: <Settings size={16} />, text: "Delete / Deactivate Account" },
      ]
    }
  ];

  return (
    <div className="flex min-h-screen bg-[#FDFCF8] text-[#1F2622] font-sans">
      
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-20 w-[272px] flex flex-col border-r border-[#E3DED3] bg-[#FDFCF8]">
        
        {/* Logo */}
        <div className="flex h-16 items-center px-6 shrink-0 border-b border-[#E3DED3]/50">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#2F6B57] flex items-center justify-center text-white font-bold">
              EC
            </div>
            <span className="text-xl font-bold tracking-tight text-[#1F2622]">EduCarieră</span>
          </Link>
        </div>

        {/* Navigation */}
        <AdminSidebarAccordion groups={sidebarGroups} />
      </aside>
      
      {/* Main Container */}
      <main className="flex-1 pl-[272px] flex flex-col min-h-screen bg-[#FDFCF8]">
        
        {/* Top Header */}
        <header className="flex h-16 items-center justify-between border-b border-[#E3DED3] bg-[#FDFCF8] px-6 shrink-0 z-10 sticky top-0">
          
          <div className="flex items-center gap-6 w-full max-w-4xl">
            {/* Organization & Environment */}
            <div className="flex items-center gap-3 shrink-0">
              <select className="bg-transparent text-sm font-semibold text-[#1F2622] outline-none cursor-pointer">
                <option>All Organizations</option>
              </select>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#EDF4F0] border border-[#2F6B57]/20">
                <div className="w-2 h-2 rounded-full bg-[#2F6B57]"></div>
                <span className="text-[11px] font-bold text-[#2F6B57] uppercase tracking-wider">Production</span>
              </div>
            </div>

            {/* Global Search */}
            <div className="flex-1 max-w-2xl relative flex items-center bg-white border border-[#E3DED3] rounded-lg px-3 py-1.5 shadow-sm">
              <Search className="w-4 h-4 text-[#6B746F] mr-2 shrink-0" />
              <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide text-[11px] font-semibold text-[#6B746F] mr-2 whitespace-nowrap shrink-0">
                <span className="cursor-pointer hover:text-[#1F2622] flex items-center gap-1"><Search size={10}/> Case ID</span>
                <span className="cursor-pointer hover:text-[#1F2622] flex items-center gap-1"><Search size={10}/> Parent</span>
                <span className="cursor-pointer hover:text-[#1F2622] flex items-center gap-1"><Search size={10}/> Child</span>
                <span className="cursor-pointer hover:text-[#1F2622] flex items-center gap-1"><Search size={10}/> Specialist</span>
                <span className="cursor-pointer hover:text-[#1F2622] flex items-center gap-1"><Search size={10}/> Email</span>
                <span className="cursor-pointer hover:text-[#1F2622] flex items-center gap-1"><Search size={10}/> Phone</span>
                <span className="cursor-pointer hover:text-[#1F2622] flex items-center gap-1"><Search size={10}/> Order</span>
                <span className="cursor-pointer hover:text-[#1F2622] flex items-center gap-1"><Search size={10}/> Appointment</span>
              </div>
              <input
                type="text"
                placeholder="Search..."
                className="flex-1 bg-transparent border-none text-sm focus:outline-none placeholder:text-[#94A3B8] min-w-[50px]"
              />
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
