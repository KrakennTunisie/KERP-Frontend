"use client";

import { FileText, Upload, X } from "lucide-react";
import { Label } from "./label";

type FilePickerProps = {
  label: string;
  file?: File;
  error?: string;
  tooltip?:string;
  required?: boolean;
  id:string;
  onPick: (file: File) => void;
  onRemove?: () => void;
};

export default function FilePicker({
  label,
  file,
  error,
  tooltip,
  required,
  id,
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
     {label && (
        <Label
        tooltip={tooltip}
          htmlFor={id}
          required = {required}
        >
          {label}
        </Label>
      )}

     <label
  className={`flex flex-col items-center justify-center gap-3 text-center cursor-pointer transition-all rounded-2xl border-2 border-dashed px-4 py-5 ${
    file
      ? "border-solid border-emerald-300 bg-emerald-50"
      : "border-gray-200 bg-gray-50 hover:bg-gray-100"
  } ${error ? "border-rose-300 bg-rose-50" : ""}`}
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
      <div className="w-11 h-11 rounded-xl bg-white border border-gray-200 flex items-center justify-center">
        <Upload className="w-5 h-5 text-gray-400" />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-800">Choisir un fichier</p>
        <p className="text-xs text-gray-400 mt-1">PDF, image ou document administratif</p>
      </div>
    </>
  ) : (
    <>
      {/* Icône + extension badge */}
      <div className="relative">
        <div className="w-12 h-12 rounded-xl bg-white border border-emerald-200 flex items-center justify-center">
          <FileText className="w-5 h-5 text-emerald-600" />
        </div>
        <span className="absolute -bottom-1 -right-1 text-[9px] font-bold uppercase bg-emerald-500 text-white px-1 py-0.5 rounded-md leading-none">
          {file.name.split(".").pop()}
        </span>
      </div>

      {/* Nom affiché : début...fin */}
      <div className="w-full px-1">
        <p className="text-xs font-medium text-emerald-900 leading-snug break-all line-clamp-2">
          {file.name.length > 24
            ? `${file.name.slice(0, 10)}…${file.name.slice(-10)}`
            : file.name}
        </p>
        <p className="text-xs text-emerald-500 mt-1">{formatSize(file.size)}</p>
      </div>

      {/* Bouton supprimer */}
      {onRemove && (
        <button
          type="button"
          onClick={(e) => { e.preventDefault(); onRemove(); }}
          className="w-8 h-8 rounded-xl border border-emerald-200 bg-white hover:bg-emerald-50 flex items-center justify-center"
          aria-label={`Supprimer ${label}`}
        >
          <X className="w-3.5 h-3.5 text-emerald-700" />
        </button>
      )}
    </>
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