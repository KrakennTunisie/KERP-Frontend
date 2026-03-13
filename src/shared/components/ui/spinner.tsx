"use client";

import { Loader2 } from "lucide-react";

type SpinnerProps = {
  size?: number;
  className?: string;
  label?: string;
};

export default function Spinner({
  size = 18,
  className = "",
  label,
}: SpinnerProps) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <Loader2
        className="animate-spin"
        style={{ width: size, height: size }}
        aria-hidden="true"
      />
      {label ? <span>{label}</span> : null}
    </span>
  );
}