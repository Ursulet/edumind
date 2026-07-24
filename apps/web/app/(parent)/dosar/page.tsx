import { getUserFromToken, getAuthHeaders } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, Tabs, TabsList, TabsTrigger, TabsContent } from "@educariera/ui";

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
  title: "Dosarul Cazului - Portal Părinți | EduMind",
};

export default async function ParentDossierPage() {
  const user = await getUserFromToken();
  if (!user) redirect("/login");

  const authHeaders = await getAuthHeaders();

  // 1. Get user's cases to find the active one
  const casesData = await fetchWithAuth(`/api/v1/cases/mine`, authHeaders);
  const activeCaseMeta = Array.isArray(casesData) ? casesData[0] : null;

  // 2. Fetch full case details
  let careerCase: any = null;
  if (activeCaseMeta) {
    careerCase = await fetchWithAuth(`/api/v1/cases/${activeCaseMeta.id}`, authHeaders);
  }

  return (
    <div className="flex-1 w-full py-4 md:py-6">
      <div className="max-w-5xl mx-auto space-y-6">
        
        <div className="flex items-start justify-between border-b border-[#E3DED3] pb-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold text-[#1F2622] tracking-[-0.025em]">
              Dosarul de Consiliere
            </h1>
            <p className="text-sm text-[#6B746F]">
              Tot parcursul vocațional al copilului tău ({careerCase?.child?.firstName || "Elev"}), într-un singur loc.
            </p>
          </div>
        </div>

        {careerCase ? (
          <Tabs defaultValue="sessions" className="w-full">
            <TabsList className="bg-[#FFFDF8] border border-[#E3DED3] w-full justify-start overflow-x-auto rounded-lg p-1">
              <TabsTrigger value="sessions" className="data-[state=active]:bg-[#EDF4F0] data-[state=active]:text-[#2F6B57]">Istoric Ședințe</TabsTrigger>
              <TabsTrigger value="reports" className="data-[state=active]:bg-[#EDF4F0] data-[state=active]:text-[#2F6B57]">Rapoarte Finale</TabsTrigger>
              <TabsTrigger value="plan" className="data-[state=active]:bg-[#EDF4F0] data-[state=active]:text-[#2F6B57]">Plan Carieră</TabsTrigger>
            </TabsList>
            
            <TabsContent value="sessions" className="mt-6 space-y-6">
              {!careerCase.counselingSessions || careerCase.counselingSessions.length === 0 ? (
                <Card className="bg-[#FFFDF8] border-[#E3DED3] border-dashed">
                  <CardContent className="p-8 text-center text-[#6B746F]">
                    Nu s-a finalizat încă nicio ședință.
                  </CardContent>
                </Card>
              ) : (
                <div className="relative border-l-2 border-[#E3DED3] ml-4 space-y-8 pb-4">
                  {careerCase.counselingSessions.map((session: any) => (
                  <div key={session.id} className="relative pl-6 border-l-2 border-[#2F6B57]">
                      <div className="absolute -left-[11px] top-1 w-5 h-5 rounded-full bg-[#2F6B57] border-4 border-[#F7F5F0]" />
                      
                      <Card className="bg-[#FFFDF8] border-[#E3DED3] shadow-[0_1px_2px_rgba(31,38,34,0.05)]">
                        <CardHeader className="pb-2">
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-lg text-[#1F2622]">{session.appointment?.type?.title || "Ședință Consiliere"}</CardTitle>
                            <span className="text-xs text-[#6B746F] font-medium">
                              {new Date(session.createdAt).toLocaleDateString('ro-RO')}
                            </span>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {session.content?.parentSummary ? (
                            <div className="bg-[#F7F5F0] p-4 rounded-md border border-[#E3DED3]">
                              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#6B746F] mb-2">Concluziile Specialistului</h4>
                              <p className="text-sm text-[#1F2622] whitespace-pre-wrap">
                                {session.content.parentSummary}
                              </p>
                            </div>
                          ) : (
                            <p className="text-sm text-[#6B746F] italic">Specialistul nu a publicat încă concluziile.</p>
                          )}

                          {session.content?.homework && (
                            <div className="bg-[#EDF4F0] p-4 rounded-md border border-[#2F6B57]/20">
                              <h4 className="text-xs font-semibold uppercase tracking-wider text-[#2F6B57] mb-2">De Făcut (Homework)</h4>
                              <p className="text-sm text-[#1F2622] whitespace-pre-wrap">
                                {session.content.homework}
                              </p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="reports" className="mt-6 space-y-6">
               {!careerCase.reports || careerCase.reports.length === 0 ? (
                <Card className="bg-[#FFFDF8] border-[#E3DED3] border-dashed">
                  <CardContent className="p-8 text-center text-[#6B746F]">
                    Niciun raport publicat.
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {careerCase.reports.map((report: any) => (
                    <Card key={report.id} className="bg-[#FFFDF8] border-[#E3DED3] shadow-sm hover:border-[#2F6B57]/50 transition-colors cursor-pointer">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-3">
                           <div className="p-2 bg-[#EDF4F0] text-[#2F6B57] rounded">
                             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                           </div>
                           <div>
                             <h3 className="font-medium text-[#1F2622]">{report.title}</h3>
                             <p className="text-xs text-[#6B746F]">{new Date(report.createdAt).toLocaleDateString('ro-RO')}</p>
                           </div>
                        </div>
                        <p className="text-sm text-[#6B746F] line-clamp-2">
                          Raport generat și publicat de specialist.
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

          <TabsContent value="plan" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="md:col-span-2 space-y-6">
              <h2 className="text-xl font-medium text-[#1F2622] border-b border-[#E3DED3] pb-2">Planul de Carieră (Livrabil)</h2>
              
              {careerCase.careerPlans && careerCase.careerPlans.length > 0 ? (
                <div className="space-y-6">
                  {(() => {
                    const sections = careerCase.careerPlans[0].sections || {};
                    return (
                      <>
                        <div className="bg-[#FFFDF8] p-6 rounded-md shadow-[0_1px_2px_rgba(31,38,34,0.05)] border border-[#E3DED3]">
                          <h3 className="font-semibold text-[#1F2622] mb-2">Puncte Tari Identificate</h3>
                          <p className="text-sm text-[#6B746F]">{sections.strengths || "-"}</p>
                        </div>
                        <div className="bg-[#FFFDF8] p-6 rounded-md shadow-[0_1px_2px_rgba(31,38,34,0.05)] border border-[#E3DED3]">
                          <h3 className="font-semibold text-[#1F2622] mb-2">Arii de Interes (Top 3)</h3>
                          <p className="text-sm text-[#6B746F]">{sections.interests || "-"}</p>
                        </div>
                        <div className="bg-[#FFFDF8] p-6 rounded-md shadow-[0_1px_2px_rgba(31,38,34,0.05)] border border-[#E3DED3]">
                          <h3 className="font-semibold text-[#1F2622] mb-2">Obiective pe Termen Scurt</h3>
                          <p className="text-sm text-[#6B746F]">{sections.short_term || "-"}</p>
                        </div>
                        <div className="bg-[#FFFDF8] p-6 rounded-md shadow-[0_1px_2px_rgba(31,38,34,0.05)] border border-[#E3DED3]">
                          <h3 className="font-semibold text-[#1F2622] mb-2">Direcția pe Termen Lung</h3>
                          <p className="text-sm text-[#6B746F]">{sections.long_term || "-"}</p>
                        </div>
                      </>
                    );
                  })()}
                </div>
              ) : (
                <p className="text-sm text-[#6B746F]">Planul de carieră nu a fost încă finalizat și publicat de către specialist.</p>
              )}
            </div>

            <div>
              <h2 className="text-xl font-medium text-[#1F2622] border-b border-[#E3DED3] pb-2 mb-6">Documente Atașate</h2>
              {careerCase.documents && careerCase.documents.length > 0 ? (
                <div className="space-y-3">
                  {careerCase.documents.map((doc: any) => (
                    <a key={doc.id} href="#" className="block bg-[#FFFDF8] p-4 rounded-md shadow-[0_1px_2px_rgba(31,38,34,0.05)] border border-[#E3DED3] hover:border-[#2F6B57] transition-colors">
                      <div className="flex items-center gap-3">
                        <svg className="w-8 h-8 text-[#2F6B57]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                        <div>
                          <p className="text-sm font-medium text-[#1F2622]">{doc.displayName}</p>
                          <p className="text-xs text-[#6B746F]">Descărcare sigură (S3)</p>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-[#6B746F]">Niciun document nu a fost atașat încă.</p>
              )}
            </div>
            
          </div>
        </TabsContent>
          </Tabs>
        ) : (
          <Card className="bg-[#FFFDF8] border-[#E3DED3]">
            <CardContent className="p-8 text-center text-[#6B746F]">
              Nu ai un dosar activ.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

