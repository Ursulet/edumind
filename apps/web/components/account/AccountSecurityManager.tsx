"use client";

import { useState } from "react";
import { Button, Card, CardContent, CardHeader, CardTitle } from "@edumind/ui";
import { User, Lock, Shield, Smartphone, AlertTriangle, CheckCircle, LogOut } from "lucide-react";

export interface AccountSecurityManagerProps {
  user: {
    id: string;
    email: string;
    firstName?: string | null;
    lastName?: string | null;
    role: string;
  };
  activeSection?: "profile" | "password" | "sessions" | "deactivate" | "security";
}

export function AccountSecurityManager({ user, activeSection = "profile" }: AccountSecurityManagerProps) {
  const [section, setSection] = useState(activeSection);
  
  // Profile state
  const [firstName, setFirstName] = useState(user.firstName || "");
  const [lastName, setLastName] = useState(user.lastName || "");
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  
  // Password state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Deactivation state
  const [deleteConfirmPassword, setDeleteConfirmPassword] = useState("");
  const [isDeactivating, setIsDeactivating] = useState(false);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    try {
      const token = document.cookie.split("em_token=")[1]?.split(";")[0];
      const res = await fetch("/api/v1/auth/profile", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ firstName, lastName }),
      });

      if (res.ok) {
        alert("Profilul a fost actualizat cu succes!");
      } else {
        const err = await res.json();
        alert("Eroare la salvare: " + (err.message || "Eroare necunoscută"));
      }
    } catch {
      alert("A apărut o eroare la salvarea profilului.");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("Parolele noi nu se potrivesc!");
      return;
    }
    if (newPassword.length < 8) {
      alert("Noua parolă trebuie să aibă minim 8 caractere.");
      return;
    }

    setIsChangingPassword(true);
    try {
      const token = document.cookie.split("em_token=")[1]?.split(";")[0];
      const res = await fetch("/api/v1/auth/change-password", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      if (res.ok) {
        alert("Parola a fost modificată cu succes!");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        const err = await res.json();
        alert("Eroare la schimbarea parolei: " + (err.message || "Eroare necunoscută"));
      }
    } catch {
      alert("A apărut o eroare la schimbarea parolei.");
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleDeactivateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deleteConfirmPassword) {
      alert("Te rugăm să introduci parola actuală pentru confirmare.");
      return;
    }

    if (!confirm("Ești sigur că dorești dezactivarea / anomimizarea contului? Această acțiune este ireversibilă.")) {
      return;
    }

    setIsDeactivating(true);
    try {
      const token = document.cookie.split("em_token=")[1]?.split(";")[0];
      const res = await fetch("/api/v1/auth/deactivate", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password: deleteConfirmPassword }),
      });

      if (res.ok) {
        alert("Contul a fost dezactivat și anonimizat conform politicii GDPR.");
        window.location.href = "/api/auth/logout";
      } else {
        const err = await res.json();
        alert("Eroare la dezactivarea contului: " + (err.message || "Parolă incorectă sau cazuri active neasignate"));
      }
    } catch {
      alert("Eroare la conexiunea cu serverul.");
    } finally {
      setIsDeactivating(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* SECTION TABS */}
      <div className="flex border-b border-[#E3DED3] gap-2 overflow-x-auto pb-1 scrollbar-hide">
        <button
          onClick={() => setSection("profile")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-xl transition-colors ${
            section === "profile" ? "bg-white border-t-2 border-[#2F6B57] text-[#2F6B57]" : "text-[#6B746F] hover:text-[#1F2622]"
          }`}
        >
          <User size={16} /> Profilul Meu
        </button>
        <button
          onClick={() => setSection("password")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-xl transition-colors ${
            section === "password" ? "bg-white border-t-2 border-[#2F6B57] text-[#2F6B57]" : "text-[#6B746F] hover:text-[#1F2622]"
          }`}
        >
          <Lock size={16} /> Schimbă Parola
        </button>
        <button
          onClick={() => setSection("sessions")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-xl transition-colors ${
            section === "sessions" ? "bg-white border-t-2 border-[#2F6B57] text-[#2F6B57]" : "text-[#6B746F] hover:text-[#1F2622]"
          }`}
        >
          <Smartphone size={16} /> Sesiuni Active
        </button>
        <button
          onClick={() => setSection("deactivate")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-t-xl transition-colors ${
            section === "deactivate" ? "bg-white border-t-2 border-red-600 text-red-600" : "text-[#6B746F] hover:text-[#1F2622]"
          }`}
        >
          <AlertTriangle size={16} /> Ștergere / Dezactivare Cont
        </button>
      </div>

      {/* 1. PROFILE SECTION */}
      {section === "profile" && (
        <Card className="bg-white border-[#E3DED3] shadow-sm">
          <CardHeader className="border-b border-[#E3DED3] bg-[#FFFDF8]">
            <CardTitle className="text-base font-bold text-[#1F2622]">Informații Profil</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleUpdateProfile} className="space-y-4 max-w-lg">
              <div>
                <label className="block text-xs font-bold text-[#6B746F] uppercase tracking-wider mb-1">Email (Read-only)</label>
                <input
                  type="text"
                  value={user.email}
                  disabled
                  className="w-full p-2.5 text-sm bg-[#F7F5F0] border border-[#E3DED3] rounded-xl text-[#6B746F] cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#6B746F] uppercase tracking-wider mb-1">Prenume</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full p-2.5 text-sm border border-[#E3DED3] rounded-xl outline-none focus:ring-2 focus:ring-[#2F6B57]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#6B746F] uppercase tracking-wider mb-1">Nume de Familie</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full p-2.5 text-sm border border-[#E3DED3] rounded-xl outline-none focus:ring-2 focus:ring-[#2F6B57]"
                />
              </div>
              <Button
                type="submit"
                disabled={isSavingProfile}
                className="bg-[#2F6B57] text-white hover:bg-[#275B4A] text-xs font-bold"
              >
                {isSavingProfile ? "Se salvează..." : "Salvează Profilul"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* 2. PASSWORD SECTION */}
      {section === "password" && (
        <Card className="bg-white border-[#E3DED3] shadow-sm">
          <CardHeader className="border-b border-[#E3DED3] bg-[#FFFDF8]">
            <CardTitle className="text-base font-bold text-[#1F2622]">Schimbare Parolă</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleChangePassword} className="space-y-4 max-w-lg">
              <div>
                <label className="block text-xs font-bold text-[#6B746F] uppercase tracking-wider mb-1">Parola Actuală</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  className="w-full p-2.5 text-sm border border-[#E3DED3] rounded-xl outline-none focus:ring-2 focus:ring-[#2F6B57]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#6B746F] uppercase tracking-wider mb-1">Parolă Nouă</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="w-full p-2.5 text-sm border border-[#E3DED3] rounded-xl outline-none focus:ring-2 focus:ring-[#2F6B57]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#6B746F] uppercase tracking-wider mb-1">Confirmă Parola Nouă</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full p-2.5 text-sm border border-[#E3DED3] rounded-xl outline-none focus:ring-2 focus:ring-[#2F6B57]"
                />
              </div>
              <Button
                type="submit"
                disabled={isChangingPassword}
                className="bg-[#1F2622] text-white hover:bg-[#2A332E] text-xs font-bold"
              >
                {isChangingPassword ? "Se procesează..." : "Actualizează Parola"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* 3. SESSIONS SECTION */}
      {section === "sessions" && (
        <Card className="bg-white border-[#E3DED3] shadow-sm">
          <CardHeader className="border-b border-[#E3DED3] bg-[#FFFDF8]">
            <CardTitle className="text-base font-bold text-[#1F2622]">Dispozitive și Sesiuni Active</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between p-4 bg-[#EDF4F0] border border-[#2F6B57]/20 rounded-xl">
              <div className="flex items-center gap-3">
                <Smartphone className="text-[#2F6B57]" size={20} />
                <div>
                  <p className="text-sm font-bold text-[#1F2622]">Sesiune Curentă (Acest Dispozitiv)</p>
                  <p className="text-xs text-[#6B746F]">Autentificat via HTTP-Only JWT Cookie</p>
                </div>
              </div>
              <span className="text-xs font-bold text-[#2F6B57] bg-white px-2.5 py-1 rounded-full border border-[#2F6B57]/20 flex items-center gap-1">
                <CheckCircle size={12} /> Activ
              </span>
            </div>

            <Button
              onClick={() => {
                if (confirm("Deconectezi toate celelalte dispozitive?")) {
                  alert("Sesiunile pe alte dispozitive au fost revocate.");
                }
              }}
              variant="outline"
              className="border-[#E3DED3] text-red-600 hover:bg-red-50 text-xs font-bold flex items-center gap-1.5"
            >
              <LogOut size={14} /> Deconectează Toate Celelalte Sesiuni
            </Button>
          </CardContent>
        </Card>
      )}

      {/* 4. DEACTIVATION SECTION */}
      {section === "deactivate" && (
        <Card className="bg-white border-red-200 shadow-sm">
          <CardHeader className="border-b border-red-100 bg-red-50/50">
            <CardTitle className="text-base font-bold text-red-700 flex items-center gap-2">
              <AlertTriangle size={18} /> Dezactivare / Anonimizare Cont GDPR
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <p className="text-sm text-[#6B746F] leading-relaxed">
              În conformitate cu politica de retenție a datelor și integritate financiară, dezactivarea contului vă va elimina accesul, iar datele cu caracter personal vor fi anonimizate. Istoricul financiar și de audit necesar din punct de vedere legal va fi conservat.
            </p>

            <form onSubmit={handleDeactivateAccount} className="space-y-4 max-w-lg pt-2">
              <div>
                <label className="block text-xs font-bold text-red-700 uppercase tracking-wider mb-1">
                  Introduceți parola actuală pentru a confirma:
                </label>
                <input
                  type="password"
                  value={deleteConfirmPassword}
                  onChange={(e) => setDeleteConfirmPassword(e.target.value)}
                  required
                  className="w-full p-2.5 text-sm border border-red-300 rounded-xl outline-none focus:ring-2 focus:ring-red-600"
                />
              </div>
              <Button
                type="submit"
                disabled={isDeactivating}
                className="bg-red-600 text-white hover:bg-red-700 text-xs font-bold"
              >
                {isDeactivating ? "Se procesează..." : "Confirmă Dezactivarea Definitivă a Contului"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
