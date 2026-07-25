import { prisma } from "@/lib/db";
import { Button, Card, CardContent, CardHeader, CardTitle, Textarea, Label } from "@edumind/ui";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function SpecialistCareerPlanPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  let careerCase: any = null;
  try {
    careerCase = await prisma.careerCase.findUnique({
      where: { id },
      include: {
        child: true,
        careerPlans: {
          orderBy: { version: "desc" },
          take: 1
        },
        documents: {
          orderBy: { createdAt: "desc" }
        }
      }
    });
  } catch (e) {
    // Mock Data Fallback
    careerCase = {
      id,
      child: { firstName: "Matei", lastName: "Popescu" },
      careerPlans: [
        {
          id: "plan-1",
          status: "DRAFT",
          version: 1,
          sections: {
            strengths: "Capacitate analitică ridicată, atenție la detalii.",
            interests: "Tehnologie, inginerie, robotică.",
            short_term: "Participare la clubul de robotică local.",
            long_term: "Facultatea de Automatică și Calculatoare."
          }
        }
      ],
      documents: [
        {
          id: "doc-1",
          displayName: "Rezultat_Test_Holland.pdf",
          visibility: "PARENT_VISIBLE",
          createdAt: new Date().toISOString()
        }
      ]
    };
  }

  if (!careerCase) return notFound();

  const currentPlan = careerCase.careerPlans[0] || { sections: {} };

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
            Plan de Carieră & Documente
          </h1>
          <p className="text-sm text-muted-text">Gestionează livrabilul final și atașamentele pentru {careerCase.child.firstName}.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-forest-accent text-forest-accent hover:bg-forest-accent/5">
            Salvează Draft
          </Button>
          <Button className="bg-forest-accent text-warm-surface hover:bg-forest-hover">
            Publică către Părinte
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Career Plan Editor */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-lg font-medium text-primary-ink">Structură Plan de Carieră (v{currentPlan.version || 1})</h3>
          
          <Card className="bg-white border-border shadow-sm">
            <CardHeader className="bg-ivory-background border-b border-border py-3">
              <CardTitle className="text-base font-medium">1. Puncte Tari & Interese</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-5">
              <div className="space-y-2">
                <Label>Puncte Tari Identificate</Label>
                <Textarea 
                  defaultValue={(currentPlan.sections as any)?.strengths || ""}
                  placeholder="Ex: Gândire critică, comunicare eficientă..." 
                  className="min-h-[100px]"
                />
              </div>
              <div className="space-y-2">
                <Label>Arii de Interes (Top 3)</Label>
                <Textarea 
                  defaultValue={(currentPlan.sections as any)?.interests || ""}
                  placeholder="Ex: 1. IT, 2. Design, 3. Antreprenoriat..." 
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-border shadow-sm">
            <CardHeader className="bg-ivory-background border-b border-border py-3">
              <CardTitle className="text-base font-medium">2. Obiective de Dezvoltare</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-5">
              <div className="space-y-2">
                <Label>Termen Scurt (0-6 luni)</Label>
                <Textarea 
                  defaultValue={(currentPlan.sections as any)?.short_term || ""}
                  placeholder="Acțiuni imediate recomandate..." 
                />
              </div>
              <div className="space-y-2">
                <Label>Termen Lung (2-5 ani)</Label>
                <Textarea 
                  defaultValue={(currentPlan.sections as any)?.long_term || ""}
                  placeholder="Direcție educațională/profesională pe termen lung..." 
                />
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Right Column: Document Management */}
        <div className="space-y-6">
          <h3 className="text-lg font-medium text-primary-ink">Documente Atașate</h3>
          
          <Card className="bg-white border-border shadow-sm">
            <CardContent className="p-0">
              <div className="p-4 border-b border-border bg-muted-surface/30">
                <Button variant="outline" className="w-full justify-center">
                  + Încarcă Document Nou
                </Button>
              </div>
              
              <div className="divide-y divide-border">
                {careerCase.documents.map((doc: any) => (
                  <div key={doc.id} className="p-4 flex items-center justify-between hover:bg-muted-surface/10 transition-colors">
                    <div className="flex items-center gap-3">
                      <svg className="w-8 h-8 text-muted-text" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                      <div>
                        <p className="text-sm font-medium text-primary-ink">{doc.displayName}</p>
                        <p className="text-xs text-muted-text">
                          Vizibilitate: <span className="font-semibold text-forest-accent">{doc.visibility}</span>
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" className="h-8 w-8 p-0 text-muted-text hover:text-red-500">
                      &times;
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded p-4 text-sm text-yellow-800">
            <strong>Atenție (S3 MOCK):</strong> Părinții pot descărca doar documentele marcate ca "PARENT_VISIBLE". Generarea de URL-uri semnate temporare (Presigned URLs) este activată la download.
          </div>
        </div>

      </div>
    </div>
  );
}
