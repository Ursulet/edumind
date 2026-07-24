import { prisma } from "@/lib/db";
import { Button, Card, CardContent } from "@educariera/ui";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Catalog Comercial - Control Center",
};

export default async function CatalogPage() {
  const products = await prisma.product.findMany({
    include: {
      versions: {
        orderBy: { version: "desc" },
        take: 1, // Only show latest version in list
      }
    },
    orderBy: { createdAt: "desc" }
  }).catch(() => []);


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <h1 className="text-2xl font-semibold text-primary-ink">Catalog Comercial</h1>
          <p className="text-sm text-muted-text">Gestionează produsele, pachetele de ședințe și ofertele platformei.</p>
        </div>
        <Button asChild>
          <Link href="/catalog/new">Adaugă Produs Nou</Link>
        </Button>
      </div>

      <div className="space-y-4">
        {products.length === 0 ? (
          <Card className="bg-warm-surface border-border">
            <CardContent className="p-8 text-center text-muted-text">
              Nu există produse definite.
            </CardContent>
          </Card>
        ) : (
          products.map((product) => {
            const latestVersion = product.versions[0];
            return (
              <Card key={product.id} className="bg-warm-surface border-border shadow-sm">
                <CardContent className="p-6 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="bg-sage-surface text-forest-accent px-2 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider border border-border">
                        {product.category}
                      </span>
                      {latestVersion?.status === "PUBLISHED" ? (
                        <span className="bg-success/10 text-success px-2 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider">
                          Activ (v{latestVersion.version})
                        </span>
                      ) : (
                        <span className="bg-warning/10 text-warning px-2 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider">
                          Ciornă (v{latestVersion?.version || 1})
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-primary-ink">
                      {latestVersion?.internalName || "Produs Fără Nume"}
                    </h3>
                    <p className="text-sm text-primary-text line-clamp-1">
                      {latestVersion?.marketingName}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    <Button variant="outline" asChild>
                      <Link href={`/catalog/${product.id}`}>
                        Vezi Versiuni & Editează
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

