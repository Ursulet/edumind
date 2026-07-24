import Link from "next/link";
import { Button } from "@edumind/ui";
import { ArrowRight, ChevronRight, Briefcase } from "lucide-react";

const CAREERS = [
  {
    title: "Cybersecurity",
    what: "Protejează sisteme, rețele și date împotriva atacurilor cibernetice.",
    skills: ["Analiză", "Atenție la detalii", "Problem-solving"],
    path: "Facultatea de Automatică / Cibernetică",
  },
  {
    title: "Design de Produs (UX)",
    what: "Proiectează interfețe și experiențe digitale centrate pe nevoile utilizatorilor.",
    skills: ["Empatie", "Comunicare vizuală", "Cercetare"],
    path: "Facultatea de Arte (Design) / Comunicare",
  },
  {
    title: "Inginerie Aerospațială",
    what: "Proiectează și testează avioane, rachete și sateliți.",
    skills: ["Matematică", "Fizică", "Gândire spațială"],
    path: "Facultatea de Inginerie Aerospațială",
  },
  {
    title: "Psihologie Clinică",
    what: "Evaluează și tratează tulburările emoționale și de comportament.",
    skills: ["Inteligență emoțională", "Ascultare", "Relaționare"],
    path: "Facultatea de Psihologie",
  }
];

export function CareersBrowser() {
  return (
    <section className="bg-[#F7F5F0] py-24 md:py-32 border-b border-[#E3DED3]">
      <div className="container mx-auto px-4 max-w-[1280px]">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-semibold text-[#1F2622] tracking-tight leading-snug mb-4">
              Există mult mai multe opțiuni decât meseriile pe care le auzim în fiecare zi.
            </h2>
            <p className="text-lg md:text-xl text-[#6B746F]">
              Explorează domenii, profesii și traseele educaționale care duc către ele.
            </p>
          </div>
          <Link href="/catalog" className="hidden md:block shrink-0">
            <Button variant="outline" className="border-[#E3DED3] text-[#1F2622] hover:bg-[#F1EEE7] h-12 px-6 rounded-xl font-medium gap-2">
              Explorează toate carierele <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {CAREERS.map((career, index) => (
            <div key={index} className="bg-white rounded-2xl border border-[#E3DED3] p-6 hover:shadow-lg transition-shadow group flex flex-col h-full">
              <div className="w-12 h-12 rounded-xl bg-[#EDF4F0] flex items-center justify-center mb-6">
                <Briefcase className="w-6 h-6 text-[#2F6B57]" />
              </div>
              <h3 className="text-xl font-semibold text-[#1F2622] mb-3 group-hover:text-[#2F6B57] transition-colors">
                {career.title}
              </h3>
              <p className="text-[14px] text-[#6B746F] mb-6 flex-1">
                {career.what}
              </p>
              
              <div className="space-y-4 pt-4 border-t border-[#E3DED3]">
                <div>
                  <p className="text-[11px] font-bold tracking-wider text-[#6B746F] uppercase mb-2">Aptitudini</p>
                  <p className="text-[13px] font-medium text-[#1F2622]">
                    {career.skills.join(" • ")}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-bold tracking-wider text-[#6B746F] uppercase mb-2">Traseu educațional</p>
                  <p className="text-[13px] font-medium text-[#1F2622]">
                    {career.path}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 md:hidden">
          <Link href="/catalog" className="w-full">
            <Button variant="outline" className="w-full border-[#E3DED3] text-[#1F2622] hover:bg-[#F1EEE7] h-12 rounded-xl font-medium gap-2">
              Explorează toate carierele <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>

      </div>
    </section>
  );
}
