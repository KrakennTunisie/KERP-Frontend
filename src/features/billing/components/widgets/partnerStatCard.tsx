// src/shared/components/StatCard.tsx
import { LucideIcon } from "lucide-react";
import React from "react";

type StatCardProps = {
  title: string;
  value: React.ReactNode;
  icon: LucideIcon;
  iconContainerClassName?: string;
  iconClassName?: string;
  footer?: React.ReactNode;
  className?: string;
};

export default function PartnerStatCard({
  title,
  value,
  icon: Icon,
  iconContainerClassName = "bg-gray-50",
  iconClassName = "text-gray-600",
  footer,
  className = "",
}: StatCardProps) {
  return (
    <div
      className={`bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm ${className}`}
    >
      <div className="flex items-center gap-3 mb-4">
        <div
          className={`w-12 h-12 rounded-2xl flex items-center justify-center ${iconContainerClassName}`}
        >
          <Icon className={`w-6 h-6 ${iconClassName}`} />
        </div>

        <p className="text-xs font-black text-gray-400 uppercase tracking-widest">
          {title}
        </p>
      </div>

      <div>{value}</div>

      {footer ? <div className="mt-2">{footer}</div> : null}
    </div>
  );
}