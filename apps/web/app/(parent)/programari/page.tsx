import { getUserFromToken, getAuthHeaders } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Button, Card, CardContent } from "@edumind/ui";
import Link from "next/link";
import { NewAppointmentDialog } from "@/components/scheduling/NewAppointmentDialog";
import { CancelAppointmentButton } from "@/components/parent/CancelAppointmentButton";

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

export const metadata = {
  title: "Programări - Portal Părinți | EduMind",
};

export default async function ParentAppointmentsPage() {
  const user = await getUserFromToken();
  if (!user) redirect("/login");

  const authHeaders = await getAuthHeaders();

  const caseData = await fetchWithAuth(`/api/v1/cases/mine`, authHeaders);
  const activeCase = Array.isArray(caseData) ? caseData[0] : null;

  let appointments: any[] = [];
  
  if (activeCase) {
    const apts = await fetchWithAuth(`/api/v1/scheduling/appointments/case/${activeCase.id}`, authHeaders);
    if (Array.isArray(apts)) {
      appointments = apts;
    }
  }

  const upcomingAppointments = appointments.filter((a) => a.status === "SCHEDULED");
  const pastAppointments = appointments.filter((a) => a.status !== "SCHEDULED");

  return (
    <div className="flex-1 w-full py-4 md:py-6">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Context Header */}
        <div className="flex items-start justify-between border-b border-[#E3DED3] pb-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold text-[#1F2622] tracking-[-0.025em]">
              Programările Mele
            </h1>
            <p className="text-sm text-[#6B746F]">
              Gestionează ședințele de consiliere cu specialiștii noștri.
            </p>
          </div>
          {activeCase && activeCase.assignments && activeCase.assignments.length > 0 && (
            <NewAppointmentDialog 
              caseId={activeCase.id}
              staffId={activeCase.assignments[0].staff.id}
              staffName={`${activeCase.assignments[0].staff.user.firstName} ${activeCase.assignments[0].staff.user.lastName}`}
            />
          )}
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-[#1F2622]">Următoarele Ședințe</h2>
          {!activeCase ? (
            <Card className="bg-[#FFFDF8] border-[#E3DED3] border-dashed">
              <CardContent className="p-8 text-center text-[#6B746F]">
                Nu ai un dosar activ pentru a putea face programări.
              </CardContent>
            </Card>
          ) : upcomingAppointments.length === 0 ? (
            <Card className="bg-[#FFFDF8] border-[#E3DED3] border-dashed">
              <CardContent className="p-8 text-center text-[#6B746F]">
                Nu ai nicio ședință viitoare programată.
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {upcomingAppointments.map((apt) => (
                <Card key={apt.id} className="bg-[#FFFDF8] border-[#E3DED3] shadow-[0_1px_2px_rgba(31,38,34,0.05)]">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="bg-[#EDF4F0] text-[#2F6B57] px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider mb-3 inline-block">
                          Confirmat
                        </span>
                        <h3 className="text-lg font-semibold text-[#1F2622]">
                          {apt.type?.title || "Ședință Consiliere"}
                        </h3>
                        <p className="text-sm text-[#6B746F] font-medium mt-1">
                          {new Date(apt.startTime).toLocaleDateString('ro-RO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                        <p className="text-sm text-[#6B746F]">
                          Ora: {new Date(apt.startTime).toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-[#6B746F]">Specialist</div>
                        <div className="text-sm font-medium text-[#1F2622]">{apt.staff?.user?.firstName || "Alocat"}</div>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-[#E3DED3] flex gap-3">
                      {apt.videoMeeting && (
                        <Button asChild className="flex-1 bg-[#2F6B57] hover:bg-[#275B4A] text-white">
                          <Link href={apt.videoMeeting.joinUrl} target="_blank">
                            Intră în Conferință
                          </Link>
                        </Button>
                      )}
                      <CancelAppointmentButton appointmentId={apt.id} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4 pt-8">
          <h2 className="text-lg font-semibold text-[#1F2622]">Istoric Ședințe</h2>
          {pastAppointments.length === 0 ? (
            <p className="text-sm text-[#6B746F]">Nu există istoric.</p>
          ) : (
            <div className="space-y-3">
              {pastAppointments.map(apt => (
                <Card key={apt.id} className="bg-[#F7F5F0] border-[#E3DED3] shadow-none">
                  <CardContent className="p-4 flex justify-between items-center opacity-70">
                    <div>
                      <p className="font-medium text-sm text-[#1F2622]">{apt.type?.title || "Ședință Consiliere"}</p>
                      <p className="text-xs text-[#6B746F]">
                        {new Date(apt.startTime).toLocaleDateString('ro-RO')} • Specialist: {apt.staff?.user?.firstName || "Necunoscut"}
                      </p>
                    </div>
                    <span className="text-xs uppercase tracking-wider font-semibold text-[#6B746F]">
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

