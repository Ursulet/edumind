import Link from "next/link";
import { Button } from "@edumind/ui";
import { ArrowRight, Check } from "lucide-react";

export function StudentParentSplit() {
  return (
    <section className="bg-[#F7F5F0]">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        
        {/* Left Side: Student */}
        <div className="bg-[#EDF4F0] px-6 py-20 lg:px-20 lg:py-32 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-[#E3DED3]">
          <div className="max-w-md mx-auto lg:ml-auto lg:mr-10 w-full">
            <span className="inline-block px-3 py-1 rounded-full bg-[#DCE8E1] text-[#2F6B57] text-[11px] font-bold tracking-widest uppercase mb-8">
              Sunt elev
            </span>
            <h2 className="text-3xl md:text-4xl font-semibold text-[#1F2622] tracking-tight leading-snug mb-8">
              Descoperă ce ți se potrivește fără să ți se spună ce <span className="italic">«trebuie»</span> să devii.
            </h2>
            <ul className="space-y-4 mb-10">
              {[
                "Înțelege ce te atrage și la ce ești bun",
                "Descoperă domenii noi",
                "Compară trasee educaționale",
                "Explorează meserii și facultăți",
                "Construiește un plan realist"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="mt-0.5 rounded-full bg-[#2F6B57]/10 p-1">
                    <Check className="w-4 h-4 text-[#2F6B57]" />
                  </div>
                  <span className="text-[15px] font-medium text-[#1F2622]">{item}</span>
                </li>
              ))}
            </ul>
            <Link href="/cum-functioneaza">
              <Button className="bg-[#2F6B57] hover:bg-[#275B4A] text-white rounded-xl shadow-sm gap-2">
                Descoperă experiența pentru elevi <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Right Side: Parent */}
        <div className="bg-[#FFFDF8] px-6 py-20 lg:px-20 lg:py-32 flex flex-col justify-center">
          <div className="max-w-md mx-auto lg:mr-auto lg:ml-10 w-full">
            <span className="inline-block px-3 py-1 rounded-full bg-[#E3DED3]/50 text-[#6B746F] text-[11px] font-bold tracking-widest uppercase mb-8">
              Sunt părinte
            </span>
            <h2 className="text-3xl md:text-4xl font-semibold text-[#1F2622] tracking-tight leading-snug mb-8">
              Ajută-l să aleagă informat, fără să alegi în locul lui.
            </h2>
            <ul className="space-y-4 mb-10">
              {[
                "Înțelegi mai bine profilul copilului",
                "Primești concluzii explicate",
                "Descoperi alternative educaționale",
                "Participi la proces atunci când este relevant",
                "Primești un raport și pași concreți"
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="mt-0.5 rounded-full bg-[#E3DED3] p-1">
                    <Check className="w-4 h-4 text-[#6B746F]" />
                  </div>
                  <span className="text-[15px] font-medium text-[#1F2622]">{item}</span>
                </li>
              ))}
            </ul>
            <Link href="/cum-functioneaza">
              <Button variant="outline" className="border-[#E3DED3] text-[#1F2622] hover:bg-[#F1EEE7] rounded-xl gap-2">
                Vezi cum poate ajuta EduMind <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}
