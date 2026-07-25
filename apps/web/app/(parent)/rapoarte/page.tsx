export const dynamic = "force-dynamic";
import { getUserFromToken, getAuthHeaders } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent } from "@edumind/ui";
import Link from "next/link";

export const metadata = {
  title: "Rapoarte și Planuri - Portal Părinți",
};

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

export default async function ParentReportsPage() {
  const user = await getUserFromToken();
  if (!user) redirect("/login");

  const authHeaders = await getAuthHeaders();

  // Step 1: get the parent's own case
  const casesData = await fetchWithAuth(`/api/v1/cases/mine`, authHeaders);
  const activeCase = Array.isArray(casesData) ? casesData[0] : null;

  // We rely on the /cases/mine response including reports (or we fetch them directly if not)
  // Let's assume activeCase.reports holds the reports, filtered to PUBLISHED on backend
  const reportsList = activeCase?.reports || [];

  return (
    <div className="flex-1 w-full bg-[#F7F5F0] py-8">
      <div className="container mx-auto px-4 max-w-5xl space-y-8">
        <div className="flex items-start justify-between border-b border-[#E3DED3] pb-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold text-[#1F2622]">
              Rapoarte și Planuri de Carieră
            </h1>
            <p className="text-sm text-[#6B746F]">
              Documentele finale elaborate de specialiștii noștri.
            </p>
          </div>
        </div>

        {!activeCase && (
          <Card className="bg-[#FFFDF8] border-[#E3DED3]">
            <CardContent className="p-8 text-center text-[#6B746F]">
              Nu ai un dosar activ momentan.
            </CardContent>
          </Card>
        )}

        {activeCase && (
          <div className="space-y-4">
            {reportsList.length === 0 ? (
              <Card className="bg-[#FFFDF8] border-[#E3DED3]">
                <CardContent className="p-8 text-center text-[#6B746F]">
                  Nu există rapoarte publicate momentan.
                </CardContent>
              </Card>
            ) : (
              reportsList.map((report: any) => (
                <Card key={report.id} className="bg-[#FFFDF8] border-[#E3DED3] shadow-sm">
                  <CardContent className="p-6 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-3">
                        <span className="bg-[#EDF4F0] text-[#2F7A55] px-2 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider">
                          Publicat
                        </span>
                        <span className="text-xs text-[#6B746F]">
                          {new Date(report.publishedAt || report.createdAt).toLocaleDateString('ro-RO')}
                        </span>
                      </div>
                      
                      <h3 className="text-lg font-semibold text-[#1F2622]">
                        {report.title || "Raport Evaluare Vocațională"}
                      </h3>
                      
                      {activeCase.child?.firstName && (
                        <p className="text-sm text-[#6B746F]">
                          Elev: <strong className="text-[#1F2622]">{activeCase.child.firstName}</strong>
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                      <Link 
                        href={`/rapoarte/${report.id}`} 
                        className="w-full md:w-auto text-center px-6 py-2.5 bg-[#2F6B57] text-white text-sm font-semibold rounded-lg hover:bg-[#275B4A] transition-colors"
                      >
                        Deschide Raport
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
