import { ProcessSectionData } from "@educariera/validation";

export function ProcessSection({ data }: { data: ProcessSectionData }) {
  return (
    <section className="w-full bg-sage-surface py-16 md:py-24">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-semibold text-center mb-16 text-primary-ink">{data.title}</h2>
        
        <div className="hidden md:flex relative justify-between max-w-4xl mx-auto">
          {/* Horizontal Line */}
          <div className="absolute top-6 left-0 right-0 h-0.5 bg-border -z-10" />
          
          {data.steps.map((step, idx) => (
            <div key={idx} className="flex flex-col items-center text-center w-48 relative">
              <div className="w-12 h-12 rounded-full bg-forest-accent text-warm-surface flex items-center justify-center font-bold text-lg mb-4 shadow-sm">
                {idx + 1}
              </div>
              <h3 className="font-semibold text-primary-ink mb-2">{step.title}</h3>
              <p className="text-sm text-muted-text">{step.description}</p>
            </div>
          ))}
        </div>

        {/* Mobile vertical */}
        <div className="flex md:hidden flex-col space-y-8 max-w-sm mx-auto">
          {data.steps.map((step, idx) => (
            <div key={idx} className="flex gap-4">
              <div className="w-10 h-10 shrink-0 rounded-full bg-forest-accent text-warm-surface flex items-center justify-center font-bold">
                {idx + 1}
              </div>
              <div>
                <h3 className="font-semibold text-primary-ink mb-1">{step.title}</h3>
                <p className="text-sm text-muted-text">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
