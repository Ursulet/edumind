import Link from "next/link";
import { getUserFromToken, getAuthHeaders } from "@/lib/auth";
import { redirect } from "next/navigation";

const API = process.env.INTERNAL_API_URL || "http://api:4000";

async function fetchWithAuth(path: string, headers: Record<string, string>) {
  try {
    const res = await fetch(`${API}${path}`, {
      headers: { ...headers, "Content-Type": "application/json" },
      cache: "no-store",
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export const metadata = {
  title: "Dashboard — Portal Părinți | EduMind",
};

export default async function ParentDashboard({ searchParams }: { searchParams: { caseId?: string } }) {
  const user = await getUserFromToken();
  if (!user) redirect("/login");

  const authHeaders = await getAuthHeaders();
  const { caseId } = await searchParams;

  // Fetch case data and workflow next action in parallel
  const [caseData, notificationsData] = await Promise.all([
    fetchWithAuth(`/api/v1/cases/mine`, authHeaders),
    fetchWithAuth(`/api/v1/notifications`, authHeaders),
  ]);

  const allCases = Array.isArray(caseData) ? caseData : [];
  let activeCase = allCases.length > 0 ? allCases[0] : null;

  if (caseId && allCases.find((c) => c.id === caseId)) {
    activeCase = allCases.find((c) => c.id === caseId);
  }

  const notifications = Array.isArray(notificationsData)
    ? notificationsData.filter((n: { readAt: string | null }) => !n.readAt)
    : [];

  const nextAction = activeCase
    ? await fetchWithAuth(`/api/v1/workflows/instances/${activeCase.id}/next-action`, authHeaders)
    : null;

  // Mocked for now until endpoints are created:
  const sessionBalance = activeCase ? 2 : 0; // Remaining sessions
  const latestRecommendation = activeCase ? { id: "1", title: "Pachet Consiliere Extinsă", date: new Date().toISOString() } : null;
  const latestReport = activeCase ? { id: "1", title: "Raport Evaluare Vocațională", date: new Date().toISOString() } : null;

  const displayName = `${user.firstName || ""}`.trim() || user.email.split("@")[0];

  const journeySteps = activeCase?.workflowSteps ?? [
    { label: "Înscriere", status: "COMPLETED" },
    { label: "Evaluare", status: "ACTIVE" },
    { label: "Consiliere", status: "UPCOMING" },
    { label: "Plan Carieră", status: "UPCOMING" },
  ];

  return (
    <div className="flex-1 w-full py-4 md:py-6">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Context Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-[#E3DED3] gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold text-[#1F2622] tracking-[-0.025em]">
              Bun venit, {displayName}!
            </h1>
            <p className="text-sm text-[#6B746F]">Aici vezi statusul și următorii pași pentru copilul tău.</p>
          </div>
          
          <div className="flex items-center gap-3">
            {allCases.length > 1 && (
              <div className="flex items-center gap-2">
                <label className="text-xs font-medium text-[#6B746F]">Copil selectat:</label>
                <select 
                  className="text-sm border-[#E3DED3] bg-[#FFFDF8] rounded-md px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#2F6B57]"
                  defaultValue={activeCase?.id}
                  // In a real client component, this would push router. However this is RSC.
                  // We'll wrap it in a form or just use standard native behavior in next phase.
                >
                  {allCases.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.child?.firstName || c.childName} {c.child?.lastName || ""}
                    </option>
                  ))}
                </select>
              </div>
            )}
            {notifications.length > 0 && (
              <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md text-xs font-semibold bg-[#FEF3C7] text-[#B7791F] border border-[#FDE68A]">
                {notifications.length} notificări
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">

            {/* Dominant Next Action Card */}
            {nextAction ? (
              <div className="bg-[#FFFDF8] border border-[#E3DED3] border-l-4 border-l-[#2F6B57] rounded-xl p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-2 text-[#2F6B57]">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span className="text-xs font-bold uppercase tracking-wider">Acțiune Necesară</span>
                </div>
                <h2 className="text-xl font-semibold text-[#1F2622]">
                  {nextAction.stepLabel || nextAction.label || "Pasul următor"}
                </h2>
                <p className="text-sm text-[#6B746F] leading-relaxed">
                  {nextAction.description || "Completați acțiunea curentă pentru a avansa în parcurs."}
                </p>
                {nextAction.actionUrl && (
                  <Link
                    href={nextAction.actionUrl}
                    className="inline-flex items-center px-5 py-2.5 rounded-lg bg-[#2F6B57] text-white text-sm font-semibold hover:bg-[#275B4A] transition-colors"
                  >
                    {nextAction.actionLabel || "Continuă"}
                  </Link>
                )}
              </div>
            ) : (
              <div className="bg-[#FFFDF8] border border-[#E3DED3] border-l-4 border-l-[#2F6B57] rounded-xl p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-2 text-[#2F6B57]">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-xs font-bold uppercase tracking-wider">Status Curent</span>
                </div>
                <h2 className="text-xl font-semibold text-[#1F2622]">
                  {activeCase ? "Așteptați instrucțiuni sau alocarea specialistului" : "Completează înscrierea"}
                </h2>
                <p className="text-sm text-[#6B746F] leading-relaxed">
                  {activeCase
                    ? "Dosarul este în regulă. Veți fi notificat când există o nouă acțiune de efectuat."
                    : "Completează formularul de aplicație pentru a începe parcursul de consiliere."}
                </p>
                {!activeCase && (
                  <Link
                    href="/inscriere"
                    className="inline-flex items-center px-5 py-2.5 rounded-lg bg-[#1F2622] text-white text-sm font-semibold hover:bg-[#2A332E] transition-colors"
                  >
                    Completează Aplicația
                  </Link>
                )}
              </div>
            )}

            {/* Journey Stepper */}
            {activeCase && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold text-[#1F2622]">Parcurs Educațional</h3>
                  <span className="px-2.5 py-1 bg-[#EDF4F0] text-[#2F6B57] text-xs font-semibold rounded-md border border-[#DCE8E1]">
                    {activeCase.status || "ACTIV"}
                  </span>
                </div>
                <div className="bg-[#FFFDF8] border border-[#E3DED3] rounded-xl p-6 overflow-x-auto">
                  <div className="flex justify-between relative min-w-[500px]">
                    <div className="absolute top-4 left-6 right-6 h-px bg-[#E3DED3] -z-10" />
                    {journeySteps.map((step: { label: string; status: string }, i: number) => {
                      const isDone = step.status === "COMPLETED";
                      const isActive = step.status === "ACTIVE";
                      return (
                        <div key={i} className="flex flex-col items-center gap-2">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-colors ${
                              isDone
                                ? "bg-[#2F6B57] text-white"
                                : isActive
                                ? "bg-[#EDF4F0] border-2 border-[#2F6B57] text-[#2F6B57]"
                                : "bg-[#F1EEE7] border border-[#E3DED3] text-[#6B746F]"
                            }`}
                          >
                            {isDone ? (
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            ) : (
                              i + 1
                            )}
                          </div>
                          <span className={`text-xs font-medium ${isDone || isActive ? "text-[#1F2622]" : "text-[#6B746F]"}`}>
                            {step.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Documents & Recommendations */}
            {activeCase && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-[#FFFDF8] border border-[#E3DED3] rounded-xl p-5 hover:border-[#2F6B57] transition-colors cursor-pointer flex flex-col justify-between group">
                  <div>
                    <div className="flex items-center gap-2 text-[#6B746F] mb-3">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                      <h4 className="text-sm font-semibold">Ultimul Raport</h4>
                    </div>
                    {latestReport ? (
                      <div>
                        <p className="text-sm font-medium text-[#1F2622] group-hover:text-[#2F6B57] transition-colors">{latestReport.title}</p>
                        <p className="text-xs text-[#6B746F] mt-1">{new Date(latestReport.date).toLocaleDateString('ro-RO')}</p>
                      </div>
                    ) : (
                      <p className="text-xs text-[#6B746F]">Niciun raport disponibil încă.</p>
                    )}
                  </div>
                  <Link href="/rapoarte" className="text-xs text-[#2F6B57] font-semibold mt-4 hover:underline">Vezi toate rapoartele &rarr;</Link>
                </div>

                <div className="bg-[#FFFDF8] border border-[#E3DED3] rounded-xl p-5 hover:border-[#2F6B57] transition-colors cursor-pointer flex flex-col justify-between group">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2 text-[#6B746F]">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
                        <h4 className="text-sm font-semibold">Recomandări Noi</h4>
                      </div>
                      {latestRecommendation && <span className="w-2 h-2 rounded-full bg-[#B4453A]"></span>}
                    </div>
                    {latestRecommendation ? (
                      <div>
                        <p className="text-sm font-medium text-[#1F2622] group-hover:text-[#2F6B57] transition-colors">{latestRecommendation.title}</p>
                        <p className="text-xs text-[#6B746F] mt-1">Apasă pentru detalii</p>
                      </div>
                    ) : (
                      <p className="text-xs text-[#6B746F]">Nicio recomandare nouă.</p>
                    )}
                  </div>
                  <Link href="/recomandari" className="text-xs text-[#2F6B57] font-semibold mt-4 hover:underline">Vezi recomandările &rarr;</Link>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">

            {/* Balanta Sesiuni */}
            {activeCase && (
              <div className="bg-[#2F6B57] rounded-xl p-5 text-white shadow-sm relative overflow-hidden">
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
                <h4 className="text-sm font-medium text-[#EDF4F0] mb-1">Balanță Sesiuni</h4>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-4xl font-bold">{sessionBalance}</span>
                  <span className="text-sm font-medium text-[#EDF4F0]">rămase</span>
                </div>
                <Link href="/catalog" className="inline-block mt-4 text-xs font-semibold text-[#EDF4F0] hover:text-white transition-colors underline underline-offset-2">
                  Achiziționează mai multe
                </Link>
              </div>
            )}

            {/* Upcoming Session */}
            <div className="bg-[#FFFDF8] border border-[#E3DED3] rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-[#E3DED3]">
                <h4 className="text-sm font-semibold text-[#1F2622]">Următoarea Ședință</h4>
              </div>
              <div className="px-5 py-4 text-center">
                <p className="text-sm text-[#6B746F] mb-3">Nicio ședință programată momentan.</p>
                <Link
                  href="/programari"
                  className="inline-block w-full rounded-lg border border-[#E3DED3] text-sm text-[#1F2622] py-2 hover:bg-[#F1EEE7] transition-colors text-center font-medium shadow-sm"
                >
                  Solicită Programare
                </Link>
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-[#FFFDF8] border border-[#E3DED3] rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-[#E3DED3]">
                <h4 className="text-sm font-semibold text-[#1F2622]">Acces Rapid</h4>
              </div>
              <div className="p-3 space-y-1">
                {[
                  { href: "/evaluari", label: "Teste & Evaluări" },
                  { href: "/rapoarte", label: "Rapoarte Analiză" },
                  { href: "/recomandari", label: "Recomandări Sistem" },
                  { href: "/dosar", label: "Istoric Dosar Complet" },
                  { href: "/plati", label: "Istoric Plăți" },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-[#6B746F] hover:bg-[#F7F5F0] hover:text-[#1F2622] transition-colors"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E3DED3] group-hover:bg-[#2F6B57] transition-colors" />
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Account info */}
            <div className="bg-[#F7F5F0] rounded-xl px-5 py-4 border border-[#E3DED3] border-dashed">
              <p className="text-xs text-[#6B746F] font-medium mb-1">Cont autentificat</p>
              <p className="text-sm text-[#1F2622] font-semibold truncate">{user.email}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
