import { HeroSectionData } from "@edumind/validation";
import { Button } from "@edumind/ui";
import Link from "next/link";

export function HeroSection({ data }: { data: HeroSectionData }) {
  return (
    <section className="relative w-full bg-ivory-background py-16 md:py-24 overflow-hidden">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6 max-w-xl">
          {data.eyebrow && (
            <span className="text-sm font-semibold tracking-wider text-forest-accent uppercase">
              {data.eyebrow}
            </span>
          )}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-primary-ink">
            {data.headline}
          </h1>
          {data.subtitle && (
            <p className="text-lg md:text-xl text-primary-text/80 leading-relaxed">
              {data.subtitle}
            </p>
          )}
          
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            {data.primaryCtaLabel && (
              <Button size="lg" asChild>
                <Link href={data.primaryCtaLink || "#"}>{data.primaryCtaLabel}</Link>
              </Button>
            )}
            {data.secondaryCtaLabel && (
              <Button variant="outline" size="lg" asChild>
                <Link href={data.secondaryCtaLink || "#"}>{data.secondaryCtaLabel}</Link>
              </Button>
            )}
          </div>
          
          {data.trustNote && (
            <p className="text-sm text-muted-text pt-2 border-t border-border mt-6">
              {data.trustNote}
            </p>
          )}
        </div>
        
        <div className="relative h-[400px] md:h-[500px] lg:h-[600px] rounded-2xl overflow-hidden bg-sage-surface border border-border flex items-center justify-center">
          {data.imageUrl ? (
            <img src={data.imageUrl} alt="Hero Visual" className="object-cover w-full h-full" />
          ) : (
            <span className="text-muted-text">Editorial Visual Placeholder</span>
          )}
        </div>
      </div>
    </section>
  );
}


