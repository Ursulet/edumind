import { getUserFromToken } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Clock, AlertTriangle, Calendar, FileText, CheckCircle, Briefcase, Video, FileSearch } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Specialist Dashboard - EduCarieră",
};

export default async function SpecialistDashboardPage() {
  const user = await getUserFromToken();
  if (!user) redirect("/login");

  if (!["SPECIALIST", "DEPARTMENT_ADMIN", "SUPER_ADMIN", "PLATFORM_OWNER"].includes(user.role)) {
    redirect("/dashboard");
  }

  // 1. Next Session (Dominant Area)
  const nextSession = {
    time: "10:00 - 11:00",
    child: "Andrei Popescu",
    parent: "Maria Popescu",
    type: "Consiliere (Șed. 2)",
    duration: "60 min",
    stage: "Intervenție Activa",
    canJoin: true
  };

  // 2. KPIs
  const topMetrics = [
    { label: "Sessions Today", value: "4", type: "neutral" },
    { label: "Active Cases", value: "18", type: "neutral" },
    { label: "Requires Action", value: "3", type: "danger" },
    { label: "Draft Reports", value: "2", type: "warning" },
    { label: "Missing Session Notes", value: "1", type: "danger" },
    { label: "Pending Recs", value: "0", type: "success" },
  ];

  // 3. Today's Schedule
  const todaysSchedule = [
    { time: "09:00", child: "Elena Rusu", type: "Evaluare Inițială", status: "Completed", duration: "45m", action: "Complete Notes" },
    { time: "10:00", child: "Andrei Popescu", type: "Consiliere", status: "Upcoming", duration: "60m", action: "Join Session" },
    { time: "14:30", child: "Mihai Stan", type: "Interpretare Test", status: "Upcoming", duration: "45m", action: "Open Case" },
    { time: "16:00", child: "Ioana Dan", type: "Plan de Carieră", status: "Upcoming", duration: "60m", action: "Open Case" },
  ];

  // 4. Requires Action
  const requiredActions = [
    { child: "Vlad M.", case: "CAS-892", reason: "Assessment Completed - Needs Verification", due: "Due: Today", icon: <FileSearch size={16} />, cta: "Verify Result" },
    { child: "Elena Rusu", case: "CAS-881", reason: "Session without summary", due: "1 hour ago", icon: <FileText size={16} />, cta: "Write Summary" },
    { child: "Sofia D.", case: "CAS-875", reason: "Report Draft Pending Publish", due: "Due: Tomorrow", icon: <FileText size={16} />, cta: "Review Draft" },
    { child: "Matei C.", case: "CAS-840", reason: "Career Plan Incomplete", due: "Due in 3 days", icon: <Briefcase size={16} />, cta: "Edit Plan" },
  ];

  return (
    <div className="space-y-6 max-w-[1600px]">
      
      {/* Page Header */}
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-2xl font-bold text-[#1F2622]">Bun venit, {user.firstName || 'Specialist'}!</h1>
          <p className="text-[13px] text-[#6B746F]">Aici este centrul tău de comandă operațional.</p>
        </div>
      </div>

      <div className="flex flex-col xl:flex-row gap-6">
        {/* Left Column */}
        <div className="flex-[2] flex flex-col gap-6">
          
          {/* Dominant Area: Next Session */}
          <div className="bg-[#1F2622] rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
            
            <div className="flex justify-between items-start relative z-10">
              <div>
                <span className="bg-[#2F6B57] text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                  Next Session
                </span>
                <h2 className="text-3xl font-black mt-3 mb-1">{nextSession.time}</h2>
                <div className="flex items-center gap-3 text-sm text-gray-300">
                  <span className="flex items-center gap-1.5"><Clock size={14} /> {nextSession.duration}</span>
                  <span className="w-1 h-1 rounded-full bg-gray-500"></span>
                  <span className="flex items-center gap-1.5"><Video size={14} /> {nextSession.type}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs text-gray-400 block mb-1">Stadiu curent</span>
                <span className="text-sm font-bold bg-white/10 px-3 py-1 rounded-md">{nextSession.stage}</span>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 flex justify-between items-center relative z-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center font-bold text-xl">
                  {nextSession.child[0]}
                </div>
                <div>
                  <h3 className="font-bold text-lg leading-tight">{nextSession.child}</h3>
                  <p className="text-xs text-gray-400">Părinte: {nextSession.parent}</p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <button className="bg-white/10 hover:bg-white/20 text-white px-5 py-2.5 rounded-lg text-sm font-bold transition-colors">
                  Open Case
                </button>
                <button className={`px-6 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors ${
                  nextSession.canJoin ? 'bg-[#2F6B57] hover:bg-[#388068] text-white' : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                }`}>
                  <Video size={16} /> Join Session
                </button>
              </div>
            </div>
          </div>

          {/* KPIs Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
            {topMetrics.map((m, i) => (
              <div key={i} className="bg-white border border-[#E3DED3] rounded-xl p-4 shadow-sm flex flex-col justify-between h-24">
                <p className="text-[10px] font-bold text-[#6B746F] uppercase tracking-wide leading-tight">{m.label}</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <h3 className={`text-2xl font-black tracking-tight ${
                    m.type === 'danger' && parseInt(m.value) > 0 ? 'text-[#B4453A]' :
                    m.type === 'warning' && parseInt(m.value) > 0 ? 'text-[#B7791F]' :
                    m.type === 'success' ? 'text-[#2F6B57]' : 'text-[#1F2622]'
                  }`}>
                    {m.value}
                  </h3>
                </div>
              </div>
            ))}
          </div>

          {/* Today's Schedule */}
          <div className="bg-white border border-[#E3DED3] rounded-xl shadow-sm overflow-hidden flex flex-col">
            <div className="p-5 border-b border-[#E3DED3] flex justify-between items-center bg-[#FDFCF8]">
              <div>
                <h2 className="text-[15px] font-bold text-[#1F2622]">Today's Schedule</h2>
                <p className="text-[11px] text-[#6B746F] mt-0.5">Your sessions and appointments for today.</p>
              </div>
              <Link href="/specialist/sessions/calendar" className="text-xs font-bold text-[#2F6B57] hover:underline">
                View Calendar
              </Link>
            </div>
            
            <div className="p-2">
              <table className="w-full text-left border-collapse">
                <tbody className="text-[12px] text-[#1F2622]">
                  {todaysSchedule.map((session, i) => (
                    <tr key={i} className="border-b border-[#E3DED3] last:border-0 hover:bg-[#FAF9F5] transition-colors group">
                      <td className="p-3 w-20">
                        <span className="font-bold text-[13px]">{session.time}</span>
                        <div className="text-[10px] text-[#6B746F]">{session.duration}</div>
                      </td>
                      <td className="p-3">
                        <div className="font-bold text-[14px]">{session.child}</div>
                        <div className="text-[11px] text-[#6B746F]">{session.type}</div>
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded-md text-[10px] font-bold ${
                          session.status === 'Completed' ? 'bg-[#EDF4F0] text-[#2F6B57]' : 'bg-[#F1F5F9] text-[#475569]'
                        }`}>
                          {session.status}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <button className={`text-[11px] font-bold px-3 py-1.5 rounded shadow-sm transition-colors ${
                          session.action === 'Join Session' ? 'bg-[#2F6B57] text-white hover:bg-[#388068]' :
                          session.action === 'Complete Notes' ? 'bg-[#FFFBEB] border border-[#FDE68A] text-[#B7791F] hover:bg-[#FEF3C7]' :
                          'bg-white border border-[#E3DED3] text-[#1F2622] hover:bg-[#EDF4F0]'
                        }`}>
                          {session.action}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Requires Action */}
        <div className="flex-1 flex flex-col gap-6">
          <div className="bg-[#FAF9F5] border border-[#E3DED3] rounded-xl p-5 shadow-sm h-full flex flex-col">
            <div className="flex justify-between items-end mb-5">
              <div>
                <h2 className="text-[15px] font-bold text-[#1F2622]">Requires Action</h2>
                <p className="text-[11px] text-[#6B746F] mt-0.5">Tasks blocking case progress.</p>
              </div>
              <span className="bg-[#B4453A] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                {requiredActions.length} Items
              </span>
            </div>
            
            <div className="space-y-3 flex-1">
              {requiredActions.map((task, i) => (
                <div key={i} className="p-3.5 rounded-xl bg-white border border-[#E3DED3] shadow-sm flex flex-col gap-3 hover:border-[#2F6B57] transition-colors group">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-md bg-[#EDF4F0] text-[#2F6B57] flex items-center justify-center">
                        {task.icon}
                      </span>
                      <div>
                        <span className="text-[13px] font-bold text-[#1F2622] block leading-none">{task.child}</span>
                        <span className="text-[10px] text-[#6B746F]">{task.case}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-[#B4453A] bg-[#FEF2F2] px-2 py-0.5 rounded-md">
                      {task.due}
                    </span>
                  </div>
                  
                  <div>
                    <span className="text-xs font-semibold text-[#1F2622]">{task.reason}</span>
                  </div>

                  <button className="w-full bg-[#FDFCF8] border border-[#E3DED3] text-[#1F2622] py-1.5 text-[11px] font-bold rounded-lg shadow-sm group-hover:bg-[#1F2622] group-hover:text-white group-hover:border-[#1F2622] transition-colors">
                    {task.cta}
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-[#E3DED3] text-center">
              <Link href="/specialist/work/requires-action" className="text-xs font-bold text-[#6B746F] hover:text-[#1F2622]">
                View all pending actions →
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
