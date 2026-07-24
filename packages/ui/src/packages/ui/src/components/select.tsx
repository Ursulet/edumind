import * as React from "react";

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  placeholder?: string;
  error?: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = "", placeholder, children, error, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <select
          ref={ref}
          className={`h-11 w-full appearance-none rounded-lg border px-3 pr-10 text-[15px] bg-white transition-colors outline-none ${
            error
              ? "border-[#B42318] focus:border-[#B42318] focus:ring-2 focus:ring-[#B42318]/15"
              : "border-[#E2E8F0] focus:border-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/15"
          } disabled:pointer-events-none disabled:opacity-50 disabled:bg-[#F1F5F9] ${className}`}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {children}
        </select>
        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B]">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </div>
        {error && (
          <p className="mt-1.5 text-xs text-[#B42318]" role="alert">{error}</p>
        )}
      </div>
    );
  }
);
Select.displayName = "Select";

export { Select };
