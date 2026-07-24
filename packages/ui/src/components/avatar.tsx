import * as React from "react";

export interface AvatarProps {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeMap = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
  xl: "h-16 w-16 text-lg",
};

function Avatar({ src, alt, fallback, size = "md", className = "" }: AvatarProps) {
  const [imgError, setImgError] = React.useState(false);
  const sizeClass = sizeMap[size];

  if (src && !imgError) {
    return (
      <img
        src={src}
        alt={alt ?? "Avatar"}
        onError={() => setImgError(true)}
        className={`rounded-full object-cover ${sizeClass} ${className}`}
      />
    );
  }

  const initials = fallback
    ? fallback.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "?";

  return (
    <div className={`inline-flex items-center justify-center rounded-full bg-[#0F766E] text-white font-semibold ${sizeClass} ${className}`}>
      {initials}
    </div>
  );
}

export { Avatar };
