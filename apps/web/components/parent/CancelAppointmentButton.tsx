"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function CancelAppointmentButton({ appointmentId }: { appointmentId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleCancel = async () => {
    if (!confirm("Ești sigur că vrei să anulezi programarea?")) return;
    
    setLoading(true);
    try {
      const res = await fetch(`/api/actions/appointments/${appointmentId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        router.refresh();
      } else {
        alert("Eroare la anularea programării.");
      }
    } catch {
      alert("Eroare de conexiune.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleCancel}
      disabled={loading}
      className="text-sm font-medium text-[#B4453A] hover:text-[#9B3A30] transition-colors disabled:opacity-50"
    >
      {loading ? "Se anulează..." : "Anulează Programarea"}
    </button>
  );
}
