import { FinalCtaSectionData } from "@edumind/validation";
import { Button } from "@edumind/ui";
import Link from "next/link";

export function FinalCtaSection({ data }: { data: FinalCtaSectionData }) {
  const isDark = data.variant === "B";
  
  return (
    <section className={`w-full py-20 md:py-32 ${isDark ? "bg-deep-graphite text-warm-surface" : "bg-sage-surface text-primary-ink"}`}>
      <div className="container mx-auto px-4 text-center max-w-3xl space-y-8">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
          {data.headline}
        </h2>
        {data.subtitle && (
          <p className={`text-lg md:text-xl ${isDark ? "text-warm-surface/80" : "text-primary-ink/80"}`}>
            {data.subtitle}
          </p>
        )}
        <div className="pt-8">
          <Button 
            size="lg" 
            variant="default"
            className={isDark ? "bg-warm-surface text-primary-ink hover:bg-muted-surface focus-visible:ring-warm-surface" : "bg-forest-accent text-warm-surface"}
            asChild
          >
            <Link href={data.ctaLink || "#"}>{data.ctaLabel}</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}


