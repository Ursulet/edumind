import { getUserFromToken, getAuthHeaders } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { Button, Card, CardContent, CardHeader, CardTitle, Tabs, TabsList, TabsTrigger, TabsContent } from "@edumind/ui";
import Link from "next/link";
import { SessionCard } from "@/components/cases/SessionCard";

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

export default async function SpecialistCaseDossierPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await getUserFromToken();
  if (!user) redirect("/login");

  const { id } = await params;
  const authHeaders = await getAuthHeaders();

  const careerCase = await fetchWithAuth(`/api/v1/cases/${id}`, authHeaders);
  if (!careerCase) return notFound();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-[#E3DED3] pb-4">
        <div>
          <div className="flex items-center gap-3">
            <Link href="/specialist" className="text-[#6B746F] hover:text-[#1F2622] text-sm font-medium transition-colors">
              ← Înapoi la Cazuri
            </Link>
          </div>
          <h1 className="text-2xl font-semibold text-[#1F2622] mt-2 tracking-tight">
            Dosar: {careerCase.child?.firstName} {careerCase.child?.lastName}
          </h1>
          <p className="text-sm text-[#6B746F] mt-1">
            ID Caz: <span className="font-mono bg-[#E3DED3]/50 px-1.5 py-0.5 rounded text-[#1F2622]">{careerCase.publicId || id.slice(0, 8)}</span> • Status: <span className="font-semibold text-[#2F6B57]">{careerCase.status}</span>
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-[#E3DED3] text-[#1F2622] hover:bg-[#F1EEE7]">Editează Profil</Button>
          <Button className="bg-[#2F6B57] text-white hover:bg-[#275B4A]">Adaugă Sesiune Nouă</Button>
        </div>
      </div>

      <Tabs defaultValue="sessions" className="w-full">
        <TabsList className="bg-[#FFFDF8] border border-[#E3DED3] p-1 rounded-lg">
          <TabsTrigger value="overview" className="data-[state=active]:bg-[#EDF4F0] data-[state=active]:text-[#2F6B57]">Overview</TabsTrigger>
          <TabsTrigger value="sessions" className="data-[state=active]:bg-[#EDF4F0] data-[state=active]:text-[#2F6B57]">Ședințe & Notițe</TabsTrigger>
          <TabsTrigger value="assessments" className="data-[state=active]:bg-[#EDF4F0] data-[state=active]:text-[#2F6B57]">Evaluări</TabsTrigger>
          <TabsTrigger value="reports" className="data-[state=active]:bg-[#EDF4F0] data-[state=active]:text-[#2F6B57]">Rapoarte</TabsTrigger>
        </TabsList>
        
        <TabsContent value="sessions" className="mt-6 space-y-6">
          {!careerCase.counselingSessions || careerCase.counselingSessions.length === 0 ? (
            <Card className="bg-[#FFFDF8] border-[#E3DED3] border-dashed">
              <CardContent className="p-8 text-center text-[#6B746F]">
                Nicio ședință înregistrată pentru acest caz.
              </CardContent>
            </Card>
          ) : (
            careerCase.counselingSessions.map((session: any) => (
              <SessionCard key={session.id} session={session} />
            ))
          )}
        </TabsContent>
        
        <TabsContent value="overview">
          <Card className="bg-[#FFFDF8] border-[#E3DED3]">
            <CardContent className="p-6">Overview content here...</CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="assessments">
          <Card className="bg-[#FFFDF8] border-[#E3DED3]">
            <CardContent className="p-6">Evaluări content here...</CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="reports">
          <Card className="bg-[#FFFDF8] border-[#E3DED3]">
            <CardContent className="p-6">Rapoarte content here...</CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
