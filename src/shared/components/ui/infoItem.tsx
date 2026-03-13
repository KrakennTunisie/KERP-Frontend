"use client";

import type { ReactNode } from "react";

type InfoCardProps = {
  label: string;
  value: string | undefined;
  icon: ReactNode;
};

export default function InfoItem({
  label,
  value,
  icon,
}: InfoCardProps) {
  return (
    <div className="rounded-3xl border border-gray-200 bg-gray-50 p-4 min-h-[112px] flex flex-col justify-between">
      <div className="w-10 h-10 rounded-2xl bg-white border border-gray-200 flex items-center justify-center mb-4">
        {icon}
      </div>

      <div>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
          {label}
        </p>
        <p className="text-sm font-black text-gray-900 break-words">
          {value}
        </p>
      </div>
    </div>
  );
}