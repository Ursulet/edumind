"use client";

import { useState } from "react";
import { Button, Card, CardHeader, CardTitle, CardContent } from "@edumind/ui";

export function QuickActions({ caseId }: { caseId: string }) {
  const [loading, setLoading] = useState(false);

  const sendTestLink = async () => {
    setLoading(true);
    try {
      const token = document.cookie.split("em_token=")[1]?.split(";")[0];
      const res = await fetch(`/api/v1/cases/${caseId}/assessments/send-link`, {
        method: "POST",
        headers: { 
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      
      if (res.ok) {
        alert("Link-ul către testul de evaluare a fost trimis cu succes către părinte!");
      } else {
        const err = await res.json();
        alert("Eroare la trimiterea link-ului: " + err.message);
      }
    } catch (e) {
      console.error(e);
      alert("A apărut o eroare de conexiune.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-[#FFFDF8] border-[#E3DED3]">
      <CardHeader>
        <CardTitle>Acțiuni Rapide</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={sendTestLink} 
          disabled={loading}
          className="w-full bg-[#1F2622] text-white hover:bg-[#2A332E]"
        >
          {loading ? "Se trimite..." : "Trimite Test Evaluare (Link)"}
        </Button>
        <p className="text-xs text-[#6B746F] text-center">
          Părintele va primi un email cu link-ul securizat pentru completarea evaluării.
        </p>
      </CardContent>
    </Card>
  );
}
