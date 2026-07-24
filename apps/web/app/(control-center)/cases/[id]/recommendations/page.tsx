import { prisma } from "@/lib/db";
import { Button, Card, CardContent, CardHeader, CardTitle, Textarea } from "@educariera/ui";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function SpecialistRecommendationsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const careerCase = await prisma.careerCase.findUnique({
    where: { id },
    include: {
      child: true,
      recommendations: {
        include: { productVersion: { include: { prices: { take: 1 } } } },
        orderBy: { createdAt: "desc" }
      }
    }
  });

  if (!careerCase) return notFound();

  // Get available products from catalog (Mock query for UI)
  const products = await prisma.productVersion.findMany({
    where: { status: "PUBLISHED" },
    include: { prices: { take: 1 } },
    take: 5
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-3">
            <Link href={`/cases/${id}`} className="text-muted-text hover:text-primary-ink text-sm">
              ← Înapoi la Dosar
            </Link>
          </div>
          <h1 className="text-2xl font-semibold text-primary-ink mt-2">
            Recomandări pentru {careerCase.child.firstName}
          </h1>
          <p className="text-sm text-muted-text">Gestionează pachetele prescrise și recomandările de continuare.</p>
        </div>
        <Button className="bg-forest-accent text-warm-surface hover:bg-forest-hover">
          Recomandare Nouă
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: History */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-lg font-medium text-primary-ink">Istoric Recomandări</h3>
          {careerCase.recommendations.length === 0 ? (
            <Card className="bg-warm-surface border-border">
              <CardContent className="p-8 text-center text-muted-text">
                Nicio recomandare emisă încă pentru acest caz.
              </CardContent>
            </Card>
          ) : (
            careerCase.recommendations.map(rec => (
              <Card key={rec.id} className="bg-white border-border shadow-sm">
                <CardHeader className="pb-2 flex flex-row items-start justify-between">
                  <div>
                    <CardTitle className="text-base text-primary-ink">{rec.productVersion.marketingName}</CardTitle>
                    <p className="text-sm text-muted-text">
                      Preț: {rec.productVersion.prices[0]?.amount.toString() || 0} {rec.productVersion.prices[0]?.currency || "RON"}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                    rec.status === 'ACCEPTED' ? 'bg-success/10 text-success' : 
                    rec.status === 'VIEWED' ? 'bg-forest-accent/10 text-forest-accent' : 'bg-muted-surface text-muted-text'
                  }`}>
                    {rec.status}
                  </span>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-primary-text line-clamp-2 italic border-l-2 border-muted-border pl-3 mt-2">
                    "{rec.reason}"
                  </p>
                  <div className="mt-4 flex gap-4 text-xs text-muted-text">
                    <span>Emisă: {new Date(rec.createdAt).toLocaleDateString('ro-RO')}</span>
                    {rec.viewedAt && <span>Vizualizată: {new Date(rec.viewedAt).toLocaleDateString('ro-RO')}</span>}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Right Column: Quick Create Form */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-primary-ink">Recomandare Rapidă</h3>
          <Card className="bg-ivory-background border-border">
            <CardContent className="p-5 space-y-4 pt-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-primary-ink">Alege Pachetul</label>
                <select className="w-full h-10 px-3 py-2 bg-white border border-input rounded-md text-sm outline-none focus:border-forest-accent">
                  <option value="">-- Selectează din Catalog --</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.marketingName} ({p.prices[0]?.amount.toString() || 0} {p.prices[0]?.currency || "RON"})</option>
                  ))}
                </select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-primary-ink">Motivația către Părinte</label>
                <Textarea 
                  placeholder="Ex: Pentru a explora în detaliu zona de STEM, vă recomand..."
                  className="bg-white min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-primary-ink">Context Intern (Opțional, Confidențial)</label>
                <Textarea 
                  placeholder="Notițe interne despre decizia de upsell..."
                  className="bg-white min-h-[60px]"
                />
              </div>

              <Button className="w-full bg-forest-accent text-warm-surface hover:bg-forest-hover">
                Trimite Recomandarea
              </Button>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
