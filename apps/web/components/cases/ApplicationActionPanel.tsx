"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  applicationId: string;
  specialists: { id: string; name: string }[];
  journeyTemplates: { id: string; name: string }[];
  departmentId: string;
}

export function ApplicationActionPanel({ applicationId, specialists, journeyTemplates, departmentId }: Props) {
  const router = useRouter();
  const [step, setStep] = useState<"idle" | "convert" | "reject">("idle");
  const [selectedSpecialist, setSelectedSpecialist] = useState(specialists[0]?.id || "");
  const [selectedTemplate, setSelectedTemplate] = useState(journeyTemplates[0]?.id || "");
  const [internalNote, setInternalNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleReview = async (status: string, note?: string) => {
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/actions/review-application", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationId, status, internalNote: note }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({ type: "success", text: `Status actualizat: ${status}` });
        router.refresh();
      } else {
        setMessage({ type: "error", text: data.error || "A apărut o eroare." });
      }
    } catch {
      setMessage({ type: "error", text: "Eroare de conexiune." });
    } finally {
      setLoading(false);
    }
  };

  const handleConvert = async () => {
    if (!selectedSpecialist || !selectedTemplate) {
      setMessage({ type: "error", text: "Selectează un specialist și un workflow." });
      return;
    }
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/actions/convert-application", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicationId,
          specialistId: selectedSpecialist,
          journeyTemplateId: selectedTemplate,
          departmentId,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({ type: "success", text: "Caz creat cu succes! Redirecționare..." });
        setTimeout(() => router.push(`/cases/${data.id}`), 1500);
      } else {
        setMessage({ type: "error", text: data.error || "Conversia a eșuat." });
      }
    } catch {
      setMessage({ type: "error", text: "Eroare de conexiune." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {message && (
        <div
          className={`px-4 py-3 rounded-lg text-sm font-medium border ${
            message.type === "success"
              ? "bg-[#EDF4F0] text-[#2F7A55] border-[#DCE8E1]"
              : "bg-[#FEF2F2] text-[#B4453A] border-[#FECACA]"
          }`}
        >
          {message.text}
        </div>
      )}

      {step === "idle" && (
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => handleReview("UNDER_REVIEW")}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium rounded-lg border border-[#E3DED3] text-[#1F2622] hover:bg-[#F1EEE7] transition-colors disabled:opacity-50"
          >
            Marchează În Evaluare
          </button>
          <button
            onClick={() => setStep("convert")}
            disabled={loading}
            className="px-4 py-2 text-sm font-semibold rounded-lg bg-[#2F6B57] text-white hover:bg-[#275B4A] transition-colors disabled:opacity-50"
          >
            Aprobă & Deschide Caz
          </button>
          <button
            onClick={() => setStep("reject")}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium rounded-lg border border-[#FECACA] text-[#B4453A] hover:bg-[#FEF2F2] transition-colors disabled:opacity-50"
          >
            Respinge
          </button>
        </div>
      )}

      {step === "convert" && (
        <div className="bg-[#F7F5F0] border border-[#E3DED3] rounded-xl p-6 space-y-4">
          <h3 className="font-semibold text-[#1F2622]">Configurare Caz Nou</h3>

          <div className="space-y-2">
            <label className="text-sm font-medium text-[#1F2622]">Specialist Asignat</label>
            {specialists.length === 0 ? (
              <p className="text-sm text-[#B4453A]">Nu există specialiști disponibili în sistem.</p>
            ) : (
              <select
                value={selectedSpecialist}
                onChange={(e) => setSelectedSpecialist(e.target.value)}
                className="w-full rounded-lg border border-[#E3DED3] bg-white px-3 py-2 text-sm text-[#1F2622] focus:outline-none focus:ring-2 focus:ring-[#2F6B57]"
              >
                {specialists.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-[#1F2622]">Workflow / Journey</label>
            {journeyTemplates.length === 0 ? (
              <p className="text-sm text-[#B4453A]">Nu există workflow-uri publicate. Creați mai întâi un Journey Template.</p>
            ) : (
              <select
                value={selectedTemplate}
                onChange={(e) => setSelectedTemplate(e.target.value)}
                className="w-full rounded-lg border border-[#E3DED3] bg-white px-3 py-2 text-sm text-[#1F2622] focus:outline-none focus:ring-2 focus:ring-[#2F6B57]"
              >
                {journeyTemplates.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            )}
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={() => setStep("idle")}
              disabled={loading}
              className="px-4 py-2 text-sm rounded-lg border border-[#E3DED3] text-[#6B746F] hover:bg-white transition-colors"
            >
              Anulează
            </button>
            <button
              onClick={handleConvert}
              disabled={loading || specialists.length === 0 || journeyTemplates.length === 0}
              className="px-4 py-2 text-sm font-semibold rounded-lg bg-[#2F6B57] text-white hover:bg-[#275B4A] transition-colors disabled:opacity-50"
            >
              {loading ? "Se creează cazul..." : "Confirmă & Deschide Caz"}
            </button>
          </div>
        </div>
      )}

      {step === "reject" && (
        <div className="bg-[#FEF2F2] border border-[#FECACA] rounded-xl p-6 space-y-4">
          <h3 className="font-semibold text-[#B4453A]">Respingere Aplicație</h3>
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#1F2622]">Notă internă (motiv)</label>
            <textarea
              value={internalNote}
              onChange={(e) => setInternalNote(e.target.value)}
              placeholder="Motivul respingerii..."
              className="w-full rounded-lg border border-[#FECACA] bg-white px-3 py-2 text-sm text-[#1F2622] min-h-[80px] focus:outline-none focus:ring-2 focus:ring-[#B4453A]"
            />
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setStep("idle")}
              disabled={loading}
              className="px-4 py-2 text-sm rounded-lg border border-[#E3DED3] text-[#6B746F] hover:bg-white transition-colors"
            >
              Anulează
            </button>
            <button
              onClick={() => handleReview("REJECTED", internalNote)}
              disabled={loading}
              className="px-4 py-2 text-sm font-semibold rounded-lg bg-[#B4453A] text-white hover:bg-[#9B3A30] transition-colors disabled:opacity-50"
            >
              {loading ? "Se procesează..." : "Confirmă Respingerea"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
