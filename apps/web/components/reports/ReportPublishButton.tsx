"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@edumind/ui";

export function ReportPublishButton({ reportId }: { reportId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handlePublish = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/actions/reports/${reportId}/publish`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        router.refresh();
      } else {
        alert("Eroare la publicarea raportului.");
      }
    } catch {
      alert("Eroare de conexiune.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      onClick={handlePublish}
      disabled={loading}
      className="bg-[#2F6B57] text-white hover:bg-[#275B4A] w-full sm:w-auto"
    >
      {loading ? "Se publică..." : "Publică la Părinte"}
    </Button>
  );
}
