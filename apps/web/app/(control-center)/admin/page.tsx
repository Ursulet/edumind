import { PrismaClient } from "@prisma/client";
import { Card, CardContent, Button } from "@edumind/ui";
import Link from "next/link";

const prisma = new PrismaClient();

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin Dashboard - EduMind",
};

export default async function AdminDashboardPage() {
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

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between border-b border-[#E3DED3] pb-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1F2622]">Executive Control Center</h1>
          <p className="text-sm text-[#6B746F]">Metrice live extrase din baza de date operațională.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-[#FFFDF8] border-[#E3DED3] shadow-[0_1px_2px_rgba(31,38,34,0.05)]">
          <CardContent className="p-6">
            <p className="text-sm font-medium text-[#6B746F]">Venituri Încasate (PAID)</p>
            <h3 className="text-3xl font-extrabold text-[#1F2622] mt-2">
              {totalRevenue.toLocaleString('ro-RO')} RON
            </h3>
            <p className="text-xs text-[#2F6B57] mt-1 flex items-center gap-1 font-semibold">
              Din {totalOrders} comenzi procesate
            </p>
          </CardContent>
        </Card>

        <Card className="bg-[#FFFDF8] border-[#E3DED3] shadow-[0_1px_2px_rgba(31,38,34,0.05)]">
          <CardContent className="p-6">
            <p className="text-sm font-medium text-[#6B746F]">Cazuri Active</p>
            <h3 className="text-3xl font-extrabold text-[#1F2622] mt-2">{activeCasesCount}</h3>
            <p className="text-xs text-[#2F6B57] mt-1 font-semibold">
              În desfășurare
            </p>
          </CardContent>
        </Card>

        <Card className="bg-[#FFFDF8] border-[#E3DED3] shadow-[0_1px_2px_rgba(31,38,34,0.05)]">
          <CardContent className="p-6">
            <p className="text-sm font-medium text-[#6B746F]">Conversie Recomandări</p>
            <h3 className="text-3xl font-extrabold text-[#1F2622] mt-2">{conversionRate}%</h3>
            <p className="text-xs text-[#6B746F] mt-1">
              {acceptedRecommendations} din {totalRecommendations} acceptate
            </p>
          </CardContent>
        </Card>

        <Card className="bg-[#FFFDF8] border-[#E3DED3] shadow-[0_1px_2px_rgba(31,38,34,0.05)]">
          <CardContent className="p-6">
            <p className="text-sm font-medium text-[#6B746F]">Sesiuni Finalizate</p>
            <h3 className="text-3xl font-extrabold text-[#1F2622] mt-2">{completedSessionsCount}</h3>
            <p className="text-xs text-[#2F6B57] mt-1 font-semibold">
              Ședințe de consiliere
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="space-y-4">
          <h2 className="text-lg font-bold text-[#1F2622]">Module de Configurare (Super Admin)</h2>
          <div className="grid grid-cols-2 gap-4">
            <Link href="/catalog" className="block">
              <Card className="bg-[#FFFDF8] border-[#E3DED3] shadow-sm hover:border-[#2F6B57] transition-colors h-full">
                <CardContent className="p-5 flex flex-col items-center text-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#EDF4F0] flex items-center justify-center text-[#2F6B57]">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                  </div>
                  <span className="text-sm font-semibold text-[#1F2622]">Catalog Produse</span>
                </CardContent>
              </Card>
            </Link>

            <Link href="/cms" className="block">
              <Card className="bg-[#FFFDF8] border-[#E3DED3] shadow-sm hover:border-[#2F6B57] transition-colors h-full">
                <CardContent className="p-5 flex flex-col items-center text-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#EDF4F0] flex items-center justify-center text-[#2F6B57]">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>
                  </div>
                  <span className="text-sm font-semibold text-[#1F2622]">Conținut CMS</span>
                </CardContent>
              </Card>
            </Link>

            <Link href="/reports" className="block">
              <Card className="bg-[#FFFDF8] border-[#E3DED3] shadow-sm hover:border-[#2F6B57] transition-colors h-full">
                <CardContent className="p-5 flex flex-col items-center text-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#EDF4F0] flex items-center justify-center text-[#2F6B57]">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  </div>
                  <span className="text-sm font-semibold text-[#1F2622]">Template Rapoarte</span>
                </CardContent>
              </Card>
            </Link>
            
            <Link href="/workflows" className="block">
              <Card className="bg-[#FFFDF8] border-[#E3DED3] shadow-sm hover:border-[#2F6B57] transition-colors h-full">
                <CardContent className="p-5 flex flex-col items-center text-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#EDF4F0] flex items-center justify-center text-[#2F6B57]">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
                  </div>
                  <span className="text-sm font-semibold text-[#1F2622]">Journey Engine</span>
                </CardContent>
              </Card>
            </Link>
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#1F2622]">Jurnal de Audit Recente</h2>
            <Link href="/admin/audit" className="text-xs text-[#2F6B57] font-semibold hover:underline">
              Vezi tot jurnalul
            </Link>
          </div>
          <Card className="bg-[#FFFDF8] border-[#E3DED3] shadow-sm">
            <CardContent className="p-6">
              <p className="text-sm text-[#6B746F]">
                Sistemul înregistrează imutabil toate acțiunile critice de securitate, autentificare și tranzacții.
              </p>
              <div className="mt-4 pt-4 border-t border-[#E3DED3] flex justify-between items-center">
                <span className="text-xs font-mono text-[#6B746F]">Status Imutabilitate: ACTIV</span>
                <Link href="/admin/audit">
                  <Button variant="outline" className="border-[#E3DED3] text-[#1F2622] text-xs">Deschide Audit Log</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}

