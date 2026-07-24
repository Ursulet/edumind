import { SectionRenderer } from "@/components/cms/SectionRenderer";
import { PrismaClient } from "@prisma/client";
import Link from "next/link";
import { Button } from "@educariera/ui";

const prisma = new PrismaClient();

export const metadata = {
  title: "EduCarieră | Ghidăm viitorul copilului tău",
  description: "Platformă instituțională pentru consiliere educațională și orientare în carieră.",
};

export default async function LandingPage() {
  // Fetch published CMS homepage from database
  const page = await prisma.cmsPage.findFirst({
    where: {
      slug: "home",
      status: "PUBLISHED",
    },
    include: {
      sections: { orderBy: { order: "asc" } },
    },
  });

  return (
    <div className="flex flex-col min-h-screen bg-[#F7F9FC]">
      {/* Header / Navigation */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-[#E2E8F0]">
        <div className="container mx-auto px-4 max-w-6xl h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#0B2239] flex items-center justify-center text-white font-bold text-lg">
              EC
            </div>
            <span className="font-bold text-xl text-[#0B2239] tracking-tight">EduCarieră</span>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[#64748B]">
            <Link href="/cum-functioneaza" className="hover:text-[#0F766E] transition-colors">Cum funcționează</Link>
            <Link href="/servicii" className="hover:text-[#0F766E] transition-colors">Programe</Link>
            <Link href="/intrebari-frecvente" className="hover:text-[#0F766E] transition-colors">Întrebări frecvente</Link>
            <Link href="/contact" className="hover:text-[#0F766E] transition-colors">Contact</Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="outline" className="border-[#E2E8F0] text-[#0B2239]">Intră în cont</Button>
            </Link>
            <Link href="/inscriere">
              <Button className="bg-[#0B2239] text-white hover:bg-[#123A5A]">Înscriere Familii</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Render sections from CMS if available */}
      {page && page.sections.length > 0 ? (
        <main className="flex-1">
          {page.sections.map((section) => (
            <SectionRenderer key={section.id} section={section} />
          ))}
        </main>
      ) : (
        /* Fallback Hero if CMS database has not been seeded yet */
        <main className="flex-1 flex flex-col items-center justify-center pt-24 pb-16 px-4 text-center">
          <div className="max-w-3xl space-y-8">
            <span className="inline-block rounded-full bg-[#CCFBF1] px-4 py-1.5 text-xs font-semibold text-[#0F766E]">
              Centrul Național de Ghidare Educațională
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold text-[#0B2239] tracking-tight leading-tight">
              Construim viitorul profesional al <span className="text-[#0F766E]">copilului tău.</span>
            </h1>
            <p className="text-lg md:text-xl text-[#64748B] max-w-2xl mx-auto leading-relaxed">
              Consiliere vocațională riguroasă, instrumente validate științific și suport integrat pentru familii și elevi.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link href="/inscriere">
                <Button size="lg" className="bg-[#0B2239] hover:bg-[#123A5A] text-white h-13 px-8 text-base font-semibold">
                  Completează Înscrierea
                </Button>
              </Link>
              <Link href="/cum-functioneaza">
                <Button size="lg" variant="outline" className="border-[#E2E8F0] text-[#0B2239] h-13 px-8 text-base">
                  Află metodologia
                </Button>
              </Link>
            </div>
          </div>
        </main>
      )}

      {/* Footer */}
      <footer className="bg-[#0B2239] text-white pt-16 pb-8 mt-auto">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12 border-b border-[#123A5A] pb-12">
            <div className="space-y-4">
              <span className="font-bold text-xl tracking-tight text-white">EduCarieră</span>
              <p className="text-sm text-[#94A3B8] leading-relaxed">
                Sistem integrat de consiliere vocațională și orientare în carieră.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white">Navigare</h4>
              <ul className="space-y-2 text-sm text-[#94A3B8]">
                <li><Link href="/servicii" className="hover:text-[#2DD4BF]">Programe</Link></li>
                <li><Link href="/cum-functioneaza" className="hover:text-[#2DD4BF]">Metodologie</Link></li>
                <li><Link href="/login" className="hover:text-[#2DD4BF]">Portal Autentificare</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white">Legal</h4>
              <ul className="space-y-2 text-sm text-[#94A3B8]">
                <li><Link href="/legal/termeni" className="hover:text-[#2DD4BF]">Termeni și Condiții</Link></li>
                <li><Link href="/legal/confidentialitate" className="hover:text-[#2DD4BF]">Politica de Confidențialitate</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white">Contact</h4>
              <p className="text-sm text-[#94A3B8]">contact@educariera.ro</p>
              <p className="text-sm text-[#94A3B8] mt-1">București, România</p>
            </div>
          </div>
          <div className="text-center text-xs text-[#64748B]">
            © {new Date().getFullYear()} EduCarieră. Toate drepturile rezervate.
          </div>
        </div>
      </footer>
    </div>
  );
}
