import { TrustStripSectionData } from "@edumind/validation";

export function TrustStripSection({ data }: { data: TrustStripSectionData }) {
  return (
    <section className="w-full bg-warm-surface border-y border-border py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {data.items.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center justify-center space-y-2">
              <div className="h-8 w-8 text-forest-accent flex items-center justify-center">
                {/* Fallback for icon rendering if lucide is not mapped */}
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <span className="text-sm font-medium text-primary-text">{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

