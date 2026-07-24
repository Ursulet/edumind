import { PrismaClient } from "@prisma/client";
import { Button, Card, CardContent, Badge } from "@educariera/ui";

const prisma = new PrismaClient();

export const metadata = {
  title: "Aplicații Noi - Portal Consilieri",
};

export default async function ApplicationsQueuePage() {
  const applications = await prisma.application.findMany({
    where: { status: { in: ["SUBMITTED", "UNDER_REVIEW"] } },
    include: {
      family: {
        include: {
          children: true,
          parents: { include: { user: true } },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#0B2239]">Aplicații Noi în Așteptare</h1>
          <p className="text-sm text-[#64748B]">Triage pentru cererile noi de orientare în carieră (Director / Staff Queue).</p>
        </div>
        <Badge variant="outline" className="bg-[#CCFBF1] text-[#0F766E] font-bold">
          {applications.length} aplicații
        </Badge>
      </div>

      <div className="space-y-4">
        {applications.length === 0 ? (
          <Card className="bg-white border-[#E2E8F0]">
            <CardContent className="p-8 text-center text-[#64748B]">
              Nu există aplicații noi în așteptare în acest moment.
            </CardContent>
          </Card>
        ) : (
          applications.map((app) => {
            const formData = (app.data as any) ?? {};
            const parentUser = app.family.parents[0]?.user;
            const child = app.family.children[0];

            return (
              <Card key={app.id} className="bg-white border-[#E2E8F0] shadow-sm hover:shadow-md transition-shadow">
                <CardContent className="p-6 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="bg-[#FEF9C3] text-[#B7791F] px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider">
                        {app.status}
                      </span>
                      <span className="text-xs text-[#64748B] font-mono">
                        Data: {new Date(app.createdAt).toLocaleDateString('ro-RO')}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-[#0B2239]">
                      Elev: {formData.childFirstName || child?.firstName || "Copil"} {formData.childLastName || child?.lastName || ""}
                    </h3>
                    <div className="text-sm text-[#102A43] space-y-1">
                      <p><strong>Părinte:</strong> {parentUser ? `${parentUser.firstName} ${parentUser.lastName} (${parentUser.email})` : "Nespecificat"}</p>
                      <p><strong>Clasă / Oraș:</strong> {formData.grade || "N/A"} - {formData.city || "N/A"}, {formData.county || ""}</p>
                      <p><strong>Nevoie declarată:</strong> <span className="italic">{app.declaredNeed || formData.declaredNeed || "Nespecificat"}</span></p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    <Button variant="outline" className="border-[#E2E8F0] text-[#0B2239]">
                      Detalii
                    </Button>
                    <Button className="bg-[#0B2239] text-white hover:bg-[#123A5A]">
                      Aprobă & Deschide Caz
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
