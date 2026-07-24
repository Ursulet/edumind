import { prisma } from "@/lib/db";
import { Button, Card, CardContent, CardHeader, CardTitle } from "@educariera/ui";
import Link from "next/link";

export const metadata = {
  title: "Programări - Portal Părinți",
};

export default async function ParentAppointmentsPage() {
  const appointments = await prisma.appointment.findMany({
    include: {
      type: true,
      staff: { include: { user: true } },
      case: { include: { child: true } },
      videoMeeting: true,
    },
    orderBy: { startTime: "asc" }
  });

  const upcomingAppointments = appointments.filter(a => a.status === "SCHEDULED");
  const pastAppointments = appointments.filter(a => a.status !== "SCHEDULED");

  return (
    <div className="flex-1 w-full bg-ivory-background py-8">
      <div className="container mx-auto px-4 max-w-5xl space-y-8">
        
        <div className="flex items-start justify-between border-b border-border pb-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold text-primary-ink">
              Programările Mele
            </h1>
            <p className="text-sm text-primary-text">
              Gestionează ședințele de consiliere cu specialiștii noștri.
            </p>
          </div>
          <Button className="bg-forest-accent text-warm-surface hover:bg-forest-hover">
            Programează Ședință Nouă
          </Button>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-primary-ink">Următoarele Ședințe</h2>
          {upcomingAppointments.length === 0 ? (
            <Card className="bg-warm-surface border-border border-dashed">
              <CardContent className="p-8 text-center text-muted-text">
                Nu ai nicio ședință viitoare programată.
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {upcomingAppointments.map((apt) => (
                <Card key={apt.id} className="bg-warm-surface border-border shadow-sm">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="bg-success/10 text-success px-2 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-2 inline-block">
                          Confirmat
                        </span>
                        <h3 className="text-lg font-semibold text-primary-ink">
                          {apt.type.title}
                        </h3>
                        <p className="text-sm text-primary-text font-medium mt-1">
                          {new Date(apt.startTime).toLocaleDateString('ro-RO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                        <p className="text-sm text-muted-text">
                          Ora: {new Date(apt.startTime).toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-muted-text">Specialist</div>
                        <div className="text-sm font-medium">{apt.staff.user.firstName}</div>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-border flex gap-3">
                      {apt.videoMeeting && (
                        <Button asChild className="flex-1 bg-forest-accent hover:bg-forest-hover text-warm-surface">
                          <Link href={apt.videoMeeting.joinUrl} target="_blank">
                            Intră în Conferință
                          </Link>
                        </Button>
                      )}
                      <Button variant="outline" className="flex-1 text-danger border-danger/30 hover:bg-danger/5 hover:text-danger">
                        Anulează
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4 pt-8">
          <h2 className="text-lg font-semibold text-primary-ink">Istoric Ședințe</h2>
          {pastAppointments.length === 0 ? (
            <p className="text-sm text-muted-text">Nu există istoric.</p>
          ) : (
            <div className="space-y-3">
              {pastAppointments.map(apt => (
                <Card key={apt.id} className="bg-muted-surface border-border shadow-none">
                  <CardContent className="p-4 flex justify-between items-center opacity-70">
                    <div>
                      <p className="font-medium text-sm">{apt.type.title}</p>
                      <p className="text-xs text-muted-text">
                        {new Date(apt.startTime).toLocaleDateString('ro-RO')} • Specialist: {apt.staff.user.firstName}
                      </p>
                    </div>
                    <span className="text-xs uppercase tracking-wider font-semibold text-muted-text">
                      {apt.status}
                    </span>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
