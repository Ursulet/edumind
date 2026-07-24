import * as React from "react";

export interface TimelineEvent {
  id: string;
  title: string;
  description?: string;
  date: string;
  icon?: React.ReactNode;
  color?: "default" | "success" | "warning" | "danger" | "info";
}

interface TimelineProps {
  events: TimelineEvent[];
  className?: string;
}

const colorMap = {
  default: "bg-[#E2E8F0] text-[#64748B]",
  success: "bg-[#DCFCE7] text-[#15803D]",
  warning: "bg-[#FEF9C3] text-[#B7791F]",
  danger: "bg-[#FEE2E2] text-[#B42318]",
  info: "bg-[#DBEAFE] text-[#2563EB]",
};

function Timeline({ events, className = "" }: TimelineProps) {
  return (
    <ol className={`relative border-l border-[#E2E8F0] space-y-6 pl-6 ${className}`}>
      {events.map((event) => (
        <li key={event.id} className="relative">
          <div className={`absolute -left-[25px] flex h-5 w-5 items-center justify-center rounded-full text-[10px] ${colorMap[event.color ?? "default"]}`}>
            {event.icon ?? <span className="h-2 w-2 rounded-full bg-current" />}
          </div>
          <div>
            <p className="text-sm font-medium text-[#102A43]">{event.title}</p>
            {event.description && <p className="mt-0.5 text-xs text-[#64748B]">{event.description}</p>}
            <time className="mt-0.5 block text-xs text-[#64748B]">{event.date}</time>
          </div>
        </li>
      ))}
    </ol>
  );
}

export { Timeline };
