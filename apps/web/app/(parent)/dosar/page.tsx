import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle, Tabs, TabsList, TabsTrigger, TabsContent } from "@educariera/ui";

export const metadata = {
  title: "Dosarul Cazului - Portal Părinți",
};

export default async function ParentDossierPage() {
  let careerCase: any = null;
  try {
    careerCase = await prisma.careerCase.findFirst({
      include: {
        child: true,
        counselingSessions: {
          include: { type: true, content: true },
          where: { status: "COMPLETED" },
          orderBy: { createdAt: "desc" }
        },
        reports: {
          where: { status: "PUBLISHED" },
          include: { templateVersion: { include: { template: true } } }
        },
        careerPlans: {
          where: { status: "PUBLISHED" },
          orderBy: { version: "desc" },
          take: 1
        },
        documents: {
          where: { visibility: "PARENT_VISIBLE" }
        }
      }
    });
  } catch (e) {
    console.log("DB Offline - Using Mock Data for Dossier");
    careerCase = {
      child: { firstName: "Matei", lastName: "Popescu" },
      counselingSessions: [
        {
          id: "sess-1",
          type: { title: "Ședință Consiliere Vocațională #2" },
          createdAt: new Date().toISOString(),
          content: {
            parentSummary: "Matei a fost foarte deschis azi. Am discutat despre rezultatele testului de interese și am observat o înclinație puternică spre lucrul în echipă și rezolvarea de probleme tehnice.",
            homework: "Să discute cu un membru al familiei despre o problemă tehnică pe care a rezolvat-o recent și să noteze cum s-a simțit."
          }
        },
        {
          id: "sess-2",
          type: { title: "Ședință de Cunoaștere" },
          createdAt: new Date(Date.now() - 864000000).toISOString(),
          content: {
            parentSummary: "O primă întâlnire excelentă. Am stabilit obiectivele pentru următoarele luni de consiliere.",
            homework: null
          }
        }
      ],
      reports: [
        {
          id: "rep-1",
          title: "Raport Interese Holland (RIASEC)",
          createdAt: new Date().toISOString(),
          templateVersion: { template: { name: "Șablon Standard Holland" } }
        }
      ],
      careerPlans: [
        {
          id: "plan-1",
          status: "PUBLISHED",
          version: 1,
          sections: {
            strengths: "Capacitate analitică ridicată, atenție la detalii. Matei învață extrem de repede concepte noi de matematică și fizică.",
            interests: "Tehnologie, inginerie, robotică.",
            short_term: "Participare la clubul de robotică local, cursuri introductive de Python.",
            long_term: "Facultatea de Automatică și Calculatoare (Politehnică) sau un program echivalent în străinătate."
          }
        }
      ],
      documents: [
        {
          id: "doc-1",
          displayName: "Plan_Cariera_Matei_Final.pdf",
          visibility: "PARENT_VISIBLE",
          createdAt: new Date().toISOString()
        }
      ]
    };
  }

  return (
    <div className="flex-1 w-full bg-ivory-background py-8">
      <div className="container mx-auto px-4 max-w-5xl space-y-8">
        
        <div className="flex items-start justify-between border-b border-border pb-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold text-primary-ink">
              Dosarul de Consiliere
            </h1>
            <p className="text-sm text-primary-text">
              Tot parcursul vocațional al copilului tău ({careerCase?.child.firstName || "Elev"}), într-un singur loc.
            </p>
          </div>
        </div>

        {careerCase ? (
          <Tabs defaultValue="sessions" className="w-full">
            <TabsList className="bg-warm-surface border border-border w-full justify-start overflow-x-auto">
              <TabsTrigger value="sessions">Istoric Ședințe</TabsTrigger>
              <TabsTrigger value="reports">Rapoarte Finale</TabsTrigger>
              <TabsTrigger value="plan">Plan Carieră</TabsTrigger>
            </TabsList>
            
            <TabsContent value="sessions" className="mt-6 space-y-6">
              {careerCase.counselingSessions.length === 0 ? (
                <Card className="bg-warm-surface border-border border-dashed">
                  <CardContent className="p-8 text-center text-muted-text">
                    Nu s-a finalizat încă nicio ședință.
                  </CardContent>
                </Card>
              ) : (
                <div className="relative border-l-2 border-border ml-4 space-y-8 pb-4">
                  {careerCase.counselingSessions.map((session: any) => (
                  <div key={session.id} className="relative pl-6 border-l-2 border-forest-accent">
                      <div className="absolute -left-[11px] top-1 w-5 h-5 rounded-full bg-forest-accent border-4 border-ivory-background" />
                      
                      <Card className="bg-warm-surface border-border shadow-sm">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-lg text-primary-ink">{session.type.title}</CardTitle>
                            <span className="text-xs text-muted-text font-medium">
                              {new Date(session.createdAt).toLocaleDateString('ro-RO')}
                            </span>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {/* We strictly ONLY render parentSummary and homework. internalNotes are excluded from the DB query theoretically, but definitely excluded from UI */}
                          {session.content?.parentSummary ? (
                            <div className="bg-ivory-background p-4 rounded-md border border-border">
                              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-text mb-2">Concluziile Specialistului</h4>
                              <p className="text-sm text-primary-text whitespace-pre-wrap">
                                {session.content.parentSummary}
                              </p>
                            </div>
                          ) : (
                            <p className="text-sm text-muted-text italic">Specialistul nu a publicat încă concluziile.</p>
                          )}

                          {session.content?.homework && (
                            <div className="bg-sage-surface/30 p-4 rounded-md border border-forest-accent/20">
                              <h4 className="text-xs font-semibold uppercase tracking-wider text-forest-accent mb-2">De Făcut (Homework)</h4>
                              <p className="text-sm text-primary-text whitespace-pre-wrap">
                                {session.content.homework}
                              </p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="reports" className="mt-6 space-y-6">
               {careerCase.reports.length === 0 ? (
                <Card className="bg-warm-surface border-border border-dashed">
                  <CardContent className="p-8 text-center text-muted-text">
                    Niciun raport publicat.
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {careerCase.reports.map((report: any) => (
                    <Card key={report.id} className="bg-warm-surface border-border shadow-sm hover:border-forest-accent/50 transition-colors cursor-pointer">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-3">
                           <div className="p-2 bg-sage-surface text-forest-accent rounded">
                             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                           </div>
                           <div>
                             <h3 className="font-medium text-primary-ink">{report.title}</h3>
                             <p className="text-xs text-muted-text">{new Date(report.createdAt).toLocaleDateString('ro-RO')}</p>
                           </div>
                        </div>
                        <p className="text-sm text-primary-text line-clamp-2">
                          Raport generat din șablonul {report.templateVersion.template.name}.
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

          <TabsContent value="plan" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="md:col-span-2 space-y-6">
              <h2 className="text-xl font-medium text-primary-ink border-b border-border pb-2">Planul de Carieră (Livrabil)</h2>
              
              {careerCase.careerPlans && careerCase.careerPlans.length > 0 ? (
                <div className="space-y-6">
                  {(() => {
                    const sections = careerCase.careerPlans[0].sections || {};
                    return (
                      <>
                        <div className="bg-white p-6 rounded-md shadow-sm border border-border">
                          <h3 className="font-semibold text-primary-ink mb-2">Puncte Tari Identificate</h3>
                          <p className="text-sm text-primary-text">{sections.strengths || "-"}</p>
                        </div>
                        <div className="bg-white p-6 rounded-md shadow-sm border border-border">
                          <h3 className="font-semibold text-primary-ink mb-2">Arii de Interes (Top 3)</h3>
                          <p className="text-sm text-primary-text">{sections.interests || "-"}</p>
                        </div>
                        <div className="bg-white p-6 rounded-md shadow-sm border border-border">
                          <h3 className="font-semibold text-primary-ink mb-2">Obiective pe Termen Scurt</h3>
                          <p className="text-sm text-primary-text">{sections.short_term || "-"}</p>
                        </div>
                        <div className="bg-white p-6 rounded-md shadow-sm border border-border">
                          <h3 className="font-semibold text-primary-ink mb-2">Direcția pe Termen Lung</h3>
                          <p className="text-sm text-primary-text">{sections.long_term || "-"}</p>
                        </div>
                      </>
                    );
                  })()}
                </div>
              ) : (
                <p className="text-sm text-muted-text">Planul de carieră nu a fost încă finalizat și publicat de către specialist.</p>
              )}
            </div>

            <div>
              <h2 className="text-xl font-medium text-primary-ink border-b border-border pb-2 mb-6">Documente Atașate</h2>
              {careerCase.documents && careerCase.documents.length > 0 ? (
                <div className="space-y-3">
                  {careerCase.documents.map((doc: any) => (
                    <a key={doc.id} href="#" className="block bg-white p-4 rounded-md shadow-sm border border-border hover:border-forest-accent transition-colors">
                      <div className="flex items-center gap-3">
                        <svg className="w-8 h-8 text-forest-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                        <div>
                          <p className="text-sm font-medium text-primary-ink">{doc.displayName}</p>
                          <p className="text-xs text-muted-text">Descărcare sigură (S3)</p>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-text">Niciun document nu a fost atașat încă.</p>
              )}
            </div>
            
          </div>
        </TabsContent>
          </Tabs>
        ) : (
          <Card className="bg-warm-surface border-border">
            <CardContent className="p-8 text-center text-muted-text">
              Nu ai un dosar activ.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
