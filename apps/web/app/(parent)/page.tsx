import Link from "next/link";
import { getUserFromToken } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Calendar, CheckCircle2, ChevronRight, FileText, PlayCircle, CreditCard, Activity, AlertCircle } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Acasă | EduCarieră Părinți",
};

export default async function ParentDashboard({ searchParams }: { searchParams: { caseId?: string } }) {
  const user = await getUserFromToken();
  if (!user) redirect("/login");

  // Mocked state for presentation
  const child = {
    firstName: "Andrei",
    lastName: "Popescu",
    grade: "Clasa a 8-a",
    program: "Program Orientare Școlară",
    specialist: "Elena Rusu (Psiholog)",
  };

  const nextAction = {
    title: "Completează Evaluarea Inițială",
    description: "Pentru a merge la următorul pas, te rugăm să completezi setul de întrebări despre parcursul dorit.",
    cta: "Pornește Testul",
    url: "/evaluare"
  };

  const upcomingSession = {
    date: "14 Octombrie 2026",
    day: "Miercuri",
    time: "10:00",
    specialist: "Elena Rusu",
    type: "Consiliere Vocațională",
    duration: "60 minute"
  };

  const journeySteps = [
    { label: "Înscriere", status: "COMPLETED" },
    { label: "Evaluare", status: "ACTIVE" },
    { label: "Consiliere", status: "UPCOMING" },
    { label: "Plan Carieră", status: "UPCOMING" },
  ];

  return (
    <div className="w-full py-6 md:py-8 px-4 md:px-8 max-w-6xl mx-auto">
      
      {/* Grid container with specific mobile ordering */}
      <div className="flex flex-col md:grid md:grid-cols-12 gap-6">
        
        {/* 1. CHILD CONTEXT */}
        <div className="order-1 md:col-span-12 flex flex-col md:flex-row md:items-end justify-between border-b border-[#E3DED3] pb-4 mb-2 gap-4">
          <div>
            <h1 className="text-[26px] font-bold text-[#1F2622] tracking-tight">
              Parcursul lui {child.firstName}
            </h1>
            <div className="flex items-center gap-3 mt-1.5">
              <span className="text-[13px] font-medium text-[#6B746F] bg-white border border-[#E3DED3] px-2.5 py-0.5 rounded-full">
                {child.grade}
              </span>
              <span className="text-[13px] font-medium text-[#6B746F] bg-white border border-[#E3DED3] px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
                <PlayCircle size={14} className="text-[#2F6B57]" /> {child.program}
              </span>
            </div>
          </div>
          <div className="text-left md:text-right">
            <span className="block text-[11px] font-bold uppercase tracking-widest text-[#6B746F]">Specialist alocat</span>
            <span className="text-[14px] font-bold text-[#1F2622]">{child.specialist}</span>
          </div>
        </div>

        {/* Left Column (Main content) */}
        <div className="order-2 md:order-2 md:col-span-8 space-y-6 flex flex-col">
          
          {/* 2. JOURNEY PROGRESS */}
          <div className="order-2 space-y-2.5">
            <h3 className="text-[13px] font-bold text-[#1F2622] uppercase tracking-wide">Status Curent</h3>
            <div className="bg-white border border-[#E3DED3] rounded-2xl p-6 shadow-sm overflow-hidden">
              <div className="relative flex justify-between">
                <div className="absolute top-4 left-6 right-6 h-[2px] bg-[#F7F5F0] -z-10" />
                {journeySteps.map((step, i) => {
                  const isDone = step.status === "COMPLETED";
                  const isActive = step.status === "ACTIVE";
                  return (
                    <div key={i} className="flex flex-col items-center gap-3 relative bg-white px-2">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all ${
                          isDone
                            ? "bg-[#2F6B57] text-white shadow-md shadow-[#2F6B57]/20"
                            : isActive
                            ? "bg-white border-2 border-[#2F6B57] text-[#2F6B57] shadow-sm"
                            : "bg-[#F7F5F0] border border-[#E3DED3] text-[#94A3B8]"
                        }`}
                      >
                        {isDone ? <CheckCircle2 size={18} /> : i + 1}
                      </div>
                      <span className={`text-[12px] font-bold ${isDone || isActive ? "text-[#1F2622]" : "text-[#94A3B8]"}`}>
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 3. NEXT ACTION (Dominant) */}
          <div className="order-3 bg-[#1F2622] rounded-2xl p-7 text-white shadow-lg relative overflow-hidden">
             <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
             <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <AlertCircle size={16} className="text-[#FDE68A]" />
                    <span className="text-[11px] font-bold uppercase tracking-widest text-[#FDE68A]">Următorul pas necesar</span>
                  </div>
                  <h2 className="text-[22px] font-bold leading-tight mb-2">{nextAction.title}</h2>
                  <p className="text-[14px] text-gray-300 max-w-lg leading-relaxed">
                    {nextAction.description}
                  </p>
                </div>
                <Link href={nextAction.url} className="shrink-0 bg-[#2F6B57] hover:bg-[#388068] text-white px-6 py-3.5 rounded-xl font-bold transition-colors shadow-lg">
                  {nextAction.cta}
                </Link>
             </div>
          </div>

          {/* 5. RECOMMENDATIONS & ACTIVE PROGRAM */}
          <div className="order-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
             {/* Active Program */}
             <div className="bg-white border border-[#E3DED3] rounded-2xl p-5 shadow-sm hover:border-[#2F6B57] transition-colors group">
               <div className="flex items-center gap-2 text-[#6B746F] mb-3">
                 <Activity size={18} />
                 <h4 className="text-[13px] font-bold uppercase tracking-wide">Programul Activ</h4>
               </div>
               <p className="text-[15px] font-bold text-[#1F2622]">{child.program}</p>
               <p className="text-[13px] text-[#6B746F] mt-1 mb-4">4 ședințe incluse · 2 rămase</p>
               <Link href="/program-activ" className="inline-flex items-center text-[13px] font-bold text-[#2F6B57] hover:underline">
                 Vezi progresul <ChevronRight size={16} />
               </Link>
             </div>
             
             {/* Recommendation */}
             <div className="bg-[#FFFDF8] border border-[#FDE68A] rounded-2xl p-5 shadow-sm">
               <div className="flex justify-between items-center mb-3">
                 <div className="flex items-center gap-2 text-[#B7791F]">
                   <span className="w-2 h-2 rounded-full bg-[#B7791F] animate-pulse"></span>
                   <h4 className="text-[13px] font-bold uppercase tracking-wide">Recomandare Nouă</h4>
                 </div>
               </div>
               <p className="text-[15px] font-bold text-[#1F2622]">Pachet Extins Vocațional</p>
               <p className="text-[13px] text-[#6B746F] mt-1 mb-4">Recomandat de Elena Rusu</p>
               <Link href="/recomandari" className="inline-flex items-center justify-center w-full bg-[#FEF3C7] text-[#B7791F] py-2 rounded-lg text-[13px] font-bold hover:bg-[#FDE68A] transition-colors">
                 Vezi detalii
               </Link>
             </div>
          </div>

          {/* 7. REPORTS (Preview) */}
          <div className="order-7">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[14px] font-bold text-[#1F2622]">Ultimele Rapoarte</h3>
              <Link href="/rapoarte" className="text-[12px] font-bold text-[#2F6B57] hover:underline">Toate rapoartele</Link>
            </div>
            <div className="bg-white border border-[#E3DED3] rounded-2xl overflow-hidden shadow-sm">
              <div className="p-4 flex items-center justify-between border-b border-[#E3DED3] hover:bg-[#F7F5F0] transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#EDF4F0] flex items-center justify-center text-[#2F6B57]">
                    <FileText size={20} />
                  </div>
                  <div>
                    <p className="text-[14px] font-bold text-[#1F2622]">Raport Evaluare Psihologică</p>
                    <p className="text-[12px] text-[#6B746F]">Publicat: 10 Oct 2026</p>
                  </div>
                </div>
                <span className="text-[13px] font-bold text-[#2F6B57]">Descarcă</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column (Sidebar metrics) */}
        <div className="order-4 md:order-3 md:col-span-4 flex flex-col gap-6">
          
          {/* 4. UPCOMING SESSION */}
          <div className="order-4 bg-white border border-[#E3DED3] rounded-2xl overflow-hidden shadow-sm">
            <div className="p-5 border-b border-[#E3DED3] flex items-center gap-2 bg-[#F7F5F0]">
              <Calendar size={18} className="text-[#2F6B57]" />
              <h3 className="text-[14px] font-bold text-[#1F2622]">Următoarea Ședință</h3>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-end mb-4">
                <div>
                  <span className="block text-[12px] font-bold text-[#6B746F] mb-1">{upcomingSession.day}</span>
                  <span className="text-[20px] font-bold text-[#1F2622]">{upcomingSession.date}</span>
                </div>
                <span className="text-[24px] font-black text-[#2F6B57]">{upcomingSession.time}</span>
              </div>
              <div className="space-y-1.5 mb-6">
                <p className="text-[13px] text-[#6B746F] flex items-center justify-between">
                  <span>Specialist:</span> <span className="font-bold text-[#1F2622]">{upcomingSession.specialist}</span>
                </p>
                <p className="text-[13px] text-[#6B746F] flex items-center justify-between">
                  <span>Tip:</span> <span className="font-bold text-[#1F2622]">{upcomingSession.type}</span>
                </p>
                <p className="text-[13px] text-[#6B746F] flex items-center justify-between">
                  <span>Durată:</span> <span className="font-bold text-[#1F2622]">{upcomingSession.duration}</span>
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <button className="col-span-2 bg-[#F7F5F0] hover:bg-[#EDF4F0] text-[#1F2622] py-2.5 rounded-lg text-[13px] font-bold transition-colors shadow-sm">
                  Reprogramează
                </button>
                <button className="col-span-2 bg-gray-100 text-gray-400 py-2.5 rounded-lg text-[13px] font-bold cursor-not-allowed">
                  Join Session (inactiv)
                </button>
              </div>
            </div>
          </div>

          {/* 8. PAYMENTS (Empty state example) */}
          <div className="order-8 bg-white border border-[#E3DED3] rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-3 text-[#1F2622]">
              <CreditCard size={18} />
              <h3 className="text-[14px] font-bold">Plăți restante</h3>
            </div>
            <div className="bg-[#F7F5F0] rounded-xl p-4 text-center">
              <p className="text-[13px] text-[#6B746F] font-medium">Nicio plată în așteptare.</p>
              <Link href="/plati" className="text-[12px] font-bold text-[#2F6B57] hover:underline mt-2 inline-block">Istoric plăți</Link>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
