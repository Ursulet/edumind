import { CheckCircle2, ChevronRight, LayoutDashboard, Target, Activity, Map, ArrowRight } from "lucide-react";

export function ProductPreviewSection() {
  return (
    <section className="bg-[#1F2622] py-24 md:py-32 overflow-hidden">
      <div className="container mx-auto px-4 max-w-[1280px]">
        
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-24">
          <h2 className="text-3xl md:text-5xl font-semibold text-white tracking-tight leading-snug mb-6">
            Nu primești doar un rezultat.<br className="hidden md:block" />
            Primești o direcție.
          </h2>
          <p className="text-lg text-[#94A3B8] leading-relaxed">
            EduMind transformă informațiile despre elev într-un profil ușor de înțeles și într-un plan care poate fi pus în practică.
          </p>
        </div>

        {/* Dashboard Mockup */}
        <div className="relative mx-auto max-w-[1000px] rounded-[2rem] bg-[#FFFDF8] shadow-2xl overflow-hidden ring-1 ring-white/10">
          
          {/* Dashboard Header / Tabs */}
          <div className="flex items-center gap-6 px-6 pt-6 pb-4 border-b border-[#E3DED3] overflow-x-auto hide-scrollbar">
            {["Profil", "Interese", "Aptitudini", "Direcții profesionale", "Traseu educațional", "Plan de acțiune"].map((tab, i) => (
              <div 
                key={tab} 
                className={`whitespace-nowrap text-sm font-medium pb-4 border-b-2 -mb-[17px] ${i === 3 ? 'border-[#2F6B57] text-[#1F2622]' : 'border-transparent text-[#6B746F] hover:text-[#1F2622]'}`}
              >
                {tab}
              </div>
            ))}
          </div>

          {/* Dashboard Content */}
          <div className="p-6 md:p-10 grid grid-cols-1 md:grid-cols-12 gap-8 bg-[#F7F5F0]">
            
            {/* Main column */}
            <div className="md:col-span-7 space-y-6">
              
              <div className="bg-white rounded-2xl p-6 border border-[#E3DED3] shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-[#EDF4F0] flex items-center justify-center">
                    <Target className="w-5 h-5 text-[#2F6B57]" />
                  </div>
                  <div>
                    <h4 className="text-base font-semibold text-[#1F2622]">Compatibilitate domenii</h4>
                    <p className="text-[13px] text-[#6B746F]">Bazat pe interese și aptitudini validate</p>
                  </div>
                </div>

                <div className="space-y-5">
                  {[
                    { name: "Psihologie", pct: 92 },
                    { name: "Comunicare & Media", pct: 87 },
                    { name: "Design UX", pct: 81 },
                  ].map(domain => (
                    <div key={domain.name}>
                      <div className="flex justify-between text-sm font-medium text-[#1F2622] mb-2">
                        <span>{domain.name}</span>
                        <span>{domain.pct}%</span>
                      </div>
                      <div className="h-2.5 w-full bg-[#F7F5F0] rounded-full overflow-hidden">
                        <div className="h-full bg-[#2F6B57] rounded-full" style={{ width: `${domain.pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-[#E3DED3] shadow-sm">
                <h4 className="text-base font-semibold text-[#1F2622] mb-2">De ce aceste direcții?</h4>
                <p className="text-[14px] text-[#6B746F] leading-relaxed">
                  Profilul indică o afinitate ridicată pentru înțelegerea comportamentului uman și comunicare vizuală/verbală. Spre deosebire de domeniile strict tehnice, ai nevoie de un mediu colaborativ unde empatia și rezolvarea de probleme prin design aduc valoare.
                </p>
              </div>

            </div>

            {/* Sidebar column */}
            <div className="md:col-span-5 space-y-6">
              
              <div className="bg-white rounded-2xl p-6 border border-[#E3DED3] shadow-sm">
                <h4 className="text-[13px] font-bold tracking-wider text-[#6B746F] uppercase mb-4">Aptitudini Cheie</h4>
                <div className="flex flex-wrap gap-2">
                  {["Empatie", "Comunicare", "Analiză", "Creativitate", "Ascultare activă"].map(skill => (
                    <span key={skill} className="px-3 py-1.5 bg-[#EDF4F0] text-[#2F6B57] text-[13px] font-semibold rounded-lg">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-[#2F6B57] rounded-2xl p-6 text-white shadow-sm relative overflow-hidden">
                <div className="relative z-10">
                  <h4 className="text-lg font-semibold mb-2">Următorul pas</h4>
                  <p className="text-[13px] text-white/80 mb-5 leading-relaxed">
                    Explorează planul educațional detaliat pentru a vedea ce opțiuni de facultate se aliniază cu acest profil.
                  </p>
                  <button className="flex items-center gap-2 text-sm font-semibold bg-white text-[#1F2622] px-4 py-2 rounded-lg hover:bg-[#F7F5F0] transition-colors">
                    Deschide planul educațional <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
                {/* Decorative shape */}
                <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
