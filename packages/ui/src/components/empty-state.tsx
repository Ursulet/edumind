import * as React from "react";

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

function EmptyState({ icon, title, description, action, className = "" }: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-16 px-4 text-center ${className}`}>
      {icon && (
        <div className="mb-4 text-[#64748B]">{icon}</div>
      )}
      <h3 className="text-base font-semibold text-[#102A43]">{title}</h3>
      {description && (
        <p className="mt-1 text-sm text-[#64748B] max-w-sm">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export { EmptyState };
