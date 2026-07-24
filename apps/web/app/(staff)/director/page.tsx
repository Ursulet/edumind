export const dynamic = "force-dynamic";
import { PrismaClient } from "@prisma/client";
import { Card, CardContent, Badge, Button } from "@educariera/ui";
import Link from "next/link";

const prisma = new PrismaClient();

export const metadata = {
  title: "Dashboard Director Departament - EduCarierÄƒ",
};

export default async function DirectorDashboardPage() {
  const pendingAppsCount = await prisma.application.count({ where: { status: "SUBMITTED" } }).catch(() => 0);
  const activeCases = await prisma.careerCase.findMany({
    where: { status: { not: "COMPLETED" } },
    include: {
      child: { include: { family: { include: { parents: { include: { user: true } } } } } },
      assignments: { include: { staff: { include: { user: true } } } },
      journeyInstance: { include: { stepInstances: { include: { step: true } } } },
    },
    take: 10,
    orderBy: { createdAt: "desc" },
  }).catch(() => []);

  const unassignedCases = activeCases.filter((c) => c.assignments.length === 0);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0B2239]">Panou Director Departament</h1>
          <p className="text-sm text-[#64748B]">Gestionarea aplicaÈ›iilor noi, a fluxurilor de cazuri È™i a Ã®ncÄƒrcÄƒrii echipei de specialiÈ™ti.</p>
        </div>
        <Link href="/applications">
          <Button className="bg-[#0B2239] text-white">
            Queue AplicaÈ›ii ({pendingAppsCount})
          </Button>
        </Link>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white border-[#E2E8F0] shadow-sm">
          <CardContent className="p-6">
            <p className="text-sm font-medium text-[#64748B]">AplicaÈ›ii Noi AÈ™teptare</p>
            <h3 className="text-3xl font-extrabold text-[#0B2239] mt-2">{pendingAppsCount}</h3>
            <p className="text-xs text-[#B7791F] mt-1 font-semibold">Triage necesar</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-[#E2E8F0] shadow-sm">
          <CardContent className="p-6">
            <p className="text-sm font-medium text-[#64748B]">Cazuri Neasignate</p>
            <h3 className="text-3xl font-extrabold text-[#0B2239] mt-2">{unassignedCases.length}</h3>
            <p className="text-xs text-[#B42318] mt-1 font-semibold">NecesitÄƒ alocare consilier</p>
          </CardContent>
        </Card>

        <Card className="bg-white border-[#E2E8F0] shadow-sm">
          <CardContent className="p-6">
            <p className="text-sm font-medium text-[#64748B]">Cazuri ÃŽn DesfÄƒÈ™urare</p>
            <h3 className="text-3xl font-extrabold text-[#0B2239] mt-2">{activeCases.length}</h3>
            <p className="text-xs text-[#0F766E] mt-1 font-semibold">Progres active</p>
          </CardContent>
        </Card>
      </div>

      {/* Active Cases Table */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-[#0B2239]">Cazuri Active Ã®n Departament</h2>
        <Card className="bg-white border-[#E2E8F0] shadow-sm overflow-hidden">
          <CardContent className="p-0">
            <table className="w-full text-sm text-left">
              <thead className="bg-[#F1F5F9] text-[#64748B]">
                <tr>
                  <th className="px-4 py-3 font-semibold">ID Caz</th>
                  <th className="px-4 py-3 font-semibold">Elev</th>
                  <th className="px-4 py-3 font-semibold">Specialist Asignat</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">AcÈ›iuni</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {activeCases.map((c) => (
                  <tr key={c.id} className="hover:bg-[#F8FAFC]">
                    <td className="px-4 py-3 font-mono font-bold text-[#0B2239]">{c.publicId}</td>
                    <td className="px-4 py-3 text-[#102A43]">
                      {c.child.firstName} {c.child.lastName}
                    </td>
                    <td className="px-4 py-3 text-[#64748B]">
                      {c.assignments[0]?.staff?.user
                        ? `${c.assignments[0].staff.user.firstName} ${c.assignments[0].staff.user.lastName}`
                        : "Neasignat"}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className="text-[#0F766E] border-[#0F766E]/30 bg-[#CCFBF1]/30 font-bold">
                        {c.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Link href={`/cases/${c.id}`}>
                        <Button variant="outline" className="text-xs border-[#E2E8F0]">Deschide Dossier</Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}

