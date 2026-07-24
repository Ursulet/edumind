export function QuestionsSection() {
  return (
    <section className="bg-[#FFFDF8] py-24 md:py-32 border-b border-[#E3DED3]">
      <div className="container mx-auto px-4 max-w-[1000px] text-center">
        
        <h2 className="text-3xl md:text-5xl font-semibold text-[#1F2622] tracking-[-0.03em] leading-tight mb-6">
          Uneori, cea mai grea întrebare este:<br className="hidden md:block" />
          <span className="text-[#2F6B57] italic">«Și eu ce fac mai departe?»</span>
        </h2>
        
        <p className="text-lg md:text-xl text-[#6B746F] leading-relaxed max-w-2xl mx-auto mb-20">
          Alegerea unui liceu, a unui profil, a unei facultăți sau a unui domeniu profesional nu ar trebui să pornească din presiune, presupuneri sau întâmplare.
        </p>

        <div className="flex flex-col gap-8 md:gap-12 mb-20 text-left md:text-center">
          <div className="py-6 border-b border-[#E3DED3]">
            <h3 className="text-2xl md:text-4xl font-medium text-[#1F2622] tracking-tight">
              Ce profil aleg după clasa a VIII-a?
            </h3>
          </div>
          <div className="py-6 border-b border-[#E3DED3]">
            <h3 className="text-2xl md:text-4xl font-medium text-[#1F2622] tracking-tight">
              Ce facultate mi s-ar potrivi?
            </h3>
          </div>
          <div className="py-6 border-b border-[#E3DED3]">
            <h3 className="text-2xl md:text-4xl font-medium text-[#1F2622] tracking-tight">
              Cum îmi dau seama la ce sunt cu adevărat bun?
            </h3>
          </div>
        </div>

        <div className="max-w-3xl mx-auto bg-[#F7F5F0] p-10 rounded-2xl border border-[#E3DED3]">
          <p className="text-xl md:text-2xl font-semibold text-[#1F2622] mb-4">
            Un elev nu este un rezultat la un test.
          </p>
          <p className="text-[17px] text-[#6B746F] leading-relaxed">
            De aceea EduMind combină evaluarea, explorarea și consilierea pentru a construi recomandări care au context.
          </p>
        </div>

      </div>
    </section>
  );
}
