import { ProblemSectionData } from "@EduMind/validation";

export function ProblemSection({ data }: { data: ProblemSectionData }) {
  return (
    <section className="w-full bg-ivory-background py-16 md:py-24">
      <div className="container mx-auto px-4 max-w-3xl text-center space-y-8">
        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-primary-ink">
          {data.headline}
        </h2>
        <div className="space-y-6 text-lg text-primary-text/80 leading-relaxed text-left">
          {data.paragraphs.map((paragraph, idx) => (
            <p key={idx}>{paragraph}</p>
          ))}
        </div>
      </div>
    </section>
  );
}
