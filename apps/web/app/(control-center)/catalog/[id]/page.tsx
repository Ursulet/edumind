import { prisma } from "@/lib/db";
import { Button, Input, Label, Card, CardContent, CardHeader, CardTitle } from "@edumind/ui";
import { notFound } from "next/navigation";
import Link from "next/link";

export default async function ProductEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      versions: {
        orderBy: { version: "desc" },
        include: { prices: true, entitlements: true }
      }
    }
  });

  if (!product && id !== "new") return notFound();

  const activeVersion = product?.versions[0];
  const isPublished = activeVersion?.status === "PUBLISHED";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-3">
            <Link href="/catalog" className="text-muted-text hover:text-primary-ink text-sm">
              ← Înapoi la Catalog
            </Link>
          </div>
          <h1 className="text-2xl font-semibold text-primary-ink mt-2">
            {product ? activeVersion?.internalName : "Produs Nou"}
          </h1>
          <p className="text-sm text-muted-text">
            {isPublished ? "Acest produs este publicat. Orice modificare va genera o versiune nouă." : "Versiune Ciornă (Draft)"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isPublished && <Button variant="outline">Creează Versiune Nouă (v{(activeVersion?.version || 0) + 1})</Button>}
          {!isPublished && <Button variant="outline">Salvează Ciornă</Button>}
          {!isPublished && <Button className="bg-forest-accent text-warm-surface">Publică Versiunea</Button>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main Editor */}
        <div className="md:col-span-2 space-y-6">
          <Card className="bg-warm-surface border-border">
            <CardHeader>
              <CardTitle>Date Comerciale</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Nume Intern</Label>
                <Input defaultValue={activeVersion?.internalName} disabled={isPublished} placeholder="Ex: Pachet 5 Sedinte Consiliere V2" />
              </div>
              <div className="space-y-2">
                <Label>Nume Marketing (Afișat Părinților)</Label>
                <Input defaultValue={activeVersion?.marketingName} disabled={isPublished} placeholder="Ex: Descoperă-ți Drumul - Pachet Start" />
              </div>
              <div className="space-y-2">
                <Label>Descriere Scurtă</Label>
                <textarea 
                  className="w-full flex min-h-[80px] rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50" 
                  defaultValue={activeVersion?.description || ""} 
                  disabled={isPublished}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-warm-surface border-border">
            <CardHeader>
              <CardTitle>Drepturi Obținute (Entitlements)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border border-border rounded-lg p-4 bg-muted-surface flex justify-between items-center">
                <div>
                  <h4 className="font-semibold text-sm">Ședințe Individuale</h4>
                  <p className="text-xs text-muted-text">Acordă credite de consiliere.</p>
                </div>
                <div className="flex items-center gap-2">
                  <Input type="number" defaultValue="5" disabled={isPublished} className="w-20 text-center" />
                  <span className="text-sm">credite</span>
                </div>
              </div>
              {!isPublished && (
                <Button variant="outline" className="w-full border-dashed">
                  + Adaugă Drept Nou
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card className="bg-warm-surface border-border">
            <CardHeader>
              <CardTitle>Preț și Taxe</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Preț Standard (RON)</Label>
                <Input type="number" defaultValue={activeVersion?.prices[0]?.amount?.toString() || ""} disabled={isPublished} placeholder="2500" />
                <p className="text-xs text-muted-text">TVA inclus conform politicilor setate.</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-warm-surface border-border">
            <CardHeader>
              <CardTitle>Istoric Versiuni</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                {product?.versions.map((v) => (
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
