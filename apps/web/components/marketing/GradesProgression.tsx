export function GradesProgression() {
  const steps = [
    {
      grade: "CLASA A VIII-A",
      title: "Liceu, profil, specializare",
      question: "Ce aleg după gimnaziu?",
    },
    {
      grade: "CLASELE IX–X",
      title: "Explorare și autocunoaștere",
      question: "Ce domenii mi s-ar putea potrivi?",
    },
    {
      grade: "CLASA A XI-A",
      title: "Direcții și opțiuni",
      question: "Ce facultăți și trasee merită explorate?",
    },
    {
      grade: "CLASA A XII-A",
      title: "Decizie și tranziție",
      question: "Care este următorul pas concret?",
    },
  ];

  return (
    <section className="bg-[#FFFDF8] py-24 md:py-32 border-b border-[#E3DED3]">
      <div className="container mx-auto px-4 max-w-[1000px]">
        
        <div className="mb-20">
          <h2 className="text-3xl md:text-5xl font-semibold text-[#1F2622] tracking-tight">
            Fiecare etapă vine <br className="hidden md:block" />cu alte întrebări.
          </h2>
        </div>

        <div className="relative border-l-2 border-[#E3DED3] ml-4 md:ml-8 pl-8 md:pl-16 space-y-16">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Timeline marker */}
              <div className="absolute -left-[41px] md:-left-[73px] top-1.5 w-5 h-5 rounded-full bg-[#FFFDF8] border-[4px] border-[#2F6B57] shadow-sm" />
              
              <span className="inline-block px-3 py-1 bg-[#EDF4F0] text-[#2F6B57] text-[11px] font-bold tracking-widest uppercase rounded-md mb-4">
                {step.grade}
              </span>
              
              <h3 className="text-xl md:text-2xl font-medium text-[#1F2622] tracking-tight mb-2">
                {step.title}
              </h3>
              
              <p className="text-[17px] md:text-lg font-semibold text-[#6B746F] italic">
                « {step.question} »
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
