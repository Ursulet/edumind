"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@edumind/ui";

interface Props {
  caseId: string;
  products: any[];
}

export function NewRecommendationForm({ caseId, products }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(products[0]?.id || "");
  const [reason, setReason] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct || !reason) return;
    
    setLoading(true);
    try {
      const res = await fetch(`/api/actions/recommendations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caseId, productId: selectedProduct, reason }),
      });
      if (res.ok) {
        setReason("");
        router.refresh();
      } else {
        alert("Eroare la adăugarea recomandării.");
      }
    } catch {
      alert("Eroare de conexiune.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="font-semibold text-[#1F2622] text-sm">Adaugă Recomandare Nouă</h3>
      
      <div className="space-y-2">
        <label className="text-xs font-medium text-[#1F2622]">Produs / Serviciu</label>
        {products.length === 0 ? (
          <p className="text-xs text-[#B4453A]">Nu există produse în catalog.</p>
        ) : (
          <select
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
            className="w-full rounded border border-[#E3DED3] bg-white px-3 py-2 text-sm text-[#1F2622] focus:outline-none focus:ring-1 focus:ring-[#2F6B57]"
          >
            {products.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-xs font-medium text-[#1F2622]">Motivație (De ce recomandăm?)</label>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Explică părintelui de ce este necesar acest pas..."
          className="w-full rounded border border-[#E3DED3] bg-white px-3 py-2 text-sm text-[#1F2622] min-h-[80px] focus:outline-none focus:ring-1 focus:ring-[#2F6B57]"
          required
        />
      </div>

      <Button
        type="submit"
        disabled={loading || products.length === 0 || !reason}
        className="w-full bg-[#2F6B57] text-white hover:bg-[#275B4A]"
      >
        {loading ? "Se salvează..." : "Trimite Recomandare"}
      </Button>
    </form>
  );
}
