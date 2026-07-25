import { getUserFromToken, getAuthHeaders } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Button, Card, CardContent, CardHeader, CardTitle, Badge } from "@edumind/ui";
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
  title: "Specialist Dashboard | EduMind",
};

export default async function SpecialistDashboardPage() {
  const user = await getUserFromToken();
  if (!user) redirect("/login");

  // Allow SPECIALIST or higher
  if (!["SPECIALIST", "DEPARTMENT_ADMIN", "SUPER_ADMIN", "PLATFORM_OWNER"].includes(user.role)) {
    redirect("/dashboard");
  }

  const authHeaders = await getAuthHeaders();
  
  // Fetch cases assigned to the specialist
  let cases: any[] = [];
  const casesData = await fetchWithAuth(`/api/v1/cases`, authHeaders);
  if (Array.isArray(casesData)) {
    // In a real app we would pass assignedToMe=true to the API, but filtering here works if the API is scoped
    cases = casesData;
  }

  // Fetch appointments
  let appointments: any[] = [];
  const aptsData = await fetchWithAuth(`/api/v1/scheduling/my-appointments`, authHeaders);
  if (Array.isArray(aptsData)) {
    appointments = aptsData;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between border-b border-[#E3DED3] pb-4">
        <div>
          <h1 className="text-2xl font-semibold text-[#1F2622] tracking-[-0.025em]">Portal Specialist</h1>
          <p className="text-sm text-[#6B746F]">Ce necesită atenția ta profesională astăzi?</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-[#2F6B57] text-[#2F6B57] hover:bg-[#EDF4F0]">
            Sincronizează Google Calendar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Action Required & Today */}
        <div className="lg:col-span-2 space-y-8">
          
          <section className="space-y-4">
            <h2 className="text-lg font-medium text-[#1F2622] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#B4453A]"></span> Acțiuni Necesare
            </h2>
            
            <Card className="bg-[#FEF2F2] border-[#FECACA] shadow-sm">
              <CardContent className="p-0">
                <div className="divide-y divide-[#FECACA]">
                  
                  {/* Empty state or items */}
                  <div className="p-4 flex items-center justify-between hover:bg-[#FEE2E2] transition-colors">
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-[#7F1D1D]">Toate notițele sunt la zi</p>
                      <p className="text-xs text-[#991B1B]">Nu ai sesiuni din ultimele 24h necompletate.</p>
                    </div>
                  </div>

                </div>
              </CardContent>
            </Card>
          </section>

          {/* Operational Metrics */}
          <section className="space-y-4">
            <h2 className="text-lg font-medium text-[#1F2622]">Sumar Operațional (Luna Curentă)</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-[#FFFDF8] border-[#E3DED3] shadow-[0_1px_2px_rgba(31,38,34,0.05)]">
                <CardContent className="p-4 text-center">
                  <p className="text-xs font-medium text-[#6B746F] uppercase tracking-wider">Cazuri Active</p>
                  <p className="text-2xl font-bold text-[#1F2622] mt-1">{cases.length}</p>
                </CardContent>
              </Card>
              <Card className="bg-[#FFFDF8] border-[#E3DED3] shadow-[0_1px_2px_rgba(31,38,34,0.05)]">
                <CardContent className="p-4 text-center">
                  <p className="text-xs font-medium text-[#6B746F] uppercase tracking-wider">Timp Mediu Așteptare</p>
                  <p className="text-2xl font-bold text-[#1F2622] mt-1">3.2 zile</p>
                </CardContent>
              </Card>
              <Card className="bg-[#FFFDF8] border-[#E3DED3] shadow-[0_1px_2px_rgba(31,38,34,0.05)]">
                <CardContent className="p-4 text-center">
                  <p className="text-xs font-medium text-[#6B746F] uppercase tracking-wider">Rata de Finalizare</p>
                  <p className="text-2xl font-bold text-[#2F6B57] mt-1">92%</p>
                </CardContent>
              </Card>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-[#1F2622]">Cazurile Mele (Active)</h2>
              <div className="flex gap-2">
                <select className="h-8 text-xs border border-[#E3DED3] rounded px-2 outline-none bg-[#FFFDF8] text-[#1F2622]">
                  <option>Toate Etapele</option>
                  <option>Evaluare</option>
                  <option>Consiliere</option>
                </select>
              </div>
            </div>
            
            <Card className="bg-[#FFFDF8] border-[#E3DED3] shadow-[0_1px_2px_rgba(31,38,34,0.05)]">
              <CardContent className="p-0">
                <table className="w-full text-sm text-left">
                  <thead className="bg-[#F7F5F0] text-[#6B746F] border-b border-[#E3DED3]">
                    <tr>
                      <th className="px-4 py-3 font-medium">Copil</th>
                      <th className="px-4 py-3 font-medium">Etapă</th>
                      <th className="px-4 py-3 font-medium">Data Alocării</th>
                      <th className="px-4 py-3 text-right font-medium">Acțiune</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E3DED3]">
                    {cases.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-4 py-8 text-center text-[#6B746F]">Nu ai cazuri active alocate momentan.</td>
                      </tr>
                    ) : (
                      cases.map((c: any) => (
                        <tr key={c.id} className="hover:bg-[#F7F5F0] transition-colors">
                          <td className="px-4 py-4 font-medium text-[#1F2622]">{c.child?.firstName} {c.child?.lastName}</td>
                          <td className="px-4 py-4">
                            <span className="px-2 py-1 bg-[#EDF4F0] text-[#2F6B57] text-xs rounded font-semibold">
                              {c.status || "ACTIV"}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-[#6B746F]">
                            {new Date(c.createdAt).toLocaleDateString('ro-RO')}
                          </td>
                          <td className="px-4 py-4 text-right">
                            <Button variant="outline" size="sm" asChild className="h-8 text-xs border-[#E3DED3] text-[#1F2622]">
                              <Link href={`/applications/${c.id}`}>Dosar</Link>
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </section>

        </div>

        {/* Right Column: Calendar Today */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium text-[#1F2622]">Programul de Azi</h2>
          <Card className="bg-[#FFFDF8] border-[#E3DED3] shadow-[0_1px_2px_rgba(31,38,34,0.05)]">
            <CardContent className="p-5 space-y-6">
              
              {appointments.length === 0 ? (
                <p className="text-sm text-[#6B746F]">Nu ai nicio programare viitoare.</p>
              ) : (
                appointments.map((apt: any) => (
                  <div key={apt.id} className="relative pl-6 border-l-2 border-[#2F6B57]">
                    <div className="absolute w-3 h-3 bg-[#2F6B57] rounded-full -left-[7px] top-1"></div>
                    <p className="text-xs font-bold text-[#2F6B57] mb-1">
                      {new Date(apt.startTime).toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' })} - {new Date(apt.endTime).toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    <p className="text-sm font-medium text-[#1F2622]">{apt.type?.title || "Ședință Consiliere"}</p>
                    <p className="text-xs text-[#6B746F]">
                      {apt.case?.child?.firstName} {apt.case?.child?.lastName} (Online)
                    </p>
                    {apt.videoMeeting && (
                      <Button asChild className="w-full mt-3 bg-[#2F6B57] text-white hover:bg-[#275B4A] h-8 text-xs">
                        <Link href={apt.videoMeeting.joinUrl} target="_blank">
                          Intră în Apel Video
                        </Link>
                      </Button>
                    )}
                  </div>
                ))
              )}

            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}

