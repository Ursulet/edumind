import * as React from "react";

export interface StepperStep {
  label: string;
  description?: string;
  status: "completed" | "current" | "upcoming";
}

interface StepperProps {
  steps: StepperStep[];
  orientation?: "horizontal" | "vertical";
  className?: string;
}

function Stepper({ steps, orientation = "horizontal", className = "" }: StepperProps) {
  if (orientation === "vertical") {
    return (
      <ol className={`space-y-4 ${className}`}>
        {steps.map((step, i) => (
          <li key={i} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                step.status === "completed" ? "bg-[#0F766E] text-white" :
                step.status === "current" ? "bg-[#0B2239] text-white ring-4 ring-[#0B2239]/20" :
                "bg-[#F1F5F9] text-[#64748B] border border-[#E2E8F0]"
              }`}>
                {step.status === "completed" ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                ) : i + 1}
              </div>
              {i < steps.length - 1 && <div className="mt-1 w-0.5 flex-1 bg-[#E2E8F0]" />}
            </div>
            <div className="pb-4">
              <p className={`text-sm font-medium ${step.status === "upcoming" ? "text-[#64748B]" : "text-[#102A43]"}`}>{step.label}</p>
              {step.description && <p className="mt-0.5 text-xs text-[#64748B]">{step.description}</p>}
            </div>
          </li>
        ))}
      </ol>
    );
  }

  return (
    <ol className={`flex items-center ${className}`}>
      {steps.map((step, i) => (
        <li key={i} className={`flex items-center ${i < steps.length - 1 ? "flex-1" : ""}`}>
          <div className="flex flex-col items-center">
            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
              step.status === "completed" ? "bg-[#0F766E] text-white" :
              step.status === "current" ? "bg-[#0B2239] text-white ring-4 ring-[#0B2239]/20" :
              "bg-[#F1F5F9] text-[#64748B] border border-[#E2E8F0]"
            }`}>
              {step.status === "completed" ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              ) : i + 1}
            </div>
            <p className={`mt-1.5 text-xs font-medium text-center max-w-[80px] ${step.status === "upcoming" ? "text-[#64748B]" : "text-[#102A43]"}`}>{step.label}</p>
          </div>
          {i < steps.length - 1 && (
            <div className={`h-0.5 flex-1 mx-2 mb-5 ${step.status === "completed" ? "bg-[#0F766E]" : "bg-[#E2E8F0]"}`} />
          )}
        </li>
      ))}
    </ol>
  );
}

export { Stepper };
