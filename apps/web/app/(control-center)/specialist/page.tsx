export const dynamic = "force-dynamic";
import { prisma } from "@/lib/db";
import { Button, Card, CardContent, CardHeader, CardTitle, Badge } from "@EduMind/ui";
import Link from "next/link";

export const metadata = {
  title: "Specialist Dashboard",
};

export default async function SpecialistDashboardPage() {
  // In a real app we'd get the current user's Staff ID. Demo mock data fallback.
  let cases: any = [];
  try {
    cases = await prisma.careerCase.findMany({
      where: { 
        counselingSessions: { some: {} } // just to get some cases
      },
      include: {
        child: true,
        counselingSessions: {
          orderBy: { createdAt: "asc" },
          take: 1
        }
      },
      take: 5
    });
  } catch (e) {
    // Mock Data Fallback
    cases = [
      {
        id: "case-1",
        child: { firstName: "Matei", lastName: "Popescu" },
        status: "ACTIVE",
        journeyStage: "COUNSELING",
        counselingSessions: [
          { status: "SCHEDULED", scheduledAt: new Date(Date.now() + 86400000).toISOString() }
        ]
      },
      {
        id: "case-2",
        child: { firstName: "Ana", lastName: "Ionescu" },
        status: "ACTIVE",
        journeyStage: "ASSESSMENT",
        counselingSessions: []
      }
    ];
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <h1 className="text-2xl font-semibold text-primary-ink">Control Center Specialist</h1>
          <p className="text-sm text-muted-text">Ce necesitÄƒ atenÈ›ia ta profesionalÄƒ astÄƒzi?</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-forest-accent text-forest-accent">
            SincronizeazÄƒ Google Calendar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
          {/* Left Column: Action Required & Today */}
        <div className="lg:col-span-2 space-y-8">
          
          <section className="space-y-4">
            <h2 className="text-lg font-medium text-primary-ink flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500"></span> AcÈ›iuni Necesare
            </h2>
            
            <Card className="bg-red-50/50 border-red-100 shadow-sm">
              <CardContent className="p-0">
                <div className="divide-y divide-red-100">
                  
                  <div className="p-4 flex items-center justify-between hover:bg-red-50 transition-colors">
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-red-900">NotiÈ›e Necompletate (È˜edinÈ›a #2)</p>
                      <p className="text-xs text-red-700">Pentru cazul Matei Popescu. Au trecut 24h de la sesiune.</p>
                    </div>
                    <Link href="/cases/case-1">
                      <Button variant="outline" size="sm" className="border-red-200 text-red-800 hover:bg-red-100">
                        CompleteazÄƒ
                      </Button>
                    </Link>
                  </div>

                </div>
              </CardContent>
            </Card>
          </section>

          {/* Operational Metrics */}
          <section className="space-y-4">
            <h2 className="text-lg font-medium text-primary-ink">Sumar OperaÈ›ional (Luna CurentÄƒ)</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-white border-border shadow-sm">
                <CardContent className="p-4 text-center">
                  <p className="text-xs font-medium text-muted-text uppercase tracking-wider">Cazuri Active</p>
                  <p className="text-2xl font-bold text-primary-ink mt-1">24</p>
                </CardContent>
              </Card>
              <Card className="bg-white border-border shadow-sm">
                <CardContent className="p-4 text-center">
                  <p className="text-xs font-medium text-muted-text uppercase tracking-wider">Timp Mediu AÈ™teptare</p>
                  <p className="text-2xl font-bold text-primary-ink mt-1">3.2 zile</p>
                </CardContent>
              </Card>
              <Card className="bg-white border-border shadow-sm">
                <CardContent className="p-4 text-center">
                  <p className="text-xs font-medium text-muted-text uppercase tracking-wider">Rata de Finalizare</p>
                  <p className="text-2xl font-bold text-success mt-1">92%</p>
                </CardContent>
              </Card>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-primary-ink">Cazurile Mele (Active)</h2>
              <div className="flex gap-2">
                <select className="h-8 text-xs border border-border rounded px-2 outline-none">
                  <option>Toate Etapele</option>
                  <option>Evaluare</option>
                  <option>Consiliere</option>
                </select>
              </div>
            </div>
            
            <Card className="bg-white border-border shadow-sm">
              <CardContent className="p-0">
                <table className="w-full text-sm text-left">
                  <thead className="bg-muted-surface/50 text-muted-text border-b border-border">
                    <tr>
                      <th className="px-4 py-3 font-medium">Copil</th>
                      <th className="px-4 py-3 font-medium">EtapÄƒ</th>
                      <th className="px-4 py-3 font-medium">UrmÄƒtoarea Sesiune</th>
                      <th className="px-4 py-3 text-right font-medium">AcÈ›iune</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {cases.map((c: any) => (
                      <tr key={c.id} className="hover:bg-muted-surface/10">
                        <td className="px-4 py-4 font-medium text-primary-ink">{c.child?.firstName} {c.child?.lastName}</td>
                        <td className="px-4 py-4">
                          <span className="px-2 py-1 bg-sage-surface text-forest-accent text-xs rounded font-medium">
                            {c.journeyStage}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-muted-text">
                          {c.counselingSessions?.[0]?.scheduledAt 
                            ? new Date(c.counselingSessions[0].scheduledAt).toLocaleDateString('ro-RO')
                            : "Neprogramat"}
                        </td>
                        <td className="px-4 py-4 text-right">
                          <Link href={`/cases/${c.id}`}>
                            <Button variant="outline" size="sm" className="h-8 text-xs">Deschide Dosar</Button>
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

        {/* Right Column: Calendar Today */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium text-primary-ink">Programul de Azi</h2>
          <Card className="bg-white border-border shadow-sm">
            <CardContent className="p-5 space-y-6">
              
              <div className="relative pl-6 border-l-2 border-forest-accent">
                <div className="absolute w-3 h-3 bg-forest-accent rounded-full -left-[7px] top-1"></div>
                <p className="text-xs font-bold text-forest-accent mb-1">10:00 - 10:50</p>
                <p className="text-sm font-medium text-primary-ink">È˜edinÈ›Äƒ Consiliere #2</p>
                <p className="text-xs text-muted-text">Matei Popescu (Online)</p>
                <Button className="w-full mt-3 bg-forest-accent text-warm-surface hover:bg-forest-hover h-8 text-xs">
                  IntrÄƒ Ã®n Apel Video
                </Button>
              </div>

              <div className="relative pl-6 border-l-2 border-muted-border">
                <div className="absolute w-3 h-3 bg-muted-border rounded-full -left-[7px] top-1"></div>
                <p className="text-xs font-bold text-muted-text mb-1">14:00 - 14:30</p>
                <p className="text-sm font-medium text-primary-ink">Sesiune de CunoaÈ™tere</p>
                <p className="text-xs text-muted-text">Ana Ionescu (Online)</p>
              </div>

            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}

