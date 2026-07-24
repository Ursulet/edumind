import { getAuthHeaders } from "@/lib/auth";
import { Card, CardContent, CardHeader, Badge } from "@educariera/ui";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Jurnal Audit Securitate - EduMind",
};

const API = process.env.INTERNAL_API_URL || "http://api:4000";

async function getAuditLogs() {
  try {
    const headers = await getAuthHeaders();
    const res = await fetch(`${API}/api/v1/audit?limit=50`, {
      headers: { ...headers },
      cache: "no-store",
    });
    if (!res.ok) return [];
    return res.json();
  } catch {
    return [];
  }
}

export default async function AuditLogPage() {
  const auditEvents = await getAuditLogs();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-[#E3DED3] pb-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1F2622]">Jurnal Audit Securitate & Conformitate</h1>
          <p className="text-sm text-[#6B746F]">Monitorizarea imuabila a tututor evenimentelor si actiunilor din sistem.</p>
        </div>
        <Badge variant="outline" className="bg-[#EDF4F0] border-[#2F6B57]/20 text-[#2F6B57] font-bold tracking-wide">
          Stocare Imuabila API
        </Badge>
      </div>

      <Card className="bg-[#FFFDF8] border-[#E3DED3]">
        <CardHeader className="border-b border-[#E3DED3] bg-[#F7F5F0]">
          <h2 className="text-lg font-semibold text-[#1F2622]">Evenimente Recente</h2>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-[#6B746F] uppercase bg-[#F7F5F0] border-b border-[#E3DED3]">
                <tr>
                  <th className="px-6 py-3">Data & Ora</th>
                  <th className="px-6 py-3">Actor</th>
                  <th className="px-6 py-3">Actiune</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">IP / Device</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E3DED3]">
                {auditEvents.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-[#6B746F]">
                      Niciun eveniment de audit inregistrat momentan.
                    </td>
                  </tr>
                ) : (
                  auditEvents.map((event: any) => (
                    <tr key={event.id} className="hover:bg-[#F1EEE7] transition-colors">
                      <td className="px-6 py-4 font-mono text-[#6B746F]">
                        {new Date(event.createdAt).toLocaleString("ro-RO")}
                      </td>
                      <td className="px-6 py-4">
                        {event.actor ? (
                          <div>
                            <p className="font-semibold text-[#1F2622]">
                              {event.actor.firstName} {event.actor.lastName}
                            </p>
                            <p className="text-xs text-[#6B746F]">{event.actor.email}</p>
                          </div>
                        ) : (
                          <span className="text-xs font-bold text-[#6B746F] uppercase">System</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-[#1F2622]">{event.action}</span>
                        {event.resource && (
                          <p className="text-xs text-[#6B746F] mt-0.5">
                            Resursa: {event.resource}
                          </p>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {event.status === "SUCCESS" ? (
                          <span className="bg-[#EDF4F0] text-[#2F6B57] text-xs font-bold px-2 py-1 rounded">
                            SUCCES
                          </span>
                        ) : (
                          <span className="bg-[#FEF2F2] text-[#B4453A] border border-[#FECACA] text-xs font-bold px-2 py-1 rounded">
                            {event.status}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-xs text-[#6B746F] font-mono">
                        {event.ipAddress || "N/A"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
