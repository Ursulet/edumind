"use client";

import { useState, useEffect } from "react";
import { Button, Card, CardContent, Input, Label, Badge } from "@edumind/ui";

export default function AdminCmsPage() {
  const [pages, setPages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Create Page form
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newPage, setNewPage] = useState({ title: "", slug: "" });

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      const res = await fetch("/api/v1/cms/pages");
      if (res.ok) {
        const data = await res.json();
        setPages(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePage = async () => {
    if (!newPage.title || !newPage.slug) {
      alert("Completati titlul si slug-ul!");
      return;
    }
    try {
      const res = await fetch(`/api/v1/cms/pages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newPage)
      });
      
      if (res.ok) {
        setNewPage({ title: "", slug: "" });
        setShowCreateModal(false);
        fetchPages();
        alert("Pagina a fost creată cu succes (Draft)!");
      } else {
        const err = await res.json();
        alert("Eroare: " + err.message);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handlePublish = async (pageId: string) => {
    try {
      const res = await fetch(`/api/v1/cms/pages/${pageId}/publish`, {
        method: "PATCH"
      });
      if (res.ok) {
        fetchPages();
      } else {
        alert("Eroare la publicare.");
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-[#E3DED3] pb-4">
        <div>
          <h1 className="text-2xl font-semibold text-[#1F2622]">Content Management System</h1>
          <p className="text-sm text-[#6B746F]">Gestionează paginile și conținutul platformei (Termeni, Confidențialitate, Landing).</p>
        </div>
        <Button 
          className="bg-[#1F2622] text-white hover:bg-[#2A332E]"
          onClick={() => setShowCreateModal(true)}
        >
          Crează Pagină Nouă
        </Button>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="bg-[#FFFDF8] w-full max-w-md">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-lg font-bold">Creează Pagină CMS</h2>
              <div className="space-y-3">
                <div className="space-y-1">
                  <Label className="text-xs text-[#6B746F]">Titlu Pagină</Label>
                  <Input 
                    placeholder="Ex: Termeni și Condiții" 
                    value={newPage.title} 
                    onChange={(e) => {
                      const title = e.target.value;
                      setNewPage({
                        title, 
                        slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
                      })
                    }} 
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-[#6B746F]">Slug URL</Label>
                  <Input 
                    placeholder="ex: termeni-si-conditii" 
                    value={newPage.slug} 
                    onChange={(e) => setNewPage({...newPage, slug: e.target.value})} 
                  />
                  <p className="text-[10px] text-[#6B746F]">URL-ul public va fi: /cms/{newPage.slug || '...'}</p>
                </div>
              </div>
              <div className="pt-4 flex gap-2">
                <Button className="flex-1 bg-[#1F2622] text-white hover:bg-[#2A332E]" onClick={handleCreatePage}>Salvează Draft</Button>
                <Button variant="outline" onClick={() => setShowCreateModal(false)}>Anulează</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {loading ? (
        <p className="text-sm text-[#6B746F]">Se încarcă paginile...</p>
      ) : (
        <Card className="bg-[#FFFDF8] border-[#E3DED3] shadow-sm overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-[#F7F5F0] text-[#6B746F]">
              <tr>
                <th className="px-4 py-3 font-semibold">Titlu / Slug</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Ultima Modificare</th>
                <th className="px-4 py-3 font-semibold">Acțiuni</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E3DED3]">
              {pages.map(p => (
                <tr key={p.id} className="hover:bg-[#F7F5F0]">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-[#1F2622]">{p.title}</p>
                    <p className="text-xs text-[#6B746F]">/{p.slug}</p>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="outline" className={p.status === "PUBLISHED" ? "text-[#2F6B57] bg-[#EDF4F0]" : "text-[#B4453A] bg-[#FEF2F2]"}>
                      {p.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-xs text-[#6B746F]">
                    {new Date(p.updatedAt).toLocaleDateString("ro-RO")}
                  </td>
                  <td className="px-4 py-3 space-x-2">
                    {p.status !== "PUBLISHED" && (
                      <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => handlePublish(p.id)}>
                        Publică
                      </Button>
                    )}
                    <Button variant="ghost" size="sm" className="h-7 text-xs text-[#2F6B57]">
                      Editează
                    </Button>
                  </td>
                </tr>
              ))}
              {pages.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-[#6B746F]">
                    Nu există pagini CMS. Creați una nouă!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}
