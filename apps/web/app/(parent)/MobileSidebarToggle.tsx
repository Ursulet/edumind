"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export function MobileSidebarToggle({ sidebarGroups }: { sidebarGroups: any[] }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        className="md:hidden fixed top-3 left-4 z-50 p-2 bg-[#FFFDF8] rounded-md shadow-sm border border-[#E3DED3] text-[#1F2622]"
        onClick={() => setIsOpen(true)}
      >
        <Menu size={20} />
      </button>

      {isOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/50" onClick={() => setIsOpen(false)}>
          <div className="absolute inset-y-0 left-0 w-[260px] bg-[#FFFDF8] flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-5 h-16 border-b border-[#E3DED3]">
              <span className="text-[17px] font-bold tracking-tight text-[#1F2622]">EduCarieră</span>
              <button onClick={() => setIsOpen(false)} className="text-[#6B746F] hover:text-[#1F2622] p-1">
                <X size={20} />
              </button>
            </div>
            
            <nav className="flex-1 overflow-y-auto py-5 px-3 space-y-7">
              {sidebarGroups.map((group, index) => (
                <div key={index}>
                  <h3 className="px-3 text-[10px] font-bold uppercase tracking-[0.15em] text-[#6B746F] mb-3">
                    {group.label}
                  </h3>
                  <div className="space-y-1">
                    {group.items.map((item: any, idx: number) => (
                      <Link
                        key={idx}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-[15px] font-medium text-[#1F2622] hover:bg-[#EDF4F0] hover:text-[#2F6B57]"
                      >
                        <span className="text-[#6B746F]">{item.icon}</span>
                        {item.text}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
