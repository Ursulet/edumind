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

export default async function ParentDashboard() {
  const user = await getUserFromToken();
  if (!user) redirect("/login");

  const authHeaders = await getAuthHeaders();

  // Fetch case data and workflow next action in parallel
  const [caseData, notificationsData] = await Promise.all([
    fetchWithAuth(`/api/v1/cases/mine`, authHeaders),
    fetchWithAuth(`/api/v1/notifications`, authHeaders),
  ]);

  const activeCase = Array.isArray(caseData) ? caseData[0] : null;
  const notifications = Array.isArray(notificationsData)
    ? notificationsData.filter((n: { readAt: string | null }) => !n.readAt)
    : [];

  // Try to get workflow next action if we have a case
  const nextAction = activeCase
    ? await fetchWithAuth(
        `/api/v1/workflows/instances/${activeCase.id}/next-action`,
        authHeaders
      )
    : null;

  const displayName =
    `${user.firstName || ""}`.trim() || user.email.split("@")[0];

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
        <div className="flex items-start justify-between pb-6 border-b border-[#E3DED3]">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold text-[#1F2622] tracking-[-0.025em]">
              Bun venit, {displayName}!
            </h1>
            {activeCase ? (
              <p className="text-sm text-[#6B746F]">
                Dosar activ pentru{" "}
                <strong className="text-[#1F2622]">
                  {activeCase.childName || "copilul tău"}
                </strong>
              </p>
            ) : (
              <p className="text-sm text-[#6B746F]">
                Nu ai niciun dosar activ momentan.
              </p>
            )}
          </div>
          {activeCase && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#EDF4F0] text-[#2F6B57] border border-[#DCE8E1]">
              {activeCase.status || "Activ"}
            </span>
          )}
          {notifications.length > 0 && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-[#FEF3C7] text-[#B7791F] border border-[#FDE68A]">
              {notifications.length} notificări noi
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="md:col-span-2 space-y-6">

            {/* Dominant Next Action Card */}
            {nextAction ? (
              <div className="bg-[#FFFDF8] border border-[#E3DED3] border-l-4 border-l-[#2F6B57] rounded-xl p-6 shadow-[0_1px_2px_rgba(31,38,34,0.05)] space-y-4">
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
                    className="inline-flex items-center px-5 py-2.5 rounded-lg bg-[#2F6B57] text-white text-sm font-semibold hover:bg-[#275B4A] transition-colors duration-150"
                  >
                    {nextAction.actionLabel || "Continuă"}
                  </Link>
                )}
              </div>
            ) : (
              <div className="bg-[#FFFDF8] border border-[#E3DED3] border-l-4 border-l-[#2F6B57] rounded-xl p-6 shadow-[0_1px_2px_rgba(31,38,34,0.05)] space-y-4">
                <div className="flex items-center gap-2 text-[#2F6B57]">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-xs font-bold uppercase tracking-wider">Acțiune Necesară</span>
                </div>
                <h2 className="text-xl font-semibold text-[#1F2622]">
                  {activeCase ? "Așteptați atribuirea specialistului" : "Completează înscrierea"}
                </h2>
                <p className="text-sm text-[#6B746F] leading-relaxed">
                  {activeCase
                    ? "Dosarul tău a fost înregistrat. Un specialist va fi atribuit în curând."
                    : "Completează formularul de aplicație pentru a începe parcursul de consiliere."}
                </p>
                {!activeCase && (
                  <Link
                    href="/inscriere"
                    className="inline-flex items-center px-5 py-2.5 rounded-lg bg-[#1F2622] text-white text-sm font-semibold hover:bg-[#2A332E] transition-colors duration-150"
                  >
                    Completează Aplicația
                  </Link>
                )}
              </div>
            )}

            {/* Journey Stepper */}
            <div className="space-y-3">
              <h3 className="text-base font-semibold text-[#1F2622]">Parcurs Educațional</h3>
              <div className="bg-[#FFFDF8] border border-[#E3DED3] rounded-xl p-6">
                <div className="flex justify-between relative">
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
          </div>

          {/* Sidebar */}
          <div className="space-y-4">

            {/* Upcoming Session */}
            <div className="bg-[#FFFDF8] border border-[#E3DED3] rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-[#E3DED3]">
                <h4 className="text-sm font-semibold text-[#1F2622]">Următoarea Ședință</h4>
              </div>
              <div className="px-5 py-4 text-center">
                <p className="text-sm text-[#6B746F] mb-3">Nicio ședință programată momentan.</p>
                <Link
                  href="/programari"
                  className="inline-block w-full rounded-lg border border-[#E3DED3] text-sm text-[#1F2622] py-2 hover:bg-[#F1EEE7] transition-colors text-center font-medium"
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
                  { href: "/evaluari", label: "Evaluări" },
                  { href: "/rapoarte", label: "Rapoarte" },
                  { href: "/recomandari", label: "Recomandări" },
                  { href: "/dosar", label: "Dosar Complet" },
                  { href: "/plati", label: "Plăți" },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[#6B746F] hover:bg-[#F1EEE7] hover:text-[#1F2622] transition-all duration-150"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2F6B57]" />
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Account info */}
            <div className="bg-[#EDF4F0] border border-[#DCE8E1] rounded-xl px-5 py-4">
              <p className="text-xs text-[#6B746F] font-medium mb-1">Cont autentificat</p>
              <p className="text-sm text-[#1F2622] font-semibold truncate">{user.email}</p>
              <p className="text-xs text-[#6B746F] mt-0.5 capitalize">{user.role.toLowerCase().replace("_", " ")}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
