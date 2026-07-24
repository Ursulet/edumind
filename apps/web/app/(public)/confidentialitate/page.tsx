import { Card, CardContent } from "@EduMind/ui";

export const metadata = {
  title: "Politica de ConfidenÈ›ialitate | Edu-Cariera",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-ivory-background pt-24 pb-16 px-4">
      <div className="max-w-3xl mx-auto space-y-8">
        
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-primary-ink tracking-tight">Politica de ConfidenÈ›ialitate (GDPR)</h1>
          <p className="text-lg text-primary-text">Ultima actualizare: Iulie 2026</p>
        </div>

        <Card className="bg-warm-surface border-border shadow-sm">
          <CardContent className="p-8 prose prose-slate max-w-none">
            <h2 className="text-2xl font-semibold text-primary-ink mb-4">1. Colectarea Datelor</h2>
            <p className="text-primary-text mb-6 leading-relaxed">
              EduMind trateazÄƒ cu maximÄƒ seriozitate confidenÈ›ialitatea datelor dumneavoastrÄƒ È™i ale copiilor. ColectÄƒm doar informaÈ›iile strict necesare pentru furnizarea serviciului: nume, date de contact, È™i rÄƒspunsurile de la evaluÄƒrile profesionale (RIASEC).
            </p>

            <h2 className="text-2xl font-semibold text-primary-ink mb-4">2. Prelucrarea Datelor Minorilor</h2>
            <p className="text-primary-text mb-6 leading-relaxed">
              Prelucrarea datelor minorilor se realizeazÄƒ **exclusiv** cu consimÈ›ÄƒmÃ¢ntul explicit al pÄƒrintelui sau al tutorelui legal, acordat la Ã®nregistrarea contului. Aceste date nu sunt niciodatÄƒ vÃ¢ndute sau transferate cÄƒtre terÈ›i Ã®n scopuri de marketing.
            </p>

            <h2 className="text-2xl font-semibold text-primary-ink mb-4">3. Dreptul de a fi Uitat</h2>
            <p className="text-primary-text mb-6 leading-relaxed">
              ÃŽn conformitate cu reglementÄƒrile GDPR, aveÈ›i dreptul de a solicita È™tergerea datelor. Datele dumneavoastrÄƒ vor fi *anonimizate* pentru a menÈ›ine integritatea financiarÄƒ a facturilor, Ã®nsÄƒ orice date cu caracter personal, dosare È™i rapoarte de testare vor fi iremediabil distruse din platformÄƒ.
            </p>

            <h2 className="text-2xl font-semibold text-primary-ink mb-4">4. Stocare È™i Securitate</h2>
            <p className="text-primary-text mb-6 leading-relaxed">
              Datele sunt stocate Ã®n mod securizat pe servere din Uniunea EuropeanÄƒ (Frankfurt). Platforma aplicÄƒ mecanisme stricte de izolare a bazei de date (multi-tenancy) pentru a garanta cÄƒ doar dumneavoastrÄƒ È™i specialistul atribuit aveÈ›i acces la dosarul copilului.
            </p>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
