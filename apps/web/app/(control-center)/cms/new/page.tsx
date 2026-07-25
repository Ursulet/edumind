export const dynamic = "force-dynamic";

export const metadata = {
  title: "Adaugă Articol CMS - Control Center",
};

export default function NewCmsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <h1 className="text-2xl font-semibold text-primary-ink">Creează Articol</h1>
          <p className="text-sm text-muted-text">Redactează un nou articol sau resursă publică.</p>
        </div>
      </div>
      <div className="bg-warm-surface border border-border p-8 text-center rounded-xl">
        <p className="text-muted-text">Editorul CMS este în curs de dezvoltare.</p>
      </div>
    </div>
  );
}
