"use client";

import Link from "next/link";
import { Button } from "@edumind/ui";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[#F7F5F0] pt-12 pb-20 md:pt-20 md:pb-28 lg:pt-24 lg:pb-32 border-b border-[#E3DED3]">
      <div className="container mx-auto px-4 max-w-[1280px]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Side: Content (7 cols on desktop) */}
          <div className="lg:col-span-6 xl:col-span-6 max-w-2xl">
            <span className="inline-block text-[13px] font-semibold tracking-[0.15em] text-[#2F6B57] uppercase mb-5 bg-[#EDF4F0] px-3 py-1 rounded-full border border-[#2F6B57]/15">
              Orientare educațională & în carieră
            </span>
            <h1 className="text-3xl md:text-5xl lg:text-[56px] font-semibold text-[#1F2622] tracking-[-0.04em] leading-[1.08] mb-6">
              Nu trebuie să știi de acum <br className="hidden md:block" />
              ce vei face toată viața.
            </h1>
            <p className="text-lg md:text-[22px] font-medium text-[#2F6B57] leading-snug mb-5">
              Trebuie să știi care este următorul pas potrivit pentru tine.
            </p>
            <p className="text-[16px] md:text-[17px] text-[#6B746F] leading-relaxed mb-8 max-w-lg">
              EduMind îi ajută pe elevii din clasele VIII–XII să își înțeleagă aptitudinile, interesele și opțiunile și să transforme incertitudinea într-un plan educațional clar.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 mb-8">
              <Link href="/inscriere" className="w-full sm:w-auto">
                <Button size="lg" className="w-full bg-[#1F2622] hover:bg-[#2A332E] text-white px-8 h-14 text-[15px] font-semibold rounded-xl transition-all shadow-sm">
                  Începe evaluarea
                </Button>
              </Link>
              <Link href="/cum-functioneaza" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full border-[#E3DED3] text-[#1F2622] hover:bg-[#F1EEE7] px-8 h-14 text-[15px] font-medium rounded-xl transition-all bg-transparent">
                  Vezi cum funcționează
                </Button>
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] font-medium text-[#6B746F]">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-[#2F6B57]" /> Evaluare</span>
              <span className="hidden sm:inline text-[#E3DED3]">•</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-[#2F6B57]" /> Consiliere individuală</span>
              <span className="hidden sm:inline text-[#E3DED3]">•</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-[#2F6B57]" /> Raport personalizat</span>
              <span className="hidden sm:inline text-[#E3DED3]">•</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-[#2F6B57]" /> Plan educațional</span>
            </div>
          </div>

          {/* Right Side: Non-colliding Responsive Visual Composition (6 cols on desktop) */}
          <div className="lg:col-span-6 xl:col-span-6 flex flex-col items-center lg:items-end justify-center relative mt-6 lg:mt-0">
            
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] md:w-[420px] h-[280px] md:h-[420px] bg-gradient-to-tr from-[#2F6B57]/15 to-[#DCE8E1]/40 rounded-full blur-3xl -z-10" />

            {/* Container for Desktop vs Mobile layout */}
            <div className="w-full max-w-[540px] relative flex flex-col lg:block">

              {/* Main Photo (Parent + Teenager Student) */}
              <div className="w-full lg:w-[380px] h-[320px] sm:h-[400px] lg:h-[480px] lg:ml-auto rounded-3xl border border-[#E3DED3] overflow-hidden shadow-xl relative z-10 bg-[#EDF4F0]">
                <img
                  src="/hero-parent-student.png"
                  onError={(e) => {
                    // Fallback to high quality verified parent-student counseling photo
                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=1000&auto=format&fit=crop";
                  }}
                  alt="Mamă și elev discutând cu un consilier educațional"
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1F2622]/30 via-transparent to-transparent" />
              </div>

              {/* Floating Profile Card: Offset on Desktop, Stacked Below on Mobile */}
              <div className="mt-4 lg:mt-0 lg:absolute lg:top-8 lg:-left-12 w-full lg:w-[300px] bg-white/95 backdrop-blur-xl rounded-2xl border border-[#E3DED3] shadow-[0_15px_35px_-10px_rgba(31,38,34,0.15)] z-20 overflow-hidden">
                <div className="px-5 py-3.5 border-b border-[#E3DED3]/60 bg-[#FFFDF8]">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#6B746F] mb-0.5">Profil EduMind</p>
                  <h3 className="text-sm font-bold text-[#1F2622]">ANDREI · CLASA A XI-A</h3>
                </div>
                
                <div className="p-5 space-y-4">
                  <div>
                    <p className="text-[11px] font-semibold text-[#6B746F] mb-0.5">Profil principal</p>
                    <p className="text-[14px] font-bold text-[#2F6B57]">Analitic – Explorator</p>
                  </div>

                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between text-xs font-medium text-[#1F2622]">
                      <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#2F6B57]" /> Analiză
                      </span>
                      <span className="font-bold">91%</span>
                    </div>
                    <div className="flex items-center justify-between text-xs font-medium text-[#1F2622]">
                      <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#2F6B57]" /> Creativitate
                      </span>
                      <span className="font-bold">84%</span>
                    </div>
                    <div className="flex items-center justify-between text-xs font-medium text-[#1F2622]">
                      <span className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#2F6B57]" /> Comunicare
                      </span>
                      <span className="font-bold">78%</span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#E3DED3]/60">
                    <p className="text-[11px] font-semibold text-[#6B746F] mb-2">Direcții de explorat</p>
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-[#1F2622]">Psihologie</span>
                        <span className="font-bold px-2 py-0.5 rounded bg-[#EDF4F0] text-[#2F6B57]">92%</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-[#1F2622]">UX Research</span>
                        <span className="font-bold px-2 py-0.5 rounded bg-[#EDF4F0] text-[#2F6B57]">88%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Status Badge: Bottom Corner */}
              <div className="mt-3 lg:mt-0 lg:absolute lg:right-4 lg:-bottom-6 self-end bg-white shadow-lg rounded-xl p-3 flex items-center gap-3 z-30 border border-[#E3DED3]">
                <div className="w-8 h-8 rounded-full bg-[#EDF4F0] flex items-center justify-center text-[#2F6B57] shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-[#1F2622]">Evaluare completată</p>
                  <p className="text-[11px] text-[#6B746F]">Acuratețe 82%</p>
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
