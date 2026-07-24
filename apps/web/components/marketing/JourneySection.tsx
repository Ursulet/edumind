"use client";

import { useEffect, useRef, useState } from "react";

const STEPS = [
  {
    title: "Cunoaștem elevul",
    description: "Începem cu contextul educațional, obiectivele și întrebările lui.",
  },
  {
    title: "Evaluăm",
    description: "Explorăm interese, aptitudini, motivație și preferințe.",
  },
  {
    title: "Interpretăm",
    description: "Rezultatele sunt analizate în context, nu tratate ca simple scoruri.",
  },
  {
    title: "Explorăm",
    description: "Comparăm domenii profesionale și trasee educaționale.",
  },
  {
    title: "Construim traseul",
    description: "Transformăm concluziile în pași concreți.",
  },
  {
    title: "Discutăm rezultatele",
    description: "Elevul și familia primesc concluzii clare și argumentate.",
  },
];

export function JourneySection() {
  const [progress, setProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate how far the container is scrolled
      // Start progress when container top reaches middle of screen
      // End progress when container bottom reaches middle of screen
      const totalScrollable = rect.height;
      const scrolled = windowHeight / 2 - rect.top;
      
      let newProgress = (scrolled / totalScrollable) * 100;
      newProgress = Math.max(0, Math.min(100, newProgress));
      setProgress(newProgress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // initial check
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="bg-[#FFFDF8] py-24 md:py-32 border-b border-[#E3DED3] overflow-hidden" ref={containerRef}>
      <div className="container mx-auto px-4 max-w-[1280px]">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <h2 className="text-3xl md:text-5xl font-semibold text-[#1F2622] tracking-tight mb-4">
            De la întrebări la un plan clar.
          </h2>
          <p className="text-lg md:text-xl text-[#6B746F]">
            Un proces structurat, construit în jurul elevului.
          </p>
        </div>

        <div className="relative">
          {/* Timeline track (Mobile: vertical, Desktop: horizontal) */}
          <div className="absolute left-[27px] top-0 bottom-0 w-0.5 bg-[#E3DED3] lg:hidden" />
          <div className="hidden lg:block absolute top-[27px] left-0 right-0 h-0.5 bg-[#E3DED3]" />

          {/* Animated progress line */}
          <div 
            className="absolute left-[27px] top-0 w-0.5 bg-[#2F6B57] transition-all duration-300 ease-out lg:hidden"
            style={{ height: `${progress}%` }}
          />
          <div 
            className="hidden lg:block absolute top-[27px] left-0 h-0.5 bg-[#2F6B57] transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />

          {/* Steps */}
          <div className="grid grid-cols-1 lg:grid-cols-6 gap-8 lg:gap-4 relative">
            {STEPS.map((step, index) => {
              // Calculate if this step is "active" based on progress
              const stepThreshold = (index / (STEPS.length - 1)) * 100;
              const isActive = progress >= stepThreshold - 10; // slightly early activation

              return (
                <div key={index} className="relative flex lg:flex-col gap-6 lg:gap-8 items-start">
                  <div className={`
                    w-14 h-14 shrink-0 rounded-2xl flex items-center justify-center font-bold text-lg border-2 z-10 transition-colors duration-500
                    ${isActive ? 'bg-[#2F6B57] border-[#2F6B57] text-white' : 'bg-[#F7F5F0] border-[#E3DED3] text-[#6B746F]'}
                  `}>
                    0{index + 1}
                  </div>
                  <div className="pt-3 lg:pt-0">
                    <h3 className={`text-lg font-semibold tracking-tight mb-2 transition-colors duration-500 ${isActive ? 'text-[#1F2622]' : 'text-[#6B746F]'}`}>
                      {step.title}
                    </h3>
                    <p className="text-[14px] text-[#6B746F] leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
