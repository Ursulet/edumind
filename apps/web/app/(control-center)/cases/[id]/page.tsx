import { prisma } from "@/lib/db";
import { Button, Card, CardContent, CardHeader, CardTitle, Tabs, TabsList, TabsTrigger, TabsContent, Textarea } from "@educariera/ui";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function SpecialistCaseDossierPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const careerCase = await prisma.careerCase.findUnique({
    where: { id },
    include: {
      child: { include: { family: true } },
      counselingSessions: {
        include: { type: true, content: true },
        orderBy: { createdAt: "desc" }
      },
      reports: true,
      assessments: { include: { template: true } }
    }
  });

  if (!careerCase) return notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-3">
            <Link href="/cases" className="text-muted-text hover:text-primary-ink text-sm">
              ← Înapoi la Cazuri
            </Link>
          </div>
          <h1 className="text-2xl font-semibold text-primary-ink mt-2">
            Dosar: {careerCase.child.firstName} {careerCase.child.lastName}
          </h1>
          <p className="text-sm text-muted-text">
            ID Caz: {careerCase.publicId} • Status: {careerCase.status}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Editează Profil</Button>
          <Button className="bg-forest-accent text-warm-surface hover:bg-forest-hover">Adaugă Sesiune Nouă</Button>
        </div>
      </div>

      <Tabs defaultValue="sessions" className="w-full">
        <TabsList className="bg-warm-surface border border-border">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sessions">Ședințe & Notițe</TabsTrigger>
          <TabsTrigger value="assessments">Evaluări</TabsTrigger>
          <TabsTrigger value="reports">Rapoarte</TabsTrigger>
        </TabsList>
        
        <TabsContent value="sessions" className="mt-6 space-y-6">
          {careerCase.counselingSessions.length === 0 ? (
            <Card className="bg-warm-surface border-border">
              <CardContent className="p-8 text-center text-muted-text">
                Nicio ședință înregistrată pentru acest caz.
              </CardContent>
            </Card>
          ) : (
            careerCase.counselingSessions.map(session => (
              <Card key={session.id} className="bg-warm-surface border-border shadow-sm">
                <CardHeader className="border-b border-border bg-ivory-background/50 flex flex-row items-center justify-between pb-4">
                  <div>
                    <CardTitle className="text-lg">{session.type.title}</CardTitle>
                    <p className="text-sm text-muted-text">
                      {new Date(session.createdAt).toLocaleDateString('ro-RO')} • Status: {session.status}
                    </p>
                  </div>
                  <Button variant="outline" size="sm">Marchează Complet</Button>
                </CardHeader>
                <CardContent className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Internal Notes - STRICTLY CONFIDENTIAL */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-danger">Notițe Interne (Confidențial)</h4>
                      <span className="bg-danger/10 text-danger text-[10px] px-2 py-0.5 rounded font-bold uppercase">Staff Only</span>
                    </div>
                    <Textarea 
                      placeholder="Notițe personale pentru continuitatea cazului..." 
                      className="min-h-[150px] bg-white border-danger/20 focus-visible:ring-danger/30"
                      defaultValue={session.content?.internalNotes || ""}
                    />
                    <p className="text-xs text-muted-text">Aceste notițe nu vor fi vizibile niciodată în portalul părintelui.</p>
                  </div>

                  {/* Parent Summary - VISIBLE TO PARENT */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-primary-ink">Rezumat pentru Părinte</h4>
                      <span className="bg-success/10 text-success text-[10px] px-2 py-0.5 rounded font-bold uppercase">Public</span>
                    </div>
                    <Textarea 
                      placeholder="Ce concluzii îi transmiți părintelui?" 
                      className="min-h-[150px] bg-white border-success/20 focus-visible:ring-success/30"
                      defaultValue={session.content?.parentSummary || ""}
                    />
                    <p className="text-xs text-muted-text">Textul completat aici va apărea în aplicația părintelui.</p>
                  </div>
                  
                  {/* Homework */}
                  <div className="space-y-3 lg:col-span-2">
                    <h4 className="font-semibold text-primary-ink">Acțiuni & Teme (Homework)</h4>
                    <Textarea 
                      placeholder="Ex: De completat testul de personalitate..." 
                      className="bg-white"
                      defaultValue={session.content?.homework || ""}
                    />
                  </div>
                </CardContent>
                <div className="bg-muted-surface p-4 border-t border-border flex justify-end gap-3">
                  <Button variant="outline">Renunță</Button>
                  <Button className="bg-forest-accent text-warm-surface hover:bg-forest-hover">Salvează Notițele</Button>
                </div>
              </Card>
            ))
          )}
        </TabsContent>
        
        <TabsContent value="overview">
          <Card className="bg-warm-surface border-border">
            <CardContent className="p-6">Overview content here...</CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="assessments">
          <Card className="bg-warm-surface border-border">
            <CardContent className="p-6">Evaluări content here...</CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="reports">
          <Card className="bg-warm-surface border-border">
            <CardContent className="p-6">Rapoarte content here...</CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
