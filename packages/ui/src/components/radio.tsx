import * as React from "react";

export interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  description?: string;
}

const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({ className = "", label, description, id, ...props }, ref) => {
    const inputId = id ?? React.useId();
    return (
      <div className="flex items-start gap-3">
        <input
          ref={ref}
          id={inputId}
          type="radio"
          className={`mt-0.5 h-4 w-4 border-[#E2E8F0] text-[#0F766E] accent-[#0F766E] focus:ring-2 focus:ring-[#0F766E]/20 cursor-pointer ${className}`}
          {...props}
        />
        {(label || description) && (
          <div>
            {label && <label htmlFor={inputId} className="text-sm font-medium text-[#102A43] cursor-pointer leading-none">{label}</label>}
            {description && <p className="mt-0.5 text-xs text-[#64748B]">{description}</p>}
          </div>
        )}
      </div>
    );
  }
);
Radio.displayName = "Radio";
export { Radio };
