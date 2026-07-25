import { getUserFromToken, getAuthHeaders } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Button, Card, CardContent, Badge } from "@edumind/ui";
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
  
  let cases: any[] = [];
  const casesData = await fetchWithAuth(`/api/v1/cases`, authHeaders);
  if (Array.isArray(casesData)) {
    cases = casesData;
  }

  let appointments: any[] = [];
  const aptsData = await fetchWithAuth(`/api/v1/scheduling/my-appointments`, authHeaders);
  if (Array.isArray(aptsData)) {
    appointments = aptsData;
  }

  // Mocked actions based on requirements
  const requiresAction = [
    { id: 1, type: "TEST_RESULT", title: "Rezultat primit: Profil Vocațional", childName: "David Popescu", urgency: "HIGH" },
    { id: 2, type: "INCOMPLETE_NOTES", title: "Notițe necompletate (Sesiunea 2)", childName: "Ana Ionescu", urgency: "MEDIUM" },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between border-b border-[#E3DED3] pb-4">
        <div>
          <h1 className="text-2xl font-semibold text-[#1F2622] tracking-[-0.025em]">Portal Specialist</h1>
          <p className="text-sm text-[#6B746F]">Ce necesită atenția ta profesională astăzi?</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-[#2F6B57] text-[#2F6B57] hover:bg-[#EDF4F0] font-semibold text-xs">
            Sincronizează Calendar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Requires Action */}
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-[#1F2622] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#B4453A]"></span> Necesită Acțiune
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {requiresAction.length === 0 ? (
                <Card className="bg-[#FEF2F2] border-[#FECACA] shadow-sm md:col-span-2">
                  <CardContent className="p-6 text-center">
                    <p className="text-sm font-semibold text-[#7F1D1D]">Toate notițele sunt la zi</p>
                    <p className="text-xs text-[#991B1B] mt-1">Nu există acțiuni restante în acest moment.</p>
                  </CardContent>
                </Card>
              ) : (
                requiresAction.map(action => (
                  <Card key={action.id} className="bg-[#FFFDF8] border-[#E3DED3] border-l-4 border-l-[#B4453A] shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-5 flex flex-col h-full justify-between gap-4">
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${action.urgency === 'HIGH' ? 'bg-[#FEF2F2] text-[#B4453A]' : 'bg-[#FEF9C3] text-[#A16207]'}`}>
                            {action.urgency}
                          </span>
                          <span className="text-xs text-[#6B746F]">{action.childName}</span>
                        </div>
                        <h3 className="text-sm font-semibold text-[#1F2622]">{action.title}</h3>
                      </div>
                      <div className="flex justify-end">
                        <span className="text-xs font-semibold text-[#2F6B57] hover:underline">Rezolvă &rarr;</span>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </section>

          {/* My Cases */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-[#1F2622]">Cazurile Mele</h2>
              <div className="flex items-center gap-2">
                <select className="h-8 text-xs border border-[#E3DED3] rounded-md px-2 outline-none bg-[#FFFDF8] text-[#1F2622] focus:ring-1 focus:ring-[#2F6B57]">
                  <option>Toate Statusurile</option>
                  <option>Active</option>
                  <option>În Așteptare</option>
                </select>
                <select className="h-8 text-xs border border-[#E3DED3] rounded-md px-2 outline-none bg-[#FFFDF8] text-[#1F2622] focus:ring-1 focus:ring-[#2F6B57]">
                  <option>Toate Etapele</option>
                  <option>Evaluare</option>
                  <option>Consiliere</option>
                </select>
              </div>
            </div>
            
            <Card className="bg-[#FFFDF8] border-[#E3DED3] shadow-sm">
              <CardContent className="p-0 overflow-x-auto">
                <table className="w-full text-sm text-left whitespace-nowrap">
                  <thead className="bg-[#F7F5F0] text-[#6B746F] border-b border-[#E3DED3]">
                    <tr>
                      <th className="px-5 py-3.5 font-semibold">Elev</th>
                      <th className="px-5 py-3.5 font-semibold">Etapă Curentă</th>
                      <th className="px-5 py-3.5 font-semibold">Următoarea Acțiune</th>
                      <th className="px-5 py-3.5 text-right font-semibold">Dosar</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E3DED3]">
                    {cases.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-5 py-8 text-center text-[#6B746F]">Nu ai cazuri alocate momentan.</td>
                      </tr>
                    ) : (
                      cases.map((c: any) => (
                        <tr key={c.id} className="hover:bg-[#F7F5F0] transition-colors group">
                          <td className="px-5 py-4 font-semibold text-[#1F2622]">
                            {c.child?.firstName} {c.child?.lastName}
                          </td>
                          <td className="px-5 py-4">
                            <span className="px-2.5 py-1 bg-[#EDF4F0] text-[#2F6B57] text-xs rounded-md font-semibold border border-[#DCE8E1]">
                              {c.status || "EVALUARE"}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-[#6B746F] text-xs">
                            Așteaptă completare test vocațional
                          </td>
                          <td className="px-5 py-4 text-right">
                            <Button variant="outline" size="sm" asChild className="h-8 text-xs border-[#E3DED3] text-[#1F2622] group-hover:border-[#2F6B57] group-hover:text-[#2F6B57] transition-colors">
                              <Link href={`/cases/${c.id}`}>Deschide</Link>
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

        {/* Right Column */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Today's Appointments */}
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-[#1F2622]">Astăzi</h2>
            <Card className="bg-[#FFFDF8] border-[#E3DED3] shadow-sm">
              <CardContent className="p-5 space-y-5">
                
                {appointments.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-sm font-medium text-[#1F2622]">Zi liberă</p>
                    <p className="text-xs text-[#6B746F] mt-1">Nu ai nicio ședință programată pentru azi.</p>
                  </div>
                ) : (
                  appointments.map((apt: any) => (
                    <div key={apt.id} className="relative pl-5 border-l-[3px] border-[#2F6B57]">
                      <div className="absolute w-2.5 h-2.5 bg-[#2F6B57] rounded-full -left-[6px] top-1.5 shadow-[0_0_0_2px_#FFFDF8]"></div>
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-bold text-[#1F2622]">{apt.type?.title || "Ședință Consiliere"}</p>
                          <p className="text-xs font-semibold text-[#6B746F] mt-0.5">
                            {new Date(apt.startTime).toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' })} 
                            {' - '}
                            {new Date(apt.endTime).toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                        <Badge variant="outline" className="text-[10px] bg-[#F1EEE7] border-none text-[#6B746F]">Online</Badge>
                      </div>
                      <p className="text-sm font-medium text-[#2F6B57] mt-2 flex items-center gap-1.5">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                        {apt.case?.child?.firstName} {apt.case?.child?.lastName}
                      </p>
                      
                      {apt.videoMeeting && (
                        <Button asChild className="w-full mt-3 bg-[#2F6B57] text-white hover:bg-[#275B4A] h-8 text-xs font-semibold shadow-sm">
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
          </section>

          {/* Calendar Widget */}
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-[#1F2622]">Calendar</h2>
            <Card className="bg-[#FFFDF8] border-[#E3DED3] shadow-sm overflow-hidden">
              <CardContent className="p-0">
                <div className="p-5 border-b border-[#E3DED3] flex justify-between items-center bg-[#F7F5F0]">
                  <h3 className="text-sm font-bold text-[#1F2622]">Iulie 2026</h3>
                  <div className="flex gap-2">
                    <button className="p-1 rounded text-[#6B746F] hover:bg-[#E3DED3] transition-colors"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg></button>
                    <button className="p-1 rounded text-[#6B746F] hover:bg-[#E3DED3] transition-colors"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg></button>
                  </div>
                </div>
                <div className="p-5">
                  <div className="grid grid-cols-7 text-center text-[10px] font-bold text-[#6B746F] mb-3">
                    <div>LU</div><div>MA</div><div>MI</div><div>JO</div><div>VI</div><div>SÂ</div><div>DU</div>
                  </div>
                  <div className="grid grid-cols-7 text-center text-sm gap-y-2">
                    {/* Mocked Days */}
                    {Array.from({ length: 31 }, (_, i) => (
                      <div key={i} className={`py-1.5 mx-1 rounded-full cursor-pointer font-medium ${i + 1 === 26 ? 'bg-[#2F6B57] text-white shadow-sm' : i % 5 === 0 ? 'font-bold text-[#1F2622] underline decoration-[#2F6B57] decoration-2 underline-offset-4' : 'text-[#6B746F] hover:bg-[#F1EEE7]'}`}>
                        {i + 1}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="p-4 border-t border-[#E3DED3] text-center bg-[#F7F5F0]">
                  <Link href="/calendar" className="text-xs font-bold text-[#2F6B57] hover:underline">
                    Deschide Calendar Complet &rarr;
                  </Link>
                </div>
              </CardContent>
            </Card>
          </section>

        </div>

      </div>
    </div>
  );
}

