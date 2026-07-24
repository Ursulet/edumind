import React from "react";
import { StatsSectionData } from "@educariera/validation";

export function StatsSection({ data }: { data: StatsSectionData }) {
  return (
    <section className="py-16 bg-[#0B2239] text-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {data.headline && (
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold sm:text-3xl">{data.headline}</h2>
            {data.subtitle && <p className="mt-2 text-sm text-[#E2E8F0]">{data.subtitle}</p>}
          </div>
        )}
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 text-center">
          {data.stats.map((stat, i) => (
            <div key={i} className="p-4">
              <p className="text-4xl font-extrabold text-[#0F766E] sm:text-5xl">{stat.value}</p>
              <p className="mt-2 text-base font-medium text-white">{stat.label}</p>
              {stat.description && <p className="mt-1 text-xs text-[#64748B]">{stat.description}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

