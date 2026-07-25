export const dynamic = "force-dynamic";

import { getUserFromToken, getAuthHeaders } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card, CardContent } from "@edumind/ui";
import Link from "next/link";
import { AssessmentCompleteButton } from "@/components/parent/AssessmentCompleteButton";

export const metadata = {
  title: "Teste și Evaluări - Portal Părinți",
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

export default async function ParentAssessmentsPage() {
  const user = await getUserFromToken();
  if (!user) redirect("/login");

  const authHeaders = await getAuthHeaders();

  // Step 1: get the parent's own case (scoped to authenticated user)
  const casesData = await fetchWithAuth(`/api/v1/cases/mine`, authHeaders);
  const activeCase = Array.isArray(casesData) ? casesData[0] : null;

  // Step 2: get assessments only for this case
  const assessments = activeCase
    ? (await fetchWithAuth(`/api/v1/cases/${activeCase.id}/assessments`, authHeaders)) ?? []
    : [];

  const assessmentList = Array.isArray(assessments) ? assessments : [];

  return (
    <div className="flex-1 w-full bg-[#F7F5F0] py-8">
      <div className="container mx-auto px-4 max-w-5xl space-y-8">

        <div className="flex items-start justify-between border-b border-[#E3DED3] pb-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold text-[#1F2622]">
              Teste și Evaluări Vocaționale
            </h1>
            <p className="text-sm text-[#6B746F]">
              Chestionare externe necesare pentru profilarea candidatului.
            </p>
          </div>
        </div>

        {!activeCase && (
          <Card className="bg-[#FFFDF8] border-[#E3DED3]">
            <CardContent className="p-8 text-center text-[#6B746F]">
              Nu ai un dosar activ. Completează{" "}
              <Link href="/inscriere" className="text-[#2F6B57] font-medium underline">
                formularul de aplicație
              </Link>{" "}
              pentru a începe.
            </CardContent>
          </Card>
        )}

        {activeCase && (
          <div className="space-y-4">
            {assessmentList.length === 0 ? (
              <Card className="bg-[#FFFDF8] border-[#E3DED3]">
                <CardContent className="p-8 text-center text-[#6B746F]">
                  Nu există teste de evaluare alocate momentan. Specialistul tău le va adăuga în curând.
                </CardContent>
              </Card>
            ) : (
              assessmentList.map((assessment: any) => (
                <Card key={assessment.id} className="bg-[#FFFDF8] border-[#E3DED3] shadow-sm">
                  <CardContent className="p-6 flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        {assessment.status === "VERIFIED" ? (
                          <span className="bg-[#EDF4F0] text-[#2F7A55] px-2 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider">
                            Rezultat Primit
                          </span>
                        ) : assessment.status === "DECLARED_COMPLETED" ? (
                          <span className="bg-[#EFF6FF] text-[#2563EB] px-2 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider">
                            În curs de validare
                          </span>
                        ) : (
                          <span className="bg-[#FEF3C7] text-[#B7791F] px-2 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider">
                            Necesită Acțiune
                          </span>
                        )}
                        <span className="text-xs text-[#6B746F]">
                          Atribuit: {new Date(assessment.assignedAt).toLocaleDateString('ro-RO')}
                        </span>
                        {assessment.deadline && (
                          <span className="text-xs text-[#B4453A] font-medium">
                            Termen: {new Date(assessment.deadline).toLocaleDateString('ro-RO')}
                          </span>
                        )}
                      </div>

                      <h3 className="text-lg font-semibold text-[#1F2622]">
                        {assessment.template?.testName || assessment.testName || "Evaluare Vocațională"}
                      </h3>

                      {(assessment.template?.instructions || assessment.instructions) && (
                        <p className="text-sm text-[#1F2622] bg-[#F7F5F0] p-3 rounded-md border border-[#E3DED3]">
                          {assessment.template?.instructions || assessment.instructions}
                        </p>
                      )}

                      <div className="flex gap-4 text-xs text-[#6B746F]">
                        {activeCase.child?.firstName && (
                          <span>Elev: <strong className="text-[#1F2622]">{activeCase.child.firstName}</strong></span>
                        )}
                        {(assessment.template?.expectedDuration || assessment.expectedDuration) && (
                          <span>Durată est.: {assessment.template?.expectedDuration || assessment.expectedDuration} min</span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-3 w-full md:w-48">
                      {assessment.status === "ASSIGNED" || assessment.status === "OPENED" ? (
                        <>
                          {(assessment.template?.url || assessment.url) ? (
                            <Link
                              href={assessment.template?.url || assessment.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full text-center px-4 py-2 bg-[#2F6B57] text-white text-sm font-semibold rounded-lg hover:bg-[#275B4A] transition-colors"
                            >
                              1. Începe Testul
                            </Link>
                          ) : (
                            <div className="text-sm text-center text-[#6B746F] border border-[#E3DED3] p-3 rounded bg-[#F7F5F0] w-full">
                              Link test — în curând
                            </div>
                          )}
                          <AssessmentCompleteButton
                            assessmentId={assessment.id}
                            caseId={activeCase.id}
                          />
                        </>
                      ) : assessment.status === "DECLARED_COMPLETED" ? (
                        <div className="text-sm text-center text-[#6B746F] border border-[#E3DED3] p-3 rounded bg-[#F7F5F0] w-full">
                          Așteptăm rezultatele de la platforma parteneră.
                        </div>
                      ) : (
                        <div className="text-sm text-center text-[#2F7A55] border border-[#2F7A55]/20 p-3 rounded bg-[#EDF4F0] w-full font-medium">
                          ✓ Specialistul a interpretat rezultatele.
                        </div>
                      )}
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
