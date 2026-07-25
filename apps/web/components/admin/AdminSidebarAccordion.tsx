"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

export function AdminSidebarAccordion({ groups }: { groups: any[] }) {
  const pathname = usePathname();
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    OVERVIEW: true,
    OPERATIONS: true
  });

  const toggleGroup = (label: string) => {
    setOpenGroups(prev => ({
      ...prev,
      [label]: !prev[label]
    }));
  };

  return (
    <nav className="flex-1 overflow-y-auto py-4 px-4 space-y-2 scrollbar-hide">
      {groups.map((group, index) => {
        const isOpen = openGroups[group.label] !== false;
        
        return (
          <div key={index} className="mb-2">
            <button 
              onClick={() => toggleGroup(group.label)}
              className="w-full flex items-center justify-between px-2 py-1.5 text-left group"
            >
              <h3 className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#6B746F] group-hover:text-[#1F2622] transition-colors">
                {group.label}
              </h3>
              {isOpen ? (
                <ChevronDown size={14} className="text-[#6B746F]" />
              ) : (
                <ChevronRight size={14} className="text-[#6B746F]" />
              )}
            </button>
            
            {isOpen && (
              <div className="space-y-0.5 mt-1 ml-1 pl-2 border-l border-[#E3DED3]/50">
                {group.items.map((item: any, idx: number) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={idx}
                      href={item.href}
                      className={`flex items-center gap-3 rounded-lg px-2 py-2 text-[13px] font-medium transition-colors group ${
                        isActive 
                          ? "bg-[#EDF4F0] text-[#2F6B57]" 
                          : "text-[#1F2622] hover:bg-[#F7F5F0] hover:text-[#2F6B57]"
                      }`}
                    >
                      <span className={isActive ? "text-[#2F6B57]" : "text-[#6B746F] group-hover:text-[#2F6B57]"}>
                        {item.icon}
                      </span>
                      {item.text}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}
