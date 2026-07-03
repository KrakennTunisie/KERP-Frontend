"use client";

import { FileText, Upload, X, Eye } from "lucide-react";
import { Label } from "./label";

type FilePickerProps = {
  label: string;
  file?: File;
  existingFileUrl?: string | null;
  error?: string;
  tooltip?: string;
  required?: boolean;
  id: string;
  onPick: (file: File) => void;
  onRemove?: () => void;
};

export default function FilePicker({
  label,
  file,
  existingFileUrl,
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
    <div className="space-y-1.5">
      {label && (
        <Label tooltip={tooltip} htmlFor={id} required={required}>
          {label}
        </Label>
      )}

      <div className="space-y-2">
        <label
          htmlFor={id}
          className={`flex min-h-[70px] cursor-pointer items-center justify-between gap-3 rounded-xl border px-3 py-2.5 transition-all ${
            file
              ? "border-emerald-200 bg-emerald-50"
              : "border-dashed border-slate-200 bg-slate-50 hover:border-blue-200 hover:bg-blue-50/40"
          } ${error ? "border-rose-300 bg-rose-50" : ""}`}
        >
          <input
            id={id}
            type="file"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onPick(f);
            }}
          />

          {!file ? (
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white">
                <Upload className="h-4.5 w-4.5 text-slate-400" />
              </div>

              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-800">
                  Ajouter un document
                </p>
                <p className="mt-0.5 truncate text-[11px] text-slate-400">
                  PDF, image ou document administratif
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex min-w-0 items-center gap-3">
                <div className="relative shrink-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-emerald-200 bg-white">
                    <FileText className="h-4.5 w-4.5 text-emerald-600" />
                  </div>

                  <span className="absolute -bottom-1 -right-1 rounded bg-emerald-500 px-1 py-0.5 text-[8px] font-bold uppercase leading-none text-white">
                    {file.name.split(".").pop()}
                  </span>
                </div>

                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold text-emerald-900">
                    {file.name}
                  </p>
                  <p className="mt-0.5 text-[11px] font-medium text-emerald-500">
                    {formatSize(file.size)}
                  </p>
                </div>
              </div>

              {onRemove && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    onRemove();
                  }}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-emerald-200 bg-white hover:bg-emerald-50"
                  aria-label={`Supprimer ${label}`}
                >
                  <X className="h-3.5 w-3.5 text-emerald-700" />
                </button>
              )}
            </>
          )}
        </label>

        {/* Lien "voir le document existant" — même ligne, sous le picker */}
        {existingFileUrl && (
          <a
            href={existingFileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between gap-2 rounded-lg px-1 py-1 text-[11px] font-semibold text-blue-600 transition-colors hover:text-blue-800"
          >
            <span className="flex items-center gap-1.5">
              <FileText className="h-3 w-3" />
              Voir le dernier document ajouté
            </span>
            <Eye className="h-3.5 w-3.5" />
          </a>
        )}
      </div>

      {/* Message bas */}
      {error ? (
        <p className="text-[11px] font-semibold text-rose-600">{error}</p>
      ) : file ? (
        <p className="text-[11px] font-semibold text-emerald-700">
          Fichier prêt à être envoyé
        </p>
      ) : (
        <p className="text-[11px] font-semibold text-slate-500">
          Aucun fichier sélectionné
        </p>
      )}
    </div>
  );
}