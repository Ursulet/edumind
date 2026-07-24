import { getUserFromToken, getAuthHeaders } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, Badge, Button } from "@edumind/ui";
import Link from "next/link";

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

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Dashboard Director Departament | EduMind",
};

export default async function DirectorDashboardPage() {
  const user = await getUserFromToken();
  if (!user) redirect("/login");

  // Only allow Director or Admin
  if (!["DEPARTMENT_ADMIN", "SUPER_ADMIN", "PLATFORM_OWNER"].includes(user.role)) {
    redirect("/specialist");
  }

  const authHeaders = await getAuthHeaders();

  // Fetch applications
  const appsData = await fetchWithAuth(`/api/v1/applications`, authHeaders);
  const pendingAppsCount = Array.isArray(appsData)
    ? appsData.filter((a) => ["SUBMITTED", "UNDER_REVIEW"].includes(a.status)).length
    : 0;

  // Fetch cases
  const casesData = await fetchWithAuth(`/api/v1/cases`, authHeaders);
  const activeCases = Array.isArray(casesData)
    ? casesData.filter((c) => c.status !== "COMPLETED")
    : [];

  const unassignedCases = activeCases.filter((c) => !c.assignments || c.assignments.length === 0);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between border-b border-[#E3DED3] pb-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1F2622]">Panou Director Departament</h1>
          <p className="text-sm text-[#6B746F]">Gestionarea aplicațiilor noi, a fluxurilor de cazuri și a încărcării echipei de specialiști.</p>
        </div>
        <Link href="/applications">
          <Button className="bg-[#1F2622] text-white hover:bg-[#2A332E]">
            Queue Aplicații ({pendingAppsCount})
          </Button>
        </Link>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-[#FFFDF8] border-[#E3DED3] shadow-[0_1px_2px_rgba(31,38,34,0.05)]">
          <CardContent className="p-6">
            <p className="text-sm font-medium text-[#6B746F]">Aplicații Noi Așteptare</p>
            <h3 className="text-3xl font-extrabold text-[#1F2622] mt-2">{pendingAppsCount}</h3>
            <p className="text-xs text-[#B7791F] mt-1 font-semibold">Triage necesar</p>
          </CardContent>
        </Card>

        <Card className="bg-[#FFFDF8] border-[#E3DED3] shadow-[0_1px_2px_rgba(31,38,34,0.05)]">
          <CardContent className="p-6">
            <p className="text-sm font-medium text-[#6B746F]">Cazuri Neasignate</p>
            <h3 className="text-3xl font-extrabold text-[#1F2622] mt-2">{unassignedCases.length}</h3>
            <p className="text-xs text-[#B4453A] mt-1 font-semibold">Necesită alocare consilier</p>
          </CardContent>
        </Card>

        <Card className="bg-[#FFFDF8] border-[#E3DED3] shadow-[0_1px_2px_rgba(31,38,34,0.05)]">
          <CardContent className="p-6">
            <p className="text-sm font-medium text-[#6B746F]">Cazuri În Desfășurare</p>
            <h3 className="text-3xl font-extrabold text-[#1F2622] mt-2">{activeCases.length}</h3>
            <p className="text-xs text-[#2F6B57] mt-1 font-semibold">Progres active</p>
          </CardContent>
        </Card>
      </div>

      {/* Active Cases Table */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-[#1F2622]">Cazuri Active în Departament</h2>
        <Card className="bg-[#FFFDF8] border-[#E3DED3] shadow-sm overflow-hidden">
          <CardContent className="p-0">
            <table className="w-full text-sm text-left">
              <thead className="bg-[#F7F5F0] text-[#6B746F]">
                <tr>
                  <th className="px-4 py-3 font-semibold">ID Caz</th>
                  <th className="px-4 py-3 font-semibold">Elev</th>
                  <th className="px-4 py-3 font-semibold">Specialist Asignat</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold text-right">Acțiuni</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E3DED3]">
                {activeCases.map((c: any) => (
                  <tr key={c.id} className="hover:bg-[#F7F5F0] transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-[#1F2622]">{c.publicId || c.id.slice(0, 8)}</td>
                    <td className="px-4 py-3 text-[#1F2622]">
                      {c.child?.firstName} {c.child?.lastName}
                    </td>
                    <td className="px-4 py-3 text-[#6B746F]">
                      {c.assignments?.[0]?.staff?.user
                        ? `${c.assignments[0].staff.user.firstName} ${c.assignments[0].staff.user.lastName}`
                        : "Neasignat"}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className="text-[#2F6B57] border-[#2F6B57]/30 bg-[#EDF4F0] font-bold">
                        {c.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {/* In a real app this would go to the internal case viewer */}
                      <Link href={`/cases/${c.id}`}>
                        <Button variant="outline" className="text-xs border-[#E3DED3] text-[#1F2622]">Deschide Dossier</Button>
                      </Link>
                    </td>
                  </tr>
                ))}
                {activeCases.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-6 text-center text-[#6B746F]">
                      Niciun caz activ momentan.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

