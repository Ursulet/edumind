import { SectionRenderer } from "@/components/cms/SectionRenderer";
import { PrismaClient } from "@prisma/client";
import Link from "next/link";
import { Button } from "@educariera/ui";

const prisma = new PrismaClient();

export const dynamic = "force-dynamic";

export const metadata = {
  title: "EduMind | Ghidăm viitorul copilului tău",
  description:
    "Platformă instituțională pentru consiliere educațională și orientare în carieră.",
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
    <div className="flex flex-col min-h-screen bg-[#F7F5F0]">
      {/* Header / Navigation — Warm Institutional */}
      <header className="sticky top-0 z-50 bg-[#FFFDF8]/95 backdrop-blur-sm border-b border-[#E3DED3]">
        <div className="container mx-auto px-4 max-w-[1280px] h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#1F2622] flex items-center justify-center text-white font-bold text-base tracking-tight">
              EM
            </div>
            <span className="font-semibold text-xl text-[#1F2622] tracking-tight">
              EduMind
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#6B746F]">
            <Link
              href="/cum-functioneaza"
              className="hover:text-[#1F2622] transition-colors duration-150"
            >
              Cum funcționează
            </Link>
            <Link
              href="/servicii"
              className="hover:text-[#1F2622] transition-colors duration-150"
            >
              Programe
            </Link>
            <Link
              href="/intrebari-frecvente"
              className="hover:text-[#1F2622] transition-colors duration-150"
            >
              Întrebări frecvente
            </Link>
            <Link
              href="/contact"
              className="hover:text-[#1F2622] transition-colors duration-150"
            >
              Contact
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button
                variant="outline"
                className="border-[#E3DED3] text-[#1F2622] hover:bg-[#F1EEE7]"
              >
                Intră în cont
              </Button>
            </Link>
            <Link href="/inscriere">
              <Button className="bg-[#2F6B57] text-white hover:bg-[#275B4A]">
                Înscriere Familii
              </Button>
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
        /* Fallback Hero — Warm Institutional 2026 palette */
        <main className="flex-1">
          {/* Hero Section */}
          <section className="bg-[#F7F5F0] py-20 md:py-28 lg:py-32 border-b border-[#E3DED3]">
            <div className="container mx-auto px-4 max-w-[1280px] grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="space-y-7 max-w-xl">
                <span className="inline-block text-xs font-semibold tracking-widest text-[#2F6B57] uppercase">
                  Centrul Național de Ghidare Educațională
                </span>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-[#1F2622] tracking-[-0.04em] leading-tight">
                  Construim viitorul profesional al{" "}
                  <span className="text-[#2F6B57]">copilului tău.</span>
                </h1>
                <p className="text-[15px] md:text-lg text-[#6B746F] leading-relaxed">
                  Consiliere vocațională riguroasă, instrumente validate
                  științific și suport integrat pentru familii și elevi.
                </p>
                <div className="flex flex-col sm:flex-row items-start gap-4 pt-2">
                  <Link href="/inscriere">
                    <Button
                      size="lg"
                      className="bg-[#1F2622] hover:bg-[#2A332E] text-white px-8 text-[15px] font-semibold rounded-lg"
                    >
                      Completează Înscrierea
                    </Button>
                  </Link>
                  <Link href="/cum-functioneaza">
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-[#E3DED3] text-[#1F2622] hover:bg-[#F1EEE7] px-8 text-[15px] rounded-lg"
                    >
                      Află metodologia
                    </Button>
                  </Link>
                </div>
                <p className="text-sm text-[#6B746F] border-t border-[#E3DED3] pt-5">
                  Proces complet confidențial · Date protejate GDPR · Specialiști
                  certificați
                </p>
              </div>

              <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden bg-[#EDF4F0] border border-[#E3DED3] flex items-center justify-center">
                <div className="text-center space-y-3 p-8">
                  <div className="w-16 h-16 rounded-2xl bg-[#2F6B57]/10 border border-[#2F6B57]/20 flex items-center justify-center mx-auto">
                    <span className="text-2xl">🎓</span>
                  </div>
                  <p className="text-sm text-[#6B746F] font-medium">
                    Imagine editorială disponibilă
                  </p>
                  <p className="text-xs text-[#6B746F]/70">
                    Configurabilă din panoul CMS
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Trust Strip */}
          <section className="bg-[#FFFDF8] py-10 border-b border-[#E3DED3]">
            <div className="container mx-auto px-4 max-w-[1280px]">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { icon: "🏛️", label: "Proces condus de specialiști" },
                  { icon: "🔒", label: "Date confidențiale GDPR" },
                  { icon: "📋", label: "Metodologie structurată" },
                  { icon: "💻", label: "Ședințe online & față în față" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center gap-3 p-4"
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span className="text-sm text-[#6B746F] font-medium leading-tight">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Final CTA */}
          <section className="bg-[#EDF4F0] py-20">
            <div className="container mx-auto px-4 max-w-[1280px] text-center space-y-6">
              <h2 className="text-3xl md:text-4xl font-semibold text-[#1F2622] tracking-[-0.025em]">
                Începeți parcursul astăzi
              </h2>
              <p className="text-[15px] text-[#6B746F] max-w-lg mx-auto leading-relaxed">
                Orientare profesională completă, adaptată fiecărui elev și
                familie.
              </p>
              <Link href="/inscriere">
                <Button
                  size="lg"
                  className="bg-[#2F6B57] hover:bg-[#275B4A] text-white px-10 text-[15px] font-semibold rounded-lg"
                >
                  Completează formularul de înscriere
                </Button>
              </Link>
            </div>
          </section>
        </main>
      )}

      {/* Footer — Deep Graphite */}
      <footer className="bg-[#1F2622] text-white pt-16 pb-8 mt-auto">
        <div className="container mx-auto px-4 max-w-[1280px]">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12 border-b border-[#2A332E] pb-12">
            <div className="space-y-4">
              <span className="font-semibold text-xl tracking-tight text-white">
                EduMind
              </span>
              <p className="text-sm text-[#94A3B8] leading-relaxed">
                Sistem integrat de consiliere vocațională și orientare în
                carieră.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white text-sm tracking-wide">
                Navigare
              </h4>
              <ul className="space-y-2 text-sm text-[#94A3B8]">
                <li>
                  <Link href="/servicii" className="hover:text-[#DCE8E1] transition-colors">
                    Programe
                  </Link>
                </li>
                <li>
                  <Link href="/cum-functioneaza" className="hover:text-[#DCE8E1] transition-colors">
                    Metodologie
                  </Link>
                </li>
                <li>
                  <Link href="/login" className="hover:text-[#DCE8E1] transition-colors">
                    Portal Autentificare
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white text-sm tracking-wide">
                Legal
              </h4>
              <ul className="space-y-2 text-sm text-[#94A3B8]">
                <li>
                  <Link
                    href="/termeni"
                    className="hover:text-[#DCE8E1] transition-colors"
                  >
                    Termeni și Condiții
                  </Link>
                </li>
                <li>
                  <Link
                    href="/confidentialitate"
                    className="hover:text-[#DCE8E1] transition-colors"
                  >
                    Politica de Confidențialitate
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white text-sm tracking-wide">
                Contact
              </h4>
              <p className="text-sm text-[#94A3B8]">contact@edumind.ro</p>
              <p className="text-sm text-[#94A3B8] mt-1">București, România</p>
            </div>
          </div>
          <div className="text-center text-xs text-[#6B746F]">
            © {new Date().getFullYear()} EduMind. Toate drepturile rezervate.
          </div>
        </div>
      </footer>
    </div>
  );
}
