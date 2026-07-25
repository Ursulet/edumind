export const dynamic = "force-dynamic";

export const metadata = {
  title: "Editează Produs - Catalog",
};

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <h1 className="text-2xl font-semibold text-primary-ink">Editează Produs</h1>
          <p className="text-sm text-muted-text">Modifică detaliile pentru produsul cu ID: {id}</p>
        </div>
      </div>
      <div className="bg-warm-surface border border-border p-8 text-center rounded-xl">
        <p className="text-muted-text">Această secțiune (Formular Editare Produs) este în curs de dezvoltare.</p>
      </div>
    </div>
  );
}
