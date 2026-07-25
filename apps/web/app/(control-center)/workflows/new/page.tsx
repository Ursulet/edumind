export const dynamic = "force-dynamic";

export const metadata = {
  title: "Creează Workflow Nou - Control Center",
};

export default function NewWorkflowPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <h1 className="text-2xl font-semibold text-primary-ink">Creează Workflow</h1>
          <p className="text-sm text-muted-text">Configurează un nou șablon de parcurs pentru clienți.</p>
        </div>
      </div>
      <div className="bg-warm-surface border border-border p-8 text-center rounded-xl">
        <p className="text-muted-text">Această secțiune (Editor Workflow vizual) este în curs de dezvoltare.</p>
      </div>
    </div>
  );
}
