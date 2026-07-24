"use client";

import { useState } from "react";
import { Button, Input, Label, Card, CardContent } from "@edumind/ui";

export function RegistrationWizard() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    parentFirstName: "",
    parentLastName: "",
    email: "",
    phone: "",
    childFirstName: "",
    childLastName: "",
    dateOfBirth: "",
    grade: "",
    city: "",
    county: "",
    declaredNeed: "",
    consentParticipation: false,
    consentDataProcessing: false,
    consentTerms: false,
  });

  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      // API call to NestJS backend
      const res = await fetch("/api/v1/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          organizationId: "org-default",
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Eroare la trimiterea aplicației");
      }

      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || "A apărut o eroare neașteptată");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <Card className="shadow-[0_1px_2px_rgba(31,38,34,0.05)] border-[#E3DED3] bg-[#FFFDF8] text-center p-8">
        <CardContent className="space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#EDF4F0] text-[#2F6B57]">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-[#1F2622] tracking-[-0.025em]">Aplicația a fost înregistrată!</h2>
          <p className="text-[#6B746F] max-w-md mx-auto">
            Vă mulțumim pentru încredere. Un specialist EduMind va analiza aplicația dumneavoastră și vă va contacta în cel mai scurt timp.
          </p>
          <div className="pt-4">
            <a href="/login">
              <Button className="bg-[#1F2622] text-white hover:bg-[#2A332E]">Mergi la Autentificare</Button>
            </a>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-[0_1px_2px_rgba(31,38,34,0.05)] border-[#E3DED3] bg-[#FFFDF8]">
      <CardContent className="p-8">
        {/* Progress Stepper */}
        <div className="flex items-center justify-between mb-8 relative">
          <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-[#E3DED3] -z-10 -translate-y-1/2" />
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                s <= step ? "bg-[#1F2622] text-white" : "bg-[#F1EEE7] text-[#6B746F] border border-[#E3DED3]"
              }`}
            >
              {s}
            </div>
          ))}
        </div>

        {error && (
          <div className="mb-6 rounded-lg bg-[#FEF2F2] border border-[#FCA5A5] p-4 text-sm text-[#B42318]">
            {error}
          </div>
        )}

        {/* Step 1: Parent Info */}
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-[#1F2622]">Date Părinte / Tutore</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="parentFirstName">Prenume</Label>
                <Input
                  id="parentFirstName"
                  value={formData.parentFirstName}
                  onChange={(e) => updateField("parentFirstName", e.target.value)}
                  placeholder="Ex: Ion"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="parentLastName">Nume de familie</Label>
                <Input
                  id="parentLastName"
                  value={formData.parentLastName}
                  onChange={(e) => updateField("parentLastName", e.target.value)}
                  placeholder="Ex: Popescu"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => updateField("email", e.target.value)}
                placeholder="ion.popescu@exemplu.ro"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Telefon</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => updateField("phone", e.target.value)}
                placeholder="07xx xxx xxx"
              />
            </div>
          </div>
        )}

        {/* Step 2: Child Info */}
        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-[#1F2622]">Date Elev</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="childFirstName">Prenume copil</Label>
                <Input
                  id="childFirstName"
                  value={formData.childFirstName}
                  onChange={(e) => updateField("childFirstName", e.target.value)}
                  placeholder="Ex: Andrei"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="childLastName">Nume copil</Label>
                <Input
                  id="childLastName"
                  value={formData.childLastName}
                  onChange={(e) => updateField("childLastName", e.target.value)}
                  placeholder="Ex: Popescu"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Data nașterii</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => updateField("dateOfBirth", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="grade">Clasă</Label>
                <Input
                  id="grade"
                  value={formData.grade}
                  onChange={(e) => updateField("grade", e.target.value)}
                  placeholder="Ex: Clasa a X-a"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">Localitate</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => updateField("city", e.target.value)}
                  placeholder="Ex: București"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="county">Județ</Label>
                <Input
                  id="county"
                  value={formData.county}
                  onChange={(e) => updateField("county", e.target.value)}
                  placeholder="Ex: Ilfov"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="declaredNeed">Nevoie declarată (Opțional)</Label>
              <Input
                id="declaredNeed"
                value={formData.declaredNeed}
                onChange={(e) => updateField("declaredNeed", e.target.value)}
                placeholder="Ce vă doriți de la acest program de consiliere?"
              />
            </div>
          </div>
        )}

        {/* Step 3: Consents */}
        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-[#1F2622]">Acorduri și Declarații</h2>
            <div className="space-y-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.consentParticipation}
                  onChange={(e) => updateField("consentParticipation", e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-[#E3DED3] accent-[#2F6B57]"
                />
                <span className="text-sm text-[#1F2622]">
                  Mă angajez să particip activ în procesul de consiliere educațională al copilului meu.
                </span>
              </label>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.consentDataProcessing}
                  onChange={(e) => updateField("consentDataProcessing", e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-[#E3DED3] accent-[#2F6B57]"
                />
                <span className="text-sm text-[#1F2622]">
                  Sunt de acord cu prelucrarea datelor cu caracter personal conform politicii GDPR.
                </span>
              </label>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.consentTerms}
                  onChange={(e) => updateField("consentTerms", e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-[#E3DED3] accent-[#2F6B57]"
                />
                <span className="text-sm text-[#1F2622]">
                  Accept termenii și condițiile de utilizare a platformei EduMind.
                </span>
              </label>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between mt-10 pt-6 border-t border-[#E3DED3]">
          <Button
            variant="outline"
            onClick={() => setStep((s) => Math.max(s - 1, 1))}
            disabled={step === 1 || loading}
            className="text-[#6B746F] border-[#E3DED3]"
          >
            Înapoi
          </Button>

          {step < 3 ? (
            <Button
              onClick={() => setStep((s) => Math.min(s + 1, 3))}
              className="bg-[#1F2622] text-white hover:bg-[#2A332E]"
            >
              Continuă
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={loading || !formData.consentTerms || !formData.consentDataProcessing}
              className="bg-[#2F6B57] text-white hover:bg-[#275B4A]"
            >
              {loading ? "Se procesează..." : "Trimite Aplicația"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

