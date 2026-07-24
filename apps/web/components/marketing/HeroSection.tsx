import Link from "next/link";
import { Button } from "@edumind/ui";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[#F7F5F0] pt-16 pb-24 md:pt-24 md:pb-32 lg:pt-32 lg:pb-40 border-b border-[#E3DED3]">
      <div className="container mx-auto px-4 max-w-[1280px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center">
          
          {/* Left Side: Content */}
          <div className="max-w-2xl">
            <span className="inline-block text-[13px] font-semibold tracking-[0.15em] text-[#2F6B57] uppercase mb-6">
              Orientare educațională & în carieră
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-[64px] font-semibold text-[#1F2622] tracking-[-0.04em] leading-[1.05] mb-6">
              Nu trebuie să știi de acum <br className="hidden md:block" />
              ce vei face toată viața.
            </h1>
            <p className="text-xl md:text-[22px] font-medium text-[#2F6B57] leading-snug mb-6">
              Trebuie să știi care este următorul pas potrivit pentru tine.
            </p>
            <p className="text-[17px] text-[#6B746F] leading-relaxed mb-10 max-w-lg">
              EduMind îi ajută pe elevii din clasele VIII–XII să își înțeleagă aptitudinile, interesele și opțiunile și să transforme incertitudinea într-un plan educațional clar.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 mb-10">
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

          {/* Right Side: Visual Product Composition */}
          <div className="relative h-[600px] lg:h-[700px] flex items-center justify-center lg:justify-end">
            
            {/* Background decorative blob / gradient (subtle) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-tr from-[#2F6B57]/10 to-[#DCE8E1]/40 rounded-full blur-3xl" />
            
            {/* Decorative Squiggly Line SVG */}
            <svg className="absolute -bottom-10 -left-10 w-48 h-48 text-[#1F2622]/10 rotate-12" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10.4578 86.8778C29.6206 58.7483 67.8927 41.5204 98.7118 61.1278C127.359 79.352 135.048 119.539 116.591 146.685C95.421 177.82 50.1472 181.714 26.6579 154.218C1.52984 124.802 8.79093 75.3344 35.8116 49.332C64.9126 21.3283 118.065 24.3642 148.818 55.4312C183.181 90.1444 179.624 149.262 141.675 181.082" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
            </svg>

            {/* Teenager Placeholder Image */}
            <div className="absolute right-0 lg:right-0 bottom-10 w-[360px] h-[500px] bg-[#EDF4F0] rounded-[2rem] border border-[#E3DED3] overflow-hidden shadow-lg object-cover z-10 flex items-center justify-center">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1531384441138-2736e62e0919?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center opacity-90" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1F2622]/40 to-transparent" />
            </div>

            {/* Floating EduMind Profile Card */}
            <div className="absolute right-[40px] lg:right-[180px] top-4 w-[320px] bg-white/95 backdrop-blur-xl rounded-2xl border border-white/50 shadow-[0_20px_40px_-15px_rgba(31,38,34,0.1)] z-20 overflow-hidden">
              <div className="px-6 py-4 border-b border-[#E3DED3]/50 bg-white/50">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#6B746F] mb-1">Profil EduMind</p>
                <h3 className="text-base font-bold text-[#1F2622]">ANDREI · CLASA A XI-A</h3>
              </div>
              
              <div className="p-6 space-y-6">
                <div>
                  <p className="text-[12px] font-medium text-[#6B746F] mb-1">Profil principal</p>
                  <p className="text-[15px] font-semibold text-[#2F6B57]">Analitic – Explorator</p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 font-medium text-[#1F2622]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2F6B57]" /> Analiză
                    </span>
                    <span className="font-semibold text-[#1F2622]">91%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 font-medium text-[#1F2622]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2F6B57]" /> Creativitate
                    </span>
                    <span className="font-semibold text-[#1F2622]">84%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 font-medium text-[#1F2622]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#2F6B57]" /> Comunicare
                    </span>
                    <span className="font-semibold text-[#1F2622]">78%</span>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#E3DED3]/50">
                  <p className="text-[12px] font-medium text-[#6B746F] mb-3">Direcții de explorat</p>
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-[#1F2622]">Psihologie</span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-[#EDF4F0] text-[#2F6B57]">92%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-[#1F2622]">UX Research</span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-[#EDF4F0] text-[#2F6B57]">88%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-[#1F2622]">Marketing</span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-[#EDF4F0] text-[#2F6B57]">82%</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <Link href="/cum-functioneaza" className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#2F6B57] hover:text-[#1F2622] transition-colors">
                    Vezi profilul complet <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>

            {/* Smaller floating element 1 */}
            <div className="absolute right-[-20px] lg:right-[-40px] bottom-32 bg-white shadow-xl rounded-xl p-3 flex items-center gap-3 z-30 border border-[#E3DED3]/50 animate-bounce" style={{ animationDuration: '3s' }}>
              <div className="w-8 h-8 rounded-full bg-[#EDF4F0] flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-[#2F6B57]" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#1F2622]">Evaluare completată</p>
                <p className="text-[11px] text-[#6B746F]">Acuratețe 82%</p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
