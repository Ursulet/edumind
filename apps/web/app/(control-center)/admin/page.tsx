import { PrismaClient } from "@prisma/client";
import { Card, CardContent, Button } from "@edumind/ui";
import Link from "next/link";
import { getUserFromToken } from "@/lib/auth";
import { redirect } from "next/navigation";

const prisma = new PrismaClient();

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Super Admin Control Center - EduMind",
};

export default async function AdminDashboardPage() {
  const user = await getUserFromToken();
  if (!user) redirect("/login");

  if (!["SUPER_ADMIN", "PLATFORM_OWNER"].includes(user.role)) {
    redirect("/dashboard");
  }

  const isPlatformOwner = user.role === "PLATFORM_OWNER";

  // Data fetching (Mix of real and mocked for the new structure until analytics engine is ready)
  const totalOrders = await prisma.order.count({ where: { status: "PAID" } }).catch(() => 0);
  const paidOrders = await prisma.order.findMany({ where: { status: "PAID" } }).catch(() => []);
  const totalRevenue = paidOrders.reduce((sum, o) => sum + Number(o.totalAmount), 0);

  const activeCasesCount = await prisma.careerCase.count({ where: { status: { not: "COMPLETED" } } }).catch(() => 0);
  const completedSessionsCount = await prisma.counselingSession.count({ where: { status: "COMPLETED" } }).catch(() => 0);
  const totalRecommendations = await prisma.productRecommendation.count().catch(() => 0);
  const acceptedRecommendations = await prisma.productRecommendation.count({ where: { status: "ACCEPTED" } }).catch(() => 0);

  const conversionRate = totalRecommendations > 0 
    ? Math.round((acceptedRecommendations / totalRecommendations) * 100) 
    : 0;
    
  const averageOrder = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-12">
      <div className="flex items-center justify-between border-b border-[#E3DED3] pb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1F2622]">Executive Control Center</h1>
          <p className="text-sm text-[#6B746F]">Cum performează operațiunile și cum poți configura business-ul.</p>
        </div>
        {isPlatformOwner && (
          <span className="px-3 py-1 bg-[#1F2622] text-white text-xs font-bold rounded-full tracking-widest uppercase shadow-sm">
            God Mode (Platform Owner)
          </span>
        )}
      </div>

      {/* 1. BUSINESS */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-[#1F2622] flex items-center gap-2">
          <svg className="w-5 h-5 text-[#2F6B57]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          Business
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-[#FFFDF8] border-[#E3DED3] shadow-sm">
            <CardContent className="p-5">
              <p className="text-xs font-semibold text-[#6B746F] uppercase">Venituri (PAID)</p>
              <h3 className="text-2xl font-extrabold text-[#1F2622] mt-1">{totalRevenue.toLocaleString('ro-RO')} RON</h3>
            </CardContent>
          </Card>
          <Card className="bg-[#FFFDF8] border-[#E3DED3] shadow-sm">
            <CardContent className="p-5">
              <p className="text-xs font-semibold text-[#6B746F] uppercase">Comenzi Procesate</p>
              <h3 className="text-2xl font-extrabold text-[#1F2622] mt-1">{totalOrders}</h3>
            </CardContent>
          </Card>
          <Card className="bg-[#FFFDF8] border-[#E3DED3] shadow-sm">
            <CardContent className="p-5">
              <p className="text-xs font-semibold text-[#6B746F] uppercase">Valoare Medie Comandă</p>
              <h3 className="text-2xl font-extrabold text-[#1F2622] mt-1">{averageOrder} RON</h3>
            </CardContent>
          </Card>
          <Card className="bg-[#FFFDF8] border-[#E3DED3] shadow-sm">
            <CardContent className="p-5">
              <p className="text-xs font-semibold text-[#6B746F] uppercase">Conversie Pachete</p>
              <h3 className="text-2xl font-extrabold text-[#1F2622] mt-1">{conversionRate}%</h3>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 2. FUNNEL & OPERATIONS (2 columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* FUNNEL */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-[#1F2622] flex items-center gap-2">
            <svg className="w-5 h-5 text-[#2F6B57]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" /></svg>
            Funnel (Conversie Flux)
          </h2>
          <Card className="bg-[#FFFDF8] border-[#E3DED3] shadow-sm">
            <CardContent className="p-0">
              <div className="divide-y divide-[#E3DED3]">
                {[
                  { step: "1. Aplicații Primite", value: "342", drop: null },
                  { step: "2. Aprobări (Triage)", value: "310", drop: "-9%" },
                  { step: "3. Prima Achiziție (Evaluare)", value: "285", drop: "-8%" },
                  { step: "4. Teste Finalizate", value: "260", drop: "-9%" },
                  { step: "5. Sesiuni Finalizate", value: "245", drop: "-6%" },
                  { step: "6. Recomandări Emise", value: "230", drop: "-6%" },
                  { step: "7. Pachete Achiziționate", value: "198", drop: "-14%" },
                  { step: "8. Programe Finalizate", value: "175", drop: "-12%" },
                ].map((item, i) => (
                  <div key={i} className="p-4 flex justify-between items-center hover:bg-[#F7F5F0]">
                    <span className="text-sm font-semibold text-[#1F2622]">{item.step}</span>
                    <div className="flex items-center gap-4">
                      {item.drop && <span className="text-xs font-bold text-[#B4453A]">{item.drop}</span>}
                      <span className="text-sm font-bold text-[#1F2622] w-12 text-right">{item.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* OPERATIONS */}
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-[#1F2622] flex items-center gap-2">
            <svg className="w-5 h-5 text-[#2F6B57]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            Operațiuni
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-[#FFFDF8] border-[#E3DED3] shadow-sm">
              <CardContent className="p-5 text-center">
                <p className="text-xs font-semibold text-[#6B746F] uppercase">Cazuri Active</p>
                <h3 className="text-2xl font-extrabold text-[#1F2622] mt-1">{activeCasesCount}</h3>
              </CardContent>
            </Card>
            <Card className="bg-[#FFFDF8] border-[#E3DED3] shadow-sm">
              <CardContent className="p-5 text-center">
                <p className="text-xs font-semibold text-[#6B746F] uppercase">Acțiuni Întârziate</p>
                <h3 className="text-2xl font-extrabold text-[#B4453A] mt-1">12</h3>
              </CardContent>
            </Card>
            <Card className="bg-[#FFFDF8] border-[#E3DED3] shadow-sm">
              <CardContent className="p-5 text-center">
                <p className="text-xs font-semibold text-[#6B746F] uppercase">Sesiuni (Luna crt.)</p>
                <h3 className="text-2xl font-extrabold text-[#1F2622] mt-1">{completedSessionsCount}</h3>
              </CardContent>
            </Card>
            <Card className="bg-[#FFFDF8] border-[#E3DED3] shadow-sm">
              <CardContent className="p-5 text-center">
                <p className="text-xs font-semibold text-[#6B746F] uppercase">Anulări / No-show</p>
                <h3 className="text-2xl font-extrabold text-[#B7791F] mt-1">4 / 1</h3>
              </CardContent>
            </Card>
            <Card className="bg-[#FFFDF8] border-[#E3DED3] shadow-sm col-span-2">
              <CardContent className="p-5 flex justify-between items-center">
                <div>
                  <p className="text-xs font-semibold text-[#6B746F] uppercase">Grad Utilizare Specialiști</p>
                  <p className="text-xs text-[#6B746F] mt-1">Capacitate medie alocată din total disponibil.</p>
                </div>
                <h3 className="text-3xl font-extrabold text-[#2F6B57]">84%</h3>
              </CardContent>
            </Card>
          </div>
        </section>

      </div>

      {/* 3. CONFIGURATION */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-[#1F2622] flex items-center gap-2">
          <svg className="w-5 h-5 text-[#2F6B57]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          Configurare Business
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
          {[
            { label: "Product Catalog", href: "/catalog" },
            { label: "Journey Engine", href: "/workflows" },
            { label: "Tipuri Sesiuni", href: "/admin/session-types" },
            { label: "Template Rapoarte", href: "/reports" },
            { label: "CMS Conținut", href: "/cms" },
            { label: "Notificări", href: "/admin/notifications" },
            { label: "Integrări", href: "/admin/integrations" },
            { label: "Roluri & Staff", href: "/admin/users" },
          ].map(link => (
            <Link key={link.href} href={link.href} className="block">
              <div className="bg-[#FFFDF8] border border-[#E3DED3] rounded-xl p-4 h-full flex items-center justify-center text-center hover:border-[#2F6B57] hover:shadow-sm transition-all cursor-pointer">
                <span className="text-xs font-bold text-[#1F2622]">{link.label}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. PLATFORM OWNER CONTROL CENTER */}
      {isPlatformOwner && (
        <section className="space-y-4 pt-6 border-t border-[#E3DED3]">
          <h2 className="text-lg font-bold text-[#1F2622] flex items-center gap-2">
            <svg className="w-5 h-5 text-[#B4453A]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            Platform Owner Core
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
             {[
              { label: "Organizații (Tenants)", href: "/admin/organizations" },
              { label: "System Health", href: "/admin/health" },
              { label: "API Configuration", href: "/admin/api-keys" },
              { label: "Feature Flags", href: "/admin/feature-flags" },
              { label: "Security & WAF", href: "/admin/security" },
              { label: "Audit Logs", href: "/admin/audit" },
              { label: "Permissions Matrix", href: "/admin/permissions" },
              { label: "System Config", href: "/admin/system" },
            ].map(link => (
              <Link key={link.href} href={link.href} className="block">
                <div className="bg-[#1F2622] rounded-xl p-4 h-full flex items-center justify-center text-center hover:bg-[#2A332E] transition-all cursor-pointer shadow-sm">
                  <span className="text-xs font-bold text-white">{link.label}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

    </div>
  );
}

