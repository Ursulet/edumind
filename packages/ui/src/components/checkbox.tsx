import * as React from "react";

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
  description?: string;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className = "", label, error, description, id, ...props }, ref) => {
    const inputId = id ?? React.useId();
    return (
      <div className="flex items-start gap-3">
        <input
          ref={ref}
          id={inputId}
          type="checkbox"
          className={`mt-0.5 h-4 w-4 rounded border-[#E2E8F0] text-[#0F766E] accent-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/20 focus:ring-offset-1 disabled:opacity-50 cursor-pointer ${className}`}
          {...props}
        />
        {(label || description) && (
          <div>
            {label && (
              <label htmlFor={inputId} className="text-sm font-medium text-[#102A43] cursor-pointer leading-none">
                {label}
              </label>
            )}
            {description && (
              <p className="mt-0.5 text-xs text-[#64748B]">{description}</p>
            )}
          </div>
        )}
        {error && <p className="text-xs text-[#B42318]" role="alert">{error}</p>}
      </div>
    );
  }
);
Checkbox.displayName = "Checkbox";
export { Checkbox };
