import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";

import { HeroSection } from "@/components/marketing/HeroSection";
import { QuestionsSection } from "@/components/marketing/QuestionsSection";
import { StudentParentSplit } from "@/components/marketing/StudentParentSplit";
import { JourneySection } from "@/components/marketing/JourneySection";
import { ProductPreviewSection } from "@/components/marketing/ProductPreviewSection";
import { GradesProgression } from "@/components/marketing/GradesProgression";
import { CareersBrowser } from "@/components/marketing/CareersBrowser";
import { HumanCounseling } from "@/components/marketing/HumanCounseling";
import { SocialProof } from "@/components/marketing/SocialProof";
import { FaqAccordion } from "@/components/marketing/FaqAccordion";
import { FinalCta } from "@/components/marketing/FinalCta";

export const metadata = {
  title: "EduMind | Orientare educațională & în carieră",
  description:
    "EduMind îi ajută pe elevii din clasele VIII–XII să își înțeleagă aptitudinile, interesele și opțiunile și să transforme incertitudinea într-un plan educațional clar.",
};

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F7F5F0]">
      <PublicHeader />
      
      <main className="flex-1 w-full">
        <HeroSection />
        <QuestionsSection />
        <StudentParentSplit />
        <JourneySection />
        <ProductPreviewSection />
        <GradesProgression />
        <CareersBrowser />
        <HumanCounseling />
        <SocialProof />
        <FaqAccordion />
        <FinalCta />
      </main>

      <PublicFooter />
    </div>
  );
}
