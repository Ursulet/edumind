import { getUserFromToken } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Clock, AlertTriangle, ChevronRight, UserPlus, FileText, CheckCircle } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Director Dashboard - EduCarieră",
};

export default async function DirectorDashboardPage() {
  const user = await getUserFromToken();
  if (!user) redirect("/login");

  if (!["DEPARTMENT_ADMIN", "SUPER_ADMIN", "PLATFORM_OWNER"].includes(user.role)) {
    redirect("/dashboard");
  }

  // 1. KPIs
  const topMetrics = [
    { label: "Applications Waiting", value: "12", trend: "+3", type: "warning" },
    { label: "Unassigned Cases", value: "8", trend: "-2", type: "warning" },
    { label: "Active Cases", value: "245", trend: "+12", type: "neutral" },
    { label: "Sessions Today", value: "34", trend: "0", type: "neutral" },
    { label: "Overdue Cases", value: "3", trend: "+1", type: "danger" },
    { label: "Active Specialists", value: "18", trend: "0", type: "neutral" },
    { label: "Average Wait Time", value: "3.2d", trend: "-0.5d", type: "success" },
  ];

  // 2. Attention Center (Real items)
  const alerts = [
    { title: "Application Waiting", desc: "Parent: Maria Ionescu | Submitted 2 days ago", type: "yellow", action: "Review" },
    { title: "Unassigned Case", desc: "Child: Andrei Pop | Wait time: 4 days", type: "red", action: "Assign" },
    { title: "Overdue Case", desc: "Child: Elena Rusu | Overdue by 2 days", type: "red", action: "View Case" },
    { title: "Unavailable Specialist", desc: "Dr. Mihnea Toma | Sick leave reported", type: "yellow", action: "Reassign Cases" },
    { title: "Cancelled Session", desc: "Child: Vlad R. | Needs reschedule", type: "yellow", action: "Reschedule" },
    { title: "Case Beyond Wait Threshold", desc: "Child: Sofia D. | Wait time: 7 days", type: "red", action: "Escalate" },
  ];

  // 3. Applications Preview Data
  const applications = [
    { id: "APP-001", date: "2026-07-25", parent: "Ion Popescu", child: "Andrei Popescu", grade: "Clasa a 8-a", county: "București", need: "Orientare liceu", status: "New" },
    { id: "APP-002", date: "2026-07-24", parent: "Maria Ionescu", child: "Elena Ionescu", grade: "Clasa a 12-a", county: "Cluj", need: "Alegere facultate", status: "Under Review" },
    { id: "APP-003", date: "2026-07-23", parent: "Vasile Rusu", child: "Mihai Rusu", grade: "Clasa a 10-a", county: "Timiș", need: "Reorientare profil", status: "More Info" },
    { id: "APP-004", date: "2026-07-22", parent: "Elena Dan", child: "Ioana Dan", grade: "Clasa a 8-a", county: "Iași", need: "Evaluare aptitudini", status: "Approved" },
  ];

  return (
    <div className="space-y-6 max-w-[1600px]">
      
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#1F2622]">Department Overview</h1>
          <p className="text-[13px] text-[#6B746F]">Operational status and team performance.</p>
        </div>
      </div>

      {/* KPIs Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        {topMetrics.map((m, i) => (
          <div key={i} className="bg-white border border-[#E3DED3] rounded-xl p-4 shadow-sm relative overflow-hidden flex flex-col justify-between h-24">
            <div>
              <p className="text-[11px] font-bold text-[#6B746F] uppercase tracking-wide">{m.label}</p>
              <div className="flex items-baseline gap-2 mt-1">
                <h3 className="text-2xl font-black text-[#1F2622] tracking-tight">{m.value}</h3>
                <span className={`text-[11px] font-bold flex items-center ${
                  m.type === 'danger' ? 'text-[#B4453A]' :
                  m.type === 'warning' ? 'text-[#B7791F]' :
                  m.type === 'success' ? 'text-[#2F6B57]' : 'text-[#6B746F]'
                }`}>
                  {m.trend.startsWith('-') ? '▼' : m.trend.startsWith('+') ? '▲' : ''}{m.trend}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Left Column: Applications Preview */}
        <div className="flex-[2] flex flex-col gap-6">
          <div className="bg-white border border-[#E3DED3] rounded-xl shadow-sm overflow-hidden flex flex-col">
            <div className="p-5 border-b border-[#E3DED3] flex justify-between items-center bg-[#FDFCF8]">
              <div>
                <h2 className="text-[15px] font-bold text-[#1F2622]">Applications Preview</h2>
                <p className="text-[11px] text-[#6B746F] mt-0.5">Recent applications requiring attention.</p>
              </div>
              <Link href="/director/applications/new" className="text-xs font-bold bg-[#1F2622] text-white px-3 py-1.5 rounded-md hover:bg-[#2A332E]">
                View All
              </Link>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#EDF4F0]/50 text-[10px] uppercase tracking-wider text-[#6B746F]">
                    <th className="p-3 font-bold border-b border-[#E3DED3]">Date</th>
                    <th className="p-3 font-bold border-b border-[#E3DED3]">Parent / Child</th>
                    <th className="p-3 font-bold border-b border-[#E3DED3]">Grade / County</th>
                    <th className="p-3 font-bold border-b border-[#E3DED3]">Declared Need</th>
                    <th className="p-3 font-bold border-b border-[#E3DED3]">Status</th>
                    <th className="p-3 font-bold border-b border-[#E3DED3] text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-[12px] text-[#1F2622]">
                  {applications.map((app, i) => (
                    <tr key={i} className="border-b border-[#E3DED3] last:border-0 hover:bg-[#FAF9F5] transition-colors">
                      <td className="p-3 whitespace-nowrap text-[#6B746F]">{app.date}</td>
                      <td className="p-3">
                        <div className="font-bold">{app.parent}</div>
                        <div className="text-[10px] text-[#6B746F]">{app.child}</div>
                      </td>
                      <td className="p-3">
                        <div>{app.grade}</div>
                        <div className="text-[10px] text-[#6B746F]">{app.county}</div>
                      </td>
                      <td className="p-3 text-[#6B746F] truncate max-w-[150px]">{app.need}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          app.status === 'New' ? 'bg-blue-100 text-blue-700' :
                          app.status === 'Under Review' ? 'bg-yellow-100 text-yellow-700' :
                          app.status === 'More Info' ? 'bg-orange-100 text-orange-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button className="bg-white border border-[#E3DED3] text-[#1F2622] text-[10px] font-bold px-3 py-1.5 rounded shadow-sm hover:bg-[#EDF4F0] hover:text-[#2F6B57]">
                          Open / Review
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Attention Center */}
        <div className="flex-1 flex flex-col gap-6">
          <div className="bg-[#FAF9F5] border border-[#E3DED3] rounded-xl p-5 shadow-sm">
            <div className="flex justify-between items-end mb-4">
              <div>
                <h2 className="text-[15px] font-bold text-[#1F2622]">Attention Center</h2>
                <p className="text-[11px] text-[#6B746F] mt-0.5">Actionable operational alerts.</p>
              </div>
              <span className="bg-[#B4453A] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                {alerts.length} Action Items
              </span>
            </div>
            
            <div className="space-y-3">
              {alerts.map((alert, i) => (
                <div key={i} className={`p-3 rounded-lg border ${
                  alert.type === 'red' ? 'bg-[#FEF2F2] border-[#FECACA]' : 'bg-[#FFFBEB] border-[#FDE68A]'
                } shadow-sm flex items-start justify-between gap-3`}>
                  <div className="mt-0.5">
                    {alert.type === 'red' ? <AlertTriangle size={16} className="text-[#B4453A]" /> : <Clock size={16} className="text-[#B7791F]" />}
                  </div>
                  <div className="flex-1 flex flex-col">
                    <span className="text-xs font-bold text-[#1F2622]">{alert.title}</span>
                    <span className="text-[10px] font-medium text-[#6B746F] mt-0.5 leading-tight">{alert.desc}</span>
                  </div>
                  <button className="bg-white border border-[#E3DED3] text-[#1F2622] px-3 py-1.5 text-[10px] font-bold rounded shadow-sm hover:bg-gray-50 whitespace-nowrap">
                    {alert.action}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
