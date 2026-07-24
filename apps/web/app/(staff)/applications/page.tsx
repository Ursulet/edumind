import { getUserFromToken, getAuthHeaders } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Button, Card, CardContent, Badge } from "@edumind/ui";

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

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Aplicații Noi - Portal Staff | EduMind",
};

export default async function ApplicationsQueuePage() {
  const user = await getUserFromToken();
  if (!user) redirect("/login");

  // Only allow Director or Admin
  if (!["DEPARTMENT_ADMIN", "SUPER_ADMIN", "PLATFORM_OWNER"].includes(user.role)) {
    redirect("/specialist");
  }

  const authHeaders = await getAuthHeaders();
  const applicationsRes = await fetchWithAuth(`/api/v1/applications`, authHeaders);
  
  // Filter for pending/review applications
  const applications = Array.isArray(applicationsRes) 
    ? applicationsRes.filter(app => ["SUBMITTED", "UNDER_REVIEW"].includes(app.status))
    : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-[#E3DED3] pb-6">
        <div>
          <h1 className="text-2xl font-semibold text-[#1F2622] tracking-[-0.025em]">Aplicații Noi în Așteptare</h1>
          <p className="text-sm text-[#6B746F] mt-1">Triage pentru cererile noi de orientare în carieră (Director / Staff Queue).</p>
        </div>
        <Badge variant="outline" className="bg-[#EDF4F0] text-[#2F6B57] font-semibold border-[#DCE8E1]">
          {applications.length} aplicații
        </Badge>
      </div>

      <div className="space-y-4">
        {applications.length === 0 ? (
          <Card className="bg-[#FFFDF8] border-[#E3DED3] border-dashed">
            <CardContent className="p-8 text-center text-[#6B746F]">
              Nu există aplicații noi în așteptare în acest moment.
            </CardContent>
          </Card>
        ) : (
          applications.map((app) => {
            const formData = (app.data as any) ?? {};
            const parentUser = app.family?.parents?.[0]?.user;
            const child = app.family?.children?.[0];

            return (
               <Card key={app.id} className="bg-[#FFFDF8] border-[#E3DED3] shadow-[0_1px_2px_rgba(31,38,34,0.05)] hover:border-[#2F6B57]/50 transition-colors">
                <CardContent className="p-6 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="bg-[#FEF3C7] text-[#B7791F] px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider border border-[#FDE68A]">
                        {app.status === "SUBMITTED" ? "Nouă" : "În Evaluare"}
                      </span>
                      <span className="text-xs text-[#6B746F] font-medium">
                        Data: {new Date(app.createdAt).toLocaleDateString('ro-RO')}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-[#1F2622]">
                      Elev: {formData.childFirstName || child?.firstName || "Copil"} {formData.childLastName || child?.lastName || ""}
                    </h3>
                    <div className="text-sm text-[#6B746F] space-y-1">
                      <p><strong className="font-medium text-[#1F2622]">Părinte:</strong> {parentUser ? `${parentUser.firstName} ${parentUser.lastName} (${parentUser.email})` : "Nespecificat"}</p>
                      <p><strong className="font-medium text-[#1F2622]">Clasă / Oraș:</strong> {formData.grade || "N/A"} - {formData.city || "N/A"}, {formData.county || ""}</p>
                      <p><strong className="font-medium text-[#1F2622]">Nevoie declarată:</strong> <span className="italic">{app.declaredNeed || formData.declaredNeed || "Nespecificat"}</span></p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                    <Button variant="outline" className="border-[#E3DED3] text-[#1F2622] hover:bg-[#F1EEE7]">
                      Detalii
                    </Button>
                    {/* In a real app this would call an API action */}
                    <form action={`/api/actions/approve-application`} method="POST">
                      <input type="hidden" name="id" value={app.id} />
                      <Button type="button" className="bg-[#2F6B57] text-white hover:bg-[#275B4A]">
                        Aprobă & Deschide Caz
                      </Button>
                    </form>
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

