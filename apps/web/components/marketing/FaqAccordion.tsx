"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQS = [
  {
    q: "Pentru ce vârste este potrivit EduMind?",
    a: "Platforma este concepută special pentru elevii din clasele VIII-XII, adaptând întrebările și instrumentele în funcție de etapa educațională în care se află."
  },
  {
    q: "Ce presupune evaluarea?",
    a: "Evaluarea constă dintr-o serie de module interactive care analizează interesele, aptitudinile și motivația elevului, construind treptat un profil complet, nu doar un simplu scor."
  },
  {
    q: "Este doar un test vocațional?",
    a: "Nu. EduMind este un proces complex care combină evaluarea cu interpretarea rezultatelor în context și recomandări concrete pentru traseul educațional și profesional."
  },
  {
    q: "Părintele vede rezultatele?",
    a: "Da, părintele primește acces la un raport adaptat, explicat pe înțelesul său, facilitând astfel o discuție constructivă și bazată pe date obiective."
  },
  {
    q: "Pot discuta rezultatele cu un consilier?",
    a: "Absolut. Recomandăm ca rezultatele să fie discutate împreună cu un consilier educațional pentru a adăuga nuanțe și a personaliza planul de acțiune."
  },
  {
    q: "Cât durează procesul?",
    a: "Completarea modulelor de evaluare durează în medie 45-60 de minute și poate fi întreruptă și reluată oricând."
  },
  {
    q: "Ce se întâmplă după evaluare?",
    a: "După evaluare primești Profilul EduMind, sugestii de domenii profesionale și opțiuni de liceu/facultate potrivite ție."
  }
];

export function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-[#FFFDF8] py-24 md:py-32 border-b border-[#E3DED3]">
      <div className="container mx-auto px-4 max-w-[800px]">
        
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-semibold text-[#1F2622] tracking-tight">
            Întrebări firești înainte de a începe.
          </h2>
        </div>

        <div className="bg-white rounded-2xl border border-[#E3DED3] p-4 md:p-8 shadow-sm">
          <div className="w-full flex flex-col gap-2">
            {FAQS.map((faq, i) => (
              <div key={i} className="border-b border-[#E3DED3] last:border-0 pb-4 last:pb-0">
                <button
                  onClick={() => toggle(i)}
                  className="w-full flex items-center justify-between text-left text-[17px] font-medium text-[#1F2622] hover:text-[#2F6B57] py-4 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${openIndex === i ? 'rotate-180' : ''}`} />
                </button>
                <div 
                  className={`grid transition-all duration-200 ease-in-out ${openIndex === i ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
                >
                  <div className="overflow-hidden">
                    <p className="text-[15px] text-[#6B746F] leading-relaxed pb-4">
                      {faq.a}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
