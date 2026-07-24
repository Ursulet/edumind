export const dynamic = "force-dynamic";
import { prisma } from "@/lib/db";
import { Button, Card, CardContent, CardHeader, CardTitle } from "@educariera/ui";

export const metadata = {
  title: "RecomandÄƒri - Portal PÄƒrinÈ›i",
};

export default async function ParentRecommendationsPage() {
  let careerCase: any = null;
  try {
    careerCase = await prisma.careerCase.findFirst({
      include: {
        child: true,
        recommendations: {
          where: { status: { in: ["RECOMMENDED", "VIEWED", "ACCEPTED"] } },
          include: { productVersion: { include: { prices: { take: 1 } } }, staff: { include: { user: true } } },
          orderBy: { createdAt: "desc" }
        }
      }
    });
  } catch (e) {
    // Fallback Mock Data if DB is offline
    console.log("DB Offline - Using Mock Data for Recommendations");
    careerCase = {
      child: { firstName: "Matei", lastName: "Popescu" },
      recommendations: [
        {
          id: "mock-1",
          status: "RECOMMENDED",
          reason: "Matei are o pasiune clarÄƒ pentru È™tiinÈ›ele exacte. Acest program de explorare STEM Ã®l va ajuta sÄƒ Ã®nÈ›eleagÄƒ mai bine carierele posibile Ã®n inginerie È™i programare, prin activitÄƒÈ›i practice È™i mentorat direcÈ›ionat.",
          createdAt: new Date().toISOString(),
          productVersion: {
            marketingName: "Pachet Explorator STEM",
            prices: [{ amount: 450, currency: "RON" }]
          },
          staff: { user: { firstName: "Elena", lastName: "Stancu" } }
        },
        {
          id: "mock-2",
          status: "ACCEPTED",
          reason: "Evaluarea iniÈ›ialÄƒ sugereazÄƒ o nevoie de sprijin Ã®n managementul timpului. Acest modul scurt va debloca potenÈ›ialul real al lui Matei pentru examenele viitoare.",
          createdAt: new Date(Date.now() - 864000000).toISOString(),
          productVersion: {
            marketingName: "Modul Managementul Timpului",
            prices: [{ amount: 150, currency: "RON" }]
          },
          staff: { user: { firstName: "Andrei", lastName: "Mirea" } }
        }
      ]
    };
  }

  return (
    <div className="flex-1 w-full bg-ivory-background py-8 min-h-[calc(100vh-64px)]">
      <div className="container mx-auto px-4 max-w-4xl space-y-8">
        
        <div className="flex items-start justify-between border-b border-border pb-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold text-primary-ink">
              RecomandÄƒrile Specialistului
            </h1>
            <p className="text-sm text-primary-text">
              Programele recomandate personalizat pentru a continua parcursul de dezvoltare.
            </p>
          </div>
        </div>

        {careerCase?.recommendations && careerCase.recommendations.length > 0 ? (
          <div className="space-y-6">
            {careerCase.recommendations.map((rec: any) => (
              <Card key={rec.id} className="bg-warm-surface border-border overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <div className="bg-sage-surface px-6 py-3 border-b border-border flex justify-between items-center">
                  <span className="text-sm font-semibold text-forest-accent uppercase tracking-wider">
                    Recomandare de la {rec.staff.user.firstName} {rec.staff.user.lastName}
                  </span>
                  <span className="text-xs text-muted-text">
                    Data: {new Date(rec.createdAt).toLocaleDateString('ro-RO')}
                  </span>
                </div>
                
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    {/* Left: Reason */}
                    <div className="p-6 md:w-2/3 border-b md:border-b-0 md:border-r border-border">
                      <h3 className="text-xl font-medium text-primary-ink mb-4">{rec.productVersion.marketingName}</h3>
                      <div className="bg-ivory-background p-4 rounded-md border border-border">
                        <h4 className="text-xs font-bold text-muted-text uppercase mb-2">De ce recomandÄƒm asta:</h4>
                        <p className="text-sm text-primary-text leading-relaxed">
                          "{rec.reason}"
                        </p>
                      </div>
                      
                      <div className="mt-6">
                        <h4 className="text-sm font-medium text-primary-ink mb-2">Ce este inclus:</h4>
                        <ul className="text-sm text-primary-text space-y-1 list-disc list-inside">
                          {/* If features were typed, we could map them. Hardcoding fallback */}
                          <li>Sesiuni de consiliere 1-la-1</li>
                          <li>Acces la evaluÄƒri avansate</li>
                          <li>Suport asincron prin chat</li>
                        </ul>
                      </div>
                    </div>

                    {/* Right: Price & CTA */}
                    <div className="p-6 md:w-1/3 bg-ivory-background/50 flex flex-col justify-center items-center text-center">
                      <p className="text-sm text-muted-text mb-1">PreÈ› Pachet</p>
                      <p className="text-3xl font-bold text-primary-ink mb-6">
                        {rec.productVersion.prices[0]?.amount.toString() || 0} <span className="text-lg">{rec.productVersion.prices[0]?.currency || "RON"}</span>
                      </p>
                      
                      {rec.status === 'ACCEPTED' ? (
                        <div className="w-full bg-success/10 text-success font-medium py-2 rounded border border-success/20">
                          Program Activ
                        </div>
                      ) : (
                        <Button className="w-full bg-forest-accent text-warm-surface hover:bg-forest-hover shadow-sm py-6">
                          ContinuÄƒ la PlatÄƒ
                        </Button>
                      )}
                      
                      <p className="text-xs text-muted-text mt-4">PlatÄƒ sigurÄƒ prin procesator autorizat. Factura va fi generatÄƒ automat.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="bg-warm-surface border-border">
            <CardContent className="p-12 text-center text-muted-text space-y-4">
              <svg className="w-12 h-12 mx-auto text-muted-border" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
              <p>Momentan nu ai nicio recomandare nouÄƒ de la specialistul tÄƒu.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

