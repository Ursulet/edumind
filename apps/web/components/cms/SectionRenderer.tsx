import { CmsSection } from "@prisma/client";
import { HeroSection } from "./HeroSection";
import { TrustStripSection } from "./TrustStripSection";
import { ProblemSection } from "./ProblemSection";
import { ProcessSection } from "./ProcessSection";
import { ProgramCardsSection } from "./ProgramCardsSection";
import { FinalCtaSection } from "./FinalCtaSection";
import { FaqSection } from "./FaqSection";
import { StatsSection } from "./StatsSection";
import { TestimonialsSection } from "./TestimonialsSection";
import { PricingSection } from "./PricingSection";
import { CmsSectionDataSchema } from "@educariera/validation";

export function SectionRenderer({ section }: { section: CmsSection }) {
  const parsed = CmsSectionDataSchema.safeParse({
    type: section.type,
    data: section.data,
  });

  if (!parsed.success) {
    console.error(`Invalid section data for section ${section.id}:`, parsed.error);
    return null;
  }

  const { type, data } = parsed.data;

  switch (type) {
    case "HERO":
      return <HeroSection data={data} />;
    case "TRUST_BAR":
      return <TrustStripSection data={data} />;
    case "PROBLEM":
      return <ProblemSection data={data} />;
    case "PROCESS_STEPS":
      return <ProcessSection data={data} />;
    case "PROGRAM_CARDS":
      return <ProgramCardsSection data={data} />;
    case "FINAL_CTA":
      return <FinalCtaSection data={data} />;
    case "FAQ":
      return <FaqSection data={data as any} />;
    case "STATS":
      return <StatsSection data={data as any} />;
    case "TESTIMONIALS":
      return <TestimonialsSection data={data as any} />;
    case "PRICING":
      return <PricingSection data={data as any} />;
    case "RICH_TEXT":
      return (
        <div className="py-12 max-w-4xl mx-auto px-4 prose text-[#102A43]">
          <div dangerouslySetInnerHTML={{ __html: (data as any).content }} />
        </div>
      );
    default:
      return null;
  }
}

