"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  assessmentId: string;
  caseId: string;
}

export function AssessmentCompleteButton({ assessmentId, caseId }: Props) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const router = useRouter();

  const handleComplete = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/actions/assessment-complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assessmentId, caseId }),
      });
      if (res.ok) {
        setDone(true);
        router.refresh();
      } else {
        alert("A apărut o eroare. Încearcă din nou.");
      }
    } catch {
      alert("Eroare de conexiune.");
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="text-sm text-center text-[#2F7A55] border border-[#2F7A55]/20 p-3 rounded bg-[#EDF4F0] w-full font-medium">
        ✓ Finalizare declarată
      </div>
    );
  }

  return (
    <button
      onClick={handleComplete}
      disabled={loading}
      className="w-full text-center px-4 py-2 border border-dashed border-[#E3DED3] text-[#6B746F] text-sm rounded-lg hover:bg-[#F1EEE7] hover:text-[#1F2622] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {loading ? "Se trimite..." : "2. Am Finalizat Testul"}
    </button>
  );
}
