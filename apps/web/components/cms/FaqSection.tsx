import React from "react";
import { FaqSectionData } from "@edumind/validation";

export function FaqSection({ data }: { data: FaqSectionData }) {
  return (
    <section className="py-20 bg-[#F7F9FC]">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-[#0B2239] sm:text-4xl">{data.headline}</h2>
          {data.subtitle && <p className="mt-3 text-lg text-[#64748B]">{data.subtitle}</p>}
        </div>
        <div className="space-y-6">
          {data.items.map((item, i) => (
            <div key={i} className="rounded-xl border border-[#E2E8F0] bg-white p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-[#102A43]">{item.question}</h3>
              <p className="mt-2 text-[#64748B] leading-relaxed">{item.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

