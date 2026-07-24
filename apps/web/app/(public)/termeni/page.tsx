import { Card, CardContent } from "@EduMind/ui";

export const metadata = {
  title: "Termeni È™i CondiÈ›ii | Edu-Cariera",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-ivory-background pt-24 pb-16 px-4">
      <div className="max-w-3xl mx-auto space-y-8">
        
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-primary-ink tracking-tight">Termeni È™i CondiÈ›ii</h1>
          <p className="text-lg text-primary-text">Ultima actualizare: Iulie 2026</p>
        </div>

        <Card className="bg-warm-surface border-border shadow-sm">
          <CardContent className="p-8 prose prose-slate max-w-none">
            <h2 className="text-2xl font-semibold text-primary-ink mb-4">1. Preambul</h2>
            <p className="text-primary-text mb-6 leading-relaxed">
              AceÈ™ti Termeni È™i CondiÈ›ii guverneazÄƒ utilizarea platformei EduMind de cÄƒtre pÄƒrinÈ›i, elevi È™i specialiÈ™ti Ã®n orientare vocaÈ›ionalÄƒ. Prin accesarea platformei, sunteÈ›i de acord cu aceÈ™ti termeni.
            </p>

            <h2 className="text-2xl font-semibold text-primary-ink mb-4">2. Servicii Oferite</h2>
            <p className="text-primary-text mb-6 leading-relaxed">
              EduMind oferÄƒ acces la instrumente de testare standardizatÄƒ (ex. RIASEC) È™i sesiuni video de consiliere 1-la-1 cu specialiÈ™ti acreditaÈ›i. Toate rapoartele generate au un caracter consultativ.
            </p>

            <h2 className="text-2xl font-semibold text-primary-ink mb-4">3. Contul de Utilizator</h2>
            <p className="text-primary-text mb-6 leading-relaxed">
              Crearea unui cont necesitÄƒ furnizarea de informaÈ›ii exacte È™i complete. Utilizatorul este responsabil pentru pÄƒstrarea confidenÈ›ialitÄƒÈ›ii credenÈ›ialelor de acces (inclusiv autentificarea MFA acolo unde este activatÄƒ).
            </p>

            <h2 className="text-2xl font-semibold text-primary-ink mb-4">4. PlÄƒÈ›i È™i RambursÄƒri</h2>
            <p className="text-primary-text mb-6 leading-relaxed">
              Toate plÄƒÈ›ile sunt procesate Ã®n siguranÈ›Äƒ de furnizorii noÈ™tri parteneri. RambursÄƒrile sunt posibile conform legislaÈ›iei Ã®n vigoare, dar exclusiv Ã®nainte de efectuarea testÄƒrii sau a sesiunii video. DupÄƒ prestarea serviciului, contravaloarea nu se returneazÄƒ.
            </p>

            <h2 className="text-2xl font-semibold text-primary-ink mb-4">5. SoluÈ›ionarea Disputelor (ANPC)</h2>
            <p className="text-primary-text mb-6 leading-relaxed">
              ÃŽn cazul oricÄƒror neÃ®nÈ›elegeri, ne propunem rezolvarea pe cale amiabilÄƒ. DacÄƒ acest lucru nu este posibil, consumatorii pot accesa platforma SOL a Comisiei Europene sau se pot adresa AutoritÄƒÈ›ii NaÈ›ionale pentru ProtecÈ›ia Consumatorilor (ANPC).
            </p>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
