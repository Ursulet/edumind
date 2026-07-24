"use client";
import * as React from "react";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  description?: string;
  className?: string;
}

function Dialog({ open, onClose, children, title, description, className = "" }: DialogProps) {
  React.useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? "dialog-title" : undefined}
        aria-describedby={description ? "dialog-desc" : undefined}
        className={`relative z-10 w-full max-w-lg rounded-2xl bg-white shadow-2xl p-6 mx-4 animate-in fade-in zoom-in-95 duration-150 ${className}`}
      >
        {title && (
          <div className="mb-4 border-b border-[#E2E8F0] pb-4">
            <h2 id="dialog-title" className="text-lg font-semibold text-[#0B2239]">{title}</h2>
            {description && <p id="dialog-desc" className="mt-1 text-sm text-[#64748B]">{description}</p>}
          </div>
        )}
        {children}
      </div>
    </div>
  );
}

function DialogFooter({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`mt-6 flex items-center justify-end gap-3 border-t border-[#E2E8F0] pt-4 ${className}`}>{children}</div>;
}

export { Dialog, DialogFooter };
