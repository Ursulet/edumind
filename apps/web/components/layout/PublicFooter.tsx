import Link from "next/link";

export function PublicFooter() {
  return (
    <footer className="bg-[#1F2622] text-white pt-16 pb-8 mt-auto">
      <div className="container mx-auto px-4 max-w-[1280px]">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12 border-b border-[#2A332E] pb-12">
          <div className="space-y-4">
            <span className="font-semibold text-xl tracking-tight text-white">EduMind</span>
            <p className="text-sm text-[#94A3B8] leading-relaxed">
              Sistem integrat de consiliere vocațională și orientare în carieră.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-white text-sm tracking-wide">Navigare</h4>
            <ul className="space-y-2 text-sm text-[#94A3B8]">
              <li><Link href="/servicii" className="hover:text-[#DCE8E1] transition-colors">Programe</Link></li>
              <li><Link href="/cum-functioneaza" className="hover:text-[#DCE8E1] transition-colors">Metodologie</Link></li>
              <li><Link href="/login" className="hover:text-[#DCE8E1] transition-colors">Portal Autentificare</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-white text-sm tracking-wide">Legal</h4>
            <ul className="space-y-2 text-sm text-[#94A3B8]">
              <li><Link href="/termeni" className="hover:text-[#DCE8E1] transition-colors">Termeni și Condiții</Link></li>
              <li><Link href="/confidentialitate" className="hover:text-[#DCE8E1] transition-colors">Politica de Confidențialitate</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 text-white text-sm tracking-wide">Contact</h4>
            <p className="text-sm text-[#94A3B8]">contact@edumind.ro</p>
            <p className="text-sm text-[#94A3B8] mt-1">București, România</p>
          </div>
        </div>
        <div className="text-center text-xs text-[#6B746F]">
          © {new Date().getFullYear()} EduMind. Toate drepturile rezervate.
        </div>
      </div>
    </footer>
  );
}
