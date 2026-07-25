import Link from "next/link";
import { Button } from "@edumind/ui";

export function PublicHeader() {
  return (
    <header className="sticky top-0 z-50 bg-[#FFFDF8]/95 backdrop-blur-sm border-b border-[#E3DED3]">
      <div className="container mx-auto px-4 max-w-[1280px] h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#1F2622] flex items-center justify-center text-white font-bold text-base tracking-tight">
            EM
          </div>
          <span className="font-semibold text-xl text-[#1F2622] tracking-tight">
            EduMind
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#6B746F]">
          <Link href="/cum-functioneaza" className="hover:text-[#1F2622] transition-colors duration-150">
            Cum funcționează
          </Link>
          <Link href="/servicii" className="hover:text-[#1F2622] transition-colors duration-150">
            Programe
          </Link>
          <Link href="/intrebari-frecvente" className="hover:text-[#1F2622] transition-colors duration-150">
            Întrebări frecvente
          </Link>
          <Link href="/contact" className="hover:text-[#1F2622] transition-colors duration-150">
            Contact
          </Link>
        </nav>

        <div className="flex items-center gap-2 md:gap-3">
          <Link href="/login" className="hidden sm:block">
            <Button variant="outline" className="border-[#E3DED3] text-[#1F2622] hover:bg-[#F1EEE7]">
              Intră în cont
            </Button>
          </Link>
          <Link href="/inscriere">
            <Button className="bg-[#2F6B57] text-white hover:bg-[#275B4A]">
              Creare Cont
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
