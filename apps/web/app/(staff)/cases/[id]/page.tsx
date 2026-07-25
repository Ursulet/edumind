import { getUserFromToken, getAuthHeaders } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, Button } from "@edumind/ui";
import { NewRecommendationForm } from "@/components/cases/NewRecommendationForm";
import { QuickActions } from "@/components/cases/QuickActions";

export const dynamic = "force-dynamic";

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

export default async function SpecialistCaseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getUserFromToken();
  if (!user) redirect("/login");

  if (!["SPECIALIST", "DEPARTMENT_ADMIN", "SUPER_ADMIN", "PLATFORM_OWNER"].includes(user.role)) {
    redirect("/dashboard");
  }

  const { id } = await params;
  const authHeaders = await getAuthHeaders();

  const [careerCase, catalogProducts] = await Promise.all([
    fetchWithAuth(`/api/v1/cases/${id}`, authHeaders),
    fetchWithAuth(`/api/v1/catalog`, authHeaders), // Assuming this endpoint exists to get products
  ]);

  if (!careerCase) return notFound();

  return (
    <div className="space-y-8 max-w-5xl">
      <div className="flex items-start justify-between border-b border-[#E3DED3] pb-6">
        <div className="space-y-2">
          <Link
            href="/specialist"
            className="text-sm text-[#6B746F] hover:text-[#1F2622] transition-colors font-medium"
          >
            ← Înapoi la Portal
          </Link>
          <h1 className="text-2xl font-semibold text-[#1F2622] tracking-tight mt-2">
            Dosar: {careerCase.child?.firstName} {careerCase.child?.lastName}
          </h1>
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider border bg-[#EDF4F0] text-[#2F7A55] border-[#DCE8E1]">
              {careerCase.status}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-[#FFFDF8] border-[#E3DED3]">
            <CardHeader>
              <CardTitle>Istoric Sesiuni</CardTitle>
            </CardHeader>
            <CardContent>
              {careerCase.counselingSessions?.length === 0 ? (
                <p className="text-sm text-[#6B746F]">Nicio sesiune completată.</p>
              ) : (
                <div className="space-y-4">
                  {careerCase.counselingSessions?.map((session: any) => (
                    <div key={session.id} className="border-b border-[#E3DED3] pb-4 last:border-0 last:pb-0">
                      <p className="text-sm font-medium text-[#1F2622]">
                        {new Date(session.createdAt).toLocaleDateString('ro-RO')}
                      </p>
                      <p className="text-sm text-[#6B746F] mt-1 whitespace-pre-wrap">{session.content?.internalNotes}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <QuickActions caseId={careerCase.id} />
          
          <Card className="bg-[#FFFDF8] border-[#E3DED3]">
            <CardHeader>
              <CardTitle>Recomandări</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {careerCase.recommendations?.length === 0 ? (
                <p className="text-sm text-[#6B746F]">Nicio recomandare făcută.</p>
              ) : (
                <div className="space-y-4">
                  {careerCase.recommendations?.map((rec: any) => (
                    <div key={rec.id} className="bg-[#F7F5F0] p-3 rounded border border-[#E3DED3]">
                      <p className="text-sm font-medium text-[#1F2622]">{rec.productVersion?.marketingName}</p>
                      <p className="text-xs text-[#6B746F] mt-1">{rec.reason}</p>
                      <span className="text-xs font-semibold text-[#2F6B57] mt-2 block">{rec.status}</span>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="pt-4 border-t border-[#E3DED3]">
                <NewRecommendationForm 
                  caseId={careerCase.id} 
                  products={Array.isArray(catalogProducts) ? catalogProducts : []} 
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
