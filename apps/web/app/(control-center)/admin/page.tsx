import { getUserFromToken } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ChevronRight, ArrowRight, Database } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Super Admin Godmode - EduMind",
};

export default async function AdminDashboardPage() {
  const user = await getUserFromToken();
  if (!user) redirect("/login");

  if (!["SUPER_ADMIN", "PLATFORM_OWNER"].includes(user.role)) {
    redirect("/dashboard");
  }

  // Top metric cards
  const topMetrics = [
    { label: "Revenue", value: "€145,320", trend: "+12%" },
    { label: "Paid Orders", value: "234", trend: "+8%" },
    { label: "Active Cases", value: "1,245", trend: "+5%" },
    { label: "Active Programs", value: "45", trend: "+15%" },
    { label: "Sessions Completed", value: "980", trend: "+18%" },
    { label: "Rec → Purchase Conversion", value: "18%", trend: "+3%" },
  ];

  // Funnel steps
  const funnelSteps = [
    { label: "Application", value: 150, h: "h-32" },
    { label: "Approved", value: 120, h: "h-28" },
    { label: "Paid", value: 95, h: "h-24" },
    { label: "Assessment", value: 80, h: "h-20" },
    { label: "Interpretation", value: 70, h: "h-16" },
    { label: "Recommendation", value: 60, h: "h-12" },
    { label: "Program Purchase", value: 40, h: "h-10" },
    { label: "Completed", value: 30, h: "h-8" },
  ];

  // Attention Center alerts
  const alerts = [
    { title: "Failed Payment", desc: "Order #12345 | €120 | 2m ago", type: "red", action: "View Order" },
    { title: "Unassigned Case", desc: "Child: Ioana Popa | Medium Urgency | 10m ago", type: "yellow", action: "Assign" },
    { title: "Email Failure", desc: "Worker #54321 | 15m ago", type: "yellow", action: "View Logs" },
    { title: "Video Provider Problem", desc: "Zoom Degraded | 30m ago", type: "red", action: "View Status" },
    { title: "Invalid Product Config", desc: "'Career Pathfinder 2026' | 45m ago", type: "red", action: "Edit Product" },
  ];

  // System Health nodes
  const healthNodes = [
    { label: "API", status: "Healthy", type: "green" },
    { label: "DB", status: "Healthy", type: "green" },
    { label: "Redis", status: "Degraded", type: "yellow" },
    { label: "APIs", status: "Healthy", type: "green" },
    { label: "Worker", status: "Healthy", type: "green" },
    { label: "Email", status: "Healthy", type: "green" },
    { label: "Payments", status: "Healthy", type: "green" },
    { label: "Video", status: "Healthy", type: "green" },
    { label: "Storage", status: "Healthy", type: "green" },
    { label: "Queues", status: "Down", type: "red" },
  ];

  return (
    <div className="space-y-6 max-w-[1600px]">
      
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#1F2622]">Operational Overview</h1>
          <p className="text-[13px] text-[#6B746F]">Real-time analytics for this week range.</p>
        </div>
        
        {/* Date Filter */}
        <div className="flex items-center bg-white border border-[#E3DED3] rounded-lg p-1 text-[13px] font-semibold text-[#6B746F] shadow-sm">
          <button className="px-3 py-1 bg-[#EDF4F0] text-[#1F2622] rounded-md transition-colors">Today</button>
          <button className="px-3 py-1 hover:text-[#1F2622] transition-colors">7d</button>
          <button className="px-3 py-1 hover:text-[#1F2622] transition-colors">30d</button>
          <button className="px-3 py-1 hover:text-[#1F2622] transition-colors">Quarter</button>
          <button className="px-3 py-1 hover:text-[#1F2622] transition-colors">Custom</button>
        </div>
      </div>

      {/* 1. Top Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {topMetrics.map((m, i) => (
          <div key={i} className="bg-white border border-[#E3DED3] rounded-xl p-4 shadow-sm relative overflow-hidden flex flex-col justify-between h-28">
            <div>
              <p className="text-xs font-bold text-[#1F2622]">{m.label}</p>
              <div className="flex items-baseline gap-2 mt-1">
                <h3 className="text-2xl font-black text-[#1F2622] tracking-tight">{m.value}</h3>
                <span className="text-[11px] font-bold text-[#2F6B57] flex items-center">
                  <span className="mr-0.5">▲</span>{m.trend}
                </span>
              </div>
            </div>
            {/* Fake Sparkline using SVG */}
            <div className="absolute bottom-0 left-0 right-0 h-10 opacity-30">
               <svg viewBox="0 0 100 30" className="w-full h-full" preserveAspectRatio="none">
                 <path d="M0 30 L0 25 L10 20 L20 28 L30 15 L40 22 L50 10 L60 18 L70 5 L80 12 L90 2 L100 8 L100 30 Z" fill="#2F6B57" opacity="0.2"/>
                 <path d="M0 25 L10 20 L20 28 L30 15 L40 22 L50 10 L60 18 L70 5 L80 12 L90 2 L100 8" fill="none" stroke="#2F6B57" strokeWidth="1.5"/>
               </svg>
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid Layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Left Column (Funnel, Finance, Cases) */}
        <div className="flex-1 flex flex-col gap-6">
          
          {/* Funnel */}
          <div className="bg-[#FAF9F5] border border-[#E3DED3] rounded-xl p-5 shadow-sm">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-[15px] font-bold text-[#1F2622]">Application Funnel</h2>
                <p className="text-xs text-[#6B746F]">Dynamic funnel chart in an stages with filtered records.</p>
              </div>
              <button className="text-[11px] font-semibold text-[#6B746F] hover:text-[#1F2622] px-3 py-1 bg-white border border-[#E3DED3] rounded-md shadow-sm">
                Filtered Record
              </button>
            </div>

            <div className="flex items-center justify-between pb-4">
              <span className="text-[11px] font-semibold text-[#6B746F] hover:text-[#2F6B57] hover:underline cursor-pointer">Filtered record &gt;</span>
              
              <div className="flex-1 flex items-center justify-center gap-1 mx-4">
                {funnelSteps.map((step, i) => (
                  <div key={i} className="flex items-center">
                    <div className={`${step.h} min-w-[70px] bg-[#3B5A46] rounded-sm flex flex-col items-center justify-center text-white p-2 shadow-sm transition-transform hover:scale-105 cursor-pointer`}>
                      <span className="text-[11px] font-medium leading-tight text-center">{step.label}</span>
                      <span className="text-xs font-bold mt-1">({step.value})</span>
                    </div>
                    {i < funnelSteps.length - 1 && (
                      <ArrowRight size={14} className="text-[#94A3B8] mx-1" />
                    )}
                  </div>
                ))}
              </div>

              <span className="text-[11px] font-semibold text-[#6B746F] hover:text-[#2F6B57] hover:underline cursor-pointer">Filtered record &gt;</span>
            </div>
          </div>

          {/* Finance & Cases Row */}
          <div className="flex flex-col md:flex-row gap-6">
            
            {/* Finance block */}
            <div className="flex-1 bg-[#FAF9F5] border border-[#E3DED3] rounded-xl p-5 shadow-sm">
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-[15px] font-bold text-[#1F2622]">Finance</h2>
                <button className="text-xs font-bold bg-[#1F2622] text-white px-3 py-1.5 rounded-md hover:bg-[#2A332E]">
                  View Details
                </button>
              </div>

              <div className="grid grid-cols-3 gap-6 h-[200px]">
                {/* Revenue Trend */}
                <div className="flex flex-col">
                  <h3 className="text-xs font-bold text-[#1F2622] mb-3 border-b border-[#E3DED3] pb-1">Revenue Trend</h3>
                  <div className="flex-1 relative flex items-end pb-5">
                     <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
                       <path d="M0 80 Q 20 90, 40 60 T 70 40 T 100 10" fill="none" stroke="#2F6B57" strokeWidth="2"/>
                     </svg>
                     <div className="absolute bottom-0 w-full flex justify-between text-[8px] text-[#6B746F] font-bold mt-1">
                       <span>January</span>
                       <span>August</span>
                       <span>December</span>
                     </div>
                     <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-[8px] text-[#6B746F] font-bold -ml-2">
                       <span>3350</span>
                       <span>2250</span>
                       <span>1200</span>
                       <span>0</span>
                     </div>
                  </div>
                </div>

                {/* Revenue by Product */}
                <div className="flex flex-col">
                  <h3 className="text-xs font-bold text-[#1F2622] mb-3 border-b border-[#E3DED3] pb-1">Revenue by Product</h3>
                  <div className="flex-1 relative flex items-end justify-between pb-5 pt-2">
                     <div className="w-1/5 bg-[#2F6B57] h-[20%] rounded-t-sm"></div>
                     <div className="w-1/5 bg-[#2F6B57] h-[40%] rounded-t-sm"></div>
                     <div className="w-1/5 bg-[#2F6B57] h-[60%] rounded-t-sm"></div>
                     <div className="w-1/5 bg-[#2F6B57] h-[100%] rounded-t-sm"></div>
                     
                     <div className="absolute bottom-0 w-full flex justify-between text-[8px] text-[#6B746F] font-bold mt-1">
                       <span className="transform -rotate-45 origin-top-left">Product 1</span>
                       <span className="transform -rotate-45 origin-top-left ml-4">Product 2</span>
                       <span className="transform -rotate-45 origin-top-left ml-4">Product 3</span>
                       <span className="transform -rotate-45 origin-top-left ml-4">Product 4</span>
                     </div>
                     <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-[8px] text-[#6B746F] font-bold -ml-8">
                       <span>€150,000</span>
                       <span>€75,000</span>
                       <span>€25,000</span>
                       <span>0</span>
                     </div>
                  </div>
                </div>

                {/* Recent Orders */}
                <div className="flex flex-col">
                  <h3 className="text-xs font-bold text-[#1F2622] mb-3 border-b border-[#E3DED3] pb-1">Recent Orders</h3>
                  <div className="flex-1 space-y-2 overflow-y-auto scrollbar-hide">
                    {[1,2,3,4,5].map(i => (
                      <div key={i} className="flex items-center justify-between bg-white px-2 py-1.5 rounded-md border border-[#E3DED3] shadow-sm">
                        <div className="flex flex-col">
                          <span className="text-[10px] font-bold text-[#1F2622]">Order #1234{i}</span>
                          <span className="text-[9px] text-[#6B746F]">Child: Ioana Popa</span>
                        </div>
                        <button className="bg-[#2F6B57] text-white text-[9px] font-bold px-2 py-1 rounded hover:bg-[#1F2622]">Assign</button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Cases block */}
            <div className="flex-[0.8] bg-[#FAF9F5] border border-[#E3DED3] rounded-xl p-5 shadow-sm">
               <div className="flex justify-between items-center mb-5">
                <h2 className="text-[15px] font-bold text-[#1F2622]">Cases</h2>
                <button className="text-xs font-bold bg-[#1F2622] text-white px-3 py-1.5 rounded-md hover:bg-[#2A332E]">
                  Create ∨
                </button>
              </div>

              <div className="flex gap-4 h-[200px]">
                {/* Cases by Stage */}
                <div className="flex-1 flex flex-col">
                  <h3 className="text-xs font-bold text-[#1F2622] mb-3 border-b border-[#E3DED3] pb-1">Cases by Stage</h3>
                  <div className="flex-1 flex flex-col items-center">
                    {/* Fake Donut Chart */}
                    <div className="w-24 h-24 rounded-full border-[12px] border-[#2F6B57] border-r-[#B7791F] border-b-[#B4453A] border-l-[#E3DED3] relative flex items-center justify-center">
                      <div className="w-16 h-16 bg-[#FAF9F5] rounded-full absolute"></div>
                    </div>
                    
                    <div className="w-full mt-4 space-y-1">
                      <div className="flex justify-between text-[10px] font-bold text-[#1F2622]"><span>Awaiting Parent</span><span>30% &gt;</span></div>
                      <div className="flex justify-between text-[10px] font-bold text-[#1F2622]"><span>Awaiting Specialist</span><span>25% &gt;</span></div>
                      <div className="flex justify-between text-[10px] font-bold text-[#1F2622]"><span>Overdue</span><span>10% &gt;</span></div>
                    </div>
                  </div>
                </div>

                {/* Sessions Today */}
                <div className="flex-1 flex flex-col">
                  <h3 className="text-xs font-bold text-[#1F2622] mb-3 border-b border-[#E3DED3] pb-1">Sessions Today</h3>
                  <div className="flex-1 space-y-2 overflow-y-auto scrollbar-hide text-[11px] font-semibold text-[#6B746F]">
                    <div className="flex justify-between"><span>Awaiting Parent</span><span className="text-[#1F2622]">15</span></div>
                    <div className="flex justify-between"><span>Awaiting Specialist</span><span className="text-[#1F2622]">15</span></div>
                    <div className="flex justify-between"><span>Overdue</span><span className="text-[#1F2622]">15</span></div>
                    <div className="flex justify-between"><span>Interpretation</span><span className="text-[#1F2622]">15</span></div>
                    <div className="flex justify-between"><span>Completed</span><span className="text-[#1F2622]">15</span></div>
                    <div className="flex justify-between"><span>In Progress</span><span className="text-[#1F2622]">15</span></div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Right Sidebar Area (Attention, Specialists, Health) */}
        <div className="w-full lg:w-[320px] flex flex-col gap-6">
          
          {/* Attention Center */}
          <div>
            <div className="flex justify-between items-end mb-2">
              <h2 className="text-[15px] font-bold text-[#1F2622]">Attention Center</h2>
            </div>
            <p className="text-[11px] text-[#6B746F] mb-3">Real alerts with severity: <span className="text-[#B4453A] font-bold">Red</span>/<span className="text-[#B7791F] font-bold">Yellow</span></p>
            
            <div className="space-y-2">
              {alerts.map((alert, i) => (
                <div key={i} className={`p-3 rounded-lg border ${
                  alert.type === 'red' ? 'bg-[#FEF2F2] border-[#FECACA]' : 'bg-[#FFFBEB] border-[#FDE68A]'
                } shadow-sm flex items-center justify-between`}>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-[#1F2622]">{alert.title}</span>
                    <span className="text-[10px] font-medium text-[#6B746F] mt-0.5">{alert.desc}</span>
                  </div>
                  <button className="bg-white border border-[#E3DED3] px-2 py-1 text-[10px] font-bold rounded shadow-sm hover:bg-gray-50">
                    {alert.action}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Specialists */}
          <div className="bg-[#FAF9F5] border border-[#E3DED3] rounded-xl p-4 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-[15px] font-bold text-[#1F2622]">Specialists</h2>
              <button className="text-[11px] font-bold bg-[#2F6B57] text-white px-3 py-1 rounded hover:bg-[#1F2622]">
                Create ∨
              </button>
            </div>
            
            <div className="space-y-2 text-[12px] font-semibold text-[#1F2622]">
              <div className="flex justify-between border-b border-[#E3DED3] pb-1"><span className="text-[#6B746F]">Active Specialists</span><span>152 <span className="text-gray-300 mx-1">|</span> 322</span></div>
              <div className="flex justify-between border-b border-[#E3DED3] pb-1"><span className="text-[#6B746F]">Case Load</span><span>234 <span className="text-gray-300 mx-1">|</span> 288</span></div>
              <div className="flex justify-between border-b border-[#E3DED3] pb-1"><span className="text-[#6B746F]">Sessions/Week</span><span>105 <span className="text-gray-300 mx-1">|</span> 2,716</span></div>
              <div className="flex justify-between border-b border-[#E3DED3] pb-1"><span className="text-[#6B746F]">Overdue Actions</span><span>0 <span className="text-gray-300 mx-1">|</span> 0</span></div>
              <div className="flex justify-between pb-1"><span className="text-[#6B746F]">Capacity (%)</span><span>88% <span className="text-gray-300 mx-1">|</span> 100% (8%)</span></div>
            </div>
          </div>

          {/* System Health */}
          <div>
            <div className="flex justify-between items-end mb-2">
              <h2 className="text-[15px] font-bold text-[#1F2622]">System Health</h2>
              <p className="text-[10px] font-bold"><span className="text-[#2F6B57]">Healthy</span> / <span className="text-[#B7791F]">Degraded</span> / <span className="text-[#B4453A]">Down</span></p>
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              {healthNodes.map((node, i) => (
                <div key={i} className={`flex flex-col items-center justify-center p-2 rounded-lg border ${
                  node.type === 'green' ? 'bg-[#EDF4F0] border-[#2F6B57]/20 text-[#2F6B57]' :
                  node.type === 'yellow' ? 'bg-[#FFFBEB] border-[#FDE68A] text-[#B7791F]' :
                  'bg-[#FEF2F2] border-[#FECACA] text-[#B4453A]'
                }`}>
                  <Database size={16} className="mb-1 opacity-80" />
                  <span className="text-[10px] font-bold">{node.label}</span>
                  <span className="text-[9px] font-semibold opacity-80">{node.status}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
