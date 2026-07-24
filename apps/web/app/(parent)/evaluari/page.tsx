export const dynamic = "force-dynamic";
import { prisma } from "@/lib/db";
import { Button, Card, CardContent } from "@EduMind/ui";
import Link from "next/link";

export const metadata = {
  title: "Teste È™i EvaluÄƒri - Portal PÄƒrinÈ›i",
};

export default async function ParentAssessmentsPage() {
  const assessments = await prisma.caseAssessment.findMany({
    include: {
      template: true,
      case: { include: { child: true } }
    },
    orderBy: { assignedAt: "desc" }
  });

  return (
    <div className="flex-1 w-full bg-ivory-background py-8">
      <div className="container mx-auto px-4 max-w-5xl space-y-8">
        
        <div className="flex items-start justify-between border-b border-border pb-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold text-primary-ink">
              Teste È™i EvaluÄƒri VocaÈ›ionale
            </h1>
            <p className="text-sm text-primary-text">
              Chestionare externe necesare pentru profilarea candidatului.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {assessments.length === 0 ? (
            <Card className="bg-warm-surface border-border">
              <CardContent className="p-8 text-center text-muted-text">
                Nu existÄƒ teste de evaluare alocate momentan.
              </CardContent>
            </Card>
          ) : (
            assessments.map((assessment) => {
              const child = assessment.case?.child;
              return (
                <Card key={assessment.id} className="bg-warm-surface border-border shadow-sm">
                  <CardContent className="p-6 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-3">
                        {assessment.status === "VERIFIED" ? (
                          <span className="bg-success/10 text-success px-2 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider">
                            Rezultat Primit
                          </span>
                        ) : assessment.status === "DECLARED_COMPLETED" ? (
                          <span className="bg-info/10 text-info px-2 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider">
                            ÃŽn curs de validare
                          </span>
                        ) : (
                          <span className="bg-warning/10 text-warning px-2 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider">
                            NecesitÄƒ AcÈ›iune
                          </span>
                        )}
                        <span className="text-xs text-muted-text">
                          Atribuit: {new Date(assessment.assignedAt).toLocaleDateString('ro-RO')}
                        </span>
                      </div>
                      
                      <h3 className="text-lg font-semibold text-primary-ink">
                        {assessment.template?.testName || "Evaluare NecunoscutÄƒ"}
                      </h3>
                      
                      <p className="text-sm text-primary-text bg-muted-surface p-3 rounded-md border border-border">
                        {assessment.template?.instructions || "UrmeazÄƒ instrucÈ›iunile specifice testului pe platforma partenerÄƒ."}
                      </p>

                      <div className="flex gap-4 text-xs text-muted-text">
                        <span>Elev: <strong>{child?.firstName}</strong></span>
                        {assessment.template?.expectedDuration && (
                          <span>DuratÄƒ est.: {assessment.template.expectedDuration} min</span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto md:w-48 mt-4 md:mt-0">
                      {assessment.status === "ASSIGNED" || assessment.status === "OPENED" ? (
                        <div className="space-y-2 w-full">
                          <Button asChild className="w-full bg-forest-accent hover:bg-forest-hover text-warm-surface">
                            <Link href={assessment.template?.url || "#"} target="_blank">
                              1. ÃŽncepe Testul
                            </Link>
                          </Button>
                          <Button variant="outline" className="w-full text-xs border-dashed">
                            2. Am Finalizat Testul
                          </Button>
                        </div>
                      ) : assessment.status === "DECLARED_COMPLETED" ? (
                        <div className="text-sm text-center text-muted-text border border-border p-3 rounded bg-muted-surface w-full">
                          AÈ™teptÄƒm rezultatele de la platforma partenerÄƒ.
                        </div>
                      ) : (
                        <div className="text-sm text-center text-success border border-success/20 p-3 rounded bg-success/5 w-full">
                          Specialistul a interpretat rezultatele.
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

