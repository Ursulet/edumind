"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Button, Card, CardContent, CardHeader, CardTitle, 
  Tabs, TabsList, TabsTrigger, TabsContent 
} from "@edumind/ui";
import { 
  Briefcase, Calendar, CheckCircle2, FileText, User, 
  Clock, AlertCircle, Award, Activity, MessageSquare, Send, Plus
} from "lucide-react";
import { SessionCard } from "./SessionCard";
import { NewRecommendationForm } from "./NewRecommendationForm";
import { QuickActions } from "./QuickActions";

export interface CaseDetailWorkspaceProps {
  careerCase: any;
  userRole: string;
  catalogProducts?: any[];
  backHref?: string;
}

export function CaseDetailWorkspace({
  careerCase,
  userRole,
  catalogProducts = [],
  backHref = "/specialist",
}: CaseDetailWorkspaceProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [noteText, setNoteText] = useState("");
  const [isSubmittingNote, setIsSubmittingNote] = useState(false);

  const child = careerCase.child || {};
  const family = child.family || {};
  const parent = family.parents?.[0]?.user || {};
  const assignments = careerCase.assignments || [];
  const primaryCounselor = assignments[0]?.staff?.user || null;

  const handleAddInternalNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText.trim()) return;

    setIsSubmittingNote(true);
    try {
      const token = document.cookie.split("em_token=")[1]?.split(";")[0];
      const res = await fetch(`/api/v1/cases/${careerCase.id}/notes`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: noteText }),
      });

      if (res.ok) {
        setNoteText("");
        alert("Notița internă a fost salvată cu succes!");
        window.location.reload();
      } else {
        const err = await res.json();
        alert("Eroare la salvare: " + (err.message || "Eroare necunoscută"));
      }
    } catch {
      alert("A apărut o eroare la conexiunea cu serverul.");
    } finally {
      setIsSubmittingNote(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-[#E3DED3] pb-5 gap-4">
        <div>
          <Link
            href={backHref}
            className="text-xs font-bold uppercase tracking-wider text-[#6B746F] hover:text-[#1F2622] transition-colors"
          >
            ← Înapoi la listă
          </Link>
          <h1 className="text-2xl font-bold text-[#1F2622] tracking-tight mt-1">
            Dosar: {child.firstName} {child.lastName}
          </h1>
          <div className="flex flex-wrap items-center gap-3 mt-2">
            <span className="text-xs font-mono bg-[#E3DED3]/60 px-2 py-0.5 rounded text-[#1F2622] font-semibold">
              ID: {careerCase.publicId || careerCase.id?.slice(0, 8)}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#EDF4F0] text-[#2F6B57] border border-[#2F6B57]/20">
              {careerCase.status}
            </span>
            {child.grade && (
              <span className="text-xs text-[#6B746F] bg-white border border-[#E3DED3] px-2.5 py-0.5 rounded-full">
                {child.grade}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Button variant="outline" className="border-[#E3DED3] text-[#1F2622] hover:bg-[#F1EEE7] text-xs font-bold">
            Editează Informații
          </Button>
          <Button className="bg-[#2F6B57] text-white hover:bg-[#275B4A] text-xs font-bold flex items-center gap-1.5">
            <Plus size={14} /> Ședință Nouă
          </Button>
        </div>
      </div>

      {/* WORKSPACE TABS */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="bg-white border border-[#E3DED3] p-1.5 rounded-xl flex flex-wrap gap-1">
          <TabsTrigger value="overview" className="data-[state=active]:bg-[#EDF4F0] data-[state=active]:text-[#2F6B57] font-bold text-xs">
            Overview & Profil
          </TabsTrigger>
          <TabsTrigger value="sessions" className="data-[state=active]:bg-[#EDF4F0] data-[state=active]:text-[#2F6B57] font-bold text-xs">
            Ședințe & Notițe
          </TabsTrigger>
          <TabsTrigger value="assessments" className="data-[state=active]:bg-[#EDF4F0] data-[state=active]:text-[#2F6B57] font-bold text-xs">
            Evaluări & Teste
          </TabsTrigger>
          <TabsTrigger value="reports" className="data-[state=active]:bg-[#EDF4F0] data-[state=active]:text-[#2F6B57] font-bold text-xs">
            Rapoarte & Plan Carieră
          </TabsTrigger>
          <TabsTrigger value="recommendations" className="data-[state=active]:bg-[#EDF4F0] data-[state=active]:text-[#2F6B57] font-bold text-xs">
            Recomandări
          </TabsTrigger>
          <TabsTrigger value="timeline" className="data-[state=active]:bg-[#EDF4F0] data-[state=active]:text-[#2F6B57] font-bold text-xs">
            Istoric & Notițe Interne
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: OVERVIEW */}
        <TabsContent value="overview" className="mt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-white border-[#E3DED3] shadow-sm md:col-span-2">
              <CardHeader className="border-b border-[#E3DED3] bg-[#FFFDF8]">
                <CardTitle className="text-base font-bold text-[#1F2622] flex items-center gap-2">
                  <User size={18} className="text-[#2F6B57]" /> Date Beneficiar & Părinte
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="block text-xs font-bold text-[#6B746F] uppercase tracking-wider">Elev</span>
                    <span className="font-bold text-[#1F2622]">{child.firstName} {child.lastName}</span>
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-[#6B746F] uppercase tracking-wider">Clasă & Județ</span>
                    <span className="font-medium text-[#1F2622]">{child.grade || "Nespecificat"} ({child.county || "București"})</span>
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-[#6B746F] uppercase tracking-wider">Părinte / Tutore</span>
                    <span className="font-medium text-[#1F2622]">{parent.firstName || "N/A"} {parent.lastName || ""}</span>
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-[#6B746F] uppercase tracking-wider">Email Părinte</span>
                    <span className="font-medium text-[#1F2622]">{parent.email || "N/A"}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <QuickActions caseId={careerCase.id} />
          </div>
        </TabsContent>

        {/* TAB 2: SESSIONS */}
        <TabsContent value="sessions" className="mt-6 space-y-6">
          {!careerCase.counselingSessions || careerCase.counselingSessions.length === 0 ? (
            <Card className="bg-white border-[#E3DED3] border-dashed shadow-sm">
              <CardContent className="p-8 text-center text-[#6B746F]">
                Nicio ședință înregistrată încă pentru acest caz.
              </CardContent>
            </Card>
          ) : (
            careerCase.counselingSessions.map((session: any) => (
              <SessionCard key={session.id} session={session} />
            ))
          )}
        </TabsContent>

        {/* TAB 3: ASSESSMENTS */}
        <TabsContent value="assessments" className="mt-6 space-y-6">
          <Card className="bg-white border-[#E3DED3] shadow-sm">
            <CardHeader className="border-b border-[#E3DED3]">
              <CardTitle className="text-base font-bold text-[#1F2622]">Evaluare Inițială Psihologică</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-sm text-[#6B746F] mb-4">
                Instrucțiunile și link-ul de completare au fost generate pentru beneficiar.
              </p>
              <div className="flex items-center justify-between bg-[#F7F5F0] p-4 rounded-xl border border-[#E3DED3]">
                <div>
                  <span className="text-xs font-bold text-[#6B746F] uppercase tracking-wider block">Status Evaluare</span>
                  <span className="text-sm font-bold text-[#2F6B57]">În așteptare completare elev</span>
                </div>
                <Button className="bg-[#1F2622] text-white text-xs font-bold hover:bg-[#2A332E]">
                  Verifică Rezultat Extensiv
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 4: REPORTS */}
        <TabsContent value="reports" className="mt-6 space-y-6">
          <Card className="bg-white border-[#E3DED3] shadow-sm">
            <CardHeader className="border-b border-[#E3DED3] flex flex-row items-center justify-between">
              <CardTitle className="text-base font-bold text-[#1F2622]">Rapoarte & Plan de Carieră</CardTitle>
              <Button className="bg-[#2F6B57] text-white text-xs font-bold hover:bg-[#275B4A]">
                Creează Raport Nou
              </Button>
            </CardHeader>
            <CardContent className="p-6 text-sm text-[#6B746F]">
              Fără rapoarte publicate. Creați un raport din șablonul aprobat.
            </CardContent>
          </Card>
        </TabsContent>

        {/* TAB 5: RECOMMENDATIONS */}
        <TabsContent value="recommendations" className="mt-6 space-y-6">
          <NewRecommendationForm caseId={careerCase.id} products={catalogProducts} />
        </TabsContent>

        {/* TAB 6: TIMELINE & INTERNAL NOTES */}
        <TabsContent value="timeline" className="mt-6 space-y-6">
          <Card className="bg-white border-[#E3DED3] shadow-sm">
            <CardHeader className="border-b border-[#E3DED3]">
              <CardTitle className="text-base font-bold text-[#1F2622] flex items-center gap-2">
                <MessageSquare size={18} className="text-[#2F6B57]" /> Notițe Interne Staff (Confidențial)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <form onSubmit={handleAddInternalNote} className="space-y-3">
                <textarea
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Scrie o notiță internă accesibilă doar specialiștilor..."
                  className="w-full min-h-[90px] p-3 text-sm border border-[#E3DED3] rounded-xl focus:ring-2 focus:ring-[#2F6B57] outline-none"
                />
                <div className="flex justify-end">
                  <Button
                    type="submit"
                    disabled={isSubmittingNote}
                    className="bg-[#1F2622] text-white hover:bg-[#2A332E] text-xs font-bold flex items-center gap-1.5"
                  >
                    <Send size={14} /> {isSubmittingNote ? "Se salvează..." : "Adaugă Notiță"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
