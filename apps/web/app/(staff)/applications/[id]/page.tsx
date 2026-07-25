import { getUserFromToken, getAuthHeaders } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ApplicationActionPanel } from "@/components/cases/ApplicationActionPanel";

export const dynamic = "force-dynamic";

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

export default async function ApplicationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getUserFromToken();
  if (!user) redirect("/login");

  if (!["DEPARTMENT_ADMIN", "SUPER_ADMIN", "PLATFORM_OWNER"].includes(user.role)) {
    redirect("/specialist");
  }

  const { id } = await params;
  const authHeaders = await getAuthHeaders();

  const [app, journeyTemplates] = await Promise.all([
    fetchWithAuth(`/api/v1/applications/${id}`, authHeaders),
    fetchWithAuth(`/api/v1/journeys/templates`, authHeaders),
  ]);

  if (!app) return notFound();

  const { prisma } = await import("@/lib/db");
  const staffList = await prisma.staffProfile.findMany({
    where: { user: { organizationId: user.organizationId } },
    include: { user: true }
  });

  const formData = (app.data as any) ?? {};
  const parentUser = app.family?.parents?.[0]?.user;

  // Map staff to simple { id, name } format
  const specialists = Array.isArray(staffList)
    ? staffList.map((s: any) => ({
        id: s.id,
        name: `${s.user?.firstName || ""} ${s.user?.lastName || ""}`.trim() || s.user?.email || s.id,
      }))
    : [];

  // Map journey templates
  const templates = Array.isArray(journeyTemplates)
    ? journeyTemplates.map((t: any) => ({ id: t.id, name: t.name || "Journey Standard" }))
    : [];

  const statusColors: Record<string, string> = {
    SUBMITTED: "bg-[#FEF3C7] text-[#B7791F] border-[#FDE68A]",
    UNDER_REVIEW: "bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]",
    APPROVED: "bg-[#EDF4F0] text-[#2F7A55] border-[#DCE8E1]",
    REJECTED: "bg-[#FEF2F2] text-[#B4453A] border-[#FECACA]",
    CONVERTED_TO_CASE: "bg-[#F3F4F6] text-[#6B7280] border-[#E5E7EB]",
  };

  const statusLabel: Record<string, string> = {
    SUBMITTED: "Nouă",
    UNDER_REVIEW: "În Evaluare",
    APPROVED: "Aprobată",
    REJECTED: "Respinsă",
    CONVERTED_TO_CASE: "Convertită în Caz",
  };

  const isActionable = ["SUBMITTED", "UNDER_REVIEW", "APPROVED"].includes(app.status);

  // Use the first department or a default - in a real system this comes from user's department
  const departmentId = user.organizationId;

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-start justify-between border-b border-[#E3DED3] pb-6">
        <div className="space-y-2">
          <Link
            href="/applications"
            className="text-sm text-[#6B746F] hover:text-[#1F2622] transition-colors font-medium"
          >
            ← Înapoi la Aplicații
          </Link>
          <h1 className="text-2xl font-semibold text-[#1F2622] tracking-tight mt-2">
            Aplicație: {formData.childFirstName || "Copil"} {formData.childLastName || ""}
          </h1>
          <div className="flex items-center gap-3">
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider border ${
                statusColors[app.status] || "bg-gray-100 text-gray-600 border-gray-200"
              }`}
            >
              {statusLabel[app.status] || app.status}
            </span>
            <span className="text-xs text-[#6B746F]">
              Înregistrată: {new Date(app.createdAt).toLocaleDateString("ro-RO", { day: "2-digit", month: "long", year: "numeric" })}
            </span>
          </div>
        </div>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Application data */}
        <div className="lg:col-span-2 space-y-6">
          {/* Child info */}
          <div className="bg-[#FFFDF8] border border-[#E3DED3] rounded-xl p-6">
            <h2 className="text-base font-semibold text-[#1F2622] mb-4">Date Copil / Elev</h2>
            <dl className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
              <div>
                <dt className="text-[#6B746F] font-medium">Prenume</dt>
                <dd className="text-[#1F2622] font-semibold mt-0.5">{formData.childFirstName || "—"}</dd>
              </div>
              <div>
                <dt className="text-[#6B746F] font-medium">Nume</dt>
                <dd className="text-[#1F2622] font-semibold mt-0.5">{formData.childLastName || "—"}</dd>
              </div>
              <div>
                <dt className="text-[#6B746F] font-medium">Clasă</dt>
                <dd className="text-[#1F2622] mt-0.5">{formData.grade || "—"}</dd>
              </div>
              <div>
                <dt className="text-[#6B746F] font-medium">Localitate</dt>
                <dd className="text-[#1F2622] mt-0.5">{formData.city ? `${formData.city}, ${formData.county || ""}` : "—"}</dd>
              </div>
            </dl>
          </div>

          {/* Parent info */}
          <div className="bg-[#FFFDF8] border border-[#E3DED3] rounded-xl p-6">
            <h2 className="text-base font-semibold text-[#1F2622] mb-4">Date Părinte / Tutore</h2>
            <dl className="grid grid-cols-2 gap-x-8 gap-y-3 text-sm">
              <div>
                <dt className="text-[#6B746F] font-medium">Nume</dt>
                <dd className="text-[#1F2622] font-semibold mt-0.5">
                  {parentUser ? `${parentUser.firstName} ${parentUser.lastName}` : "—"}
                </dd>
              </div>
              <div>
                <dt className="text-[#6B746F] font-medium">Email</dt>
                <dd className="text-[#1F2622] mt-0.5">
                  {parentUser?.email ? (
                    <a href={`mailto:${parentUser.email}`} className="text-[#2F6B57] hover:underline">
                      {parentUser.email}
                    </a>
                  ) : "—"}
                </dd>
              </div>
            </dl>
          </div>

          {/* Declared need */}
          {app.declaredNeed && (
            <div className="bg-[#FFFDF8] border border-[#E3DED3] rounded-xl p-6">
              <h2 className="text-base font-semibold text-[#1F2622] mb-3">Nevoie Declarată</h2>
              <p className="text-sm text-[#1F2622] italic leading-relaxed">
                &ldquo;{app.declaredNeed}&rdquo;
              </p>
            </div>
          )}

          {/* History */}
          {app.history && app.history.length > 0 && (
            <div className="bg-[#FFFDF8] border border-[#E3DED3] rounded-xl p-6">
              <h2 className="text-base font-semibold text-[#1F2622] mb-4">Istoric Statusuri</h2>
              <div className="space-y-3">
                {app.history.map((h: any) => (
                  <div key={h.id} className="flex items-start gap-3 text-sm">
                    <span className="text-[#6B746F] font-mono text-xs w-24 shrink-0">
                      {new Date(h.createdAt).toLocaleDateString("ro-RO")}
                    </span>
                    <span className="font-medium text-[#1F2622]">{h.status}</span>
                    {h.notes && <span className="text-[#6B746F] italic">{h.notes}</span>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Actions */}
        <div className="space-y-4">
          <div className="bg-[#FFFDF8] border border-[#E3DED3] rounded-xl p-6">
            <h2 className="text-base font-semibold text-[#1F2622] mb-4">Acțiuni Director</h2>
            {isActionable ? (
              <ApplicationActionPanel
                applicationId={app.id}
                specialists={specialists}
                journeyTemplates={templates}
                departmentId={departmentId}
              />
            ) : (
              <p className="text-sm text-[#6B746F]">
                Aplicația este în status <strong>{statusLabel[app.status] || app.status}</strong> — nu sunt disponibile acțiuni suplimentare.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
