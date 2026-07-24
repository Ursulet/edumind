import { getUserFromToken, getAuthHeaders } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { Button, Card, CardContent, CardHeader, CardTitle, Tabs, TabsList, TabsTrigger, TabsContent, Textarea } from "@educariera/ui";
import Link from "next/link";

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
              <Card key={session.id} className="bg-[#FFFDF8] border-[#E3DED3] shadow-[0_1px_2px_rgba(31,38,34,0.05)] overflow-hidden">
                <CardHeader className="border-b border-[#E3DED3] bg-[#F7F5F0] flex flex-row items-center justify-between pb-4 pt-5">
                  <div>
                    <CardTitle className="text-lg text-[#1F2622]">{session.appointment?.type?.title || "Sesiune de Consiliere"}</CardTitle>
                    <p className="text-sm text-[#6B746F] mt-1">
                      {new Date(session.createdAt).toLocaleDateString('ro-RO')} • Status: {session.status}
                    </p>
                  </div>
                  <Button variant="outline" size="sm" className="border-[#2F6B57] text-[#2F6B57] hover:bg-[#EDF4F0]">Marchează Complet</Button>
                </CardHeader>
                
                <CardContent className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Internal Notes - STRICTLY CONFIDENTIAL */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-[#B4453A]">Notițe Interne (Confidențial)</h4>
                      <span className="bg-[#FEF2F2] border border-[#FECACA] text-[#B4453A] text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider">Staff Only</span>
                    </div>
                    {/* Form elements would wrap these in a real interactive setup */}
                    <Textarea 
                      placeholder="Notițe personale pentru continuitatea cazului..." 
                      className="min-h-[160px] bg-white border-[#FECACA] focus-visible:ring-[#B4453A]/20"
                      defaultValue={session.content?.internalNotes || ""}
                    />
                    <p className="text-xs text-[#6B746F]">Aceste notițe nu vor fi vizibile niciodată în portalul părintelui.</p>
                  </div>

                  {/* Parent Summary - VISIBLE TO PARENT */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-[#1F2622]">Rezumat pentru Părinte</h4>
                      <span className="bg-[#EDF4F0] border border-[#2F6B57]/20 text-[#2F6B57] text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider">Public</span>
                    </div>
                    <Textarea 
                      placeholder="Ce concluzii îi transmiți părintelui?" 
                      className="min-h-[160px] bg-white border-[#2F6B57]/30 focus-visible:ring-[#2F6B57]/20"
                      defaultValue={session.content?.parentSummary || ""}
                    />
                    <p className="text-xs text-[#6B746F]">Textul completat aici va apărea în aplicația părintelui.</p>
                  </div>
                  
                  {/* Homework */}
                  <div className="space-y-3 lg:col-span-2">
                    <h4 className="font-semibold text-[#1F2622]">Acțiuni & Teme (Homework)</h4>
                    <Textarea 
                      placeholder="Ex: De completat testul de personalitate..." 
                      className="bg-white min-h-[100px] border-[#E3DED3]"
                      defaultValue={session.content?.homework || ""}
                    />
                  </div>
                </CardContent>
                <div className="bg-[#F7F5F0] p-4 border-t border-[#E3DED3] flex justify-end gap-3">
                  <Button variant="outline" className="border-[#E3DED3] text-[#1F2622] hover:bg-[#FFFDF8]">Renunță</Button>
                  <Button className="bg-[#2F6B57] text-white hover:bg-[#275B4A]">Salvează Notițele</Button>
                </div>
              </Card>
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
