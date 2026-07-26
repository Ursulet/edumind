import { prisma } from "@/lib/db";
import { Button, Input, Label, Card, CardContent, CardHeader, CardTitle } from "@edumind/ui";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function WorkflowEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const template = await prisma.journeyTemplate.findUnique({
    where: { id },
    include: {
      versions: {
        orderBy: { version: "desc" },
        include: { steps: { orderBy: { order: "asc" } } }
      }
    }
  }).catch(() => null);

  if (!template && id !== "new") return notFound();

  const activeVersion = template?.versions[0];
  const isPublished = activeVersion?.status === "PUBLISHED";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-3">
            <Link href="/workflows" className="text-muted-text hover:text-primary-ink text-sm">
              ← Înapoi la Fluxuri
            </Link>
          </div>
          <h1 className="text-2xl font-semibold text-primary-ink mt-2">
            {template ? template.name : "Șablon Nou"}
          </h1>
          <p className="text-sm text-muted-text">
            {isPublished ? "Versiune publicată (Imutabilă)." : "Versiune Ciornă (Draft)"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isPublished && <Button variant="outline">Creează Draft (v{(activeVersion?.version || 0) + 1})</Button>}
          {!isPublished && <Button variant="outline">Salvează Ciornă</Button>}
          {!isPublished && <Button className="bg-forest-accent text-warm-surface">Publică Workflow</Button>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main Editor - Steps Sequence */}
        <div className="md:col-span-2 space-y-6">
          <Card className="bg-warm-surface border-border">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Secvență de Pași (Noduri)</CardTitle>
              {!isPublished && <Button variant="outline" size="sm">+ Adaugă Pas</Button>}
            </CardHeader>
            <CardContent>
              {activeVersion?.steps.length === 0 ? (
                <div className="text-center py-8 text-muted-text text-sm">Nu există pași definiți. Începe să contruiești fluxul.</div>
              ) : (
                <div className="relative border-l-2 border-border ml-3 space-y-8 pb-4">
                  {activeVersion?.steps.map((step, idx) => (
                    <div key={step.id} className="relative pl-8">
                      <div className="absolute -left-[11px] top-1 w-5 h-5 rounded-full bg-forest-accent border-4 border-warm-surface" />
                      <div className="border border-border rounded-lg bg-ivory-background p-4 shadow-sm">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-primary-ink">{step.internalLabel}</h4>
                          <span className="text-xs bg-muted-surface px-2 py-0.5 rounded text-muted-text border border-border">
                            {step.type}
                          </span>
                        </div>
                        <p className="text-xs text-primary-text mb-2">
                          Parent UI Label: <span className="font-mono bg-warm-surface px-1">{step.parentLabel || "Ascuns"}</span>
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-text mt-4 pt-3 border-t border-border">
                          <span>Responsabil: {step.responsibleRole || "SISTEM"}</span>
                          {step.requiredEntitlement && (
                            <span className="text-warning flex items-center gap-1">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                              Necesită {step.requiredEntitlement}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="relative pl-8">
                    <div className="absolute -left-[11px] top-1 w-5 h-5 rounded-full bg-sage-surface border-4 border-warm-surface border-dashed" />
                    <div className="text-sm text-muted-text italic py-1">Sfârșit Flux</div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="bg-warm-surface border-border">
            <CardHeader>
              <CardTitle>Istoric Versiuni</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                {template?.versions.map((v) => (
                  <div key={v.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full border border-white bg-slate-300 text-slate-500 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                      <span className="text-xs">{v.version}</span>
                    </div>
                    <div className="w-[calc(100%-2rem)] md:w-[calc(50%-1.5rem)] p-3 rounded border border-slate-200 bg-white shadow">
                      <div className="flex items-center justify-between mb-1">
                        <div className="font-bold text-slate-900 text-xs">v{v.version}</div>
                        <time className="font-caveat font-medium text-xs text-indigo-500">
                          {new Date(v.createdAt).toLocaleDateString('ro-RO')}
                        </time>
                      </div>
                      <div className="text-slate-500 text-xs">{v.status}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
