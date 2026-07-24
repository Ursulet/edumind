import React from "react";
import { TestimonialsSectionData } from "@educariera/validation";

export function TestimonialsSection({ data }: { data: TestimonialsSectionData }) {
  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-[#0B2239] sm:text-4xl">{data.headline}</h2>
          {data.subtitle && <p className="mt-3 text-lg text-[#64748B]">{data.subtitle}</p>}
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {data.testimonials.map((t, i) => (
            <div key={i} className="flex flex-col justify-between rounded-2xl border border-[#E2E8F0] p-6 shadow-sm">
              <p className="text-[#102A43] italic">"{t.quote}"</p>
              <div className="mt-6 flex items-center gap-3 border-t border-[#E2E8F0] pt-4">
                {t.avatarUrl && <img src={t.avatarUrl} alt={t.author} className="h-10 w-10 rounded-full object-cover" />}
                <div>
                  <p className="text-sm font-semibold text-[#0B2239]">{t.author}</p>
                  {t.role && <p className="text-xs text-[#64748B]">{t.role}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
