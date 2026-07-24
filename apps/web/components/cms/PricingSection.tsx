import React from "react";
import { PricingSectionData } from "@EduMind/validation";
import { Button } from "@EduMind/ui";

export function PricingSection({ data }: { data: PricingSectionData }) {
  return (
    <section className="py-20 bg-[#F7F9FC]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-[#0B2239] sm:text-4xl">{data.headline}</h2>
          {data.subtitle && <p className="mt-3 text-lg text-[#64748B]">{data.subtitle}</p>}
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {data.tiers.map((tier, i) => (
            <div
              key={i}
              className={`flex flex-col justify-between rounded-2xl p-8 bg-white shadow-sm border ${
                tier.isHighlighted ? "border-[#0F766E] ring-2 ring-[#0F766E]" : "border-[#E2E8F0]"
              }`}
            >
              <div>
                <h3 className="text-xl font-bold text-[#0B2239]">{tier.name}</h3>
                {tier.description && <p className="mt-1 text-sm text-[#64748B]">{tier.description}</p>}
                <div className="mt-6 flex items-baseline">
                  <span className="text-4xl font-extrabold text-[#0B2239]">{tier.price}</span>
                  {tier.period && <span className="ml-1 text-sm text-[#64748B]">/{tier.period}</span>}
                </div>
                <ul className="mt-6 space-y-3">
                  {tier.features.map((feat, idx) => (
                    <li key={idx} className="flex items-center text-sm text-[#102A43]">
                      <svg className="h-4 w-4 text-[#0F766E] mr-2 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                      {feat}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-8">
                <a href={tier.ctaLink ?? "/inscriere"}>
                  <Button className={`w-full ${tier.isHighlighted ? "bg-[#0F766E] hover:bg-[#115E59]" : ""}`}>
                    {tier.ctaLabel}
                  </Button>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
