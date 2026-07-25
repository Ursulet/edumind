"use client";

import { Suspense, useState, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || null;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function getRedirectForRole(role: string): string {
    switch (role) {
      case "PLATFORM_OWNER":
      case "SUPER_ADMIN":
        return "/admin";
      case "DEPARTMENT_ADMIN":
        return "/director";
      case "SPECIALIST":
        return "/specialist";
      case "PARENT":
      default:
        return "/dashboard";
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Email sau parolă incorecte.");
        return;
      }

      // Redirect based on role (or to the originally requested page)
      const destination = from || getRedirectForRole(data.user?.role || "PARENT");
      router.push(destination);
      router.refresh();
    } catch {
      setError("Eroare de conexiune. Verifică conexiunea la internet.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F7F5F0] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1F2622] flex items-center justify-center text-white font-bold text-sm">
              EM
            </div>
            <span className="font-semibold text-xl text-[#1F2622] tracking-tight">
              EduMind
            </span>
          </Link>
        </div>

        {/* Card */}
        <div className="bg-[#FFFDF8] border border-[#E3DED3] rounded-2xl shadow-[0_1px_2px_rgba(31,38,34,0.05)] overflow-hidden">
          <div className="px-8 pt-8 pb-6 border-b border-[#E3DED3]">
            <h1 className="text-2xl font-semibold text-[#1F2622] tracking-[-0.025em]">
              Bine ai revenit
            </h1>
            <p className="text-sm text-[#6B746F] mt-1">
              Introdu datele pentru a accesa contul tău
            </p>
          </div>

          <form onSubmit={handleSubmit} className="px-8 py-6 space-y-5">
            {/* Error Message */}
            {error && (
              <div className="rounded-lg bg-[#FEF2F2] border border-[#FECACA] px-4 py-3 text-sm text-[#B4453A]">
                {error}
              </div>
            )}

            {/* Email */}
            <div className="space-y-1.5">
              <label
                htmlFor="email"
                className="text-sm font-medium text-[#1F2622]"
              >
                Adresă email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nume@email.com"
                className="w-full rounded-lg border border-[#E3DED3] bg-[#F7F5F0] px-4 py-2.5 text-sm text-[#1F2622] placeholder:text-[#6B746F] focus:outline-none focus:ring-2 focus:ring-[#2F6B57] focus:border-transparent transition-all"
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-[#1F2622]"
                >
                  Parolă
                </label>
                <Link
                  href="/resetare-parola"
                  className="text-xs font-medium text-[#2F6B57] hover:text-[#275B4A] transition-colors"
                >
                  Ai uitat parola?
                </Link>
              </div>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border border-[#E3DED3] bg-[#F7F5F0] px-4 py-2.5 text-sm text-[#1F2622] placeholder:text-[#6B746F] focus:outline-none focus:ring-2 focus:ring-[#2F6B57] focus:border-transparent transition-all"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-[#1F2622] text-white px-4 py-2.5 text-sm font-semibold hover:bg-[#2A332E] transition-colors duration-150 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading ? "Se autentifică..." : "Autentificare"}
            </button>
          </form>

          <div className="px-8 pb-8">
            <p className="text-center text-sm text-[#6B746F]">
              Nu ai cont?{" "}
              <Link
                href="/inscriere"
                className="font-semibold text-[#2F6B57] hover:text-[#275B4A] transition-colors"
              >
                Aplică acum
              </Link>
            </p>
          </div>
        </div>

        {/* Forgot password link */}
        <div className="mt-4 text-center">
          <p className="text-xs text-[#6B746F]">
            Probleme la autentificare?{" "}
            <a href="/resetare-parola" className="font-semibold text-[#2F6B57] hover:text-[#275B4A] transition-colors">
              Resetează parola
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F7F5F0] flex items-center justify-center p-4">Se încarcă...</div>}>
      <LoginForm />
    </Suspense>
  );
}
