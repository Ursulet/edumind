import { prisma } from "@/lib/db";
import { Button, Card, CardContent } from "@educariera/ui";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Journey Workflows - Control Center",
};

export default async function WorkflowsPage() {
  const templates = await prisma.journeyTemplate.findMany({
    include: {
      versions: {
        orderBy: { version: "desc" },
        take: 1, // latest version
      }
    },
    orderBy: { createdAt: "desc" }
  }).catch(() => []);


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <h1 className="text-2xl font-semibold text-primary-ink">Modele de Parcurs (Workflows)</h1>
          <p className="text-sm text-muted-text">Definește etapele consilierii și automatizează traseul copiilor.</p>
        </div>
        <Button asChild>
          <Link href="/workflows/new">Creează Șablon Nou</Link>
        </Button>
      </div>

      <div className="space-y-4">
        {templates.length === 0 ? (
          <Card className="bg-warm-surface border-border">
            <CardContent className="p-8 text-center text-muted-text">
              Nu există fluxuri de lucru definite.
            </CardContent>
          </Card>
        ) : (
          templates.map((template) => {
            const latestVersion = template.versions[0];
            return (
              <Card key={template.id} className="bg-warm-surface border-border shadow-sm">
                <CardContent className="p-6 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      {latestVersion?.status === "PUBLISHED" ? (
                        <span className="bg-success/10 text-success px-2 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider border border-success/20">
                          Activ (v{latestVersion.version})
                        </span>
                      ) : (
                        <span className="bg-warning/10 text-warning px-2 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider border border-warning/20">
                          Ciornă (v{latestVersion?.version || 1})
                        </span>
                      )}
                      <span className="text-xs text-muted-text font-mono">
                        {template.id.split('-')[0]}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-primary-ink">
                      {template.name}
                    </h3>
                    <p className="text-sm text-primary-text line-clamp-2">
                      {template.description || "Nicio descriere."}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    <Button variant="outline" asChild>
                      <Link href={`/workflows/${template.id}`}>
                        Gestionează Pași
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
