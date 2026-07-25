"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, CardContent, CardHeader, CardTitle, Textarea } from "@edumind/ui";

interface SessionContent {
  internalNotes?: string;
  parentSummary?: string;
  homework?: string;
}

interface Session {
  id: string;
  status: string;
  createdAt: string;
  appointment?: { type?: { title?: string } };
  content?: SessionContent;
}

export function SessionCard({ session }: { session: Session }) {
  const router = useRouter();
  const [internalNotes, setInternalNotes] = useState(session.content?.internalNotes || "");
  const [parentSummary, setParentSummary] = useState(session.content?.parentSummary || "");
  const [homework, setHomework] = useState(session.content?.homework || "");
  const [loading, setLoading] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const isCompleted = session.status === "COMPLETED";

  const handleSaveNotes = async () => {
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/actions/sessions/${session.id}/content`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ internalNotes, parentSummary, homework }),
      });
      if (res.ok) {
        setMessage({ type: "success", text: "Notițele au fost salvate." });
        router.refresh();
      } else {
        const data = await res.json();
        setMessage({ type: "error", text: data.error || "Eroare la salvare." });
      }
    } catch {
      setMessage({ type: "error", text: "Eroare de conexiune." });
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async () => {
    setCompleting(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/actions/sessions/${session.id}/complete`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        setMessage({ type: "success", text: "Sesiunea a fost marcată ca finalizată." });
        router.refresh();
      } else {
        const data = await res.json();
        setMessage({ type: "error", text: data.error || "Nu s-a putut finaliza sesiunea." });
      }
    } catch {
      setMessage({ type: "error", text: "Eroare de conexiune." });
    } finally {
      setCompleting(false);
    }
  };

  return (
    <Card className="bg-[#FFFDF8] border-[#E3DED3] shadow-[0_1px_2px_rgba(31,38,34,0.05)] overflow-hidden">
      <CardHeader className="border-b border-[#E3DED3] bg-[#F7F5F0] flex flex-row items-center justify-between pb-4 pt-5">
        <div>
          <CardTitle className="text-lg text-[#1F2622]">
            {session.appointment?.type?.title || "Sesiune de Consiliere"}
          </CardTitle>
          <div className="flex items-center gap-2 mt-1">
            <span
              className={`px-2 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${
                isCompleted ? "bg-[#EDF4F0] text-[#2F7A55]" : "bg-[#FEF3C7] text-[#B7791F]"
              }`}
            >
              {session.status}
            </span>
            <p className="text-sm text-[#6B746F]">
              {new Date(session.createdAt).toLocaleDateString("ro-RO")}
            </p>
          </div>
        </div>
        {!isCompleted && (
          <Button
            onClick={handleComplete}
            disabled={completing}
            variant="outline"
            size="sm"
            className="border-[#2F6B57] text-[#2F6B57] hover:bg-[#EDF4F0]"
          >
            {completing ? "..." : "Marchează Complet"}
          </Button>
        )}
      </CardHeader>

      <CardContent className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {message && (
          <div
            className={`col-span-full px-4 py-3 rounded-lg text-sm font-medium border ${
              message.type === "success"
                ? "bg-[#EDF4F0] text-[#2F7A55] border-[#DCE8E1]"
                : "bg-[#FEF2F2] text-[#B4453A] border-[#FECACA]"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* Internal Notes - STRICTLY CONFIDENTIAL */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <h4 className="font-semibold text-[#B4453A]">Notițe Interne (Confidențial)</h4>
            <span className="bg-[#FEF2F2] border border-[#FECACA] text-[#B4453A] text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider">
              Staff Only
            </span>
          </div>
          <Textarea
            placeholder="Notițe personale pentru continuitatea cazului..."
            className="min-h-[160px] bg-white border-[#FECACA] focus-visible:ring-[#B4453A]/20"
            value={internalNotes}
            onChange={(e) => setInternalNotes(e.target.value)}
          />
          <p className="text-xs text-[#6B746F]">
            Aceste notițe nu vor fi vizibile niciodată în portalul părintelui.
          </p>
        </div>

        {/* Parent Summary - VISIBLE TO PARENT */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 mb-2">
            <h4 className="font-semibold text-[#1F2622]">Rezumat pentru Părinte</h4>
            <span className="bg-[#EDF4F0] border border-[#2F6B57]/20 text-[#2F6B57] text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider">
              Public
            </span>
          </div>
          <Textarea
            placeholder="Ce concluzii îi transmiți părintelui?"
            className="min-h-[160px] bg-white border-[#2F6B57]/30 focus-visible:ring-[#2F6B57]/20"
            value={parentSummary}
            onChange={(e) => setParentSummary(e.target.value)}
          />
          <p className="text-xs text-[#6B746F]">
            Textul completat aici va apărea în aplicația părintelui.
          </p>
        </div>

        {/* Homework */}
        <div className="space-y-3 lg:col-span-2">
          <h4 className="font-semibold text-[#1F2622]">Acțiuni & Teme (Homework)</h4>
          <Textarea
            placeholder="Ex: De completat testul de personalitate..."
            className="bg-white min-h-[100px] border-[#E3DED3]"
            value={homework}
            onChange={(e) => setHomework(e.target.value)}
          />
        </div>
      </CardContent>

      <div className="bg-[#F7F5F0] p-4 border-t border-[#E3DED3] flex justify-end gap-3">
        <Button
          onClick={() => {
            setInternalNotes(session.content?.internalNotes || "");
            setParentSummary(session.content?.parentSummary || "");
            setHomework(session.content?.homework || "");
            setMessage(null);
          }}
          variant="outline"
          className="border-[#E3DED3] text-[#1F2622] hover:bg-[#FFFDF8]"
        >
          Renunță
        </Button>
        <Button
          onClick={handleSaveNotes}
          disabled={loading}
          className="bg-[#2F6B57] text-white hover:bg-[#275B4A]"
        >
          {loading ? "Se salvează..." : "Salvează Notițele"}
        </Button>
      </div>
    </Card>
  );
}
