import { Card, CardContent } from "@edumind/ui";

export const metadata = {
  title: "Termeni și Condiții | Edu-Cariera",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-ivory-background pt-24 pb-16 px-4">
      <div className="max-w-3xl mx-auto space-y-8">
        
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-primary-ink tracking-tight">Termeni și Condiții</h1>
          <p className="text-lg text-primary-text">Ultima actualizare: Iulie 2026</p>
        </div>

        <Card className="bg-warm-surface border-border shadow-sm">
          <CardContent className="p-8 prose prose-slate max-w-none">
            <h2 className="text-2xl font-semibold text-primary-ink mb-4">1. Preambul</h2>
            <p className="text-primary-text mb-6 leading-relaxed">
              Acești Termeni și Condiții guvernează utilizarea platformei EduMind de către părinți, elevi și specialiști în orientare vocațională. Prin accesarea platformei, sunteți de acord cu acești termeni.
            </p>

            <h2 className="text-2xl font-semibold text-primary-ink mb-4">2. Servicii Oferite</h2>
            <p className="text-primary-text mb-6 leading-relaxed">
              EduMind oferă acces la instrumente de testare standardizată (ex. RIASEC) și sesiuni video de consiliere 1-la-1 cu specialiști acreditați. Toate rapoartele generate au un caracter consultativ.
            </p>

            <h2 className="text-2xl font-semibold text-primary-ink mb-4">3. Contul de Utilizator</h2>
            <p className="text-primary-text mb-6 leading-relaxed">
              Crearea unui cont necesită furnizarea de informații exacte și complete. Utilizatorul este responsabil pentru păstrarea confidențialității credențialelor de acces (inclusiv autentificarea MFA acolo unde este activată).
            </p>

            <h2 className="text-2xl font-semibold text-primary-ink mb-4">4. Plăți și Rambursări</h2>
            <p className="text-primary-text mb-6 leading-relaxed">
              Toate plățile sunt procesate în siguranță de furnizorii noștri parteneri. Rambursările sunt posibile conform legislației în vigoare, dar exclusiv înainte de efectuarea testării sau a sesiunii video. După prestarea serviciului, contravaloarea nu se returnează.
            </p>

            <h2 className="text-2xl font-semibold text-primary-ink mb-4">5. Soluționarea Disputelor (ANPC)</h2>
            <p className="text-primary-text mb-6 leading-relaxed">
              În cazul oricăror neînțelegeri, ne propunem rezolvarea pe cale amiabilă. Dacă acest lucru nu este posibil, consumatorii pot accesa platforma SOL a Comisiei Europene sau se pot adresa Autorității Naționale pentru Protecția Consumatorilor (ANPC).
            </p>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}

