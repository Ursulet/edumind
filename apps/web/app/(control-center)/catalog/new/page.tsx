export const dynamic = "force-dynamic";

export const metadata = {
  title: "Adaugă Produs Nou - Catalog",
};

export default function NewProductPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <h1 className="text-2xl font-semibold text-primary-ink">Produs Nou</h1>
          <p className="text-sm text-muted-text">Adaugă un nou pachet sau serviciu în catalogul organizației.</p>
        </div>
      </div>
      <div className="bg-warm-surface border border-border p-8 text-center rounded-xl">
        <p className="text-muted-text">Această secțiune (Formular Creare Produs) este în curs de dezvoltare.</p>
      </div>
    </div>
  );
}
