import { prisma } from "@/lib/db";
import { Button, Card, CardContent } from "@EduMind/ui";
import Link from "next/link";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Reports Engine - Control Center",
};

export default async function AdminReportsPage() {
  const reports = await prisma.report.findMany({
    include: {
      case: { include: { child: { include: { family: true } } } },
      author: true
    },
    orderBy: { createdAt: "desc" }
  }).catch(() => []);


  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <h1 className="text-2xl font-semibold text-primary-ink">Motor de Rapoarte</h1>
          <p className="text-sm text-muted-text">GestioneazÄƒ rapoartele de evaluare È™i consiliere emise cÄƒtre pÄƒrinÈ›i.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">È˜abloane Rapoarte</Button>
          <Button>GenereazÄƒ Raport Nou</Button>
        </div>
      </div>

      <div className="space-y-4">
        {reports.length === 0 ? (
          <Card className="bg-warm-surface border-border">
            <CardContent className="p-8 text-center text-muted-text">
              Nu existÄƒ rapoarte generate.
            </CardContent>
          </Card>
        ) : (
          reports.map((report) => {
            const childName = report.case?.child?.firstName;
            const familyName = report.case?.child?.family?.publicId;
            
            return (
              <Card key={report.id} className="bg-warm-surface border-border shadow-sm">
                <CardContent className="p-6 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3">
                      {report.status === "PUBLISHED" ? (
                        <span className="bg-success/10 text-success px-2 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider border border-success/20">
                          Publicat
                        </span>
                      ) : report.status === "DRAFT" ? (
                        <span className="bg-warning/10 text-warning px-2 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider border border-warning/20">
                          CiornÄƒ
                        </span>
                      ) : (
                        <span className="bg-muted-surface text-muted-text px-2 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider border border-border">
                          {report.status}
                        </span>
                      )}
                      <span className="text-xs text-muted-text">
                        Creat: {new Date(report.createdAt).toLocaleDateString('ro-RO')}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-primary-ink">
                      {report.title}
                    </h3>
                    
                    <p className="text-sm text-primary-text">
                      Subiect: <strong>{childName}</strong> (Familia {familyName})
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    {report.status === "DRAFT" ? (
                      <>
                        <Button variant="outline" className="w-full sm:w-auto">EditeazÄƒ</Button>
                        <Button className="bg-forest-accent text-warm-surface hover:bg-forest-hover w-full sm:w-auto">
                          PublicÄƒ la PÄƒrinte
                        </Button>
                      </>
                    ) : (
                      <Button variant="outline" className="w-full sm:w-auto">
                        Vezi Raport Publicat
                      </Button>
                    )}
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
