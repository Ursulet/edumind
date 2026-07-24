export const dynamic = "force-dynamic";
import { prisma } from "@/lib/db";
import { Button, Card, CardContent } from "@EduMind/ui";
import Link from "next/link";

export const metadata = {
  title: "Calendar - Control Center",
};

export default async function SpecialistCalendarPage() {
  const appointments = await prisma.appointment.findMany({
    include: {
      type: true,
      case: { include: { child: { include: { family: true } } } },
      videoMeeting: true,
      staff: { include: { user: true } }
    },
    orderBy: { startTime: "asc" }
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div>
          <h1 className="text-2xl font-semibold text-primary-ink">Calendar SpecialiÈ™ti</h1>
          <p className="text-sm text-muted-text">Vizualizarea programÄƒrilor È™i gestiunea disponibilitÄƒÈ›ii.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Gestiune Disponibilitate</Button>
          <Button className="bg-forest-accent text-warm-surface">BlocheazÄƒ Interval</Button>
        </div>
      </div>

      <div className="space-y-4">
        {appointments.length === 0 ? (
          <Card className="bg-warm-surface border-border">
            <CardContent className="p-8 text-center text-muted-text">
              Nu existÄƒ programÄƒri active Ã®n calendar.
            </CardContent>
          </Card>
        ) : (
          appointments.map((apt) => {
            const childName = apt.case?.child?.firstName;
            const familyName = apt.case?.child?.family?.publicId;
            
            return (
              <Card key={apt.id} className="bg-warm-surface border-border shadow-sm border-l-4 border-l-forest-accent">
                <CardContent className="p-6 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3">
                      {apt.status === "SCHEDULED" ? (
                        <span className="bg-success/10 text-success px-2 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider border border-success/20">
                          Programat
                        </span>
                      ) : (
                        <span className="bg-muted-surface text-muted-text px-2 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider border border-border">
                          {apt.status}
                        </span>
                      )}
                      <span className="text-sm font-medium text-forest-accent">
                        {new Date(apt.startTime).toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' })} - {new Date(apt.endTime).toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span className="text-xs text-muted-text">
                        {new Date(apt.startTime).toLocaleDateString('ro-RO')}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-primary-ink">
                      {apt.type.title}
                    </h3>
                    
                    <p className="text-sm text-primary-text">
                      Elev: <strong>{childName}</strong> (Familia {familyName}) â€¢ Specialist: {apt.staff.user.firstName}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    {apt.status === "SCHEDULED" && apt.videoMeeting && (
                      <Button asChild className="w-full sm:w-auto bg-sage-surface text-forest-accent hover:bg-forest-accent hover:text-warm-surface">
                        <Link href={apt.videoMeeting.hostUrl || "#"} target="_blank">
                          Start Video (Host)
                        </Link>
                      </Button>
                    )}
                    <Button variant="outline" className="w-full sm:w-auto">
                      Vezi Dosar
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

