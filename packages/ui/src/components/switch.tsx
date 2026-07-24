"use client";
import * as React from "react";

export interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  description?: string;
}

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className = "", label, description, id, checked, onChange, ...props }, ref) => {
    const inputId = id ?? React.useId();
    return (
      <div className="flex items-start gap-3">
        <button
          type="button"
          role="switch"
          aria-checked={checked}
          onClick={() => onChange?.({ target: { checked: !checked } } as any)}
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F766E] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
            checked ? "bg-[#0F766E]" : "bg-[#E2E8F0]"
          } ${className}`}
          {...(props as any)}
        >
          <span className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform duration-200 ${checked ? "translate-x-5" : "translate-x-0"}`} />
        </button>
        {(label || description) && (
          <div>
            {label && <label htmlFor={inputId} className="text-sm font-medium text-[#102A43] cursor-pointer">{label}</label>}
            {description && <p className="mt-0.5 text-xs text-[#64748B]">{description}</p>}
          </div>
        )}
      </div>
    );
  }
);
Switch.displayName = "Switch";
export { Switch };
