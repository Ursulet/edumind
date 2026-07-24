import { ProgramCardsSectionData } from "@educariera/validation";
import { Card, CardHeader, CardTitle, CardContent, CardFooter, Button } from "@educariera/ui";
import Link from "next/link";

export function ProgramCardsSection({ data }: { data: ProgramCardsSectionData }) {
  return (
    <section className="w-full bg-ivory-background py-16 md:py-24">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-semibold text-center mb-16 text-primary-ink">{data.headline}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {data.programs.map((program, idx) => (
            <Card 
              key={idx} 
              className={`flex flex-col h-full relative ${
                program.isRecommended ? 'border-forest-accent shadow-[0_0_0_1px_rgba(47,107,87,1)]' : ''
              }`}
            >
              {program.isRecommended && (
                <div className="absolute -top-3 inset-x-0 flex justify-center">
                  <span className="bg-forest-accent text-warm-surface text-xs font-bold uppercase tracking-wider py-1 px-3 rounded-full">
                    Recomandat
                  </span>
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-xl">{program.title}</CardTitle>
                {program.price && <div className="text-2xl font-semibold text-primary-ink mt-2">{program.price}</div>}
              </CardHeader>
              <CardContent className="flex-1 space-y-4">
                <p className="text-sm text-primary-text">{program.description}</p>
                <ul className="space-y-2 pt-4 border-t border-border">
                  {program.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex gap-2 text-sm text-muted-text">
                      <span className="text-forest-accent shrink-0">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  variant={program.isRecommended ? "default" : "outline"} 
                  asChild
                >
                  <Link href={program.ctaLink || "#"}>{program.ctaLabel}</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
