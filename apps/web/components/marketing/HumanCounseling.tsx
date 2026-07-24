import { Plus } from "lucide-react";

export function HumanCounseling() {
  return (
    <section className="bg-[#FFFDF8] py-24 md:py-32 border-b border-[#E3DED3] overflow-hidden">
      <div className="container mx-auto px-4 max-w-[1280px]">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <div className="order-2 lg:order-1 relative h-[500px] lg:h-[650px] rounded-[2rem] overflow-hidden">
            {/* Elegant image placeholder - authentic conversation aesthetic */}
            <div className="absolute inset-0 bg-[#EDF4F0]">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=1000&auto=format&fit=crop')] bg-cover bg-center mix-blend-multiply opacity-90 grayscale-[20%]" />
            </div>
            
            {/* Overlay card */}
            <div className="absolute bottom-8 left-8 right-8 bg-white/95 backdrop-blur-md p-6 rounded-2xl border border-white/50 shadow-xl">
              <p className="text-[15px] font-medium text-[#1F2622] italic leading-relaxed">
                "Un test îți dă un scor. Un consilier te ajută să înțelegi ce faci cu acel scor luni dimineață."
              </p>
            </div>
          </div>

          <div className="order-1 lg:order-2 max-w-xl">
            <h2 className="text-3xl md:text-5xl font-semibold text-[#1F2622] tracking-tight leading-snug mb-6">
              Tehnologia organizează informația.<br className="hidden md:block" />
              <span className="text-[#2F6B57]">Omul îi dă sens.</span>
            </h2>
            <p className="text-lg md:text-[20px] text-[#6B746F] leading-relaxed mb-12">
              Evaluările și instrumentele digitale ne ajută să construim o imagine mai clară. Consilierul ajută elevul să o înțeleagă, să pună întrebările potrivite și să transforme concluziile într-un plan realist.
            </p>

            {/* The equation */}
            <div className="bg-[#F7F5F0] rounded-2xl p-8 border border-[#E3DED3]">
              <div className="flex flex-col gap-4">
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-white border border-[#E3DED3] flex items-center justify-center shrink-0 shadow-sm text-lg">📝</div>
                  <span className="text-[17px] font-semibold text-[#1F2622]">Evaluare structurată</span>
                </div>
                
                <div className="pl-4">
                  <Plus className="w-5 h-5 text-[#6B746F]" />
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-white border border-[#E3DED3] flex items-center justify-center shrink-0 shadow-sm text-lg">🔍</div>
                  <span className="text-[17px] font-semibold text-[#1F2622]">Interpretare</span>
                </div>

                <div className="pl-4">
                  <Plus className="w-5 h-5 text-[#6B746F]" />
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#2F6B57] flex items-center justify-center shrink-0 shadow-sm text-lg">💬</div>
                  <span className="text-[17px] font-semibold text-[#1F2622]">Consiliere umană</span>
                </div>

                <div className="my-2 border-b-2 border-[#E3DED3]" />

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#1F2622] flex items-center justify-center shrink-0 shadow-sm text-lg">🎯</div>
                  <span className="text-xl font-bold text-[#1F2622]">Plan personalizat</span>
                </div>

              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
