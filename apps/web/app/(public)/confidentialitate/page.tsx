import { Card, CardContent } from "@edumind/ui";

export const metadata = {
  title: "Politica de Confidențialitate | Edu-Cariera",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-ivory-background pt-24 pb-16 px-4">
      <div className="max-w-3xl mx-auto space-y-8">
        
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-primary-ink tracking-tight">Politica de Confidențialitate (GDPR)</h1>
          <p className="text-lg text-primary-text">Ultima actualizare: Iulie 2026</p>
        </div>

        <Card className="bg-warm-surface border-border shadow-sm">
          <CardContent className="p-8 prose prose-slate max-w-none">
            <h2 className="text-2xl font-semibold text-primary-ink mb-4">1. Colectarea Datelor</h2>
            <p className="text-primary-text mb-6 leading-relaxed">
              EduMind tratează cu maximă seriozitate confidențialitatea datelor dumneavoastră și ale copiilor. Colectăm doar informațiile strict necesare pentru furnizarea serviciului: nume, date de contact, și răspunsurile de la evaluările profesionale (RIASEC).
            </p>

            <h2 className="text-2xl font-semibold text-primary-ink mb-4">2. Prelucrarea Datelor Minorilor</h2>
            <p className="text-primary-text mb-6 leading-relaxed">
              Prelucrarea datelor minorilor se realizează **exclusiv** cu consimțământul explicit al părintelui sau al tutorelui legal, acordat la înregistrarea contului. Aceste date nu sunt niciodată vândute sau transferate către terți în scopuri de marketing.
            </p>

            <h2 className="text-2xl font-semibold text-primary-ink mb-4">3. Dreptul de a fi Uitat</h2>
            <p className="text-primary-text mb-6 leading-relaxed">
              În conformitate cu reglementările GDPR, aveți dreptul de a solicita ștergerea datelor. Datele dumneavoastră vor fi *anonimizate* pentru a menține integritatea financiară a facturilor, însă orice date cu caracter personal, dosare și rapoarte de testare vor fi iremediabil distruse din platformă.
            </p>

            <h2 className="text-2xl font-semibold text-primary-ink mb-4">4. Stocare și Securitate</h2>
            <p className="text-primary-text mb-6 leading-relaxed">
              Datele sunt stocate în mod securizat pe servere din Uniunea Europeană (Frankfurt). Platforma aplică mecanisme stricte de izolare a bazei de date (multi-tenancy) pentru a garanta că doar dumneavoastră și specialistul atribuit aveți acces la dosarul copilului.
            </p>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}

