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
  
  // Mocked Metrics for Director View based on Prompt 14
  const specialistWorkloads = [
    { id: 1, name: "Maria Ionescu", activeCases: 14, capacity: "80%", overdue: 0 },
    { id: 2, name: "Andrei Popa", activeCases: 22, capacity: "100%", overdue: 3 },
    { id: 3, name: "Elena Dumitru", activeCases: 8, capacity: "40%", overdue: 0 },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between border-b border-[#E3DED3] pb-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1F2622]">Panou Director Departament</h1>
          <p className="text-sm text-[#6B746F]">Vedere de ansamblu a fluxurilor și resurselor echipei.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/applications">
            <Button className="bg-[#1F2622] text-white hover:bg-[#2A332E]">
              Queue Aplicații ({pendingAppsCount})
            </Button>
          </Link>
        </div>
      </div>

      {/* Top Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-[#FFFDF8] border-[#E3DED3] border-t-4 border-t-[#B7791F] shadow-sm">
          <CardContent className="p-5 text-center">
            <p className="text-xs font-semibold text-[#6B746F] uppercase">Aplicații Noi</p>
            <h3 className="text-3xl font-extrabold text-[#1F2622] mt-2">{pendingAppsCount}</h3>
          </CardContent>
        </Card>

        <Card className="bg-[#FFFDF8] border-[#E3DED3] border-t-4 border-t-[#B4453A] shadow-sm">
          <CardContent className="p-5 text-center">
            <p className="text-xs font-semibold text-[#6B746F] uppercase">Cazuri Neasignate</p>
            <h3 className="text-3xl font-extrabold text-[#B4453A] mt-2">{unassignedCases.length}</h3>
          </CardContent>
        </Card>

        <Card className="bg-[#FFFDF8] border-[#E3DED3] border-t-4 border-t-[#2F6B57] shadow-sm">
          <CardContent className="p-5 text-center">
            <p className="text-xs font-semibold text-[#6B746F] uppercase">Acțiuni Întârziate</p>
            <h3 className="text-3xl font-extrabold text-[#1F2622] mt-2">5</h3>
          </CardContent>
        </Card>
        
        <Card className="bg-[#FFFDF8] border-[#E3DED3] shadow-sm">
          <CardContent className="p-5 text-center">
            <p className="text-xs font-semibold text-[#6B746F] uppercase">Timp Mediu Așteptare</p>
            <h3 className="text-3xl font-extrabold text-[#1F2622] mt-2">2.4z</h3>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Col (2/3): Queues & Case Management */}
        <div className="lg:col-span-2 space-y-8">
          
          <section className="space-y-4">
            <div className="flex justify-between items-end">
              <div>
                <h2 className="text-lg font-bold text-[#1F2622]">Cazuri cu Probleme sau Neasignate</h2>
                <p className="text-sm text-[#6B746F]">Necesită atenția managementului.</p>
              </div>
            </div>
            <Card className="bg-[#FFFDF8] border-[#E3DED3] shadow-sm overflow-hidden">
              <CardContent className="p-0">
                <table className="w-full text-sm text-left whitespace-nowrap">
                  <thead className="bg-[#F7F5F0] text-[#6B746F]">
                    <tr>
                      <th className="px-5 py-3 font-semibold">Caz</th>
                      <th className="px-5 py-3 font-semibold">Problema</th>
                      <th className="px-5 py-3 font-semibold text-right">Alocare</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E3DED3]">
                    {unassignedCases.map((c: any) => (
                      <tr key={c.id} className="hover:bg-[#F7F5F0] transition-colors">
                        <td className="px-5 py-4 font-semibold text-[#1F2622]">{c.child?.firstName} {c.child?.lastName}</td>
                        <td className="px-5 py-4">
                          <span className="px-2 py-1 bg-[#FEF2F2] text-[#B4453A] text-xs font-bold rounded">
                            NEASIGNAT
                          </span>
                        </td>
                        <td className="px-5 py-4 text-right">
                          {/* Needs dynamic assignment modal */}
                          <Button variant="outline" className="h-8 text-xs font-semibold text-[#2F6B57] border-[#2F6B57] bg-white hover:bg-[#EDF4F0]">
                            Alocă Specialist
                          </Button>
                        </td>
                      </tr>
                    ))}
                    {unassignedCases.length === 0 && (
                      <tr>
                        <td colSpan={3} className="px-5 py-8 text-center text-[#6B746F]">Niciun caz neasignat! Excelent.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-bold text-[#1F2622]">Distribuția Cazurilor (pe Etape)</h2>
            <Card className="bg-[#FFFDF8] border-[#E3DED3] shadow-sm">
              <CardContent className="p-6">
                {/* Mocked Funnel Distribution */}
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-[#6B746F]">Înscriere & Aprobare</span>
                      <span className="text-[#1F2622]">12</span>
                    </div>
                    <div className="w-full bg-[#E3DED3] rounded-full h-2"><div className="bg-[#2F6B57] h-2 rounded-full w-[15%]"></div></div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-[#6B746F]">Evaluare & Teste</span>
                      <span className="text-[#1F2622]">45</span>
                    </div>
                    <div className="w-full bg-[#E3DED3] rounded-full h-2"><div className="bg-[#2F6B57] h-2 rounded-full w-[45%]"></div></div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="text-[#6B746F]">Consiliere Activă</span>
                      <span className="text-[#1F2622]">87</span>
                    </div>
                    <div className="w-full bg-[#E3DED3] rounded-full h-2"><div className="bg-[#2F6B57] h-2 rounded-full w-[80%]"></div></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

        </div>

        {/* Right Col (1/3): Workloads */}
        <div className="space-y-8">
          
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-[#1F2622]">Workload Specialiști</h2>
            <Card className="bg-[#FFFDF8] border-[#E3DED3] shadow-sm">
              <CardContent className="p-0">
                <div className="divide-y divide-[#E3DED3]">
                  {specialistWorkloads.map(spec => (
                    <div key={spec.id} className="p-5 flex items-center justify-between hover:bg-[#F7F5F0]">
                      <div>
                        <p className="text-sm font-bold text-[#1F2622]">{spec.name}</p>
                        <p className="text-xs text-[#6B746F] mt-0.5">{spec.activeCases} cazuri active</p>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          spec.capacity === '100%' ? 'bg-[#FEF2F2] text-[#B4453A]' : 
                          'bg-[#EDF4F0] text-[#2F6B57]'
                        }`}>
                          {spec.capacity} Load
                        </span>
                        {spec.overdue > 0 && (
                          <p className="text-[10px] text-[#B4453A] font-bold mt-1.5">{spec.overdue} Taskuri Întârziate</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-bold text-[#1F2622]">Calendar Departament (Azi)</h2>
            <Card className="bg-[#FFFDF8] border-[#E3DED3] shadow-sm">
              <CardContent className="p-5 text-center">
                <p className="text-3xl font-extrabold text-[#1F2622]">18</p>
                <p className="text-xs font-semibold text-[#6B746F] uppercase">Sesiuni programate azi</p>
                
                <Link href="/calendar" className="mt-4 inline-block text-xs font-bold text-[#2F6B57] hover:underline">
                  Vezi calendarul echipei &rarr;
                </Link>
              </CardContent>
            </Card>
          </section>

        </div>

      </div>
    </div>
  );
}

