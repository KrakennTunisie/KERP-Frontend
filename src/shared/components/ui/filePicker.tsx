"use client";

import { FileText, Upload, X } from "lucide-react";

type FilePickerProps = {
  label: string;
  file?: File;
  error?: string;
  onPick: (file: File) => void;
  onRemove?: () => void;
};

export default function FilePicker({
  label,
  file,
  error,
  onPick,
  onRemove,
}: FilePickerProps) {
  const formatSize = (size: number) => {
    if (size < 1024) return `${size} o`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} Ko`;
    return `${(size / (1024 * 1024)).toFixed(1)} Mo`;
  };

  return (
    <div className="space-y-2">
      <p className="text-sm font-black text-gray-900">
        {label} <span className="text-rose-600">*</span>
      </p>

      <label
        className={`flex flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed px-4 py-6 text-center cursor-pointer transition-all ${
          error
            ? "border-rose-300 bg-rose-50/50"
            : file
            ? "border-emerald-300 bg-emerald-50/50"
            : "border-gray-200 bg-gray-50 hover:bg-gray-100"
        }`}
      >
        <input
          type="file"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onPick(f);
          }}
        />

        {!file ? (
          <>
            <div className="w-12 h-12 rounded-2xl bg-white border border-gray-200 flex items-center justify-center shadow-sm">
              <Upload className="w-5 h-5 text-gray-500" />
            </div>
            <div>
              <p className="text-sm font-black text-gray-900">Choisir un fichier</p>
              <p className="text-xs font-semibold text-gray-500 mt-1">
                PDF, image ou document administratif
              </p>
            </div>
          </>
        ) : (
          <div className="w-full flex items-start gap-3 text-left">
            <div className="w-11 h-11 rounded-2xl bg-white border border-gray-200 flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5 text-emerald-600" />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-black text-gray-900 truncate">
                {file.name}
              </p>
              <p className="text-xs font-semibold text-gray-500 mt-1">
                {formatSize(file.size)}
              </p>
            </div>

            {onRemove && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  onRemove();
                }}
                className="w-9 h-9 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center shrink-0"
                aria-label={`Supprimer ${label}`}
              >
                <X className="w-4 h-4 text-gray-600" />
              </button>
            )}
          </div>
        )}
      </label>

      {error ? (
        <p className="text-xs text-rose-600 font-semibold">{error}</p>
      ) : file ? (
        <p className="text-xs text-emerald-700 font-semibold">Fichier prêt à être envoyé</p>
      ) : (
        <p className="text-xs text-gray-500 font-semibold">Aucun fichier sélectionné</p>
      )}
    </div>
  );
}