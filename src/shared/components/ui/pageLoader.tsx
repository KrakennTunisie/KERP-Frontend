// src/shared/components/PageLoader.tsx
"use client";

import Spinner from "./spinner";

export default function PageLoader({
  label = "Chargement...",
}: {
  label?: string;
}) {
  return (
    <div className="flex items-center justify-center w-full py-16">
      <Spinner size={22} label={label} />
    </div>
  );
}