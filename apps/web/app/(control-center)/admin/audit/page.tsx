import { PrismaClient } from "@prisma/client";
import { Card, CardContent, CardHeader, Badge } from "@EduMind/ui";

const prisma = new PrismaClient();

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Jurnal Audit Securitate - EduMind",
};

export default async function AuditLogPage() {
  const auditEvents = await prisma.auditEvent.findMany({
    take: 50,
    orderBy: { createdAt: "desc" },
    include: {
      actor: { select: { firstName: true, lastName: true, email: true } },
    },
  }).catch(() => []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0B2239]">Jurnal Audit Securitate & Conformitate</h1>
          <p className="text-sm text-[#64748B]">Monitorizarea imuabilă a tututor evenimentelor și acțiunilor din sistem.</p>
        </div>
        <Badge variant="outline" className="bg-[#DCFCE7] text-[#15803D] font-bold">
          Stocare Imuabilă (Prisma Log)
        </Badge>
      </div>

      <Card className="bg-white border-[#E2E8F0] shadow-sm">
        <CardHeader className="border-b border-[#E2E8F0] bg-[#F7F9FC] p-4">
          <div className="flex justify-between items-center text-sm font-medium text-[#64748B]">
            <span>Ultimele 50 evenimente înregistrate</span>
            <span>Total înregistrări: {auditEvents.length}</span>
          </div>
        </CardHeader>
        
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-[#F1F5F9] text-[#64748B] border-b border-[#E2E8F0]">
              <tr>
                <th className="px-4 py-3 font-semibold">Dată & Timp</th>
                <th className="px-4 py-3 font-semibold">Actor & IP</th>
                <th className="px-4 py-3 font-semibold">Acțiune</th>
                <th className="px-4 py-3 font-semibold">Entitate (ID)</th>
                <th className="px-4 py-3 font-semibold">Metadata</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {auditEvents.map((evt) => (
                <tr key={evt.id} className="hover:bg-[#F8FAFC]">
                  <td className="px-4 py-3 whitespace-nowrap text-[#64748B] text-xs font-mono">
                    {new Date(evt.createdAt).toLocaleString('ro-RO')}
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-semibold text-[#0B2239]">
                      {evt.actor ? `${evt.actor.firstName} ${evt.actor.lastName}` : "Sistem"}
                    </p>
                    <p className="text-xs text-[#64748B]">{evt.actor?.email ?? evt.actorUserId ?? "System"}</p>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="outline" className="font-mono text-xs text-[#0F766E] border-[#0F766E]/30 bg-[#CCFBF1]/30">
                      {evt.action}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-[#0B2239]">{evt.entityType}</p>
                    <p className="text-xs text-[#64748B] font-mono truncate max-w-[120px]">{evt.entityId ?? "N/A"}</p>
                  </td>
                  <td className="px-4 py-3">
                    {evt.metadata ? (
                      <pre className="text-[10px] font-mono bg-[#F1F5F9] p-1.5 rounded max-w-xs overflow-x-auto text-[#102A43] border border-[#E2E8F0]">
                        {JSON.stringify(evt.metadata, null, 2)}
                      </pre>
                    ) : (
                      <span className="text-xs text-[#64748B]">-</span>
                    )}
                  </td>
                </tr>
              ))}
              {auditEvents.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-[#64748B]">
                    Niciun eveniment de audit înregistrat încă.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
