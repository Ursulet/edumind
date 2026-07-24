export function SocialProof() {
  return (
    <section className="bg-[#F7F5F0] py-24 md:py-32 border-b border-[#E3DED3]">
      <div className="container mx-auto px-4 max-w-[1280px]">
        
        <div className="text-center mb-16 md:mb-24">
          <h2 className="text-3xl md:text-5xl font-semibold text-[#1F2622] tracking-tight leading-snug">
            Decizii mai clare. Conversații mai bune.
          </h2>
        </div>

        {/* Aggregate statistics placeholder */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 border-b border-[#E3DED3] pb-20">
          <div className="text-center">
            <h3 className="text-4xl md:text-5xl font-bold text-[#2F6B57] mb-2">[ -- ]</h3>
            <p className="text-[15px] font-medium text-[#6B746F]">Elevi consiliați</p>
          </div>
          <div className="text-center">
            <h3 className="text-4xl md:text-5xl font-bold text-[#2F6B57] mb-2">[ -- ]%</h3>
            <p className="text-[15px] font-medium text-[#6B746F]">Claritate în alegerea profilului</p>
          </div>
          <div className="text-center">
            <h3 className="text-4xl md:text-5xl font-bold text-[#2F6B57] mb-2">[ -- ]</h3>
            <p className="text-[15px] font-medium text-[#6B746F]">Sesiuni de consiliere</p>
          </div>
        </div>

        {/* Testimonials placeholder */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
          {/* Student Testimonial */}
          <div className="bg-white p-8 md:p-10 rounded-2xl border border-[#E3DED3] shadow-sm">
            <div className="flex items-center gap-2 mb-6 text-[#A77A3D]">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i}>★</span>
              ))}
            </div>
            <p className="text-lg text-[#1F2622] italic mb-8 leading-relaxed">
              "[ Placeholder pentru testimonial elev. Aici va fi adăugat text real de la un elev care a trecut prin program și a reușit să își clarifice opțiunile educaționale folosind platforma EduMind. ]"
            </p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#EDF4F0] rounded-full flex items-center justify-center text-[#2F6B57] font-bold">E</div>
              <div>
                <p className="text-[15px] font-semibold text-[#1F2622]">[ Nume Elev ]</p>
                <p className="text-[13px] text-[#6B746F]">Clasa a XI-a, [ Liceu ]</p>
              </div>
            </div>
          </div>

          {/* Parent Testimonial */}
          <div className="bg-[#1F2622] p-8 md:p-10 rounded-2xl border border-[#2A332E] shadow-sm text-white">
            <div className="flex items-center gap-2 mb-6 text-[#A77A3D]">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i}>★</span>
              ))}
            </div>
            <p className="text-lg text-[#DCE8E1] italic mb-8 leading-relaxed">
              "[ Placeholder pentru testimonial părinte. Aici va fi adăugat text real din perspectiva părintelui, legat de modul în care rapoartele EduMind l-au ajutat să comunice mai bine cu copilul. ]"
            </p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#2A332E] rounded-full flex items-center justify-center text-[#DCE8E1] font-bold">P</div>
              <div>
                <p className="text-[15px] font-semibold text-white">[ Nume Părinte ]</p>
                <p className="text-[13px] text-[#94A3B8]">Părinte</p>
              </div>
            </div>
          </div>
        </div>

        {/* Partners placeholder */}
        <div className="text-center">
          <p className="text-[13px] font-bold tracking-widest text-[#6B746F] uppercase mb-8">
            Școli și instituții partenere
          </p>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-40 grayscale">
            <div className="text-xl font-bold font-serif">[ Logo Instituție ]</div>
            <div className="text-xl font-bold font-serif">[ Logo Liceu ]</div>
            <div className="text-xl font-bold font-serif">[ Logo Partener ]</div>
            <div className="text-xl font-bold font-serif">[ Logo Asociație ]</div>
          </div>
        </div>

      </div>
    </section>
  );
}
