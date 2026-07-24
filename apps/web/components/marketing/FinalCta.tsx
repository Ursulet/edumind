import Link from "next/link";
import { Button } from "@edumind/ui";

export function FinalCta() {
  return (
    <section className="bg-[#F7F5F0] py-24 md:py-32">
      <div className="container mx-auto px-4 max-w-[1000px] text-center">
        
        <div className="bg-[#2F6B57] rounded-3xl p-10 md:p-20 relative overflow-hidden shadow-xl border border-[#275B4A]">
          {/* Decorative subtle background element */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#3B8069] rounded-full blur-3xl opacity-50" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-[#1F2622] rounded-full blur-3xl opacity-50" />

          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-semibold text-white tracking-tight leading-snug mb-4">
              Nu trebuie să alegi viitorul astăzi.
            </h2>
            <h3 className="text-2xl md:text-3xl font-medium text-[#DCE8E1] tracking-tight mb-8">
              Dar poți începe să-l înțelegi.
            </h3>
            
            <p className="text-[17px] md:text-lg text-white/90 leading-relaxed mb-12">
              Începe procesul de orientare EduMind și transformă întrebările într-un plan.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
              <Link href="/inscriere" className="w-full sm:w-auto">
                <Button size="lg" className="w-full bg-white hover:bg-[#F7F5F0] text-[#2F6B57] px-8 h-14 text-[15px] font-bold rounded-xl transition-all shadow-sm">
                  Începe evaluarea
                </Button>
              </Link>
              <Link href="/cum-functioneaza" className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full border-white/30 text-white hover:bg-white/10 px-8 h-14 text-[15px] font-medium rounded-xl transition-all bg-transparent">
                  Vezi cum funcționează
                </Button>
              </Link>
            </div>

            <p className="text-[13px] font-medium text-[#DCE8E1]/80">
              Pentru elevii din clasele VIII–XII și familiile lor.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
