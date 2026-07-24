"use client";
import * as React from "react";

export type ToastVariant = "default" | "success" | "warning" | "danger" | "info";

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
}

interface ToastContextValue {
  toasts: ToastMessage[];
  toast: (msg: Omit<ToastMessage, "id">) => void;
  dismiss: (id: string) => void;
}

const ToastContext = React.createContext<ToastContextValue | null>(null);

const variantMap: Record<ToastVariant, string> = {
  default: "bg-white border-[#E2E8F0] text-[#102A43]",
  success: "bg-[#F0FDF4] border-[#86EFAC] text-[#15803D]",
  warning: "bg-[#FFFBEB] border-[#FCD34D] text-[#B7791F]",
  danger: "bg-[#FEF2F2] border-[#FCA5A5] text-[#B42318]",
  info: "bg-[#EFF6FF] border-[#93C5FD] text-[#2563EB]",
};

function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastMessage[]>([]);

  const toast = React.useCallback((msg: Omit<ToastMessage, "id">) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((prev) => [...prev, { id, duration: 4000, ...msg }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, msg.duration ?? 4000);
  }, []);

  const dismiss = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss }}>
      {children}
      <div aria-live="assertive" className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            role="alert"
            className={`pointer-events-auto flex min-w-[300px] max-w-sm items-start gap-3 rounded-xl border p-4 shadow-lg ${variantMap[t.variant ?? "default"]}`}
          >
            <div className="flex-1">
              <p className="text-sm font-semibold">{t.title}</p>
              {t.description && <p className="mt-0.5 text-xs opacity-80">{t.description}</p>}
            </div>
            <button onClick={() => dismiss(t.id)} className="opacity-60 hover:opacity-100 transition-opacity" aria-label="Dismiss">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function useToast() {
  const ctx = React.useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

export { ToastProvider, useToast };
