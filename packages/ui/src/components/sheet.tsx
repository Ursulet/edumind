"use client";
import * as React from "react";

interface SheetProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  side?: "left" | "right";
  className?: string;
}

function Sheet({ open, onClose, children, title, side = "right", className = "" }: SheetProps) {
  React.useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  const slideClass = side === "right"
    ? "right-0 translate-x-0 border-l"
    : "left-0 translate-x-0 border-r";

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        className={`absolute top-0 bottom-0 w-full max-w-md bg-white shadow-2xl border-[#E2E8F0] flex flex-col transition-transform duration-300 ${slideClass} ${className}`}
        style={{ [side]: 0 }}
      >
        <div className="flex items-center justify-between border-b border-[#E2E8F0] px-6 py-4">
          {title && <h2 className="text-lg font-semibold text-[#0B2239]">{title}</h2>}
          <button
            onClick={onClose}
            className="ml-auto rounded-lg p-2 text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#102A43] transition-colors"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-4">{children}</div>
      </div>
    </div>
  );
}

export { Sheet };
